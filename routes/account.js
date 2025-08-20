const express = require("express");
const { loginAccount } = require("../controllers/handlers/login");
const router = express.Router();

module.exports = router.post("/api/account/v1/login", loginAccount);
