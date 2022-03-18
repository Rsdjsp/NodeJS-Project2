const TaskModel = require("../models/task");

class Task {
  async getAll() {
    const listTasks = TaskModel.find({}).populate("users", "name email");
    return listTasks;
  }

  async create(userId, data) {
    const newTask = { ...data, idCreator: userId };
    const task = await TaskModel.create(newTask);
    return task;
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

  async deleteTask(idTask) {
    const result = await TaskModel.findByIdAndDelete(idTask);
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
