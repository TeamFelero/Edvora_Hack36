import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;

// MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/Users", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define schema
const profileSchema = new mongoose.Schema({
  name: String,
  mobile: String,
  email: String,
  college: String,
  address: String,
  photo: String, 
});

// Model
const Profile = mongoose.model("Profile", profileSchema);

// Middleware
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/profile.html");
});

app.get("/edit", (req, res) => {
  res.sendFile(__dirname + "/public/edit-profile.html");
});

app.post("/prof", (req, res) => {
  const newProfile = new Profile({
    name: req.body.name,
    mobile: req.body.mobile,
    email: req.body.email,
    college: req.body.college,
    address: req.body.address,
    photo: "", 
  });

  newProfile.save()
    .then(() => {
      console.log("Profile saved:", newProfile);
      res.redirect("/save");
    })
    .catch((err) => {
      console.error("Error saving profile:", err);
      res.status(500).send("Something went wrong");
    });
});

app.get("/save", (req, res) => {
  res.sendFile(__dirname + "/public/profile.html");
});

app.get("/api/profile", async (req, res) => {
    try {
      const profile = await Profile.findOne().sort({ _id: -1 }); // Latest entry
      if (!profile) {
        return res.status(404).json({ message: "No profile found" });
      }
      res.json(profile);
    } catch (err) {
      console.error("Error fetching profile:", err);
      res.status(500).json({ message: "Server error" });
    }
  });  

app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
