const express = require("express");
const path = require("path");
const cors = require("cors");

const userRoutes = require("./routes/user");
const postsRoutes = require("./routes/post");
const commentRoutes = require("./routes/comment");

const app = express();

app.use(cors());
app.use(express.json());

require("dotenv").config();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

app.use("/images", express.static(path.join(__dirname, "images")));

app.use("/api/auth", userRoutes);
app.use("/api/posts", postsRoutes);
app.use("/api/comments", commentRoutes);

module.exports = app;
