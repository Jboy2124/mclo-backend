const { isNullOrEmptyOrUndefined } = require("../../utilities/functions");
const {
  addNewUserAccount,
  addNewLoginAccount,
  getOTP,
  updateAccountStatus,
  updateOTP,
} = require("../services/registration");
const { generateOTP, hashPassword } = require("../../utilities/utilities");
const { addNewOTP } = require("../services/tokens");

module.exports = {
  registerUser: async (params) => {
    try {
      let newLoginUser = null;
      let newOTP = null;
      const newAccount = await addNewUserAccount(params);

      if (!isNullOrEmptyOrUndefined(newAccount)) {
        newLoginUser = await addNewLoginAccount({
          account_id: newAccount,
          email: params?.email,
          password: await hashPassword(params?.password),
        });
      }

      if (!isNullOrEmptyOrUndefined(newLoginUser)) {
        newOTP = generateOTP();
        await addNewOTP(newOTP, newAccount);
      }

      return newOTP ?? "";
    } catch (err) {}
  },
  updateUserStatus: async (userId) => {
    try {
      const result = await updateAccountStatus(userId);
      if (!isNullOrEmptyOrUndefined(result)) {
        return { status: "SUCCESS", result: [{ table: "Updated" }] };
      }
      return { status: "SUCCESS", result: [] };
    } catch (err) {}
  },
  verifyOTP: async (otp) => {
    try {
      const result = await getOTP(otp);
      if (!isNullOrEmptyOrUndefined(result)) {
        return result;
      }
      return [];
    } catch (err) {}
  },
  disableOTP: async (otp) => {
    try {
      const result = await updateOTP(otp);
      if (result?.result === "Updated") {
        return { status: "SUCCESS", result: [{ table: "Updated" }] };
      }
    } catch (err) {}
  },
};
