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
const {
  getForReleasingDocuments,
} = require("../controllers/handlers/releasing");

router.post(
  "/api/documents/v1/new-documents",
  upload.array("attachments", 10),
  accessTokenVerification,
  registerNewDocument
);
router.get(
  "/api/documents/v1/code-query",
  accessTokenVerification,
  findDocumentsByCodeId
);
router.get(
  "/api/documents/v1/document-list",
  accessTokenVerification,
  getDocumentList
);
router.get("/api/documents/v1/view-pdf", accessTokenVerification, viewPdf);
router.get(
  "/api/documents/v1/processing-documents",
  accessTokenVerification,
  getProcessingDocumentList
);
router.post(
  "/api/documents/v1/documents-results",
  accessTokenVerification,
  findDocuments
);
router.post(
  "/api/documents/v1/documents-count",
  accessTokenVerification,
  getDocumentCountsPerType
);
router.post(
  "/api/documents/v1/new-processed-documents",
  accessTokenVerification,
  setDocumentsAssignee
);
router.post(
  "/api/documents/v1/search-processing-documents",
  accessTokenVerification,
  findProcessingDocuments
);
router.get(
  "/api/documents/v1/for-releasing-documents",
  accessTokenVerification,
  getForReleasingDocuments
);

module.exports = router;
