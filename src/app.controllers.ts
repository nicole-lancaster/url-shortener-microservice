import Express from "express";
import { findOneByShortUrl, findOrCreateByOriginalUrl } from "./db/database";
import validUrl from "valid-url";

export const getBasicHtml = (
  _request: Express.Request,
  response: Express.Response,
) => {
  try {
    return response.status(200).sendFile(`${__dirname}/views/index.html`);
  } catch (err) {
    return response.status(500).json({ error: "unable to fetch static files" });
  }
};

export const requestSaveToDbByOriginalUrl = async (
  request: Express.Request,
  response: Express.Response,
) => {
  const originalUrl: string = request.body.url;
  try {
    if (validUrl.isUri(originalUrl) && originalUrl.startsWith("http")) {
      const savedUrlInDb = await findOrCreateByOriginalUrl(originalUrl);
      return response.status(201).send(savedUrlInDb);
    } else {
      return response.json({ error: "invalid url" });
    }
  } catch (err) {
    return response.status(500).json({ error: "something went wrong" });
  }
};

export const directToOriginalUrlFromShort = async (
  request: Express.Request,
  response: Express.Response,
) => {
  const shortUrl: string = request.params.shorturl;
  try {
    const foundByShortUrl = await findOneByShortUrl(shortUrl);
    return response.redirect(`${foundByShortUrl}`);
  } catch (err) {
    return response.status(500).json({ error: "unable to redirect" });
  }
};
