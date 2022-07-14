const express = require("express");
const router = express.Router();
const User = require("../../model/user");
const { v4: uuid } = require("uuid");
const bcrypt = require("bcryptjs");
const { Op } = require("sequelize");
const HttpError = require("../utils/httpError");
const jwt = require("jsonwebtoken");
const { auth } = require("../../middlewares/auth");

router.post("/", async (req, res, next) => {
  const { name, email, password } = req.body;
  console.log(req.body);
  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
      id: uuid(), //v4()
      name,
      email,
      password: hashedPassword,
      image: null,
    });
    res.json(user);
  } catch (err) {
    console.log(err);
    return next(
      new HttpError(
        err.message || "Something went wrong",
        err.statusCode || 500
      )
    );
  }
});

router.get("/", async (req, res, next) => {
  let { search } = req.query;
  search = search || "";
  try {
    const users = await User.findAll({
      where: {
        name: { [Op.like]: `%${search}%` },
      },
    });
    res.json(users);
  } catch (err) {
    console.log(err);
    return next(
      new HttpError(
        err.message || "Something went wrong",
        err.statusCode || 500
      )
    );
  }
});

router.get("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const user = await User.findOne({
      where: {
        id, //id:id
      },
    });

    if (!user) {
      return next(new HttpError("User not found", 404));
    }
    res.json(user);
  } catch (err) {
    console.log(err);
    return next(
      new HttpError(
        err.message || "Something went wrong",
        err.statusCode || 500
      )
    );
  }
});

router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({
      where: {
        email,
      },
    });
    console.log(user);
    if (!user) {
      return next(new HttpError("User not found", 404));
    }
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      return next(new HttpError("Password is incorrect", 401));
    }
    const token = await jwt.sign(
      {
        id: user.id,
      },
      "secret",
      { expiresIn: "4d" }
    );
    res.json({
      message: "Logged in successfully",
      user,
      token,
    });
  } catch (err) {
    // console.log(err);
    return next(
      new HttpError(
        err.message || "Something went wrong",
        err.statusCode || 500
      )
    );
  }
});

router.use(auth);

router.put("/:id", async (req, res, next) => {
  const { id } = req.params;
  if (req.userData.id !== id) {
    return next(new HttpError("You are not authorized", 401));
  }
  let { name, oldPassword, newPassword } = req.body;
  name = name || undefined;
  try {
    const user = await User.findOne({
      where: {
        id,
      },
    });
    if (!user) {
      return next(new HttpError("User not found", 404));
    }
    const isEqual = await bcrypt.compare(oldPassword, user.password);
    if (!isEqual) {
      return next(new HttpError("Password is incorrect", 401));
    }
    if (!newPassword) {
      newPassword = oldPassword;
    }
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    const result = await User.update(
      {
        name,
        password: hashedPassword,
      },
      { where: { id } }
    );
    console.log(result);
    res.json({
      // user: result[0] > 0 ? user : "Updated failed",
      message: "User updated successfully",
    });
  } catch (err) {
    console.log(err);
    return next(
      new HttpError(
        err.message || "Something went wrong",
        err.statusCode || 500
      )
    );
  }
});

module.exports = router;
