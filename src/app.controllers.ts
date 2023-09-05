import Express, { response } from "express";
import { createAndSaveUrl } from "./db/database";

type OriginalURL = string;
type ShortURLId = string;

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

export const requestStorageOfUrl = async (
  request: Express.Request,
  response: Express.Response,
) => {
  // 1. get url from request.body
  const original_url: string = request.body.url;
  const validUrl =
    /^(https?:\/\/)([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/g;
  try {
    // 2. generate short url using the length of keys of the in memory database
    if (original_url.match(validUrl)) {
      const savedUrlInDb = createAndSaveUrl(original_url);
      await savedUrlInDb;
      console.log(savedUrlInDb);
      // 4. respond with json with both original and short url
      return response.status(201).send(savedUrlInDb);
    } else {
      return response.status(400).send({ error: "invalid url" });
    }
  } catch (err) {
    console.error(err);
    return response.status(500).send({ errorMsg: "something went wrong" });
  }
};

// export const getOriginalByInputtingShort = (
//   request: Express.Request,
//   response: Express.Response,
// ) => {
//   try {
//     const shortUrl: string = request.params.shorturl;
//     const originalUrl: string | undefined =
//     const parsedShortUrlId: number = parseInt(shortUrl);

//     if (isNaN(parsedShortUrlId)) {
//       return response
//         .status(400)
//         .send({ error: "please enter valid short URL ID (number)" });
//     } else if (typeof originalUrl === "undefined") {
//       return response
//         .status(404)
//         .send({ error: `short url ${shortUrl} not found` });
//     } else {
//       return response.redirect(originalUrl);
//     }
//   } catch (err) {
//     console.error(err);
//     return response.status(500).send({ errorMsg: "something went wrong" });
//   }
// };
