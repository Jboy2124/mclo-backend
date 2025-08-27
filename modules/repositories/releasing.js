const { getDocumentsForRelease } = require("../services/releasing");

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
};
