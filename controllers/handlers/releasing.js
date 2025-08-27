const { StatusCodes } = require("http-status-codes");
const {
  getDocumentsForReleaseRepo,
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
};
