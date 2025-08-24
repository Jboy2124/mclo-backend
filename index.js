require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const compression = require("compression");
const morgan = require("morgan");
const { corsConfig } = require("./config/corsConfig");
const cookieParser = require("cookie-parser");

const registration = require("./routes/registration");
const commonCodes = require("./routes/commonCodes");
const account = require("./routes/account");
const documents = require("./routes/documents");
const users = require("./routes/users");
const auth = require("./routes/auth");

const app = express();
app.use(cookieParser());
const port = process.env.PRIMARY_PORT || process.env.SECONDARY_PORT;

//security
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        // Allow iframe embedding from localhost:8082:
        frameAncestors: ["'self'", "http://localhost:8082"],
        // Add other directives as needed, e.g.:
        scriptSrc: ["'self'"],
        // ... your other directives ...
      },
    },
  })
);
app.use(cors(corsConfig));

//performance and logging
app.use(compression());

//body-parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//routes
app.use(registration);
app.use(account);
app.use(commonCodes);
app.use(documents);
app.use(users);
app.use(auth);

app.listen(port, () => {
  console.log(`Server is running at port: ${port}`);
});
