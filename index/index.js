import express from "express";
import bodyParser from "body-parser";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 3000;

// Middleware
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/review.html");
});

app.post("/subRev", (req, res) => {
  console.log(req.body);
  res.sendFile(__dirname + "/public/review.html");
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
