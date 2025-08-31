const { StatusCodes } = require("http-status-codes");
const {
  getDocumentsForReleaseRepo,
  addReleasedDocument,
} = require("../../modules/repositories/releasing");

module.exports = {
  getForReleasingDocuments: async (request, response) => {
    try {
      const { page, user } = request.query;
      const res = await getDocumentsForReleaseRepo({ page, user });
      if (res.status !== "SUCCESS") {
        return response.status(StatusCodes.BAD_REQUEST).json({
          status: "ERROR",
          result: [],
        });
      }

      return response.status(StatusCodes.OK).json({
        status: "SUCCESS",
        result: res.result,
        totalRecords: res?.totalRecords,
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
      const data = req.body;
      const response = await addReleasedDocument(data);
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
