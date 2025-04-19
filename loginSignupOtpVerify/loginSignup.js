import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));
import otp from 'otp';
import { sendEmail } from "./sendMail.js";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/loginSignup.html");
});

var genOtp;

app.post("/submitLog", async (req, res) => {
    console.log(req.body);

    res.sendFile(__dirname + "/public/loginSignup.html");
});

app.post("/submitSig", async (req, res) => {
    console.log(req.body);
    const mail = req.body.email;
    var Otp = new otp();
    genOtp = Otp.totp();
    console.log(genOtp);

    try {
        await sendEmail({
            to: mail,
            subject: "Otp Verification",
            text: "For verification",
            html: `<h1>Otp Verification!</h1><p>Thanks for logging into Edvora. Your vetification code is ${genOtp}</p>`,
        });
        console.log("Email sent to", mail);
    } catch (error) {
        console.error("Error sending email:", error);
    }

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