const knex = require("../../config/knexConfig");

module.exports = {
  getDocumentById: async ({ code }) => {
    const result = await knex("tbl_document_details")
      .select({ doc_id: "doc_id" })
      .where("code_id", code);

    return result || [];
  },
  addNewDocuments: async ({ code, docType, description, path }) => {
    const [doc_id] = await knex("tbl_document_details").insert({
      code_id: code,
      doc_type: docType,
      document_description: description,
      document_path: path,
    });
    return doc_id;
  },
  addNewReceivingAndInitialProcessing: async (payload) => {
    try {
      await knex.transaction(async (trx) => {
        await trx("tbl_receiving_details")
          .insert({
            doc_id: payload.doc_id,
            forwarded_by: payload.forwardedBy,
            nature_of_communication: payload.natureOfComm,
            received_through: payload.receivedThru,
            received_date: payload.date,
            received_time: payload.time,
            received_by: "113",
          })
          .transacting(trx);

        await knex.transaction(async (trx) => {
          await trx("tbl_processing_details")
            .insert({
              doc_id: payload.doc_id,
            })
            .transacting(trx);
        });
      });

      return { status: "SUCCESS", result: [] };
    } catch (error) {
      console.error("Error inserting receiving details:", error);
      return { status: "ERROR", message: error.message };
    }
  },
  getDocumentsServices: async (pageNumber) => {
    const page = pageNumber || 1;
    const pageSize = 15;
    const pageOffset = (page - 1) * pageSize;

    const [{ count }] = await knex("tbl_document_details as doc")
      .leftJoin("tbl_receiving_details as rec", "doc.doc_id", "rec.doc_id")
      .count({ count: "*" });

    const result = await knex
      .select({
        code_id: "docs.code_id",
        description: "docs.document_description",
        attachments: "document_path",
        forwardedBy: "rec.forwarded_by",
        natureOfComm: "rec.nature_of_communication",
        receivedThru: "rec.received_through",
        receivedDate: "rec.received_date",
        receivedTime: "rec.received_time",
        status: "rec.status",
        assignedTo: "proc.assigned_to",
        recommendations: "proc.recommendations",
        remarks: "proc.remarks",
        dateAssigned: "proc.date_assigned",
        processStatus: "proc.process_status",
      })
      .from({ docs: "tbl_document_details" })
      .leftJoin({ rec: "tbl_receiving_details" }, "docs.doc_id", "rec.doc_id")
      .leftJoin(
        { proc: "tbl_processing_details" },
        "docs.doc_id",
        "proc.doc_id"
      )
      .orderBy("docs.doc_id", "desc")
      .limit(pageSize)
      .offset(pageOffset);

    return { status: "SUCCESS", result: result, totalRecords: count };
  },
  getProcessingDocuments: async ({ page }) => {
    const pageNumber = page || 1;
    const pageSize = 15;
    const pageOffset = (pageNumber - 1) * pageSize;

    const [{ count }] = await knex("tbl_processing_details as proc")
      .leftJoin({ docs: "tbl_document_details" }, "docs.doc_id", "proc.doc_id")
      .where("proc.process_status", "Unassigned")
      .count({ count: "proc.process_id" });

    const result = await knex
      .select({
        code: "docs.code_id",
        description: "docs.document_description",
        attachments: "docs.document_path",
      })
      .from({ proc: "tbl_processing_details" })
      .leftJoin({ docs: "tbl_document_details" }, "docs.doc_id", "proc.doc_id")
      .where("proc.process_status", "Unassigned")
      .orderBy("proc.process_id", "desc")
      .limit(pageSize)
      .offset(pageOffset);

    return { status: "SUCCESS", result, totalRecords: count };
  },
  searchDocuments: async ({ code, description, forwardedBy, page }) => {
    const pageNumber = page || 1;
    const pageSize = 15;
    const pageOffset = (pageNumber - 1) * pageSize;

    const codeInput = `%${code}%`;
    const descriptionInput = `%${description}%`;
    const forwardedbyInput = `%${forwardedBy}%`;

    const [{ count }] = await knex("tbl_document_details as doc")
      .leftJoin("tbl_receiving_details as rec", "doc.doc_id", "rec.doc_id")
      .whereILike("doc.code_id", codeInput)
      .orWhereILike("doc.document_description", descriptionInput)
      .orWhereILike("rec.forwarded_by", forwardedbyInput)
      .count({ count: "*" });

    const result = await knex
      .select({
        docId: "doc.doc_id",
        code_id: "doc.code_id",
        description: "doc.document_description",
        attachments: "doc.document_path",
        forwardedBy: "rec.forwarded_by",
        natureOfComm: "rec.nature_of_communication",
        receivedThru: "rec.received_through",
        receivedDate: "rec.received_date",
        receivedTime: "rec.received_time",
        status: "rec.status",
        assignedTo: "proc.assigned_to",
        recommendations: "proc.recommendations",
        remarks: "proc.remarks",
        dateAssigned: "proc.date_assigned",
        processStatus: "proc.process_status",
      })
      .from("tbl_document_details as doc")
      .leftJoin("tbl_receiving_details as rec", "doc.doc_id", "rec.doc_id")
      .leftJoin("tbl_processing_details as proc", "doc.doc_id", "proc.doc_id")
      .whereILike("doc.code_id", codeInput)
      .orWhereILike("doc.document_description", descriptionInput)
      .orWhereILike("rec.forwarded_by", forwardedbyInput)
      .orderBy("doc.doc_id", "desc")
      .limit(pageSize)
      .offset(pageOffset);

    return { status: "SUCCESS", result, totalRecords: count };
  },
  getDocumentRecordsPerDocType: async ({ docId }) => {
    const [{ count }] = await knex("tbl_document_details").count({
      count: "code_id",
    });

    return count || 0;
  },
  searchProcessingDocuments: async ({ code, description, page }) => {
    const pageNumber = page || 1;
    const pageSize = 15;
    const pageOffset = (pageNumber - 1) * pageSize;

    const codeInput = `%${code}%`;
    const descriptionInput = `%${description}%`;

    const [{ count }] = await knex("tbl_document_details as doc")
      .leftJoin("tbl_processing_details as proc", "doc.doc_id", "proc.doc_id")
      .where((qb) => {
        qb.whereILike("doc.code_id", codeInput).orWhereILike(
          "doc.document_description",
          descriptionInput
        );
      })
      .andWhere("proc.process_status", "Unassigned")
      .count({ count: "*" });

    const result = await knex
      .select({
        code: "docs.code_id",
        description: "docs.document_description",
        attachments: "docs.document_path",
      })
      .from({ proc: "tbl_processing_details" })
      .leftJoin({ docs: "tbl_document_details" }, "docs.doc_id", "proc.doc_id")
      .where((qb) => {
        qb.whereILike("docs.code_id", codeInput).orWhereILike(
          "docs.document_description",
          descriptionInput
        );
      })
      .andWhere("proc.process_status", "Unassigned")
      .orderBy("proc.process_id", "desc")
      .limit(pageSize)
      .offset(pageOffset);

    return { status: "SUCCESS", result, totalRecords: count };
  },
  getDocumentsByCodeIdServices: async (code) => {
    let latestCode = [];

    const row = await knex("tbl_document_details")
      .select("code_id")
      .where("code_id", code);

    if (row.length > 0) {
      latestCode = await knex("tbl_document_details")
        .select("code_id")
        .orderBy("doc_id", "desc")
        .first();
    }

    return {
      status: "SUCCESS",
      result: latestCode,
      message: row.length === 0 ? "Available" : "Not available",
    };
  },
};
