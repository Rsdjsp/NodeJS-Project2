const TeamModel = require("../models/teams");
const UserModel = require("../models/user");
const sendEmail = require("../libs/email");
const ImagesModel = require("../models/images");

class Teams {
  async create(idLeader, data) {
    const newTeam = {
      ...data,
      creator: idLeader,
      members: { user: idLeader, role: "leader" },
    };
    const team = await TeamModel.create(newTeam);
    const addTeam = await UserModel.updateOne(
      { _id: idLeader },
      {
        $push: { teams: team._id },
      }
    );
    return team;
  }

  async listByUser(idUser) {
    const teams = await TeamModel.find({
      members: { $elemMatch: { user: idUser } },
    }).populate("members.user", "name email");
    return teams;
  }

  async get(idTeam) {
    const team = await TeamModel.find({ _id: idTeam }).populate(
      "members.user",
      "name email"
    );
    return team[0];
  }

  

  async addMember(idTeam, idNewMember, idSendInvit) {
    const searchTeam = await TeamModel.findById(idTeam);
    const newUser = await UserModel.findById(idNewMember);
    const verify = searchTeam.members.find(
      (user) => user.user.toString() === idNewMember
    );
    if (!verify) {
      const result = await TeamModel.updateOne(
        { _id: idTeam },
        {
          $push: { members: { user: idNewMember } },
        }
      );
      const addTeam = await UserModel.updateOne(
        { _id: idNewMember },
        {
          $push: { teams: idTeam },
        }
      );
      return this.inviteuser(newUser.email, idSendInvit);
    } else {
      return { error: "This user has already been registered " };
    }
  }

  async inviteuser(userEmail, userId) {
    const invited = await UserModel.findById(userId);
    const host = invited.name;
    await sendEmail(
      userEmail,
      "Unete al Equipo!",
      "WorkFlow APP",
      `<div><h1><em>${host}</em> te ha invitado a unirte a su equipo</h1><br/><a href="http://localhost:3000/login/"><button >Go to the APP</button></a></div>`
    );
    return { succes: "user Invited" };
  }

  async changeRole(idTeam, idMember, newRole, userId) {
    const searchTeam = await TeamModel.findById(idTeam);
    const verify = await searchTeam.members.find(
      (user) => user.user.toString() === userId && user.role === "leader"
    );
    if (!verify) {
      return { error: "You don't have permissions for this action" };
    } else {
      const result = await TeamModel.updateOne(
        { _id: idTeam },
        { $set: { "members.$[el].role": newRole } },
        { arrayFilters: [{ "el.user": idMember }] }
      );
      return result;
    }
  }

  async deleteMember(idTeam, idMember) {
    const searchTeam = await TeamModel.findById(idTeam);
    const searchUser = await UserModel.findById(idMember);
    const verfTeam = await searchUser.teams.find(
      (team) => team.toString() === idTeam
    );
    const verify = searchTeam.members.find(
      (user) => user.user.toString() === idMember
    );
    if (verify && verfTeam) {
      searchTeam.members.pull(verify);
      const eliminated = await searchTeam.save();
      searchUser.teams.pull(verfTeam);
      const deleted = await searchUser.save();
      return { eliminated, deleted };
    } else {
      return { error: "this user dosen't exist" };
    }
  }

  async getOne(teamId) {
    const team = await TeamModel.findById(teamId);
    return team;
  }

  async getImages() {
    const images = await ImagesModel.find({});
    return images;
  }

  async updateImage(url, idTeam) {
    const newImg = await TeamModel.updateOne(
      { _id: idTeam },
      { $set: { img: url } }
    );
    return newImg;
  }
}

module.exports = Teams;
