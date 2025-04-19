import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));
import otp from 'otp';
import email from "./node_modules/mailer/lib/node_mailer.js";

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
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

for(var i = 0; i < 10; i++){
    email.send({
      host : "localhost",              // smtp server hostname
      port : "3000",                     // smtp server port
	  ssl: true,						// for SSL support - REQUIRES NODE v0.3.x OR HIGHER
      domain : "localhost",            // domain used by client to identify itself to server
      to : `${mail}`,
      from : "limitsundefined7777@gmail.com",
      subject : "node_mailer test email",
      body: `Hello! This is a test of the node_mailer. Your OTP for verification is: ${genOtp}`,
      authentication : "login",        // auth login is supported; anything else is no auth
      username : "my_username",        // username
      password : "my_password"         // password
    },
    function(err, result){
      if(err){ console.log(err); }
    });
}

app.post("/otpVerify", (req, res) => {
    console.log(req.body);
    if(req.body.OTP === genOtp) res.redirect("/");
    else res.sendFile(__dirname + "/public/otp.html");
});

app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});