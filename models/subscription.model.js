import mongoose from "mongoose";

const SubscriptionSchema = mongoose.Schema({
  subscription: Object,
});

const Subscription = mongoose.model("Subscription", SubscriptionSchema);

export default Subscription;
