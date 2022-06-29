const pool = require("../pool");
const fs = require("fs");

exports.createPost = (req, res, next) => {
  if (req.file) {
    req.body.post = JSON.parse(req.body.post);
    if (req.body.post.userId != req.auth.userId) {
      return res.status(401).json({
        error: new Error("UserId incorrect"),
      });
    } else if (req.body.post.userId === req.auth.userId) {
      const url = req.protocol + "://" + req.get("host");

      const post = {
        userId: req.body.post.userId,
        comment: req.body.post.comment,
        media: url + "/images/" + req.file.filename,
      };

      pool.query(
        `INSERT INTO posts(userid, comment, media, readby, creation_date) 
            VALUES ($1, $2, $3, ARRAY[$4], NOW()::timestamp)`,
        [post.userId, post.comment, post.media, post.userId],
        (error) => {
          if (error) {
            throw error;
          }
          console.log("New post has been registered");
          res.status(201).send("New post has been registered");
        }
      );
    }
  } else {
    if (req.auth.userId != req.body.userId) {
      return res.status(401).json({
        error: new Error("UserId incorrect"),
      });
    } else if (req.auth.userId === req.body.userId) {
      const post = {
        userId: req.body.userId,
        comment: req.body.comment,
      };
      pool.query(
        `INSERT INTO posts(userid, comment, readby, creation_date) 
            VALUES ($1, $2, ARRAY[$3], NOW()::timestamp)`,
        [post.userId, post.comment, post.userId],
        (error) => {
          if (error) {
            throw error;
          }
          console.log("New post has been registered");
          res.status(201).send("New post has been registered");
        }
      );
    }
  }
};

exports.deletePost = (req, res, next) => {
  pool.query(
    `SELECT * FROM posts WHERE postid = $1`,
    [req.params.id],
    (error, post) => {
      if (error) {
        return res.status(401).json({
          error: error,
        });
      }
      if (post.rowCount == 0) {
        console.log("Post does not exist!");
        return res.status(404).send("Post does not exist!");
      } else if (post.rowCount != 0) {
        if (post.rows[0].userid == req.auth.userId) {
          pool.query(
            `DELETE FROM posts WHERE postid = $1`,
            [req.params.id],
            (error) => {
              if (error) {
                throw error;
              }
              if (post.rows[0].media != null) {
                const filename = post.rows[0].media.split("/images/")[1];
                fs.unlink("images/" + filename, () => {});
              }
              console.log("Post has been deleted");
              res.status(201).send("Post has been deleted");
            }
          );
        } else {
          console.log("Unauthorized!");
          return res.status(403).send("Unauthorized!");
        }
      }
    }
  );
};

exports.getAllPosts = (req, res, next) => {
  pool.query(
    `SELECT * FROM posts ORDER BY creation_date DESC`,
    (error, posts) => {
      if (error) {
        return res.status(401).json({
          error: error,
        });
      } else {
        res.status(201).json(posts.rows);
      }
    }
  );
};

exports.getOnePost = (req, res, next) => {
  pool.query(
    `SELECT * FROM posts WHERE postid = $1`,
    [req.params.id],
    (error, post) => {
      if (error) {
        return res.status(401).json({
          error: error,
        });
      } else {
        pool.query(
          `SELECT * FROM comments WHERE postid = $1 ORDER BY creation_date DESC`,
          [req.params.id],
          (error, comments) => {
            if (error) {
              return res.status(401).json({
                error: error,
              });
            } else {
              const postData = post.rows;
              const commentsData = comments.rows;
              const onePost = { postData, commentsData };
              const findReadBy = post.rows[0].readby.includes(req.auth.userId);
              if (findReadBy == false) {
                pool.query(
                  `UPDATE posts SET readby = ARRAY_APPEND (readby, $1) WHERE postid = $2`,
                  [req.auth.userId, req.params.id],
                  (error, update) => {
                    if (error) {
                      return res.status(401).json({
                        error: error,
                      });
                    } else {
                      res.status(201).json(onePost);
                    }
                  }
                );
              } else {
                res.status(201).json(onePost);
              }
            }
          }
        );
      }
    }
  );
};

exports.modifyPost = (req, res, next) => {
  pool.query(
    `SELECT * FROM posts WHERE postid = $1`,
    [req.params.id],
    (error, post) => {
      if (error) {
        return res.status(401).json({
          error: error,
        });
      }
      if (post.rowCount == 0) {
        console.log("Post does not exist!");
        return res.status(404).send("Post does not exist!");
      } else if (post.rowCount != 0) {
        if (post.rows[0].userid == req.auth.userId) {
          if (req.file) {
            console.log("file required");
            const url = req.protocol + "://" + req.get("host");
            req.body.post = JSON.parse(req.body.post);
            if (post.rows[0].media != null) {
              console.log("file exists");
              const filename = post.rows[0].media.split("/images/")[1];
              fs.unlink("images/" + filename, () => {
                console.log("New image added");
                console.log("Old image " + filename + " deleted");
              });
            }
            const postNewData = {
              comment: req.body.post.comment,
              media: url + "/images/" + req.file.filename,
            };
            pool.query(
              `UPDATE posts SET comment = $1, media = $2, modify_date = NOW()::timestamp WHERE postid = $3`,
              [postNewData.comment, postNewData.media, req.params.id],
              (error) => {
                if (error) {
                  throw error;
                }
                console.log("Post has been updated");
                res.status(201).send("Post has been updated");
              }
            );
          } else if (req.body.media == null) {
            const postNewData = {
              comment: req.body.comment,
              media: null,
            };
            const filename = post.rows[0].media.split("/images/")[1];
            fs.unlink("images/" + filename, () => {
              console.log("New image added");
              console.log("Old image " + filename + " deleted");
            });

            pool.query(
              `UPDATE posts SET comment = $1, media = $2, modify_date = NOW()::timestamp WHERE postid = $3`,
              [postNewData.comment, postNewData.media, req.params.id],
              (error) => {
                if (error) {
                  throw error;
                }
                console.log("Post has been updated");
                res.status(201).send("Post has been updated");
              }
            );
          } else {
            pool.query(
              `UPDATE posts SET comment = $1, modify_date = NOW()::timestamp WHERE postid = $2`,
              [req.body.comment, req.params.id],
              (error) => {
                if (error) {
                  throw error;
                }
                console.log("Post has been updated");
                res.status(201).send("Post has been updated");
              }
            );
          }
        } else {
          console.log("Unauthorized!");
          return res.status(403).send("Unauthorized!");
        }
      }
    }
  );
};
