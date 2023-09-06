import Express, { response } from "express";
import { findOneByShortUrl, findOrCreateByOriginalUrl } from "./db/database";

export const getBasicHtml = (
  _request: Express.Request,
  response: Express.Response,
) => {
  try {
    return response.status(200).sendFile(`${__dirname}/views/index.html`);
  } catch (err) {
    return console.error(err);
  }
};

export const requestSaveToDbByOriginalUrl = async (
  request: Express.Request,
  response: Express.Response,
) => {
  const originalUrl: string = request.body.url;
  const validUrl =
    /^(https?:\/\/)([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/g;

  try {
    if (originalUrl.match(validUrl)) {
      const savedUrlInDb = await findOrCreateByOriginalUrl(originalUrl);
      // console.log(savedUrlInDb);
      return response.status(201).send(savedUrlInDb);
    } else {
      return response.status(400).send({ error: "invalid url" });
    }
  } catch (err) {
    console.error("error message", err);
    return response.status(500).send({ errorMsg: "something went wrong" });
  }
};

export const directToOriginalUrlFromShort = async (
  request: Express.Request,
  response: Express.Response,
) => {
  try {
    const shortUrl: string = request.params.shorturl;
    // const parsedShortUrlId: number = parseInt(shortUrl);
    const foundByShortUrl = await findOneByShortUrl(shortUrl);
    return foundByShortUrl;
    // console.log(foundByShortUrl)
  } catch (err) {
    console.error(err);
    return response.status(500).send({ errorMsg: "something went wrong" });
  }
};
