const { mongoose } = require("../config/db");
const { Schema } = mongoose;

const commentsSchema = new Schema({
  comment: String,
  date: {
    type: Date,
    default: new Date(),
  },
  creator: String,
  idList: String,
});

const CommentsModel = mongoose.model("comments", commentsSchema);

module.exports = CommentsModel;
