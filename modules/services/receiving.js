const knex = require("../../config/knexConfig");

module.exports = {
  addNewReceivingData: async (payload) => {
    const { code, description } = payload;
    const [doc_id] = await knex("tbl_document_details").insert({
      code_id: code,
      document_description: description,
      document_path: "",
    });
  },
};
