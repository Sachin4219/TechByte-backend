import mongoose from "mongoose";

// Define the schema for the subscription
const subscriptionSchema = new mongoose.Schema({
  endpoint: {
    type: String,
    required: true,
  },
  expirationTime: {
    type: Date,
    default: null,
  },
  keys: {
    p256dh: {
      type: String,
      required: true,
    },
    auth: {
      type: String,
      required: true,
    },
  },
});

// Create the Subscription model
const Subscription = mongoose.model("Subscription", subscriptionSchema);

export default Subscription;
