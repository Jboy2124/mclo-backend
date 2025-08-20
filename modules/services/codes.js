const knex = require("../../config/knexConfig");

module.exports = {
  commonTitles: async () => {
    const result = await knex("tbl_title").select({
      id: "title_id",
      value: "title_description",
    });

    return result;
  },
  commonDesignation: async () => {
    const result = await knex("tbl_designation").select({
      id: "designation_id",
      value: "designation",
    });

    return result;
  },
  commonNatureOfCommunication: async () => {
    const result = await knex("tbl_nature_of_communication")
      .select({
        id: "nature_comm_id",
        value: "nature_comm_description",
      })
      .orderBy("nature_comm_description", "asc");

    return result;
  },
  commonReceivedThru: async () => {
    const result = await knex("tbl_received_thru_details")
      .select({
        id: "received_thru_id",
        value: "received_thru_description",
      })
      .orderBy("received_thru_description", "asc");

    return result;
  },
  getTitle: async (id) => {
    const result = await knex("tbl_title")
      .select("title_description")
      .where("title_id", id)
      .first();

    return result;
  },
  commonDocumentType: async () => {
    const result = await knex("tbl_doc_type")
      .select({
        id: "id",
        value: "document_type",
        shortcut: "document_shortcut",
      })
      .orderBy("document_type", "asc");

    return result;
  },
};
