const { StatusCodes } = require("http-status-codes");
const { login } = require("../../modules/repositories/login");
const { generateAccessToken } = require("../../utilities/jwt");
const { getToken } = require("../../utilities/utilities");
const uuid4 = require("uuid4");
const { max } = require("../../config/knexConfig");

module.exports = {
  loginAccount: async (req, res) => {
    try {
      const payload = req.body;
      const result = await login(payload);
      const accessToken = getToken(
        { ...result?.result, access: [], genId: uuid4() },
        "access"
      );
      const refreshToken = getToken(
        { ...result?.result, access: [], genId: uuid4() },
        "refresh"
      );

      if (result?.isValid) {
        res.cookie("accessToken", accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
        });

        res.cookie("refreshToken", refreshToken, {
          httpOnly: true, // not accessible by JS
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
          maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
        });
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
