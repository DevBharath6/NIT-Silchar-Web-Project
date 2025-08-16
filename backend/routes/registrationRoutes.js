const express = require("express");
const { getRegistrationData, updateRegistrationData } = require("../controllers/registrationController.js");

const router = express.Router();

router.get("/", getRegistrationData);

router.put("/",updateRegistrationData);

module.exports = router;
