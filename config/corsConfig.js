const { StatusCodes } = require("http-status-codes");

const whiteList = ["http://localhost:8082", "http://localhost:8080", "https://localhost:8082", "http://192.168.1.14:8082", "http://192.168.1.14:8080"];

module.exports = {
  corsConfig: {
    origin: (origin, callback) => {
      if (whiteList.indexOf(origin) !== -1 || !origin) {
        callback(null, true);
      } else {
        callback(new Error());
      }
    },
    methods: ["GET", "POST", "DELETE", "PUT", "OPTIONS"],
    credentials: true,
    exposedHeaders: ["set-cookie", "Location"],
  },
  openSuccessStatus: StatusCodes.OK,
};
