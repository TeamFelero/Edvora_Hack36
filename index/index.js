import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";

// Constants
const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3000;

// MongoDB Connection
const mongoURI = "mongodb://127.0.0.1:27017/Users"; // or your MongoDB Atlas URI

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log("Connected to MongoDB"))
.catch(err => console.error("MongoDB connection error:", err));

// Mongoose Schema (for reviews)
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
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/review.html");
});

app.post("/subRev", async (req, res) => {
  try {
    const { username, subject, review } = req.body;

    const newReview = new Review({
      username,
      subject,
      review
    });

    await newReview.save();
    console.log("Review saved");

    res.sendFile(__dirname + "/public/review.html");
  } catch (error) {
    console.error("Error saving review:", error);
    res.status(500).send("Error saving your review");
  }
});

// Start Server
app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});
