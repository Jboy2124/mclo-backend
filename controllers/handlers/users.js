const { StatusCodes } = require("http-status-codes");
const { getAllUsersRepositories } = require("../../modules/repositories/user");

module.exports = {
  getActiveUsers: async (req, res) => {
    try {
      const { status } = req.query;
      const response = await getAllUsersRepositories(status);
      if (response.status !== "SUCCESS") {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ status: "ERROR", result: [] });
      }

      return res.status(StatusCodes.OK).json(response);
    } catch (error) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ status: "ERROR", result: [] });
    }
  },
};
