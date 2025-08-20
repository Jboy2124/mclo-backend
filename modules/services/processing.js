const knex = require("../../config/knexConfig");

module.exports = {
  updateProcessByCode: async (data) => {
    const result = await knex("tbl_processing_details")
      .update({
        assigned_to: data.assignedTo,
        recommendations: data.recommendations,
        remarks: data.remarks,
        process_status: "Assigned",
      })
      .where("doc_id", data.docId);

    return result;
  },
};
