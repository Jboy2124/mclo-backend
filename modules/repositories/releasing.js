const {
  getDocumentsForRelease,
  insertReleaseDocument,
} = require("../services/releasing");

module.exports = {
  getDocumentsForReleaseRepo: async ({ page, user }) => {
    try {
      const res = await getDocumentsForRelease({ page, user });
      if (res.status !== "SUCCESS") {
        return {
          status: "ERROR",
          result: [],
        };
      }

      return {
        status: "SUCCESS",
        result: res.result,
        totalRecords: res?.totalRecords,
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
      };
    } catch (error) {
      return {
        status: "ERROR",
        message: error.message,
      };
    }
  },
};
