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
  getAssignedDocumentList,
  updateProcessDocumentStatus,
} = require("../controllers/handlers/documents");
const router = express.Router();
const upload = require("../controllers/middlewares/fileUpload");
const {
  accessTokenVerification,
} = require("../controllers/middlewares/verifyToken");
const {
  getForReleasingDocuments,
  insertNewReleasedDocument,
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
router.get("/api/documents/v1/document-list", getDocumentList);
router.get("/api/documents/v1/view-pdf", viewPdf);
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

router.post(
  "/api/documents/v1/add-new-released-document",
  upload.array("attachments", 10),
  accessTokenVerification,
  insertNewReleasedDocument
);

router.get(
  "/api/documents/v1/assigned-documents",
  accessTokenVerification,
  getAssignedDocumentList
);
router.post(
  "/api/documents/v1/update-process-status",
  accessTokenVerification,
  updateProcessDocumentStatus
);

module.exports = router;
