const CommentModel = require("../models/comments");

class comment {
  async create(data, list, idCreator) {
    const newComment = await { ...data, idList: list, creator: idCreator };
    const comment = await CommentModel.create(newComment);
    return comment;
  }

  async getAll() {
    const comments = await CommentModel.find({});
    return comments;
  }

  async delete(idComment, user) {
    const verifyUser = await CommentModel.findById(idComment);
    if (verifyUser._id === user) {
      const comments = await CommentModel.findByIdAndDelete(idComment);
      return comments;
    } else {
      return { message: "You only can remove you're comments" };
    }
  }
}

module.exports = comment;
