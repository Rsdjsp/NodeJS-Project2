const { mongoose } = require("../config/db");
const { Schema } = mongoose;

const taskSchema = new Schema({
  title: String,
  description: String,
  idCreator: String,
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
  ],
  dateStart: {
    type: Date,
    default: new Date(),
  },
  dateEnd: {
    type: Date,
    default: new Date().setDate(new Date().getDate() + 1),
  },
  usermodify: String,
  state: {
    type: String,
    enum: ["toDo", "Doing", "Done"],
    default: "toDo",
  },
});
const TaskModel = mongoose.model("task", taskSchema);

module.exports = TaskModel;
