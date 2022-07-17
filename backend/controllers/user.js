const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../pool");
const emailValidator = require("email-validator");
const passwordValidator = require("password-validator");

exports.signup = (req, res, next) => {
 let validData = false;
 if (emailValidator.validate(req.body.email)) {
  console.log("Valid Email");

  const schema = new passwordValidator();
  schema
   .is()
   .min(8) // Minimum length 8
   .is()
   .max(20) // Maximum length 20
   .has()
   .uppercase() // Must have uppercase letters
   .has()
   .lowercase() // Must have lowercase letters
   .has()
   .digits(2) // Must have at least 2 digits
   .has()
   .not()
   .spaces() // Should not have spaces
   .is()
   .not()
   .oneOf(["Passw0rd", "Password123", "passw0rd", "password123"]); // Blacklist these values

  if (schema.validate(req.body.password)) {
   validData = true;
   console.log("Valid Password");
  } else {
   console.log(schema.validate(req.body.password, { details: true }));
   let validationArray = schema.validate(req.body.password, {
    details: true,
   });
   let messages = ["Invalid password: ", []];
   for (let i = 0; i < validationArray.length; i++) {
    messages[1].push(validationArray[i].message);
   }
   res.status(400).json(messages);
  }
 } else {
  console.log("Invalid Email");
  res.status(400).json("Invalid Email");
 }

 if (validData) {
  bcrypt.hash(req.body.password, 10).then((hash) => {
   const user = {
    name: req.body.name,
    email: req.body.email,
    password: hash,
    bio: req.body.bio,
   };
   pool.query(
    `SELECT * FROM users WHERE email = $1`,
    [req.body.email],
    (error, userFound) => {
     if (error) {
      return res.status(401).json({
       error: error,
      });
     }
     if (userFound.rowCount != 0) {
      console.log("Email already registered!");
      return res.status(401).json("Email already registered!");
     } else {
      pool.query(
       `INSERT INTO users(name, email, password, bio) 
            VALUES ($1, $2, $3, $4) RETURNING *`,
       [user.name, user.email, user.password, user.bio],
       (error, newUser) => {
        if (error) {
         throw error;
        }
        console.log(newUser.rows[0].name + " has been registered");
        res
         .status(201)
         .json("New user '" + newUser.rows[0].name + "' registered");
       }
      );
     }
    }
   );
  });
 }
};

require("dotenv").config();

exports.login = (req, res, next) => {
 pool.query(
  `SELECT * FROM users WHERE email = $1`,
  [req.body.email],
  (error, user) => {
   if (error) {
    return res.status(401).json({
     error: error,
    });
   }
   if (user.rowCount == 0) {
    console.log("Not a valid email!");
    return res.status(401).json("Not a valid email!");
   }
   if (user.rowCount != 0) {
    bcrypt.compare(req.body.password, user.rows[0].password).then((valid) => {
     if (!valid) {
      console.log("Incorrect password!");
      return res.status(401).json("Incorrect password!");
     }
     const token = jwt.sign(
      { userId: user.rows[0].userid },
      process.env.TOKEN_SECRET,
      {
       expiresIn: "24h",
      }
     );
     res.status(200).json({
      userId: user.rows[0].userid,
      name: user.rows[0].name,
      token: token,
     });
    });
   }
  }
 );
};

exports.deleteUser = (req, res, next) => {
 pool.query(
  `SELECT * FROM users WHERE userid = $1`,
  [req.params.id],
  (error, user) => {
   if (error) {
    return res.status(401).json({
     error: error,
    });
   }
   if (user.rowCount == 0) {
    console.log("User does not exist!");
    return res.status(404).json("User does not exist!");
   } else if (user.rowCount != 0) {
    if (user.rows[0].userid == req.auth.userId) {
     pool.query(
      `DELETE FROM users WHERE userid = $1`,
      [req.params.id],
      (error) => {
       if (error) {
        throw error;
       } else {
        pool.query(`SELECT * FROM posts`, (error, posts) => {
         if (error) {
          return res.status(401).json({
           error: error,
          });
         } else if (posts.rows.length != 0) {
          for (let i = 0; i < posts.rows.length; i++) {
           let findReadBy = posts.rows[i].readby.includes(req.auth.userId);
           if (findReadBy == true) {
            pool.query(
             `UPDATE posts SET readby = ARRAY_REMOVE (readby, $1) WHERE postid = $2`,
             [req.auth.userId, posts.rows[i].postid],
             (error, update) => {
              if (error) {
               return res.status(401).json({
                error: error,
               });
              }
             }
            );
           }
          }
          console.log("User has been deleted");
          res.status(201).json("User has been deleted");
         } else {
          console.log("User has been deleted");
          res.status(201).json("User has been deleted");
         }
        });
       }
      }
     );
    } else if (req.auth.userId != req.body.userId) {
     return res.status(401).json("Not authorized!");
    }
   }
  }
 );
};

exports.modifyUser = (req, res, next) => {
 pool.query(
  `SELECT * FROM users WHERE userid = $1`,
  [req.params.id],
  (error, user) => {
   if (error) {
    return res.status(401).json({
     error: error,
    });
   }
   if (user.rowCount == 0) {
    console.log("User does not exist!");
    return res.status(404).json("User does not exist!");
   } else if (user.rowCount != 0) {
    if (user.rows[0].userid == req.auth.userId) {
     if (emailValidator.validate(req.body.email)) {
      const modUser = {
       name: req.body.name,
       email: req.body.email,
       bio: req.body.bio,
      };
      pool.query(
       `UPDATE users SET name = $1, email = $2, bio = $3 WHERE userid = $4`,
       [modUser.name, modUser.email, modUser.bio, req.params.id],
       (error) => {
        if (error) {
         throw error;
        }
        pool.query(
         `UPDATE posts SET name = $1 WHERE userid = $2`,
         [modUser.name, req.params.id],
         (error) => {
          if (error) {
           throw error;
          }
         }
        );
        pool.query(
         `UPDATE comments SET name = $1 WHERE userid = $2`,
         [modUser.name, req.params.id],
         (error) => {
          if (error) {
           throw error;
          }
         }
        );
        console.log("Profile has been updated");
        res.status(201).json("Profile has been updated");
       }
      );
     } else {
      console.log("Invalid Email");
      res.status(400).json("Invalid Email");
     }
    } else if (req.auth.userId != req.body.userId) {
     return res.status(401).json("Not authorized!");
    }
   }
  }
 );
};

//to view someone profile
exports.getOneUser = (req, res, next) => {
 pool.query(
  `SELECT * FROM users WHERE userid = $1`,
  [req.params.id],
  (error, user) => {
   if (error) {
    return res.status(401).json({
     error: error,
    });
   } else {
    let oneUser = {
     name: user.rows[0].name,
     email: user.rows[0].email,
     bio: user.rows[0].bio,
    };
    res.status(201).json(oneUser);
   }
  }
 );
};
