const express = require("express");
const {
  registerNewDocument,
  getDocumentList,
  getPDFDocuments,
  viewPdf,
  getProcessingDocumentList,
  findDocuments,
  getDocumentCountsPerType,
  setDocumentsAssignee,
  findProcessingDocuments,
  findDocumentsByCodeId,
} = require("../controllers/handlers/documents");
const router = express.Router();
const upload = require("../controllers/middlewares/fileUpload");
const {
  accessTokenVerification,
} = require("../controllers/middlewares/verifyToken");

module.exports = router
  .post(
    "/api/documents/v1/new-documents",
    upload.array("attachments", 10),
    registerNewDocument
  )
  .get(
    "/api/documents/v1/document-list",
    accessTokenVerification,
    getDocumentList
  )
  .get("/api/documents/v1/view-pdf", accessTokenVerification, viewPdf)
  .get(
    "/api/documents/v1/processing-documents",
    accessTokenVerification,
    getProcessingDocumentList
  )
  .post(
    "/api/documents/v1/documents-results",
    accessTokenVerification,
    findDocuments
  )
  .post(
    "/api/documents/v1/documents-count",
    accessTokenVerification,
    getDocumentCountsPerType
  )
  .post(
    "/api/documents/v1/new-processed-documents",
    accessTokenVerification,
    setDocumentsAssignee
  )
  .post(
    "/api/documents/v1/search-processing-documents",
    accessTokenVerification,
    findProcessingDocuments
  )
  .get("/api/documents/v1/code-query", findDocumentsByCodeId);
