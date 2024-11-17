import express, { urlencoded } from "express";
import mongoose from "mongoose";
import cors from "cors";
import router from "./api/index.js";

import * as dotenv from "dotenv";
import Post from "./models/post.model.js";

dotenv.config();

const app = express();
// app.use(express.static(path.join(__dirname, "client")));

const PORT = process.env.PORT || 4000;

// Configurations
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());
// Log Requests
app.use((req, res, next) => {
  // green | yellow | white
  console.log(
    "\x1b[32m",
    `\b[${req.method}]`,
    "\x1b[33m",
    `\b${req.path}`,
    "\x1b[37m"
  );
  next();
});

const MONGO_URI = process.env.MONGO_URI;
// Database connection
mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() =>
    app.listen(PORT, () => {
      console.log(`Server Running on Port ${PORT}`);
    })
  )
  .catch((error) => {
    console.log(`${error} did not connect`);
  });

// const posts = await Post.find({});
// await Post.deleteMany({});

// posts.forEach(async (element, idx) => {
// console.log(element._id);
// const newPost = new Post({ ...element, _id: idx + 1 });
// console.log(newPost._id);
// await newPost.save();
// });

app.use("/", router);
