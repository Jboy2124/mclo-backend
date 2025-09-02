const knex = require("../../config/knexConfig");

module.exports = {
  getDocumentsForRelease: async ({ page, user }) => {
    const pageNumber = page || 1;
    const pageSize = 15;
    const pageOffset = (pageNumber - 1) * pageSize;

    const user_Id = `%${user}%`;

    try {
      const [{ count }] = await knex("tbl_processing_details as proc")
        .leftJoin("tbl_document_details as doc", "proc.doc_id", "doc.doc_id")
        .where((qb) => {
          qb.whereILike("proc.assigned_to", user_Id);
        })
        .andWhere("proc.process_status", "Approved")
        .count({ count: "*" });

      const result = await knex("tbl_processing_details as proc")
        .select({
          processId: "proc.process_id",
          docId: "doc.doc_id",
          codeId: "doc.code_id",
          description: "doc.document_description",
          dateAssigned: "proc.date_assigned",
          assignee: "proc.assigned_to",
          recommendations: "proc.recommendations",
          remarks: "proc.remarks",
          status: "proc.process_status",
          attachment: "doc.document_path",
        })
        .leftJoin("tbl_document_details as doc", "proc.doc_id", "doc.doc_id")
        .where((qb) => {
          qb.whereILike("proc.assigned_to", user_Id);
        })
        .andWhere("proc.process_status", "Approved")
        .orderBy("proc.process_id", "desc")
        .limit(pageSize)
        .offset(pageOffset);

      return { status: "SUCCESS", result, totalRecords: count ?? 0 };
    } catch (error) {
      console.error("Error fetching documents for release:", error);
      throw error;
    }
  },
  insertReleaseDocument: async (data) => {
    try {
      const { payload, path } = data;
      const payloadData = JSON.parse(payload);
      const result = await knex("tbl_releasing_details").insert({
        doc_id: payloadData.docId,
        release_date: payloadData.releasedDateTime,
        liaison: payloadData.liaison,
        actual_released_date: payloadData.releasedDateTime,
        received_by: payloadData.receivedBy,
        remarks: payloadData.remarks,
        file_path: path,
        status: "Released",
      });
      if (result) {
        return { status: "SUCCESS", result: result };
      }
    } catch (err) {
      return { status: "ERROR", message: err.message };
    }
  },
};
