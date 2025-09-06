const knex = require("../../config/knexConfig");

module.exports = {
  getDocumentsForRelease: async ({ page }) => {
    const pageNumber = page || 1;
    const pageSize = 15;
    const pageOffset = (pageNumber - 1) * pageSize;

    // const user_Id = `%${user}%`;

    try {
      const [{ count }] = await knex("tbl_releasing_details as rel")
        .leftJoin("tbl_document_details as doc", "rel.doc_id", "doc.doc_id")
        // .where((qb) => {
        //   qb.whereILike("proc.assigned_to", user_Id);
        // })
        // .andWhere("proc.process_status", "Approved")
        .count({ count: "*" });

      const result = await knex("tbl_releasing_details as rel")
        .select({
          releaseId: "rel.releasing_id",
          docId: "doc.doc_id",
          codeId: "doc.code_id",
          description: "doc.document_description",
          initialReleaseData: "rel.release_date",
          status: "rel.status",
        })
        .leftJoin("tbl_document_details as doc", "rel.doc_id", "doc.doc_id")
        // .where((qb) => {
        //   qb.whereILike("proc.assigned_to", user_Id);
        // })
        // .andWhere("proc.process_status", "Approved")
        .orderBy("rel.releasing_id", "desc")
        .limit(pageSize)
        .offset(pageOffset);

      return {
        status: "SUCCESS",
        result,
        message: "",
        totalRecords: count ?? 1,
      };
    } catch (error) {
      console.error("Error fetching documents for release:", error);

      return {
        status: "ERROR",
        result: [],
        message: error.message,
        totalRecords: 1,
      };
    }
  },
  insertReleaseDocument: async (data) => {
    try {
      // const { payload } = data;
      // const payloadData = JSON.parse(payload);
      const result = await knex("tbl_releasing_details").insert({
        doc_id: data,
        release_date: new Date(),
        status: "For releasing",
      });
      if (result) {
        return { status: "SUCCESS", result, message: "" };
      }
    } catch (err) {
      return { status: "ERROR", result: [], message: err.message };
    }
  },
};
