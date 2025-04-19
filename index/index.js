import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import http from "http";
import { Server } from "socket.io";

// Setup for __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const port = process.env.PORT || 3000;

// Connect to MongoDB
const mongoURI = "mongodb://127.0.0.1:27017/Users";
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("✅ Connected to MongoDB"))
.catch(err => console.error("❌ MongoDB connection error:", err));

// Mongoose Schema
const reviewSchema = new mongoose.Schema({
  username: String,
  subject: String,
  review: String,
  createdAt: {
    type: Date,
    default: Date.now
  }
});
const Review = mongoose.model("Review", reviewSchema);

// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "find.html"));  // Main page
});

app.get("/review", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "review.html"));  // Review form
});

app.post("/subRev", async (req, res) => {
  try {
    const { username, subject, review } = req.body;

    const newReview = new Review({ username, subject, review });
    await newReview.save();

    console.log("✅ Review saved");
    res.sendFile(path.join(__dirname, "public", "review.html"));
  } catch (error) {
    console.error("❌ Error saving review:", error);
    res.status(500).send("Error saving your review");
  }
});

// Socket.IO
io.on("connection", (socket) => {
  console.log("⚡ User connected:", socket.id);

  socket.on("set username", (username) => {
    socket.username = username;
  });

  socket.on("chat message", (msg) => {
    const messageWithUser = {
      username: socket.username || "Anonymous",
      text: msg,
    };
    io.emit("chat message", messageWithUser);
  });

  socket.on("disconnect", () => {
    console.log("🔌 User disconnected:", socket.id);
  });
});

// Start Server
server.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
