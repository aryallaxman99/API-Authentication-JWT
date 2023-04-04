import express from "express";
const router = express.Router();

router.post("/register", (req, res, next) => {
  res.send("register");
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
