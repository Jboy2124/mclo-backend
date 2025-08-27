const { StatusCodes } = require("http-status-codes");
const { verifyToken, generateAccessToken } = require("../../utilities/jwt");

const refreshKey = process.env.REFRESH_TOKEN_KEY;

module.exports = {
  refreshAccessToken: (req, res) => {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        return res
          .status(StatusCodes.UNAUTHORIZED)
          .json({ status: "ERROR", message: "No refresh token provided" });
      }
      const decoded = verifyToken(refreshToken, refreshKey);

      if (!decoded || decoded.status === "ERROR") {
        return res.status(StatusCodes.UNAUTHORIZED).json(
          decoded || {
            status: "ERROR",
            message: "Invalid or expired refresh token",
          }
        );
      }

      const payload = {
        email: decoded.email,
        fname: decoded.fname,
        lname: decoded.lname,
      };

      const newAccessToken = generateAccessToken(payload);

      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 1 * 24 * 60 * 60 * 1000, // 1 day
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
