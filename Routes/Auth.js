import express from "express";
import createHttpError from "http-errors";
import User from "../Models/userModel.js";
const router = express.Router();

router.post("/register", async (req, res, next) => {
  console.log(req.body);
  try {
    const { email, password } = req.body;
    if (!email || !password) throw createHttpError.BadRequest();

    const doesEmailExist = await User.findOne({ email: email });
    if (doesEmailExist) throw createHttpError.Conflict("Email already exists");

    const savedUser = await User.create(req.body);
  } catch (error) {
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
