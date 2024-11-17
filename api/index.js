import express from "express";
const router = express.Router();

import { register, login, check_auth } from "../controllers/authors.js";

// import subscribeUser from "../controllers/subscription.js";

import {
  createPost,
  deletePost,
  getPosts,
  getMyPosts,
  updatePost,
  getSinglePost,
  checkAuthor,
  getRecentPosts,
} from "../controllers/posts.js";
import { Response } from "../types/response.js";

// import { verifyOTP , generateOTP} from "../controllers/forgotPass.js";

// USER Routes
router.post("/register", register);
router.post("/login", login);

// router.post("/subscribe", subscribeUser);

// Posts Routes
router.post("/posts/new", check_auth, createPost);
router.get("/posts/my", check_auth, getMyPosts);
router.get("/posts/:page", getPosts);
router.get("/recent", getRecentPosts);
router.get("/post/:id", getSinglePost);
router.get("/post/:id", check_auth, checkAuthor);
router.put("/post/:id", check_auth, updatePost);
router.delete("/post/:id", check_auth, deletePost);

// Check Auth
router.get("/check_login", check_auth, (req, res) => {
  const serviceResponse = { ...Response };
  serviceResponse.success = true;
  serviceResponse.response = {
    isVerified: true,
    authorData: req.authorData,
  };

  return res.status(200).json(serviceResponse);
});

// Check OTP
// router.post("/resetpassword", verifyOTP)
// router.post("/forgotpassword", generateOTP)

export default router;
