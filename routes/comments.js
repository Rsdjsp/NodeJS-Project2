const express = require("express");
const { isRegular, isEditor } = require("../middleware/auth");

const Comment = require("../services/comments");

function comments(app) {
  const router = express.Router();
  app.use("/comments", router);
  const commentsService = new Comment();

  router.post("/", isRegular, async (req, res) => {
    const { comment, idList } = req.body;
    const comments = await commentsService.create(comment, idList, req.user.id);
    return res.json(comments);
  });

  router.get("/", isRegular, async (req, res) => {
    const newComments = await commentsService.getAll();
    return res.json(newComments);
  });

  router.delete("/", isRegular, async (req, res) => {
    const { idComment } = req.body;
    const deleteComment = await commentsService.delete(idComment,req.user.id);
    return res.json(deleteComment);
  });
}

module.exports = comments;
