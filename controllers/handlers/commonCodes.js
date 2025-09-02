const { StatusCodes } = require("http-status-codes");
const {
  getTitles,
  getDesignations,
  getNatureOfCommunications,
  getReceivedThru,
  getDocumentTypes,
  getCommonAccessLevel,
} = require("../../modules/repositories/codes");

module.exports = {
  getCommonTitles: async (req, res) => {
    try {
      const result = await getTitles();
      return res.status(StatusCodes.OK).json(result);
    } catch (err) {}
  },
  getCommonDesignation: async (req, res) => {
    try {
      const result = await getDesignations();
      return res.status(StatusCodes.OK).json(result);
    } catch (err) {}
  },
  getNatureOfCommunications: async (req, res) => {
    try {
      const result = await getNatureOfCommunications();
      return res.status(StatusCodes.OK).json(result);
    } catch (err) {}
  },
  getReceivedThru: async (req, res) => {
    try {
      const result = await getReceivedThru();
      return res.status(StatusCodes.OK).json(result);
    } catch (err) {}
  },
  getDocumentTypes: async (req, res) => {
    try {
      const response = await getDocumentTypes();
      if (response.status !== "SUCCESS") {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ status: "ERROR", result: [] });
      }

      return res
        .status(StatusCodes.OK)
        .json({ status: "SUCCESS", result: response.result });
    } catch (error) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ status: "ERROR", message: "Internal server error" });
    }
  },
  getAccessLevel: async (req, res) => {
    try {
      const response = await getCommonAccessLevel();
      if (response.status !== "SUCCESS") {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ status: "ERROR", result: [] });
      }

      return res
        .status(StatusCodes.OK)
        .json({ status: "SUCCESS", result: response.result });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        status: "ERROR",
        result: [],
        message: error.message,
      });
    }
  },
};
