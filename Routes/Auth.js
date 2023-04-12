import express from "express";
import createHttpError from "http-errors";
import bcrypt from "bcrypt";
import User from "../Models/userModel.js";
import authSchema from "../helpers/validationSchema.js";
import jwtHelper from "../helpers/jwtHelper.js";

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

    const acessToken = await jwtHelper.signAcessToken(savedUser.id);
    res.send({ acessToken });
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

    const accessToken = await jwtHelper.signAcessToken(user.id);
    res.send({ accessToken });
  } catch (error) {
    if (error.isjoi === true)
      return next(createHttpError.BadRequest("Invalid username/ password"));
    next(error);
  }
});

router.post("/refresh-token", (req, res, next) => {
  res.send("refresh token");
});

router.delete("/logout", (req, res, next) => {
  res.send("logout");
});

export default router;
