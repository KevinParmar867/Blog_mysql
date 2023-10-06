import db from "../models/index.js";
import jwt from "jsonwebtoken";

export const getPosts = async (req, res) => {
  try {
    const posts = req.query.cat
      ? await db.Post.findAll({ where: { cat: req.query.cat } })
      : await db.Post.findAll();

    return res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error.message);
  }
};

export const getPost = async (req, res) => {
  try {
    const postId = req.params.id;

    // Find the post by its id
    const post = await db.Post.findOne({
      where: { id: postId },
    });

    if (!post) {
      return res.status(404).json("Post not found!");
    }

    const userId = post.userID; // Assuming 'userId' is the foreign key in your Post model

    const user = await db.User.findOne({
      where: { id: userId },
      attributes: ["id", "name"], // Specify the attributes you want to retrieve from the User model
    });

    if (!user) {
      return res.status(404).json("User not found!");
    }

    // Construct the API response
    const responseData = {
      id: post.id,
      title: post.title,
      desc: post.desc,
      postImg: post.postImg,
      date: post.date,
      cat: post.cat,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      user: {
        id: user.id,
        name: user.name,
      },
    };

    return res.status(200).json(responseData);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error.message);
  }
};

export const addPost = async (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, process.env.JWT_KEY, async (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    try {
      const newPost = await db.Post.create({
        title: req.body.title,
        desc: req.body.desc,
        postImg: req.body.postImg,
        cat: req.body.cat,
        date: req.body.date,
        userID: userInfo.id,
      });

      return res.status(200).json("Post has been created.");
    } catch (error) {
      console.error(error);
      return res.status(500).json(error.message);
    }
  });
};

export const deletePost = async (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, process.env.JWT_KEY, async (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    try {
      const postId = req.params.id;
      const post = await db.Post.findOne({ where: { id: postId } });

      if (!post) return res.status(404).json("Post not found!");

      if (post.userID !== userInfo.id)
        return res.status(403).json("You can delete only your post!");

      await post.destroy();
      
      return res.status(200).json("Post has been deleted!");
    } catch (error) {
      console.error(error);
      return res.status(500).json(error.message);
    }
  });
};

export const updatePost = async (req, res) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("Not authenticated!");

  jwt.verify(token, process.env.JWT_KEY, async (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    try {
      const postId = req.params.id;
      const post = await db.Post.findOne({ where: { id: postId } });

      if (!post) return res.status(404).json("Post not found!");

      if (post.userID !== userInfo.id)
        return res.status(403).json("You can update only your post!");

      post.title = req.body.title;
      post.desc = req.body.desc;
      post.postImg = req.body.postImg;
      post.cat = req.body.cat;

      await post.save();
      return res.status(200).json("Post has been updated.");
    } catch (error) {
      console.error(error);
      return res.status(500).json(error.message);
    }
  });
};

