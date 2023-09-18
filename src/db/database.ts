require("dotenv").config();
import { response } from "express";
import mongoose, { HydratedDocument, connect, model } from "mongoose";

// 1. defining the type (shape) of the env variables
type EnvVariables = {
  MONGO_URI: string;
};

// 2. creating an interface representing a document in MongoDB
interface Url {
  short_url: number;
  original_url: string;
  versionKey: false;
}

// 3. create a schema corresponding to the document (rows) interface
const urlSchema = new mongoose.Schema<Url>(
  {
    short_url: { type: Number, required: true },
    original_url: { type: String, required: true },
  },
  { versionKey: false },
);

// 4. create a model - this allows you to create instances of your objects, called documents
const Url = model<Url>("Url", urlSchema);

// 5. connecting to mongoDB
connect((process.env as EnvVariables).MONGO_URI);

// 6. checking if user inputted original url is already in db
export const findOrCreateByOriginalUrl = async (original_url: string) => {
  // 7. if it is, return that one already saved to the user
  const foundOriginalUrl = await Url.findOne({ original_url }, { _id: 0 });

  try {
    let savedUrl: Url;
    if (foundOriginalUrl) {
      savedUrl = await foundOriginalUrl.save();
      return savedUrl;
    }
    // 8. otherwise, creating a new instance of a url and saving to db
    else {
      const numOfUniqueOriginalUrls: number = await Url.count();
      let url: HydratedDocument<Url> = new Url({
        short_url: numOfUniqueOriginalUrls + 1,
        original_url,
      });
      savedUrl = await url.save();
      const foundNewlySavedUrl = await Url.findOne(
        { original_url },
        { _id: 0 },
      );
      return foundNewlySavedUrl;
    }
  } catch (err) {
    return response.status(500).send({ error: "something went wrong" });
  }
};

// 9. looking up the user requested short url in the db
export const findOneByShortUrl = async (short_url: string | null) => {
  const foundUrlByShort = await Url.findOne({ short_url }, { _id: 0 });
  // 10. if the short url number exists in the db, return it
  try {
    if (foundUrlByShort) {
      return foundUrlByShort.original_url;
    }
    // 11. otherwise, user requested a short url that is invalid
    else {
      return response.status(400).json({ error: "invalid url" });
    }
  } catch (err) {
    return response.status(500).send({ error: "something went wrong" });
  }
};
