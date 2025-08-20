const { StatusCodes } = require("http-status-codes");
const { login } = require("../../modules/repositories/login");

module.exports = {
  loginAccount: async (req, res) => {
    try {
      const payload = req.body;
      const result = await login(payload);
      if (result?.isValid) {
        return res
          .status(StatusCodes.OK)
          .json({ status: "SUCCESS", result: result.result });
      }
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ status: "ERROR", result: [] });
    } catch (err) {}
  },
};
