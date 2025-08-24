const express = require("express");
const {
  getCommonTitles,
  getCommonDesignation,
  getNatureOfCommunications,
  getReceivedThru,
  getDocumentTypes,
} = require("../controllers/handlers/commonCodes");
const {
  accessTokenVerification,
} = require("../controllers/middlewares/verifyToken");
const router = express.Router();

module.exports = router
  .get("/api/common-codes/v1/titles", accessTokenVerification, getCommonTitles)
  .get(
    "/api/common-codes/v1/designations",
    accessTokenVerification,
    getCommonDesignation
  )
  .get(
    "/api/common-codes/v1/nature-of-communications",
    accessTokenVerification,
    getNatureOfCommunications
  )
  .get(
    "/api/common-codes/v1/received-through",
    accessTokenVerification,
    getReceivedThru
  )
  .get(
    "/api/common-codes/v1/document-type",
    accessTokenVerification,
    getDocumentTypes
  );
