import Express, { response } from "express";
import { findOrCreateByOriginalUrl } from "./db/database";

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

export const requestStorageOfUrl = async (
  request: Express.Request,
  response: Express.Response,
) => {
  const original_url: string = request.body.url;
  const validUrl =
    /^(https?:\/\/)([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/g;
  try {
    if (original_url.match(validUrl)) {
      const savedUrlInDb = await findOrCreateByOriginalUrl(original_url);
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
