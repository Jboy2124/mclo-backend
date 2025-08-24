const { StatusCodes } = require("http-status-codes");
const { verifyToken } = require("../../utilities/jwt");
const accessKey = process.env.ACCESS_TOKEN_KEY;

module.exports = {
  accessTokenVerification: (req, res, next) => {
    const token = req.cookies.accessToken;
    if (!token) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ status: "ERROR", message: "No token provided" });
    }

    const decoded = verifyToken(token, accessKey);

    if (!decoded || decoded.status === "ERROR") {
      return res
        .status(StatusCodes.FORBIDDEN)
        .json(
          decoded || { status: "ERROR", message: "Invalid or expired token" }
        );
    }

    req.user = decoded; // attach decoded payload (id, email, name, access)
    next();
  },
};
