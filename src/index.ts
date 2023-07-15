import express from "express";
import http from "http";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";
import mongoose from "mongoose";
require("dotenv").config();

const app = express();

const api = require("./routes/api.routes");

app.use(
  cors({
    credentials: true,
  })
);

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());
app.use("/api", api);

const server = http.createServer(app);

const port = process.env.PORT || 8088;
const MONGO_URL = process.env.MONGO_URL;

server.listen(port, () => {
  console.log("Server running on 8088");
});

mongoose.Promise = Promise;
mongoose
  .connect(MONGO_URL)
  .then((x) => {
    console.log(
      `Connected to Mongo! Database name: "${x.connections[0].name}"`
    );
  })
  .catch((err) => {
    console.error("Error connecting to mongo", err.reason);
  });
mongoose.connection.on("error", (error: Error) => console.log(error));
