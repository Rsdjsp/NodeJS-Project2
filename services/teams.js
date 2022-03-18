const TeamModel = require("../models/teams");

class Teams {
  async create(idLeader, data) {
    const newTeam = {
      ...data,
      members: [{ user: idLeader, role: "leader" }],
      creator: idLeader,
    };
    const team = await TeamModel.create(newTeam);
    return team;
  }

  async listByUser(idUser) {
    const teams = await TeamModel.find({
      members: { $elemMatch: { _id: idUser } },
    })
      .populate("members._id", "name email")
      .populate("idLeader", "name email");

    return teams;
  }

  async addMember(idTeam, idNewMember) {
    const result = await TeamModel.updateOne(
      { _id: idTeam },
      { $push: { members: { _id: idNewMember } } }
    );
    return result;
  }

  async changeRole(idTeam, idMember, newRole) {
    const result = await TeamModel.updateOne(
      { _id: idTeam },
      { $set: { "members.$[el].role": newRole } },
      { arrayFilters: [{ "el._id": idMember }] }
    );
    return result;
  }
  async deleteMember(idTeam, idMember) {
    const result = await TeamModel.updateOne(
      { _id: idTeam },
      { $pull: { "members.$[el].role": newRole } },
      { arrayFilters: [{ "el._id": idMember }] }
    );
    return result;
  }
}

module.exports = Teams;
