const { StatusCodes } = require("http-status-codes");
const { verifyToken, generateAccessToken } = require("../../utilities/jwt");

const refreshKey = process.env.REFRESH_TOKEN_KEY;

module.exports = {
  refreshAccessToken: (req, res) => {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        return res
          .status(StatusCodes.NOT_FOUND)
          .json({ status: "ERROR", message: "No refresh token provided" });
      }
      const decoded = verifyToken(refreshToken, refreshKey);

      if (!decoded || decoded.status === "ERROR") {
        return res.status(StatusCodes.FORBIDDEN).json(
          decoded || {
            status: "ERROR",
            message: "Invalid or expired refresh token",
          }
        );
      }

      const newAccessToken = generateAccessToken(decoded);

      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 15 * 60 * 1000, // 15 min
      });
      return res.status(StatusCodes.OK).json({
        status: "SUCCESS",
        message: "Access token refreshed successfully",
      });
    } catch (error) {
      return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json({ status: "ERROR", message: error });
    }
  },
  clearAuth: (req, res) => {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });
    return res
      .status(StatusCodes.OK)
      .json({ status: "SUCCESS", message: "Logged out successfully" });
  },
};
