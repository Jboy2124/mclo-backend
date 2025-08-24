const express = require("express");
const router = express.Router();

const { getActiveUsers } = require("../controllers/handlers/users");
const {
  accessTokenVerification,
} = require("../controllers/middlewares/verifyToken");

module.exports = router.get(
  "/api/users/v1/users",
  accessTokenVerification,
  getActiveUsers
);
