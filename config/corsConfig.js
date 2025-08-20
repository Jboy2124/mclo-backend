const { StatusCodes } = require("http-status-codes");

const whiteList = ["http://localhost:8082"];

module.exports = {
  corsConfig: {
    origin: (origin, callback) => {
      if (whiteList.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error());
      }
    },
    credentials: true,
    exposedHeaders: ["set-cookie", "Location"],
  },
  openSuccessStatus: StatusCodes.OK,
};
