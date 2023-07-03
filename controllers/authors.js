import Author from "../models/author.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Response } from "../types/response.js";

export const generateToken = (author) => {
  console.log(author);
  return jwt.sign({ authorname: author.username, id: author._id }, "kadabra", {
    expiresIn: "360min",
  });
};

export const register = async (req, res) => {
  const { name, username, bio, photo, password, email } = req.body;
  const serviceResponse = { ...Response };
  try {
    // Find if author already exists or not
    const foundAuthorEmail = await Author.findOne({ email });
    const foundAuthorUserName = await Author.findOne({ username });
    // If author already exists
    if (foundAuthorEmail || foundAuthorUserName) {
      serviceResponse.success = false;
      if(foundAuthorEmail)
        serviceResponse.msg = "Email is already registered";
      if(foundAuthorUserName)
        serviceResponse.msg = "Username is already registered";
      res.status(409).json(serviceResponse);
    }
    else{
        // Create hash
        const hash = await bcrypt.hash(password, 10);
        // console.log("Hash created", hash)

        const newAuthor = new Author({
          name,
          username,
          bio,
          photo,
          password: hash,
          email,
        });
        await newAuthor.save();
  
          serviceResponse.success = true;
          serviceResponse.msg = "Author registered successfully";
          serviceResponse.response = {
            name: newAuthor.username,
            photo: newAuthor.photo,
            email: newAuthor.email,
            token: generateToken(newAuthor),
          };
  
        res.status(201).json(serviceResponse);
      }
  } catch (error) {
    serviceResponse.msg = "Failed to register author";
    serviceResponse.error = error;
    res.status(500).json(serviceResponse);
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  // console.log(req.body)
  const serviceResponse = { ...Response };
  try {
    const foundAuthor = await Author.findOne({ email });
    const hash = foundAuthor.password;
    bcrypt.compare(password, hash, (err, result) => {
      if (err) console.log(err);
      else {
        if (result) {
          serviceResponse.response = {
            name: foundAuthor.username,
            photo: foundAuthor.photo,
            email: foundAuthor.email,
            token: generateToken(foundAuthor),
          };
          serviceResponse.success = true;
          serviceResponse.msg = "Author logged in successfully";

          res.status(200).json(serviceResponse);
        } else {
          // console.log("Password Does not match");
          serviceResponse.msg = "Password does not match (Invalid credentials)";
          res.status(401).json(serviceResponse);
        }
      }
    });
  } catch (error) {
    serviceResponse.msg = "Failed to login author";
    serviceResponse.error = error;
    res.status(500).json(serviceResponse);
  }
};

export const check_auth = (req, res, next) => {
  console.log("Cheking Auth");
  const serviceResponse = { ...Response };
  try {
    const token = req.headers.authorization.split(" ")[1];
    var decoded = jwt.verify(token, "kadabra");
    req.authorData = decoded;
    next();
  } catch (error) {
    serviceResponse.msg = "Unauthorized Access";
    serviceResponse.response = { isVerified: false };
    return res.status(401).json(serviceResponse);
  }
};
