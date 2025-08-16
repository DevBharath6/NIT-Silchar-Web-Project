const express = require("express");
const router = express.Router();
const aboutCtrl = require("../controllers/aboutController");

router.get("/", aboutCtrl.getAllAboutSections);
router.post("/", aboutCtrl.createAboutSection);
router.patch("/:id", aboutCtrl.updateAboutSection);
router.delete("/:id", aboutCtrl.deleteAboutSection);

module.exports = router;
