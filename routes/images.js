const express = require("express");
const { isRegular } = require("../middleware/auth");
const Images = require("../services/images");

function images(app) {
  const router = express.Router();
  app.use("/images", router);
  const imageService = new Images();

  router.post("/", isRegular, async (req, res) => {
    const response = await imageService.create(req.body);
    return res.json(response);
  });

  router.get("/", isRegular, async (req, res) => {
    const response = await imageService.getAll();
    return res.json(response);
  });
}

module.exports = images;
