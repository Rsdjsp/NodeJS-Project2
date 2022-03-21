const TeamModel = require("../models/teams");
const UserModel = require("../models/user");
const sendEmail = require("../libs/email");

class Teams {
  async create(idLeader, data) {
    const newTeam = {
      ...data,
      creator: idLeader,
      members: { user: idLeader, role: "leader" },
    };
    const team = await TeamModel.create(newTeam);
    return team;
  }

  async listByUser(idUser) {
    const teams = await TeamModel.find({
      members: { $elemMatch: { user: idUser } },
    }).populate("members.user", "name email");
    return teams;
  }

  async get(idTeam) {
    const team = await TeamModel.find({ _id: idTeam }).populate("members.user", "name email")
    return team[0]
  }




  async addMember(idTeam, idNewMember) {
    const searchTeam = await TeamModel.findById(idTeam);
    const verify = searchTeam.members.find(
      (user) => user.user.toString() === idNewMember
    );
    if (!verify) {
      const result = await TeamModel.updateOne(
        { _id: idTeam },
        { $push: { members: { user: idNewMember } } }
      );
      return result;
    } else {
      return { error: "This user has already been registered " };
    }
  }

  async inviteuser(userEmail,userId) {
    if (await UserModel.getByEmail(userEmail)) {
      return { succes: false, message: "Usuario ya registrado" };
    } else {
      const invited = await UserModel.findById(userId)
      const host = invited.name
      await sendEmail(
        userData.email,
        "Unete al Equipo!",
        `<div><h1><em>${host}</em> te ha invitado a unirte a su equipo</h1><br/><a href="${email_redirect_url}/auth/login"><button >ir a la APP</button></a></div>`
      );
      return {succes:"user Invited"}
    }
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
    const verify = searchTeam.members.find(
      (user) => user.user.toString() === idMember
    );
    if (verify) {
      searchTeam.members.pull(verify);
      const eliminated = await searchTeam.save();
      return eliminated;
    } else {
      return { error: "this user dosen't exist" };
    }
  }
}

module.exports = Teams;
