const { mongoose } = require("../config/db");
const { Schema } = mongoose;

const listSchema = new Schema({
  title: String,
  createDate: {
    type: Date,
    default: new Date(),
  },
  creator: String,
  tasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "task",
    },
  ],
});

const ListModel = mongoose.model("list", listSchema);

module.exports = ListModel;
