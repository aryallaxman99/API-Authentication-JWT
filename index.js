import "dotenv/config";
import express from "express";
import morgan from "morgan";
import createError from "http-errors";

import Authroute from "./Routes/Auth.js";
import connect from "./db/connect.js";

const app = express();

app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("hello");
});

app.use("/auth", Authroute);

app.use((req, res, next) => {
  //   const error = new Error("page not found");
  //   error.status = 404;
  //   next(error);
  next(createError.NotFound("route doesn't exist"));
});

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status || 500,
      msg: err.message,
    },
  });
});

app.listen(process.env.PORT, (err) => {
  if (!err) {
    console.log(`server started at ${process.env.PORT}`);
    connect();
  }
});
