const jwt = require("jsonwebtoken");
const HttpError = require("../utils/httpError");

exports.auth = (req, res, next) => {
  if (req.method === "OPTIONS") {
    next();
  }
  try {
    const token = req.headers.authorization.split(" ")[1]; // Authorization: Bearer <token>
    const decodedToken = jwt.verify(token, "secret");
    req.userData = {
      id: decodedToken.id,
    };
    next();
  } catch (error) {
    console.log(error);
    return next(new HttpError("Authentication failed", 401));
  }
};
