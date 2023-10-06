import db from "../models/index.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    // Check if any input field is empty
    if (!req.body.name || !req.body.email || !req.body.password) {
      return res.status(400).json("Please fill in all input fields.");
    }

    // Check if a user with the same email or name already exists
    const existingUser = await db.User.findOne({
      where: {
        [db.Sequelize.Op.or]: [{ email: req.body.email }, { name: req.body.name }],
      },
    });

    if (existingUser) {
      return res.status(409).json("User already exists!");
    }

    // Hash the password and create a new user
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    const newUser = await db.User.create({
      name: req.body.name,
      email: req.body.email,
      password: hash,
    });

    // Generate a JWT token for the newly registered user
    const token = jwt.sign({ id: newUser.id }, process.env.JWT_KEY);

    // Exclude password from the user data
    const { password, ...other } = newUser.toJSON();

    return res.cookie("access_token", token, {
      httpOnly: true,
    }).status(200).json(other);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error.message);
  }
};

export const login = async (req, res) => {
  try {
    // Check if a user with the given email exists
    const user = await db.User.findOne({
      where: { email: req.body.email },
    });

    if (!user) {
      return res.status(404).json("User not found!");
    }

    // Check if the provided password matches the stored password
    const isPasswordCorrect = bcrypt.compareSync(req.body.password, user.password);

    if (!isPasswordCorrect) {
      return res.status(400).json("Wrong username or password!");
    }

    // Generate a JWT token for the authenticated user
    const token = jwt.sign({ id: user.id }, process.env.JWT_KEY);

    // Exclude password from the user data
    const { password, ...other } = user.toJSON();

    return res.cookie("access_token", token, {
      httpOnly: true,
    }).status(200).json(other);
  } catch (error) {
    console.error(error);
    return res.status(500).json(error.message);
  }
};

export const logout = (req, res) => {
  res.clearCookie("access_token", {
    sameSite: "none",
    secure: true,
  }).status(200).json("User has been logged out.");
};
