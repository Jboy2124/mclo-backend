const express = require("express");
const router = express.Router();

const {
  register,
  verifyEmail,
} = require("../controllers/handlers/registration");

module.exports = router
  .post("/api/account/v1/register", register)
  .post("/api/account/v1/verify-email", verifyEmail);
