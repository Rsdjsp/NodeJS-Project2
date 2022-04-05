const ImagesModel = require("../models/images");
class Images {
  async getAll() {
    const images = await ImagesModel.find({});
    return images;
  }
  async create(images) {
    const createImages = await ImagesModel.create(images);
    return createImages;
  }
}

module.exports = Images;
