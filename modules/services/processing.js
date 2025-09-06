const knex = require("../../config/knexConfig");
const { insertStatusAndDate } = require("./tracker");

module.exports = {
  updateProcessByCode: async (data) => {
    try {
      const result = await knex.transaction(async (trx) => {
        // First update
        const updateResult = await trx("tbl_processing_details")
          .update({
            assigned_to: data.assignedTo,
            recommendations: data.recommendations,
            remarks: data.remarks,
            date_assigned: new Date(),
            process_status: "Assigned",
          })
          .where("doc_id", data.docId);

        // Then insert status + date (using trx!)
        await insertStatusAndDate(
          { docId: data.docId, status: "Assigned" },
          trx
        );

        return updateResult;
      });

      return { status: "SUCCESS", result, message: "" };
    } catch (error) {
      return { status: "ERROR", result: [], message: error.message };
    }
  },
  updateProcessByCodeAndStatus: async (data) => {
    try {
      const result = await knex.transaction(async (trx) => {
        // Step 1: Update process status
        const updateResult = await trx("tbl_processing_details")
          .update({
            process_status: data.status,
          })
          .where("process_id", data.processId);
        await insertStatusAndDate({
          docId: data.docId,
          status: data.status,
        });

        return updateResult;
      });

      return {
        status: "SUCCESS",
        result: result,
        message: "",
      };
    } catch (error) {
      return { status: "ERROR", result: [], message: error.message };
    }
  },
  getAssignedProcessedDocuments: async (assigneeId, pageNumber) => {
    try {
      const page = pageNumber || 1;
      const pageSize = 15;
      const pageOffset = (page - 1) * pageSize;

      const [{ count }] = await knex("tbl_processing_details as proc")
        .leftJoin("tbl_document_details as doc", "doc.doc_id", "proc.doc_id")
        .whereRaw("FIND_IN_SET(?, REPLACE(proc.assigned_to, ' ', ''))", [
          assigneeId,
        ])
        .count({ count: "*" });

      let result = await knex("tbl_processing_details as proc")
        .select({
          processId: "proc.process_id",
          docId: "proc.doc_id",
          codeId: "docs.code_id",
          docType: "docs.doc_type",
          description: "docs.document_description",
          path: "docs.document_path",
          additionalPath: "docs.additional_document_path",
          dateAssigned: "proc.date_assigned",
          recommendations: "proc.recommendations",
          remarks: "proc.remarks",
          status: "proc.process_status",
        })
        .leftJoin("tbl_document_details as docs", "proc.doc_id", "docs.doc_id")
        .whereRaw("FIND_IN_SET(?, REPLACE(proc.assigned_to, ' ', ''))", [
          assigneeId,
        ])
        .orderBy("proc.process_id", "desc")
        .limit(pageSize)
        .offset(pageOffset);

      result = result.map((row) => ({ ...row, assigneeId }));
      return {
        status: "SUCCESS",
        result,
        message: "",
        totalRecords: count,
      };
    } catch (error) {
      return { status: "ERROR", result: [], message: error.message };
    }
  },
};
