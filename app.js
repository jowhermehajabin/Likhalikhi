const Routes = require("./routes.js");

const express = require("express");
const app = express();
const port = 5050;

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use("/", Routes);

app.listen(port, () => {
  console.log(`Server started at port:${port}`);
});
