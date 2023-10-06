import dotenv from "dotenv"
//config 
dotenv.config()
// require("./models/index.js")
import ("./models/index.js")
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';
import fs from "fs";
import express from "express";
import authRoutes from "./routes/auth.js";
import postRoutes from "./routes/posts.js";
import cookieParser from "cookie-parser";
import multer from "multer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(express.json());
app.use(cookieParser());

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./upload");
    },
    filename: function (req, file, cb) {
        const originalname = file.originalname.replace(/\s+/g, '_');
        cb(null, Date.now() + originalname);
    },
});

const upload = multer({ storage });

app.post("/api/upload", upload.single("file"), function (req, res) {
    const file = req.file;
    res.status(200).json(file.filename);
});

app.get("/api/images/:filename", function (req, res) {
    const { filename } = req.params;

    // Check if filename is undefined or empty
    if (!filename) {
        return res.status(400).json({ error: "Invalid filename" });
    }

    const imagePath = path.join(__dirname, "upload", filename);

    // Check if the file exists before sending it
    if (!fs.existsSync(imagePath)) {
        return res.status(404).json({ error: "File not found" });
    }

    // Send the image as a response
    res.sendFile(imagePath);
});


app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

app.listen(process.env.PORT, () => {
    console.log("Connected!" + process.env.PORT);
});
