const express = require("express");
const {
  refreshAccessToken,
  clearAuth,
} = require("../controllers/handlers/auth");
const router = express.Router();

module.exports = router
  .post("/api/auth/v1/refresh-token", refreshAccessToken)
  .post("/api/auth/v1/logout", clearAuth);
