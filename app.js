import express, { urlencoded } from "express";
import mongoose from "mongoose";
import cors from "cors";
import router from "./api/index.js";
import * as dotenv from "dotenv";
import webpush from "web-push";
import path from "path";
import url from "url";
import Subscription from "./models/subscription.model.js";

// const __filename = url.fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
dotenv.config();

webpush.setVapidDetails(
  "mailto:elzachin373@gmail.com",
  "BKRns56lTgiccLbI4tVnvoBrzAeKhbDcZzVSR1Kexd2yVZS3mal9_lPL6Ec8nsYL64acQHgsZbyuC5WZsiTZDic",
  "qxepqnkZ5K5KCZQtjxk4IxJHMVc4NyoP-iyb3So-PhY"
);

// const subscription = {
//   endpoint:
//     "https://fcm.googleapis.com/fcm/send/dmrjFNCsBHg:APA91bFy6KsyIXIc-d6-vYBDQUhyEUP3om-Mp3YjQ_AWEXbCaOCSTu_O0zaFlkWmYsu_X48K0AU7LPvoHjVkqEYro27iyW5mapgeuIl6aMmiScHvNIPGzF1LxAAzkciLt0BuH5eayxz-",
//   expirationTime: null,
//   keys: {
//     p256dh:
//       "BAmpxTwyQCz6yShhRNQyBuOT0I-_BSKviTnhd2USoE7FvHMZYxEfkgrhLNIvGkuSHUcoHVee0WSex1Dt6L9PV30",
//     auth: "6WDcgSjPJt79cGCFeyH3SA",
//   },
// };

// const payload = JSON.stringify({ title: "Push Test", body: "hello man" });
// webpush
//   .sendNotification(subscription, payload)
//   .then(() => {
//     console.log("success");
//   })
//   .catch((err) => console.log(err));

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

app.use("/", router);
