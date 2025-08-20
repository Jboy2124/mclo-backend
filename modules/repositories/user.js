const { getAllusers } = require("../services/users");

module.exports = {
  getAllUsersRepositories: async (status) => {
    try {
      const result = await getAllusers(status);
      if (!result) {
        return { status: "ERROR", result: [] };
      }

      return { status: "SUCCESS", result: result };
    } catch (err) {
      return { status: "ERROR", result: [] };
    }
  },
};
