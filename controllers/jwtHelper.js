import jwt from "jsonwebtoken";
import createHttpError from "http-errors";

const signAcessToken = (userId) => {
  return new Promise((resolve, reject) => {
    const payload = {};

    const secret = "secret";
    const options = {
      expiresIn: "1h",
      issuer: "local",
      audience: userId,
    };

    jwt.sign(payload, secret, options, (err, token) => {
      if (err) reject(err);
      resolve(token);
    });
  });
};

export default {
  signAcessToken,
};
