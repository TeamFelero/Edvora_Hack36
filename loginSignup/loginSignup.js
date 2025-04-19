import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import bcrypt from "bcrypt";
import session from "express-session";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { dirname } from "path";
import { fileURLToPath } from "url";
import otp from "otp";
import { sendEmail } from "./sendMail.js"; // must exist and work

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const port = 3000;

// MongoDB setup
mongoose.connect("mongodb://localhost:27017/Users", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("MongoDB connection error:", err));

// User schema
const UserSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
});
const User = mongoose.model("User", UserSchema);

// Middleware
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Session & Passport
app.use(session({
  secret: "felerooutofcontrol",
  resave: false,
  saveUninitialized: false,
}));
app.use(passport.initialize());
app.use(passport.session());

// Google OAuth setup
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

passport.serializeUser((user, done) => {
  done(null, user.id);
});
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
  if (req.isAuthenticated()) {
    res.send(`<h1>Welcome, ${req.user.username}</h1><a href="/logout">Logout</a>`);
  } else {
    res.sendFile(__dirname + "/public/loginSignup.html");
  }
});

app.get("/logout", (req, res) => {
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
    failureRedirect: "/",
    successRedirect: "/"
  })
);

// Forget Password
app.get("/forget", (req, res) => {
    res.sendFile(__dirname + "/public/forgotPassword.html");
});

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
      text: "For verification",
      html: `<h1>Otp Verification!</h1><p>Thanks for registering. Your verification code is ${genOtp}</p>`,
    });

    req.session.pendingUser = { username, email, password: hashedPassword };

    console.log("OTP sent:", genOtp);
    res.sendFile(__dirname + "/public/otp.html");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error during signup or sending OTP");
  }
});

app.post("/forget", async (req, res) => {
    const mail = req.body.email;
    forPass = true;

    console.log(mail);
    var Otp = new otp();
    genOtp = Otp.totp();
    console.log(genOtp);
  
    // if (!mail) {
    //   return res.status(400).send("Invalid signup details");
    // }
  
    try {  
      await sendEmail({
        to: mail,
        subject: "Otp Verification",
        text: "For verification",
        html: `<h1>Otp Verification!</h1><p>Thanks for registering. Your verification code is ${genOtp}</p>`,
      });
  
      console.log("OTP sent:"+genOtp);
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).send("Error sending OTP email");
    }
    res.sendFile(__dirname + "/public/otp.html");
});

app.post("/otpVerify", async (req, res) => {
  const otpCurr = req.body.OTP;
  if (otpCurr === genOtp) {
    try {
      const newUser = new User(req.session.pendingUser);
      await newUser.save();
      delete req.session.pendingUser;
      if(signup === true) res.redirect("/");
      else res.sendFile(__dirname + "/public/createPassword.html");
    } catch (err) {
      res.status(500).send("Error saving user after OTP");
    }
  } else {
    res.sendFile(__dirname + "/public/otp.html");
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

// New Password
app.post("/create", (req, res) => {
  console.log(req.body);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
