const express = require("express");
const router = express.Router();
const User = require("../../model/user");
const Blog = require("../../model/blog");
const { v4: uuid } = require("uuid");
const { Op } = require("sequelize");
const HttpError = require("../utils/httpError");
const jwt = require("jsonwebtoken");
const { auth } = require("../../middlewares/auth");

router.get("/", async (req, res, next) => {
  let { search } = req.query;
  search = search || "";
  try {
    const blogs = await Blog.findAll({
      where: {
        description: { [Op.like]: `%${search}%` },
      },
    });
    res.json(blogs);
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
    const blog = await Blog.findOne({
      where: {
        id, //id:id
      },
    });

    if (!blog) {
      return next(new HttpError("Blog not found", 404));
    }
    res.json(blog);
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

router.use(auth);

router.post("/", async (req, res, next) => {
  const { title, description } = req.body;
  try {
    const blog = await Blog.create({
      id: uuid(), //v4()
      title,
      description,
      userId: req.userData.id,
    });
    res.json(blog);
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

router.put("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const blog = await Blog.findByPk(id);
    if (!blog) {
      return next(new HttpError("Blog not found", 404));
    }
    if (req.userData.id !== blog.userId) {
      return next(new HttpError("You are not authorized for this update", 401));
    }
    let { title, description } = req.body;
    title = title || undefined;
    description = description || undefined;

    const result = await Blog.update(
      {
        title,
        description,
      },
      { where: { id } }
    );
    console.log(result);
    res.json({
      message: result[0] > 0 ? "Blog updated successfully" : "Update failed",
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

router.delete("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const blog = await Blog.findByPk(id);
    if (!blog) {
      return next(new HttpError("Blog not found", 404));
    }
    if (req.userData.id !== blog.userId) {
      return next(new HttpError("You are not authorized for this delete", 401));
    }

    const result = await blog.destroy();
    //console.log(result);
    res.json({
      message: result ? "Blog deleted successfully" : "Deletion failed",
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

module.exports = router;
