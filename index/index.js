import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import http from "http";
import { Server } from "socket.io";
import bcrypt from "bcrypt";
import session from "express-session";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import otp from "otp";
import { sendEmail } from "./sendMail.js"; // ⚠️ Make sure this exists!

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const port = process.env.PORT || 3000;

// MongoDB Connection
mongoose.connect("mongodb://127.0.0.1:27017/Users", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Schemas
const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
});
const User = mongoose.model("User", UserSchema);

const reviewSchema = new mongoose.Schema({
  username: String,
  subject: String,
  review: String,
  createdAt: { type: Date, default: Date.now }
});
const Review = mongoose.model("Review", reviewSchema);

// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(session({
  secret: "felerooutofcontrol",
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

// Passport Google OAuth
passport.use(new GoogleStrategy({
  clientID: "354957478411-h0bfb58cnidfufitj1s4tqiteqih64f6.apps.googleusercontent.com",
  clientSecret: "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",
  callbackURL: "/auth/google/callback"
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const existingUser = await User.findOne({ email: profile.emails[0].value });
    if (existingUser) return done(null, existingUser);
    const newUser = await User.create({
      username: profile.displayName,
      email: profile.emails[0].value,
      password: ""
    });
    return done(null, newUser);
  } catch (err) {
    return done(err, null);
  }
}));

passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

// Routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/login", (req, res) => {
  if (req.isAuthenticated()) {
    res.send(`<h1>Welcome, ${req.user.username}</h1><a href="/logout">Logout</a>`);
  } else {
    res.sendFile(path.join(__dirname, "public", "loginSignup.html"));
  }
});

app.get("/logout", (req, res, next) => {
  req.logout(err => {
    if (err) return next(err);
    res.redirect("/");
  });
});

// Google OAuth
app.get("/auth/google", passport.authenticate("google", {
  scope: ["profile", "email"]
}));

app.get("/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    successRedirect: "/"
  })
);

// Signup + OTP
let genOtp;
let signup;
let forPass;

app.post("/submitSig", async (req, res) => {
  const { username, email, password, conPassword } = req.body;
  signup = true;
  if (!username || !email || !password || password !== conPassword) {
    return res.status(400).send("Invalid signup details");
  }
  const hashedPassword = await bcrypt.hash(password, 10);
  const otpGen = new otp();
  genOtp = otpGen.totp();

  try {
    await sendEmail({
      to: email,
      subject: "Otp Verification",
      html: `<h1>Otp Verification!</h1><p>Your verification code is ${genOtp}</p>`,
    });
    req.session.pendingUser = { username, email, password: hashedPassword };
    res.sendFile(path.join(__dirname, "public", "otp.html"));
  } catch (err) {
    console.error(err);
    res.status(500).send("Error sending OTP");
  }
});

// Forgot password
app.get("/forget", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "forgotPassword.html"));
});

app.post("/forget", async (req, res) => {
  const mail = req.body.email;
  forPass = true;
  const Otp = new otp();
  genOtp = Otp.totp();

  try {
    await sendEmail({
      to: mail,
      subject: "Otp Verification",
      html: `<h1>Otp Verification!</h1><p>Your verification code is ${genOtp}</p>`,
    });
    res.sendFile(path.join(__dirname, "public", "otp.html"));
  } catch (err) {
    res.status(500).send("Error sending OTP");
  }
});

app.post("/otpVerify", async (req, res) => {
  const otpCurr = req.body.OTP;
  if (otpCurr === genOtp) {
    try {
      const newUser = new User(req.session.pendingUser);
      await newUser.save();
      delete req.session.pendingUser;
      if (signup) res.redirect("/login");
      else res.sendFile(path.join(__dirname, "public", "createPassword.html"));
    } catch (err) {
      res.status(500).send("Error saving user after OTP");
    }
  } else {
    res.sendFile(path.join(__dirname, "public", "otp.html"));
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

    req.login(user, err => {
      if (err) return res.status(500).send("Login failed");
      res.redirect("/");
    });
  } catch (err) {
    res.status(500).send("Server error during login");
  }
});

// Password Reset (post-OTP)
app.post("/create", (req, res) => {
  console.log(req.body); // You can update the password here
  if(req.body.newPass !== req.body.confPass) {
    alert("Password Not Matching!!!");
    res.sendFile(path.join(__dirname, "public", "createPassword.html"));
  }
  res.sendFile(path.join(__dirname, "public", "loginSignup.html"));
});

// Review
app.get("/review", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "review.html"));
});

app.post("/subRev", async (req, res) => {
  try {
    const { username, subject, review } = req.body;
    const newReview = new Review({ username, subject, review });
    await newReview.save();
    res.sendFile(path.join(__dirname, "public", "review.html"));
  } catch (error) {
    res.status(500).send("Error saving your review");
  }
});

// Socket.IO Chat
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
