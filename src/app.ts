import express from "express";
import cors from "cors";
import {
  directToOriginalUrlFromShort,
  getBasicHtml,
  requestSaveToDbByOriginalUrl,
} from "./app.controllers";
export const app = express();

app.use(cors({ optionsSuccessStatus: 200 }));
app.use("/public", express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api", getBasicHtml);
app.post("/api/shorturl", requestSaveToDbByOriginalUrl);
app.get("/api/shorturl/:shorturl", directToOriginalUrlFromShort);
app.get("*", (_, response) =>
  response.status(404).send({ error: "Not found" }),
);
