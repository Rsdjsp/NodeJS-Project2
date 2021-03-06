const express = require("express");
const { isRegular } = require("../middleware/auth");
const { uploadFile } = require("../libs/storage");
const upload = require("../middleware/upload");


const Teams = require("../services/teams");

function teams(app) {
  const router = express.Router();
  app.use("/teams", router);

  const teamsService = new Teams();

  router.get("/", isRegular, async (req, res) => {
    const teams = await teamsService.listByUser(req.user.id);
    return res.json(teams);
  });

  router.get("/:id", isRegular, async (req, res) => {
    const { id } = req.params;
    const team = await teamsService.getOne(id);
    return res.json(team);
  });

  router.get("/:id", isRegular, async (req, res) => {
    const { id } = req.params;
    const teams = await teamsService.get(id);
    return res.json(teams);
  });

  router.post("/", isRegular, async (req, res) => {
    const team = await teamsService.create(req.user.id, req.body);
    return res.json(team);
  });

  router.post("/addMember", isRegular, async (req, res) => {
    const { idTeam, idNewMember } = req.body;
    const team = await teamsService.addMember(idTeam, idNewMember, req.user.id);
    return res.json(team);
  });

  router.post("/newMember", isRegular, async (req, res) => {
    const { email } = req.body;
    const member = await teamsService.inviteuser(email,req.user.id)
    return res.json(member)
  })

  router.post("/deleteMember", isRegular, async (req, res) => {
    const { idTeam, idMember } = req.body;
    const team = await teamsService.deleteMember(idTeam, idMember);
    return res.json(team);
  });

  router.post("/changeRole", isRegular, async (req, res) => {
    const { idTeam, idMember, role } = req.body;
    const team = await teamsService.changeRole(
      idTeam,
      idMember,
      role,
      req.user.id
    );
    return res.json(team);
  });

  router.post("/uploadTest", upload.single("image"), (req, res) => {
    const file = req.file;
    uploadFile(file.originalname, req.file.buffer);

    return res.json({ success: true });
  });

  router.post("/updateImg", isRegular, async (req, res) => {
    const { url, idTeam } = req.body;
    const update = await teamsService.updateImage(url, idTeam);
    return res.json(update);
  });

  router.post("/deleteTeam", isRegular, async (req, res) => {
   
 })

}

module.exports = teams;
