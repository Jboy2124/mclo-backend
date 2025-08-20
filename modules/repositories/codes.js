const { isNullOrEmptyOrUndefined } = require("../../utilities/functions");
const {
  commonTitles,
  commonDesignation,
  commonNatureOfCommunication,
  commonReceivedThru,
  commonDocumentType,
} = require("../services/codes");

module.exports = {
  getTitles: async () => {
    try {
      const titleCodeList = await commonTitles();
      if (!isNullOrEmptyOrUndefined(titleCodeList)) {
        return {
          status: "SUCCESS",
          result: titleCodeList,
        };
      }
      return { status: "SUCCESS", result: [] };
    } catch (err) {}
  },

  getDesignations: async () => {
    try {
      const designationCodeList = await commonDesignation();
      if (!isNullOrEmptyOrUndefined(designationCodeList)) {
        return {
          status: "SUCCESS",
          result: designationCodeList,
        };
      }
      return { status: "SUCCESS", result: [] };
    } catch (error) {}
  },

  getNatureOfCommunications: async () => {
    try {
      const natureOfCommunicationsList = await commonNatureOfCommunication();
      if (!isNullOrEmptyOrUndefined(natureOfCommunicationsList)) {
        return {
          status: "SUCCESS",
          result: natureOfCommunicationsList,
        };
      }
      return { status: "SUCCESS", result: [] };
    } catch (error) {}
  },

  getReceivedThru: async () => {
    try {
      const receivedThruList = await commonReceivedThru();
      if (!isNullOrEmptyOrUndefined(receivedThruList)) {
        return {
          status: "SUCCESS",
          result: receivedThruList,
        };
      }
      return { status: "SUCCESS", result: [] };
    } catch (error) {}
  },
  getDocumentTypes: async () => {
    try {
      const result = await commonDocumentType();
      if (!result) {
        return { status: "ERROR", result: [] };
      }

      return { status: "SUCCESS", result: result };
    } catch (error) {
      return { status: "ERROR", result: [] };
    }
  },
};
