const express = require("express");
const { isRegular, isEditor } = require("../middleware/auth");

const Task = require("../services/task");

function task(app) {
  const router = express.Router();
  app.use("/task", router);
  const taskService = new Task();

  router.post("/", isRegular, async (req, res) => {
    const tasks = await taskService.create(req.user.id, req.body);
    return res.json(tasks);
  });

  router.get("/", async (req, res) => {
    const tasks = await taskService.getAll();
    return res.json(tasks);
  });

  router.get("/:id/user", isRegular, async (req, res) => {
    const { id } = req.params;
    const tasks = await taskService.list(id);
    return res.json(tasks);
  });

  router.post("/:id/add", isRegular, async (req, res) => {
    const { id } = req.params;
    const { users } = req.body;
    const tasks = await taskService.add(users, id);
    return res.json(tasks);
  });

  router.delete("/user/delete", isEditor, async (req, res) => {
    const { idUser, idTask } = req.body;
    const tasks = await taskService.delete(idUser, idTask);
    return res.json(tasks);
  });

  router.delete("/", isEditor, async (req, res) => {
    const { idTask } = req.body;
    const tasks = await taskService.deleteTask(idTask);
    return res.json(tasks);
  });

  router.put("/update", isEditor, async (req, res) => {
    const { state, idTask } = req.body;
    const tasks = await taskService.update(idTask, state, req.user.id);
    return res.json(tasks);
  });
}

module.exports = task;
