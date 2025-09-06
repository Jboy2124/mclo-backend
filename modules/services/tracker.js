const knex = require("../../config/knexConfig");

module.exports = {
  insertStatusAndDate: async (data) => {
    try {
      const { docId, status } = data;
      const result = await knex("tbl_process_status_history").insert({
        doc_id: docId,
        status: status,
        date_updated: new Date(),
      });
      return { status: "SUCCESS", result, message: "" };
    } catch (error) {
      return {
        status: "ERROR",
        result: [],
        message: error.message,
      };
    }
  },
  getTimelineInformation: async (docId) => {
    try {
      const result = await knex("tbl_process_status_history")
        .select({
          historyId: "history_id",
          docId: "doc_id",
          status: "status",
          dateUpdated: "date_updated",
        })
        .where("doc_id", docId)
        .orderBy("history_id", "asc");

      return {
        status: "SUCCESS",
        result: result,
        message: "",
      };
    } catch (error) {
      return {
        status: "ERROR",
        result: [],
        message: error.message,
      };
    }
  },
};
