const express = require("express");
const router = express.Router();
const {
  getImportantDates,
  createImportantDate,
  updateImportantDate,
  deleteImportantDate,
} = require("../controllers/importantDatesController");

router.get("/", getImportantDates);
router.post("/", createImportantDate);
router.put("/:id", updateImportantDate);
router.delete("/:id", deleteImportantDate);

module.exports = router;
