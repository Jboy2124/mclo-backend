const { StatusCodes } = require("http-status-codes");
const {
  newDocuments,
  getDocumentsRepositories,
  getProcessingDocsRepositories,
  searchDocuments,
  getDocumentCountPerDocType,
  setDocumentAssigneeRepository,
  searchProcessingDocumentsRepositories,
} = require("../../modules/repositories/documents");
const { isNullOrEmptyOrUndefined } = require("../../utilities/functions");
const path = require("path");
const { updatePdfTitle } = require("../../utilities/utilities");

module.exports = {
  registerNewDocument: async (req, res) => {
    try {
      const { code, description, path } = req.body;
      const files = req.files || [];

      // Update titles for each file uploaded
      for (const file of files) {
        await updatePdfTitle(file.path, code);
      }

      const filePaths = files.map((file) => file.path);
      const payload = {
        ...req.body,
        path: filePaths.join(";"),
      };
      const response = await newDocuments(payload);
      if (response.status !== "SUCCESS") {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ status: "ERROR", result: [] });
      }

      return res
        .status(StatusCodes.OK)
        .json({ status: "SUCCESS", result: response.result });
    } catch (err) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ status: "ERROR", result: err });
    }
  },
  getDocumentList: async (req, res) => {
    try {
      const response = await getDocumentsRepositories();
      if (response.status === "SUCCESS") {
        const formatted = response?.result.map((row) => ({
          code_id: row.code_id,
          description: row.description,
          attachments: row.attachments,
          receiving: {
            forwardedBy: row.forwardedBy,
            natureOfComm: row.natureOfComm,
            receivedThru: row.receivedThru,
            receivedDate: row.receivedDate,
            receivedTime: row.receivedTime,
            status: row.status,
          },
          processing: {
            assignedTo: row.assignedTo,
            recommendations: row.recommendations,
            remarks: row.remarks,
            dateAssigned: row.dateAssigned,
            processStatus: row.processStatus,
          },
          releasing: {},
        }));

        return res.status(StatusCodes.OK).json({
          status: "SUCCESS",
          result: formatted,
          totalRecords: response.totalRecords,
        });
      }

      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ status: "ERROR", result: [] });
    } catch (err) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ status: "ERROR", result: response.result });
    }
  },
  viewPdf: async (req, res) => {
    try {
      const fileName = req.query.file;
      if (!fileName) {
        return res.status(400).json({ error: "Missing file query parameter" });
      }

      // Adjust the path depending on your folder structure
      const filePath = path.join(__dirname, "../../docs/uploads", fileName);

      res.setHeader("Content-Type", "application/pdf");
      res.sendFile(filePath, (err) => {
        if (err) {
          console.error(err);
          return res.status(404).json({ error: "File not found" });
        }
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal server error" });
    }
  },
  getProcessingDocumentList: async (req, res) => {
    try {
      const { page } = req.query;
      const response = await getProcessingDocsRepositories({ page });
      if (response.status !== "SUCCESS") {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ status: "ERROR", result: [] });
      }

      return res.status(StatusCodes.OK).json({
        status: "SUCCESS",
        result: response.result,
        totalRecords: response.totalRecords,
      });
    } catch (error) {
      res.status(500).json({ ERROR: "Internal server error" });
    }
  },
  findDocuments: async (req, res) => {
    try {
      const { page } = req.query;
      const { code, description, forwardedBy } = req.body;
      const response = await searchDocuments({
        code,
        description,
        forwardedBy,
        page,
      });
      if (response.status !== "SUCCESS") {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ status: "ERROR", result: [] });
      }
      const transformResponse = response?.result.map((row) => ({
        code_id: row.code_id,
        description: row.description,
        attachments: row.attachments,
        receiving: {
          forwardedBy: row.forwardedBy,
          natureOfComm: row.natureOfComm,
          receivedThru: row.receivedThru,
          receivedDate: row.receivedDate,
          receivedTime: row.receivedTime,
          status: row.status,
        },
        processing: {
          assignedTo: row.assignedTo,
          recommendations: row.recommendations,
          remarks: row.remarks,
          dateAssigned: row.dateAssigned,
          processStatus: row.processStatus,
        },
        releasing: {},
      }));

      return res.status(StatusCodes.OK).json({
        status: "SUCCESS",
        result: transformResponse,
        totalRecords: response.totalRecords,
      });
    } catch (error) {
      console.error(error);
      return res
        .status(500)
        .json({ status: "ERROR", message: "Internal server error" });
    }
  },
  getDocumentCountsPerType: async (req, res) => {
    try {
      const { docId } = req.query;
      const response = await getDocumentCountPerDocType({ docId });
      if (response.status !== "SUCCESS") {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ status: "ERROR", result: [] });
      }

      return res.status(StatusCodes.OK).json({
        status: "SUCCESS",
        result: { count: response.result },
      });
    } catch (error) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ status: "ERROR", message: "Internal server error" });
    }
  },
  setDocumentsAssignee: async (req, res) => {
    try {
      const { assignee, code, recommendation, remarks } = req.body;
      const result = await setDocumentAssigneeRepository({
        assignee,
        code,
        recommendation,
        remarks,
      });

      if (result.status !== "SUCCESS") {
        return res.status(StatusCodes.BAD_REQUEST).json({
          status: "ERROR",
          result: [],
        });
      }

      return res.status(StatusCodes.OK).json({ status: "SUCCESS", result: [] });
    } catch (error) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ status: "ERROR", message: "Internal server error" });
    }
  },
  findProcessingDocuments: async (req, res) => {
    try {
      const { page } = req.query;
      const { code, description } = req.body;

      const response = await searchProcessingDocumentsRepositories({
        code,
        description,
        page,
      });

      if (response.status !== "SUCCESS") {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ status: "ERROR", result: [] });
      }

      return res.status(StatusCodes.OK).json({
        status: "SUCCESS",
        result: response?.result,
        totalRecords: response?.totalRecords,
      });
    } catch (error) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ status: "ERROR", message: error });
    }
  },
};
