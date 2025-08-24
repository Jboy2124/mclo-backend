const jwt = require("jsonwebtoken");

const accessKey = process.env.ACCESS_TOKEN_KEY;
const accessKeyExpiry = process.env.ACCESS_TOKEN_EXPIRY;
const refreshKey = process.env.REFRESH_TOKEN_KEY;
const refreshKeyExpiry = process.env.REFRESH_TOKEN_EXPIRY;

module.exports = {
  generateAccessToken: (data) => {
    try {
      const { genId, email, fname, access = [] } = data;
      const result = jwt.sign(
        { id: genId, email, name: fname, access },
        accessKey,
        {
          algorithm: "HS256",
          expiresIn: accessKeyExpiry,
        }
      );
      return result;
    } catch (error) {
      return { status: "ERROR", message: "Error in generating access token" };
    }
  },
  generateRefreshToken: (data) => {
    try {
      const { genId, email, fname, access = [] } = data;
      const result = jwt.sign(
        { id: genId, email, name: fname, access },
        refreshKey,
        {
          algorithm: "HS256",
          expiresIn: refreshKeyExpiry,
        }
      );
      return result;
    } catch (error) {
      return { status: "ERROR", message: "Error in generating refresh token" };
    }
  },
  verifyToken: (token, key) => {
    try {
      const result = jwt.verify(token, key);
      return result;
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return { status: "ERROR", message: "Token has expired." };
      }
      if (err.name === "InvalidTokenError") {
        return { status: "ERROR", message: "Invalid or malformed token." };
      }
    }
  },
};
