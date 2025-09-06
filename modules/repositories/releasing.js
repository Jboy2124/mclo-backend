const {
  getDocumentsForRelease,
  insertReleaseDocument,
} = require("../services/releasing");

module.exports = {
  getDocumentsForReleaseRepo: async ({ page }) => {
    try {
      const res = await getDocumentsForRelease({ page });
      if (res.status !== "SUCCESS") {
        return {
          status: "ERROR",
          result: [],
          message: res.message,
        };
      }

      return {
        status: "SUCCESS",
        result: res.result,
        totalRecords: res.totalRecords,
        message: res.message,
      };
    } catch (error) {
      return { status: "ERROR", message: error.message };
    }
  },
  addReleasedDocument: async (data) => {
    try {
      const response = await insertReleaseDocument(data);
      if (response.status !== "SUCCESS") {
        return { status: "ERROR", message: response.message };
      }

      return {
        status: "SUCCESS",
        result: response.result,
        message: "",
      };
    } catch (error) {
      return {
        status: "ERROR",
        message: error.message,
      };
    }
  },
};
