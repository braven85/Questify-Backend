const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const routes = require("./routes/routes");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

require("dotenv").config();

const app = express();

// recognize the incoming Request Object as a JSON Object
app.use(express.json());

app.use(
  cors({
    origin: "*",
  })
);

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Questify",
      version: "1.0.0",
      description: "GoIT PL ON 2 Final Project",
    },
    servers: [
      {
        url: "https://questify-backend-pl-on-2.herokuapp.com",
      },
    ],
  },
  apis: ["docs/swaggerDocs.yml"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

require("./config/passport");

app.use("/api", routes);

// 404 - Not Found
app.use((_, res, __) => {
  res.status(404).json({
    message: "Use api on routes: /api",
  });
});

// 500 - Internal Server Error
app.use((err, _, res, __) => {
  res.status(500).json({
    message: err.message,
  });
});

const uriDb = process.env.DB_URI;
const PORT = process.env.PORT || 3000;

const connection = mongoose.connect(uriDb, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

connection
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Database connection successful! Listening on PORT: ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
