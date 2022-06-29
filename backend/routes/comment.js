const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");

const commentCtrl = require("../controllers/comment");

router.post("/", auth, commentCtrl.createComment);
router.delete("/:id", auth, commentCtrl.deleteComment);
router.put("/:id", auth, commentCtrl.modifyComment);

module.exports = router;
