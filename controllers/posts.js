import Post from "../models/post.model.js";
import Author from "../models/author.model.js";
import { Response } from "../types/response.js";

export const getMyPosts = async (req, res) => {
  const serviceResponse = { ...Response };
  try {
    const foundAuthor = await Author.findById(req.authorData.id);
    const posts = await Post.find({ _id: { $in: foundAuthor.posts } }).populate(
      "_author"
    );
    serviceResponse.success = true;
    serviceResponse.msg = "posts fetched successfully";
    serviceResponse.response = posts;
    res.status(200).json(serviceResponse);
  } catch (error) {
    serviceResponse.msg = "Failed to fetch posts";
    serviceResponse.error = error;
    res.status(500).json(serviceResponse);
  }
};

export const getSinglePost = async (req, res) => {
  const serviceResponse = { ...Response };
  try {
    const singlepost = await Post.findById(req.params.id).populate("_author");
    console.log(singlepost);
    serviceResponse.success = true;
    serviceResponse.msg = "posts fetched successfully";
    serviceResponse.response = singlepost;
    res.status(200).json(serviceResponse);
  } catch (error) {
    serviceResponse.msg = "Failed to fetch posts";
    serviceResponse.error = error;
    res.status(500).json(serviceResponse);
  }
};

export const getPosts = async (req, res) => {
  const serviceResponse = { ...Response };
  try {
    const posts = await Post.find({}).populate("_author");
    serviceResponse.success = true;
    serviceResponse.msg = "posts fetched successfully";
    serviceResponse.response = posts;
    res.status(200).json(serviceResponse);
  } catch (error) {
    serviceResponse.msg = "Failed to fetch posts";
    serviceResponse.error = error;
    res.status(500).json(serviceResponse);
  }
};

export const getRecentPosts = async (req, res) => {
  const serviceResponse = { ...Response };
  try {
    const posts = await Post.find({}, {}, { sort: { date: -1 } }).populate(
      "_author"
    );
    posts.slice(6);
    serviceResponse.success = true;
    serviceResponse.msg = "posts fetched successfully";
    serviceResponse.response = posts;
    res.status(200).json(serviceResponse);
  } catch (error) {
    serviceResponse.msg = "Failed to fetch posts";
    serviceResponse.error = error;
    res.status(500).json(serviceResponse);
  }
};

export const createPost = async (req, res) => {
  console.log(req.body);
  //decoding request body for form data
  const { title, titleimage, content, tags } = req.body;
  const serviceResponse = { ...Response };
  try {
    // creating new post
    console.log(req.authorData);
    const newPost = new Post({
      title,
      titleimage,
      content,
      tags,
      _author: req.authorData.id,
    });
    await newPost.save();

    // pushing post to author's posts array
    const foundAuthor = await Author.findById(req.authorData.id);
    foundAuthor.posts.push(newPost.id);
    await foundAuthor.save();

    // sending response
    serviceResponse.success = true;
    serviceResponse.msg = "post created successfully";
    serviceResponse.response = newPost;
    res.status(201).json(serviceResponse);
  } catch (error) {
    //Failure messages
    serviceResponse.msg = "Failed to create post";
    serviceResponse.error = error;
    res.status(500).json(serviceResponse);
  }
};

export const checkAuthor = async (req, res) => {
  const serviceResponse = { ...Response };
  try {
    const post = await Post.findById(req.params.id);
    if (post._author.toString() === req.authorData.id.toString()) {
      serviceResponse.success = true;
      serviceResponse.msg = "author verified";
      res.status(200).json(serviceResponse);
    } else {
      serviceResponse.msg = "You are not authorized to modify this post";
      res.status(401).json(serviceResponse);
    }
  } catch (error) {
    serviceResponse.msg = "Failed to verify author";
    serviceResponse.error = error;
    res.status(500).json(serviceResponse);
  }
};

export const updatePost = async (req, res) => {
  const { title, titleimage, content, tags } = req.body;
  const serviceResponse = { ...Response };
  try {
    const oldpost = await Post.findById(req.params.id);
    if (oldpost._author.toString() === req.authorData.id.toString()) {
      //adding new data
      await Post.findByIdAndUpdate(req.params.id, {
        title,
        titleimage,
        content,
        tags,
      });
      //sending success response
      serviceResponse.success = true;
      serviceResponse.msg = "post updated successfully";
      serviceResponse.response = await Post.findById(req.params.id);
      res.status(200).json(serviceResponse);
    } else {
      //sending authorisation error
      serviceResponse.msg = "You are not authorized to update this post";
      res.status(401).json(serviceResponse);
    }
  } catch (error) {
    serviceResponse.msg = "Failed to update post";
    serviceResponse.error = error;
    res.status(500).json(serviceResponse);
  }
};

export const deletePost = async (req, res) => {
  const serviceResponse = { ...Response };
  try {
    const post = await Post.findById(req.params.id);

    //checking user access
    console.log(req.authorData);
    console.log(post._author);
    if (post._author.toString() === req.authorData.id.toString()) {
      //deleting the post
      await Post.findByIdAndDelete(req.params.id);

      //sending success message
      serviceResponse.success = true;
      serviceResponse.msg = "post deleted successfully";
      res.status(200).json(serviceResponse);
    } else {
      //sending authorisation error
      serviceResponse.msg = "You are not authorized to delete this post";
      res.status(401).json(serviceResponse);
    }
  } catch (error) {
    serviceResponse.msg = "Failed to delete post";
    serviceResponse.error = error;
    res.status(500).json(serviceResponse);
  }
};
