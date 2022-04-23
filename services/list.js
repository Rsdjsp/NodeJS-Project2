const ListModel = require("../models/list");
const TaskModel = require("../models/task");

class List {
  async create(userId, title, idTeam) {
    const newList = { title: title, creator: userId, team: idTeam };
    const response = await ListModel.create(newList);
    return response;
  }

  async getList() {
    const workList = await ListModel.find({}).populate(
      "tasks",
      "title description"
    );

    return workList;
  }
  async getByTeam(teamId) {
    const workList = await ListModel.find({ team: teamId }).populate(
      "tasks",
      "title description dateEnd dateStart idCreator"
    );

    return workList;
  }

  async addTask(task, listId) {
    const addTask = await ListModel.updateOne(
      { _id: listId },
      { $push: { tasks: { _id: task } } }
    );
    return addTask;
  }

  async delete(task, idList) {
    const removeTask = await ListModel.updateOne(
      { _id: idList },
      { $pull: { tasks: task } }
    );

    return this.deleteTask(task);
  }

  async deleteTask(idTask) {
    const result = await TaskModel.findByIdAndDelete(idTask);
    return result;
  }

  async deleteList(idList) {
    const removeList = await ListModel.findByIdAndDelete(idList);
    return removeList;
  }
}

module.exports = List;
