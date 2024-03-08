import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

import "dotenv/config";

// TODO - IMPORT ROUTERS
import { verifyToken } from "./middlewares/user.js";
import { register } from "./controllers/auth.js";
import { createPost } from "./controllers/posts.js";
import authRoutes from "./routers/auth.js";
import usersRoutes from "./routers/users.js";
import postsRoutes from "./routers/posts.js";

// TODO - CONFIGURATIONS
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use(morgan("common"));

app.use("/assets", express.static(path.join(__dirname, "public/assets")));

// TODO - FILE STORAGE
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/assets");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

// TODO - ROUTERS WITH FILES
app.post("/auth/register", upload.single("picture"), register);
app.post("/posts", verifyToken, upload.single("picture"), createPost);

// TODO - ROUTERS
app.use("/auth", authRoutes);
app.use("/users", usersRoutes);
app.use("/posts", postsRoutes);

// TODO - MONGOOSE SETUP
const PORT = process.env.PORT || 5001;
mongoose
  .connect(process.env.MONGODB_STRING_URL)
  .then(() =>
    app.listen(PORT, () => console.log(`SERVER AND DATABASE RUNNING...`))
  )
  .catch((err) => console.log(err));
