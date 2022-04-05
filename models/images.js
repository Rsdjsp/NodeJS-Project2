const { mongoose } = require("../config/db");
const { Schema } = mongoose;

const imagesSchema = new Schema({
  url: String,
});

const ImagesModel = mongoose.model("images", imagesSchema);

module.exports = ImagesModel;
