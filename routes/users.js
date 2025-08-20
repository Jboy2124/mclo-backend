const express = require("express");
const router = express.Router();

const { getActiveUsers } = require("../controllers/handlers/users");

module.exports = router.get("/api/users/v1/users", getActiveUsers);
