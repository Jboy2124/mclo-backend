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
};
