import express from "express";
import cors from "cors";
import {
  getBasicHtml,
  // getOriginalByInputtingShort,
  requestStorageOfUrl,
} from "./app.controllers";
export const app = express();

app.use(cors({ optionsSuccessStatus: 200 }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/api", getBasicHtml);
app.post("/api/shorturl", requestStorageOfUrl);
// app.get("/api/shorturl/:shorturl", getOriginalByInputtingShort);
app.get("*", (_, response) =>
  response.status(404).send({ error: "Not found" }),
);
