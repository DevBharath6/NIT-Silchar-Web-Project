const express = require("express");
const router = express.Router();
const paperController = require("../controllers/paperController");

router.get("/", paperController.getAllSections);

router.get("/:id", paperController.getSectionById);

router.post("/", paperController.createSection);

router.put("/:id", paperController.updateSection);

router.delete("/:id", paperController.deleteSection);

module.exports = router;
