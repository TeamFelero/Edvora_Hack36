import express from "express";
import bodyParser from "body-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/profile.html");
});

app.get("/edit", (req, res) => {
    res.sendFile(__dirname + "/public/edit-profile.html");
});

app.post("/prof", (req, res) => {
    console.log(req.body);
});

app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});