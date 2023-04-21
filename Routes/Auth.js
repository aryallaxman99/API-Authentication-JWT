import express from "express";
import authController from "../controllers/authControllers.js";

const router = express.Router();

router.post("/register", authController.register);

router.post("/login", authController.login);

router.post("/refresh-token", authController.RefreshToken);

router.delete("/logout", authController.logout);

export default router;
