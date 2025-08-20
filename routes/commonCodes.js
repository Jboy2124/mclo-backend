const express = require("express");
const {
  getCommonTitles,
  getCommonDesignation,
  getNatureOfCommunications,
  getReceivedThru,
  getDocumentTypes,
} = require("../controllers/handlers/commonCodes");
const router = express.Router();

module.exports = router
  .get("/api/common-codes/v1/titles", getCommonTitles)
  .get("/api/common-codes/v1/designations", getCommonDesignation)
  .get(
    "/api/common-codes/v1/nature-of-communications",
    getNatureOfCommunications
  )
  .get("/api/common-codes/v1/received-through", getReceivedThru)
  .get("/api/common-codes/v1/document-type", getDocumentTypes);
