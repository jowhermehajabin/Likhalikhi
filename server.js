const sequelize = require("./database/dbConfig");
const express = require("express");
const userRoutes = require("./routes/userRoutes");
const blogRoutes = require("./routes/blogRoutes");
const cors = require("cors");
const HttpError = require("./utils/httpError");

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use("/users", userRoutes);
app.use("/blogs", blogRoutes);

app.use((req, res, next) => {
  return next(new HttpError("Could not find this route", 404));
});

app.use((err, req, res, next) => {
  res
    .status(err.code || 500)
    .json({ message: err.message || "Something went wrong" });
});

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log("Database synced");
    await sequelize.sync();
  } catch (err) {
    console.log(err);
  }
};
startServer();

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
