const { StatusCodes } = require("http-status-codes");
const {
  registerUser,
  verifyOTP,
  updateUserStatus,
  disableOTP,
} = require("../../modules/repositories/registration");
const { isNullOrEmptyOrUndefined } = require("../../utilities/functions");
const { sendVerificationMail } = require("../middlewares/sendVerification");

module.exports = {
  register: async (req, res) => {
    const payload = req.body;
    try {
      const result = await registerUser(payload);
      if (!isNullOrEmptyOrUndefined(result)) {
        await sendVerificationMail(payload.email, result);
        return res
          .status(StatusCodes.CREATED)
          .json({ status: "SUCCESS", result: result });
      }
      return res
        .status(StatusCodes.CREATED)
        .json({ status: "SUCCESS", result: [] });
    } catch (err) {}
  },
  verifyEmail: async (req, res) => {
    try {
      const payload = req.body;
      const result = await verifyOTP(payload.otp);

      if (isNullOrEmptyOrUndefined(result)) {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ status: "ERROR", result: [] });
      }

      const { user_id } = result;
      const response = await updateUserStatus(user_id);
      if (response?.result[0]?.table !== "Updated") {
        return res
          .status(StatusCodes.BAD_REQUEST)
          .json({ status: "ERROR", result: [] });
      }

      await disableOTP(payload.otp);

      return res.status(StatusCodes.OK).json({ status: "SUCCESS", result: [] });
    } catch (err) {}
  },
};
