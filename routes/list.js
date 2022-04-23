const express = require("express");
const { isRegular, isEditor } = require("../middleware/auth");

const List = require("../services/list");

function task(app) {
  const router = express.Router();
  app.use("/workList", router);
  const listService = new List();

  router.post("/", isEditor, async (req, res) => {
    const { title, team } = req.body;
    const workList = await listService.create(req.user.id, title, team);
    res.json(workList);
  });

  router.get("/", isRegular, async (req, res) => {
    const workList = await listService.getList();
    res.json(workList);
  });
  router.get("/:id", isRegular, async (req, res) => {
    const workList = await listService.getByTeam(req.params.id);
    res.json(workList);
  });

  router.post("/newTask", isRegular, async (req, res) => {
    const { task, idList } = req.body;
    const newTask = await listService.addTask(task, idList);
    res.json(newTask);
  });

  router.post("/deleteTask", isRegular, async (req, res) => {
    const { task, idList } = req.body;
    const deleteTask = await listService.delete(task, idList);
    res.json(deleteTask);
  });

  router.post("/deleteList", isEditor, async (req, res) => {
    const { idList } = req.body;
    const deleteList = await listService.deleteList(idList);
    res.json(deleteList);
  });
}

module.exports = task;
