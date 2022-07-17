var pgtools = require("pgtools");
const Pool = require("pg").Pool;
require("dotenv").config();

const config = {
 user: "postgres",
 host: "localhost",
 password: process.env.POST_PASS,
 port: 5432,
};

let pool = [];

pgtools.createdb(config, "groupomania", function (err, res) {
 if (err) {
  console.error("Database `groupomania` already exists");
 } else {
  console.log("Database `groupomania` created");
  async function createPool() {
   pool = new Pool({
    user: "postgres",
    password: process.env.POST_PASS,
    host: "localhost",
    port: 5432,
    database: "groupomania",
   });
  }
  createPool()
   .then(() =>
    pool.query(`SELECT * FROM users`, (error, users) => {
     if (error) {
      console.log("Creating tables...");
      return true;
     } else {
      pool.query(`DROP TABLE users;`), console.log("Creating tables...");
     }
    })
   )
   .then(() =>
    pool.query(
     `CREATE TABLE users(
          userID uuid DEFAULT gen_random_uuid(),
          name VARCHAR(100) NOT NULL,
          email VARCHAR(100) NOT NULL,
          password VARCHAR(100) NOT NULL,
          bio VARCHAR(255) NOT NULL,
          PRIMARY KEY(userID),
          UNIQUE (email)
          );`
    )
   )
   .then(() =>
    pool.query(
     `CREATE TABLE posts(
           postID uuid DEFAULT gen_random_uuid(),
           userID uuid NOT NULL,
           name VARCHAR(100) NOT NULL,
           media VARCHAR(100),
           title VARCHAR(100) NOT NULL,
           message VARCHAR(5000) NOT NULL,
           creation_date TIMESTAMP,
           modify_date TIMESTAMP,
           readBy TEXT [],
           PRIMARY KEY(postID),
           CONSTRAINT fk_user
             FOREIGN KEY(userID)
             REFERENCES users(userID)
             ON DELETE CASCADE
           );`
    )
   )
   .then(() =>
    pool.query(
     `CREATE TABLE comments(
           commentID uuid DEFAULT gen_random_uuid(),
           postID uuid NOT NULL,
           userID uuid NOT NULL,
           name VARCHAR(100) NOT NULL,
           comment VARCHAR(5000) NOT NULL,
           creation_date TIMESTAMP,
           modify_date TIMESTAMP,
           PRIMARY KEY(commentID),
           CONSTRAINT fk_user
             FOREIGN KEY(userID)
             REFERENCES users(userID)
             ON DELETE CASCADE,
           CONSTRAINT fk_post
             FOREIGN KEY(postID)
             REFERENCES posts(postID)
             ON DELETE CASCADE
           );`
    )
   )
   .catch((error) => {
    console.log("Error");
   });
 }
});
