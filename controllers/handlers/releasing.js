const { StatusCodes } = require("http-status-codes");
const {
  getDocumentsForReleaseRepo,
  addReleasedDocument,
} = require("../../modules/repositories/releasing");
const { updatePdfTitle } = require("../../utilities/utilities");

module.exports = {
  getForReleasingDocuments: async (request, response) => {
    try {
      const { page } = request.query;
      const res = await getDocumentsForReleaseRepo({ page });
      if (res.status !== "SUCCESS") {
        return response.status(StatusCodes.BAD_REQUEST).json({
          status: "ERROR",
          result: [],
          message: response.message,
        });
      }

      return response.status(StatusCodes.OK).json({
        status: "SUCCESS",
        result: res.result,
        totalRecords: res?.totalRecords,
        message: "",
      });
    } catch (err) {
      return response.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: "ERROR",
        message: err.message,
      });
    }
  },
  insertNewReleasedDocument: async (req, res) => {
    try {
      const data = JSON.parse(req.body.payload);
      const attachments = req.files || [];
      // Update titles for each file uploaded
      for (const file of attachments) {
        await updatePdfTitle(file.path, data.codeId);
      }
      const filePaths = attachments.map((file) => file.path);
      const payload = {
        ...req.body,
        path: filePaths.join(";"),
      };

      const response = await addReleasedDocument(payload);
      if (response.status !== "SUCCESS") {
        return res.status(StatusCodes.BAD_REQUEST).json({
          status: "ERROR",
          result: [],
          message: response.message,
        });
      }

      return res.status(StatusCodes.OK).json({
        status: "SUCCESS",
        result: response.result,
      });
    } catch (err) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: "ERROR",
        message: err.message,
      });
    }
  },
};
