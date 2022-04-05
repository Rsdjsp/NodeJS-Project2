const { mongoose } = require("../config/db");

const { Schema } = mongoose;

const userSchema = new Schema({
  name: String,
  birthday: Date,
  email: String,
  password: String,
  role: Number,
  provider: String,
  idProvider: String,
  validateUser: Boolean,
  teams: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "teams",
    },
  ],
});

const UserModel = mongoose.model("users", userSchema);

module.exports = UserModel;
