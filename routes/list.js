const express = require("express");
const { isRegular, isEditor } = require("../middleware/auth");

const List = require("../services/list");

function task(app) {
  const router = express.Router();
  app.use("/workList", router);
  const listService = new List();

  router.post("/", isEditor, async (req, res) => {
    const workList = await listService.create(req.user.id, req.body);
    res.json(workList);
  });

  router.get("/", isRegular, async (req, res) => {
    const workList = await listService.getList();
    res.json(workList);
  });

  router.post("/newTask", isRegular, async (req, res) => {
    const { task, idList } = req.body;
    const newTask = await listService.addTask(task, idList);
    res.json(newTask);
  });

  router.delete("/deleteTask", isRegular, async (req, res) => {
    const { task, idList } = req.body;
    const deleteTask = await listService.delete(task, idList);
    res.json(deleteTask);
  });

  router.delete("/", isEditor, async (req, res) => {
    const { idList } = req.body;
    const deleteList = await listService.deleteList(idList);
    res.json(deleteList);
  });
}

module.exports = task;
