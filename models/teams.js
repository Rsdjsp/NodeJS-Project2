const { mongoose } = require("../config/db");

const { Schema } = mongoose;

const teamSchema = new Schema({
  name: String,
  img: String,
  description: String,
  creator: String,
  members: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
      role: {
        type: String,
        enum: ["editor", "normal", "leader"],
        default: "normal",
      },
    },
  ],
});

const TeamModel = mongoose.model("teams", teamSchema);

module.exports = TeamModel;
