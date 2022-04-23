const TaskModel = require("../models/task");
const List = require("./list");


class Task {
  constructor() {
    this.list = new List();
  }

  async getAll() {
    const listTasks = TaskModel.find({}).populate("users", "name email");
    return listTasks;
  }

  async create(userId, data) {
    const newTask = { ...data, idCreator: userId };
    const task = await TaskModel.create(newTask);
    const add = await this.list.addTask(task._id, data.idList);
    return { add, task };
  }

  async add(member, taskID) {
    const members = await TaskModel.updateOne(
      { _id: taskID },
      { $push: { users: { _id: member } } }
    );
    return members;
  }

  async delete(idUser, idTask) {
    const result = await TaskModel.updateOne(
      { _id: idTask },
      { $pull: { users: idUser } }
    );
    return result;
  }

  async list(idUser) {
    const listTasks = await TaskModel.find({ users: idUser }).populate(
      "users",
      "name email"
    );
    return listTasks;
  }

  async update(taskId, status, userId) {
    const taskUpdate = await TaskModel.findByIdAndUpdate(
      taskId,
      {
        state: status,
        usermodify: userId,
      },
      { new: true }
    ).populate("users", "name email");
    return taskUpdate;
  }
}

module.exports = Task;
