const TeamModel = require("../models/teams");

class Teams {
  async create(idLeader, data) {
    const newTeam = { ...data, leader: idLeader, creator: idLeader };
    const team = await TeamModel.create(newTeam);
    return team;
  }

  async listByUser(idUser) {
    const teams = await TeamModel.find({members:{user:idUser}}).populate("members.user","")
      
    return teams;
  }

  async addMember(idTeam, idNewMember) {
    const result = await TeamModel.updateOne(
      { _id: idTeam },
      { $push: { members: { user: idNewMember } } }
    );
    return result;
  }

  async changeRole(idTeam, idMember, newRole) {
    const result = await TeamModel.updateOne(
      { _id: idTeam },
      { $set: { "members.$[el].role": newRole } },
      { arrayFilters: [{ "el.user": idMember }] }
    );
    return result;
  }
  async deleteMember(idTeam, idMember) {
    const result = await TeamModel.updateOne(
      { _id: idTeam },
      { $pull: { "members.$[el].role": newRole } },
      { arrayFilters: [{ "el.user": idMember }] }
    );
    return result;
  }
}

module.exports = Teams;
