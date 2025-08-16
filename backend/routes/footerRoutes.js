const express = require("express");
const multer = require("multer");
const {
  getFooter,
  createFooter,
  updateFooter,
  deleteFooter
} = require("../controllers/footerController");

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });


router.get("/", getFooter);
router.post("/", createFooter);
router.put("/", upload.single("logoImage"), updateFooter);
router.delete("/", deleteFooter);

module.exports = router;
