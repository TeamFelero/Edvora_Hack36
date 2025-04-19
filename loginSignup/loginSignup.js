import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import bcrypt from "bcrypt";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3000;

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/Users', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// User Schema
const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String
});
const User = mongoose.model("User", UserSchema);

// Middleware
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Routes
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/loginSignup.html");
});

// Sign Up
app.post("/submitSig", async (req, res) => {
  const { username, email, password, conPassword } = req.body;

  if (!username || !email || !password || password !== conPassword) {
    return res.status(400).send("Invalid signup details");
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword
    });

    await newUser.save();
    res.send("Signup successful");
  } catch (err) {
    res.status(500).send("Server error during signup");
  }
});

// Login
app.post("/submitLog", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).send("User not found");

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) return res.status(401).send("Incorrect password");

    res.send("Login successful");
  } catch (err) {
    res.status(500).send("Server error during login");
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
