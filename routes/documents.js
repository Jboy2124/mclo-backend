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
} = require("../controllers/handlers/documents");
const router = express.Router();
const upload = require("../controllers/middlewares/fileUpload");

module.exports = router
  .post(
    "/api/documents/v1/new-documents",
    upload.array("attachments", 10),
    registerNewDocument
  )
  .get("/api/documents/v1/document-list", getDocumentList)
  .get("/api/documents/v1/view-pdf", viewPdf)
  .get("/api/documents/v1/processing-documents", getProcessingDocumentList)
  .post("/api/documents/v1/documents-results", findDocuments)
  .post("/api/documents/v1/documents-count", getDocumentCountsPerType)
  .post("/api/documents/v1/new-processed-documents", setDocumentsAssignee)
  .post(
    "/api/documents/v1/search-processing-documents",
    findProcessingDocuments
  );
