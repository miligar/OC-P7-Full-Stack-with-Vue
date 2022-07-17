const pool = require("../pool");
const fs = require("fs");

exports.createPost = (req, res, next) => {
 if (req.file) {
  req.body.post = JSON.parse(req.body.post);
  const url = req.protocol + "://" + req.get("host");

  const post = {
   title: req.body.post.title,
   message: req.body.post.message,
   media: url + "/images/" + req.file.filename,
  };
  pool.query(
   `SELECT * FROM users WHERE userid = $1`,
   [req.auth.userId],
   (error, user) => {
    if (error) {
     return res.status(401).json({
      error: error,
     });
    }
    pool.query(
     `INSERT INTO posts(userid, name, title, message, media, readby, creation_date) 
            VALUES ($1, $2, $3, $4, $5, ARRAY[$6], NOW()::timestamp)`,
     [
      req.auth.userId,
      user.rows[0].name,
      req.body.post.title,
      post.message,
      post.media,
      req.auth.userId,
     ],
     (error) => {
      if (error) {
       throw error;
      }
      console.log("New post has been registered");
      res.status(201).json("New post has been registered");
     }
    );
   }
  );
 } else {
  const post = {
   title: req.body.title,
   message: req.body.message,
  };
  pool.query(
   `SELECT * FROM users WHERE userid = $1`,
   [req.auth.userId],
   (error, user) => {
    if (error) {
     return res.status(401).json({
      error: error,
     });
    }
    pool.query(
     `INSERT INTO posts(userid, name, title, message, readby, creation_date) 
            VALUES ($1, $2, $3, $4, ARRAY[$5], NOW()::timestamp)`,
     [
      req.auth.userId,
      user.rows[0].name,
      post.title,
      post.message,
      req.auth.userId,
     ],
     (error) => {
      if (error) {
       throw error;
      }
      console.log("New post has been registered");
      res.status(201).json("New post has been registered");
     }
    );
   }
  );
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
    return res.status(404).json("Post does not exist!");
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
       res.status(201).json("Post has been deleted");
      }
     );
    } else {
     console.log("Unauthorized!");
     return res.status(403).json("Unauthorized!");
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
    let postsData = posts.rows;
    for (i = 0; i < postsData.length; i++) {
     postsData[i].creation_date = postsData[i].creation_date
      .toString()
      .split(" G")[0];
     if (postsData[i].modify_date != null) {
      postsData[i].modify_date = postsData[i].modify_date
       .toString()
       .split(" G")[0];
     }
    }
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
       for (i = 0; i < postData.length; i++) {
        postData[i].creation_date = postData[i].creation_date
         .toString()
         .split(" G")[0];
        if (postData[i].modify_date != null) {
         postData[i].modify_date = postData[i].modify_date
          .toString()
          .split(" G")[0];
        }
       }
       for (i = 0; i < commentsData.length; i++) {
        commentsData[i].creation_date = commentsData[i].creation_date
         .toString()
         .split(" G")[0];
        if (commentsData[i].modify_date != null) {
         commentsData[i].modify_date = commentsData[i].modify_date
          .toString()
          .split(" G")[0];
        }
       }
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
    return res.status(404).json("Post does not exist!");
   } else if (post.rowCount != 0) {
    if (post.rows[0].userid == req.auth.userId) {
     if (req.file) {
      console.log("file required");
      const url = req.protocol + "://" + req.get("host");
      req.body.post = JSON.parse(req.body.post);

      if (post.rows[0].media != null) {
       const filename = post.rows[0].media.split("/images/")[1];
       fs.unlink("images/" + filename, () => {
        console.log("Old image " + filename + " deleted");
       });
      }
      const postNewData = {
       title: req.body.post.title,
       message: req.body.post.message,
       media: url + "/images/" + req.file.filename,
      };
      pool.query(
       `UPDATE posts SET title = $1, message = $2, media = $3, modify_date = NOW()::timestamp WHERE postid = $4`,
       [
        postNewData.title,
        postNewData.message,
        postNewData.media,
        req.params.id,
       ],
       (error) => {
        if (error) {
         throw error;
        }
        console.log("Post has been updated");
        res.status(201).json("Post has been updated");
       }
      );
     } else if (req.body.media == null) {
      const postNewData = {
       title: req.body.title,
       message: req.body.message,
       media: null,
      };
      if (post.rows[0].media != null) {
       const filename = post.rows[0].media.split("/images/")[1];
       fs.unlink("images/" + filename, () => {
        console.log("Old image " + filename + " deleted");
       });
      }

      pool.query(
       `UPDATE posts SET title = $1, message = $2, media = $3, modify_date = NOW()::timestamp WHERE postid = $4`,
       [
        postNewData.title,
        postNewData.message,
        postNewData.media,
        req.params.id,
       ],
       (error) => {
        if (error) {
         throw error;
        }
        console.log("Post has been updated");
        res.status(201).json("Post has been updated");
       }
      );
     } else {
      pool.query(
       `UPDATE posts SET title = $1, message = $2, modify_date = NOW()::timestamp WHERE postid = $3`,
       [req.body.title, req.body.message, req.params.id],
       (error) => {
        if (error) {
         throw error;
        }
        console.log("Post has been updated");
        res.status(201).json("Post has been updated");
       }
      );
     }
    } else {
     console.log("Unauthorized!");
     return res.status(403).json("Unauthorized!");
    }
   }
  }
 );
};
