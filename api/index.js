import express from "express";
const router = express.Router();

import {
  register,
  login,
  check_auth,
} from "../controllers/authors.js";

import {
  createPost,
  deletePost,
  getPosts,
  getMyPosts,
  updatePost,
} from "../controllers/posts.js";
import { Response } from "../types/response.js";

// import { verifyOTP , generateOTP} from "../controllers/forgotPass.js";

// USER Routes
router.post( "/register", register );
router.post( "/login", login );

// Notes Routes
router.get( "/posts/my", check_auth, getMyPosts );
router.post( "/posts/new", check_auth, createPost );
router.get( "/posts", getPosts );
router.put( "/posts/:id", check_auth, updatePost );
router.delete( "/posts/:id", check_auth, deletePost );

// Check Auth
router.get( "/check_login", check_auth, ( req, res ) => {
  const serviceResponse = { ...Response }
  serviceResponse.success = true
  serviceResponse.response = {
    isVerified: true,
    authorData: req.authorData
  }

  return res.status( 200 ).json( serviceResponse );
} );

// Check OTP
// router.post("/resetpassword", verifyOTP)
// router.post("/forgotpassword", generateOTP)

export default router;