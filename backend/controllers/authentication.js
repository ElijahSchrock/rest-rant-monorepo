const router = require("express").Router();
const db = require("../models");
const bcrypt = require("bcrypt");

const { User } = db;

router.post("/", async (req, res) => {
  let user = await User.findOne({
    where: { email: req.body.email },
  });
  if (
    !user ||
    !(await bcrypt.compare(req.body.password, user.passwordDigest))
  ) {
    res.status(404).json({
      message: `Could not find a user with the provided email and password`,
    });
  } else {
    req.session.userId = user.userId;
    res.json({ user });
  }
});

router.get("/profile", async (req, res) => {
  res.json(req.currentUser);
});

router.get("/logout", function (req, res, next) {
  // destroy session data
  req.session = null;

  // redirect to homepage
  res.redirect("/");
});

router.post("/super-important-route", async (req, res) => {
  if (req.session.userId) {
    console.log("Do the really super important thing");
    res.send("Done");
  } else {
    console.log("You are not authorized to do the super important thing");
    res.send("Denied");
  }
});

router.delete("/:placeId/comments/:commentId", async (req, res) => {
  let placeId = Number(req.params.placeId);
  let commentId = Number(req.params.commentId);

  if (isNaN(placeId)) {
    res.status(404).json({ message: `Invalid id "${placeId}"` });
  } else if (isNaN(commentId)) {
    res.status(404).json({ message: `Invalid id "${commentId}"` });
  } else {
    const comment = await Comment.findOne({
      where: { commentId: commentId, placeId: placeId },
    });
    if (!comment) {
      res.status(404).json({
        message: `Could not find comment`,
      });
    } else if (comment.authorId !== req.currentUser?.userId) {
      res.status(403).json({
        message: `You do not have permission to delete comment "${comment.commentId}"`,
      });
    } else {
      await comment.destroy();
      res.json(comment);
    }
  }
});

module.exports = router;
