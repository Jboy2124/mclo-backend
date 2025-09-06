const { StatusCodes } = require("http-status-codes");

const whiteList = ["http://localhost:8082", "https://localhost:8082"];

module.exports = {
  corsConfig: {
    origin: (origin, callback) => {
      if (whiteList.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error());
      }
    },
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    exposedHeaders: ["set-cookie", "Location"],
  },
  openSuccessStatus: StatusCodes.OK,
};
