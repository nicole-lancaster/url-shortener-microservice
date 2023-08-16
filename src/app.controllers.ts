import Express, { response } from "express";

type OriginalURL = string;
type ShortURLId = string;

const inMemoryDatabase: Record<ShortURLId, OriginalURL> = {};

export const getBasicHtml = (
  request: Express.Request,
  response: Express.Response,
) => {
  try {
    return response.status(200).sendFile(`${__dirname}/views/index.html`);
  } catch (err) {
    return console.error(err);
  }
};

export const postOriginalAndGetShort = (
  request: Express.Request,
  response: Express.Response,
) => {
  try {
    // 1. get url from request.body
    const original_url: string = request.body.url;
    const validUrl =
      /^(https?:\/\/)([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/g;
    // 2. generate short url using the length of keys of the in memory database
    const numOfStoredShortUrls: number = Object.keys(inMemoryDatabase).length;
    const short_url: number = numOfStoredShortUrls + 1;

    if (original_url.match(validUrl)) {
      // 3. store short url and original url in the inMemoryDatabase
      inMemoryDatabase[short_url] = original_url;
      // 4. respond with json with both original and short url
      return response.status(201).send({ original_url, short_url });
    } else {
      return response.status(400).send({ error: "invalid url" });
    }
  } catch (err) {
    console.error(err);
    return response.status(500).send({ errorMsg: "something went wrong" });
  }
};

export const getOriginalByInputtingShort = (
  request: Express.Request,
  response: Express.Response,
) => {
  try {
    const shortUrl: string = request.params.shorturl;
    const originalUrl: string | undefined = inMemoryDatabase[shortUrl];
    const parsedShortUrlId: number = parseInt(shortUrl);

    if (isNaN(parsedShortUrlId)) {
      return response
        .status(400)
        .send({ error: "please enter valid short URL ID (number)" });
    } else if (typeof originalUrl === "undefined") {
      return response
        .status(404)
        .send({ error: `short url ${shortUrl} not found` });
    } else {
      return response.redirect(originalUrl);
    }
  } catch (err) {
    console.error(err);
    return response.status(500).send({ errorMsg: "something went wrong" });
  }
};
