import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));
import otp from 'otp';

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/loginSignup.html");
});

var genOtp;
var mail;

app.post("/submitLog", (req, res) => {
    console.log(req.body);
    mail = req.body.mail;
    var Otp = new otp();
    console.log(Otp.totp());
    genOtp = Otp.totp();
    res.sendFile(__dirname + "/public/otp.html");
});

app.post("/submitSig", (req, res) => {
    console.log(req.body);
    mail = req.body.mail;
    var Otp = new otp();
    console.log(Otp.totp());
    genOtp = Otp.totp();
    res.sendFile(__dirname + "/public/otp.html");
});

app.post("/otpVerify", (req, res) => {
    console.log(req.body);
    if(req.body.OTP === genOtp) res.redirect("/");
    else res.sendFile(__dirname + "/public/otp.html");
});

app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});