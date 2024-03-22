import Subscription from "../models/subscription.js";
import * as dotenv from "dotenv";
import { Response } from "../types/response.js";
import webpush from "web-push";

dotenv.config();

const vapidDetails = {
  publicKey: process.env.public_key,
  privateKey: process.env.private_key,
  subject: process.env.subject,
};

const publickey =
  "BKRns56lTgiccLbI4tVnvoBrzAeKhbDcZzVSR1Kexd2yVZS3mal9_lPL6Ec8nsYL64acQHgsZbyuC5WZsiTZDic";
const privatekey = "qxepqnkZ5K5KCZQtjxk4IxJHMVc4NyoP-iyb3So-PhY";

webpush.setVapidDetails(
  vapidDetails.subject,
  vapidDetails.publicKey,
  vapidDetails.privateKey
);

const subscribeUser = async (req, res) => {
  console.log("subscribtion called");
  const subscription = req.body;
  // console.log(subscription);
  try {
    const newSub = await new Subscription({ ...subscription });
    await newSub.save();
    const serviceResponse = { ...Response };
    serviceResponse.success = true;
    serviceResponse.response = { message: "subscription successful" };
    res.status(201).json(serviceResponse);
  } catch (err) {
    console.log(err);
  }
  const payload = JSON.stringify({
    title: "Push Test",
    body: "subscription success",
  });
  webpush
    .sendNotification(subscription, payload)
    .then(() => {
      console.log("success");
    })
    .catch((err) => console.log(err));
};
export default subscribeUser;
