import Express, { response } from "express";

export const getBasicHtml = (
  request: Express.Request,
  response: Express.Response,
) => {
  try {
    console.log(__dirname);
    return response.status(200).sendFile(`${__dirname}/views/index.html`);
  } catch (err) {
    return console.error(err);
  }
};
