import express from "express";
import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import User from "../Models/userModel.js";
import authSchema from "../controllers/validationSchema.js";
const router = express.Router();

router.post("/register", async (req, res, next) => {
  try {
    const result = await authSchema.validateAsync(req.body);

    const doesEmailExist = await User.findOne({ email: result.email });
    if (doesEmailExist) throw createHttpError.Conflict("Email already exists");

    const salt = bcrypt.genSaltSync(10); //saltRounds = 10
    const hash = bcrypt.hashSync(result.password, salt);
    req.body.password = hash;
    const savedUser = await User.create(req.body);
    savedUser
      ? console.log("new user registered")
      : console.log("something went wrong");
  } catch (error) {
    // console.log(error);

    next(error);
  }
});

router.post("/login", (req, res, next) => {
  res.send("login");
});

router.post("/refresh-token", (req, res, next) => {
  res.send("refresh token");
});

router.delete("/logout", (req, res, next) => {
  res.send("logout");
});

export default router;
