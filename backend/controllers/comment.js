const pool = require("../pool");

exports.createComment = (req, res, next) => {
 const comment = {
  postId: req.body.postId,
  comment: req.body.comment,
 };
 pool.query(
  `SELECT * FROM users WHERE userid = $1`,
  [req.auth.userId],
  (error, user) => {
   if (error) {
    return res.status(401).json("Unauthorized!");
   }
   pool.query(
    `INSERT INTO comments(postid, userid, name, comment, creation_date) 
            VALUES ($1, $2, $3, $4, NOW()::timestamp)`,
    [comment.postId, req.auth.userId, user.rows[0].name, comment.comment],
    (error) => {
     if (error) {
      throw error;
     }
     console.log("New comment has been registered");
     res.status(201).json("New comment has been registered");
    }
   );
  }
 );
};

exports.deleteComment = (req, res, next) => {
 pool.query(
  `SELECT * FROM comments WHERE commentid = $1`,
  [req.params.id],
  (error, comment) => {
   if (error) {
    return res.status(401).json({
     error: error,
    });
   }
   if (comment.rowCount == 0) {
    console.log("Comment does not exist!");
    return res.status(404).json("Comment does not exist!");
   } else if (comment.rowCount != 0) {
    if (comment.rows[0].userid == req.auth.userId) {
     pool.query(
      `DELETE FROM comments WHERE commentid = $1`,
      [req.params.id],
      (error) => {
       if (error) {
        throw error;
       }
       console.log("Comment has been deleted");
       res.status(201).json("Comment has been deleted");
      }
     );
    } else if (comment.rows[0].userid != req.auth.userId) {
     pool.query(
      `SELECT * FROM posts WHERE postid = $1`,
      [comment.rows[0].postid],
      (error, post) => {
       if (error) {
        return res.status(401).json({
         error: error,
        });
       }
       if (post.rows[0].userid == req.auth.userId) {
        pool.query(
         `DELETE FROM comments WHERE commentid = $1`,
         [req.params.id],
         (error) => {
          if (error) {
           throw error;
          }
          console.log("Comment has been deleted");
          res.status(201).json("Comment has been deleted");
         }
        );
       } else {
        return res.status(401).json("UserId incorrect");
       }
      }
     );
    }
   }
  }
 );
};

exports.modifyComment = (req, res, next) => {
 pool.query(
  `SELECT * FROM comments WHERE commentid = $1`,
  [req.params.id],
  (error, comment) => {
   if (error) {
    return res.status(401).json({
     error: error,
    });
   }
   if (comment.rowCount == 0) {
    console.log("Comment does not exist!");
    return res.status(404).json("Comment does not exist!");
   } else if (comment.rowCount != 0) {
    if (comment.rows[0].userid == req.auth.userId) {
     pool.query(
      `UPDATE comments SET comment = $1, modify_date = NOW()::timestamp WHERE commentid = $2`,
      [req.body.comment, req.params.id],
      (error) => {
       if (error) {
        throw error;
       }
       console.log("Comment has been updated");
       res.status(201).json("Comment has been updated");
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
