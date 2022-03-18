const ListModel = require("../models/list");

class List {
    async create(userId, data) {
    const newList = { ...data, creator: userId };
    const response = await ListModel.create(newList);
    return response;
  }

  async getList() {
    const workList = await ListModel.find({}).populate(
      "tasks",
      "title description state idCreator usermodify"
    ).populate("comments","comment creator");
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

    return removeTask;
  }

  async deleteList(idList) {
    const removeList = await ListModel.findByIdAndDelete(idList);
    return removeList;
  }
}

module.exports = List;
