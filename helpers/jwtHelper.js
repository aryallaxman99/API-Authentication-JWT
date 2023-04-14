import jwt from "jsonwebtoken";
import createHttpError from "http-errors";

const signAccessToken = (userId) => {
  return new Promise((resolve, reject) => {
    const payload = {};

    const secret = process.env.ACCESS_TOKEN_SECRET;
    const options = {
      expiresIn: "20S",
      issuer: "local",
      audience: userId,
    };

    jwt.sign(payload, secret, options, (err, token) => {
      if (err) {
        console.log(err.message);
        reject(createHttpError.InternalServerError());
      }
      resolve(token);
    });
  });
};

const verifyAccessToken = (req, res, next) => {
  if (!req.headers["authorization"])
    return next(createHttpError.Unauthorized());
  const token = req.headers["authorization"].split(" ")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, payload) => {
    if (error) {
      const message = (error.name = "JsonWebTokenError"
        ? "Unauthorized"
        : error.message);
      return next(createHttpError.Unauthorized(message));
    }
    req.payload = payload;
    next();
  });
};

const signRefreshToken = (userId) => {
  return new Promise((resolve, reject) => {
    const payload = {};

    const secret = process.env.REFRESH_TOKEN_SECRET;
    const options = {
      expiresIn: "1y",
      issuer: "local",
      audience: userId,
    };

    jwt.sign(payload, secret, options, (err, token) => {
      if (err) {
        console.log(err.message);
        reject(createHttpError.InternalServerError());
      }
      resolve(token);
    });
  });
};

const verifyRefreshToken = (refreshToken) => {
  return new Promise((resolve, reject) => {
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, payload) => {
        if (err) return reject(createHttpError.Unauthorized());
        const userId = payload.aud;
        resolve(userId);
      }
    );
  });
};
export default {
  signAccessToken,
  verifyAccessToken,
  signRefreshToken,
  verifyRefreshToken,
};
