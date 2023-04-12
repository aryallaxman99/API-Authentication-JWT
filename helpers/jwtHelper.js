import jwt from "jsonwebtoken";
import createHttpError from "http-errors";

const signAccessToken = (userId) => {
  return new Promise((resolve, reject) => {
    const payload = {};

    const secret = process.env.ACCESS_TOKEN_SECRET;
    const options = {
      expiresIn: "1h",
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
  // const bearerToken = authHeader.split(" ");
  // const token = bearerToken[1];
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, payload) => {
    if (error) {
      return next(createHttpError.Unauthorized());
    }
    req.payload = payload;
    next();
  });
};
export default {
  signAccessToken,
  verifyAccessToken,
};
