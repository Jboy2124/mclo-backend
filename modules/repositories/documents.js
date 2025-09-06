const { isNullOrEmptyOrUndefined } = require("../../utilities/functions");
const {
  addNewDocuments,
  addNewReceivingAndInitialProcessing,
  getDocumentsServices,
  getProcessingDocuments,
  searchDocuments,
  getDocumentRecordsPerDocType,
  getDocumentById,
  searchProcessingDocuments,
  getDocumentsByCodeIdServices,
} = require("../services/documents");
const {
  updateProcessByCode,
  getAssignedProcessedDocuments,
  updateProcessByCodeAndStatus,
} = require("../services/processing");
const { getTimelineInformation } = require("../services/tracker");

module.exports = {
  newDocuments: async (payload) => {
    const {
      code,
      description,
      path,
      forwardedBy,
      natureOfComm,
      receivedThru,
      date,
      time,
      docType,
      receivedBy,
    } = payload;
    try {
      const doc_id = await addNewDocuments({
        code,
        docType,
        description,
        path,
      });
      if (isNullOrEmptyOrUndefined(doc_id)) {
        return { status: "ERROR", result: [] };
      }
      const result = await addNewReceivingAndInitialProcessing({
        doc_id,
        forwardedBy,
        natureOfComm,
        receivedThru,
        date,
        time,
        receivedBy,
      });
      if (result.status !== "SUCCESS") {
        return { status: "ERROR", result: [] };
      }
      return { status: "SUCCESS", result: [] };
    } catch (err) {}
  },
  getDocumentsRepositories: async () => {
    try {
      const result = await getDocumentsServices();
      if (result.status !== "SUCCESS") {
        return {
          status: "ERROR",
          result: [],
          message: result.message,
          totalRecords: 1,
        };
      }

      return {
        status: "SUCCESS",
        result: result.result,
        message: "",
        totalRecords: result.totalRecords,
      };
    } catch (err) {
      return { status: "ERROR", result: [] };
    }
  },
  getProcessingDocsRepositories: async (params) => {
    try {
      const { page } = params;
      const result = await getProcessingDocuments({ page });
      if (result.status === "SUCCESS") {
        return result;
      }
    } catch (err) {
      return { status: "ERROR", result: [] };
    }
  },
  searchDocuments: async (params) => {
    try {
      const { code, description, forwardedBy, page } = params;
      const response = await searchDocuments({
        code,
        description,
        forwardedBy,
        page,
      });
      if (response.status === "SUCCESS") {
        return response;
      }
    } catch (error) {
      return { status: "ERROR", result: [] };
    }
  },
  getDocumentCountPerDocType: async ({ docId }) => {
    try {
      const response = await getDocumentRecordsPerDocType({ docId });
      if (isNullOrEmptyOrUndefined(response)) {
        return { status: "ERROR", result: [] };
      }

      return { status: "SUCCESS", result: response };
    } catch (error) {
      return { status: "ERROR", result: [] };
    }
  },
  setDocumentAssigneeRepository: async ({
    assignee,
    code,
    recommendation,
    remarks,
  }) => {
    try {
      for (const itm of code) {
        const docId = await getDocumentById({ code: itm });

        if (!docId?.[0]) continue;

        const individualAssignee = assignee.join(", ");
        const constructData = {
          docId: docId[0]?.doc_id,
          assignedTo: individualAssignee,
          recommendations: recommendation,
          remarks: remarks,
        };
        await updateProcessByCode(constructData);
      }

      return { status: "SUCCESS", result: [] };
    } catch (error) {
      return { status: "ERROR", result: [] };
    }
  },
  updateProcessStatus: async (data) => {
    try {
      const { status, processId, docId } = data;
      const response = await updateProcessByCodeAndStatus({
        status,
        processId,
        docId,
      });
      if (response.status !== "SUCCESS") {
        return {
          status: "ERROR",
          result: [],
          message: response.message,
        };
      }

      return {
        status: "SUCCESS",
        result: response.result,
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
  searchProcessingDocumentsRepositories: async ({
    code,
    description,
    page,
  }) => {
    try {
      const result = await searchProcessingDocuments({
        code,
        description,
        page,
      });
      if (result.status !== "SUCCESS") {
        return { status: "ERROR", result: [] };
      }

      return {
        status: "SUCCESS",
        result: result?.result,
        totalRecords: result.totalRecords,
      };
    } catch (error) {
      return { status: "ERROR", result: [] };
    }
  },
  getDocumentsByCodeIdSearch: async (code) => {
    try {
      const result = await getDocumentsByCodeIdServices(code);

      return {
        status: "SUCCESS",
        result: result?.result,
        message: result?.message,
      };
    } catch (error) {
      return { status: "ERROR", message: error.message };
    }
  },
  getAssignedProcessedDocumentsRepo: async ({ assigneeId, pageNumber }) => {
    try {
      const response = await getAssignedProcessedDocuments(
        assigneeId,
        pageNumber
      );
      if (response.status !== "SUCCESS") {
        return {
          status: "ERROR",
          result: [],
          message: response.message,
        };
      }

      return {
        status: "SUCCESS",
        result: response.result,
        message: "",
        totalRecords: response.totalRecords,
      };
    } catch (error) {
      return { status: "ERROR", result: [], message: error.message };
    }
  },
  getTimelineInformationRepo: async (docId) => {
    try {
      const response = await getTimelineInformation(docId);
      if (response.status !== "SUCCESS") {
        return {
          status: "ERROR",
          result: [],
          message: response.message,
        };
      }

      return {
        status: "SUCCESS",
        result: response.result,
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
