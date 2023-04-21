import express from "express";
import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import User from "../Models/userModel.js";
import authSchema from "../helpers/validationSchema.js";
import jwtHelper from "../helpers/jwtHelper.js";
import { verify } from "jsonwebtoken";

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

    const acessToken = await jwtHelper.signAccessToken(savedUser.id);
    const refreshToken = await jwtHelper.signRefreshToken(savedUser.id);

    res.send({ acessToken, refreshToken });
  } catch (error) {
    // console.log(error);

    next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const result = await authSchema.validateAsync(req.body);

    const user = await User.findOne({ email: result.email });
    if (!user) throw createHttpError.NotFound("user not registered");

    const isValidPassword = bcrypt.compareSync(result.password, user.password);

    if (!isValidPassword)
      throw createHttpError.Unauthorized("Username/Password not valid");

    const accessToken = await jwtHelper.signAccessToken(user.id);
    const refreshToken = await jwtHelper.signRefreshToken(user.id);
    res.send({ accessToken, refreshToken });
  } catch (error) {
    if (error.isjoi === true)
      return next(createHttpError.BadRequest("Invalid username/ password"));
    next(error);
  }
});

router.post("/refresh-token", async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) throw createHttpError.BadRequest();

    const userId = await jwtHelper.verifyRefreshToken(refreshToken);
    const accessToken = await jwtHelper.signAccessToken(userId);
    const newRefreshToken = await jwtHelper.signRefreshToken(userId);

    res.send({ accessToken, newRefreshToken });
  } catch (error) {
    next(error);
  }
});

router.delete("/logout", async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) throw createHttpError.BadRequest();
    const userId = await jwtHelper.verifyRefreshToken(refreshToken);
    if (!userId) throw createHttpError.NotAcceptable();
    res.status(200).send("user logout");
  } catch (error) {
    next(error);
  }
});

export default router;
