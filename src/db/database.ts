require("dotenv").config();
import { response } from "express";
import mongoose, { HydratedDocument, connect, model } from "mongoose";

// defining the type (shape) of the env variables
type EnvVariables = {
  MONGO_URI: string;
};

// 1. creating an interface representing a document in MongoDB
interface Url {
  short_url: number;
  original_url: string;
  versionKey: false;
}

// 2. Create a Schema corresponding to the document (rows) interface.
const urlSchema = new mongoose.Schema<Url>(
  {
    short_url: { type: Number, required: true },
    original_url: { type: String, required: true },
  },
  { versionKey: false },
);

// 3. Create a model - this allows you to create instances of your objects, called documents
const Url = model<Url>("Url", urlSchema);

// 4. Connect to mongoose database
connect((process.env as EnvVariables).MONGO_URI);

// 5. Checking if inputted original url is already in DB
export const findOrCreateByOriginalUrl = async (original_url: string) => {
  // 6. if it is, return that one already saved to the user
  const foundOriginalUrl = await Url.findOne({ original_url }, { _id: 0 });

  try {
    let savedUrl;
    if (foundOriginalUrl) {
      savedUrl = await foundOriginalUrl.save();
      return savedUrl;
    }
    // 7. otherwise creating a new instance of a url and saving to DB
    else {
      const numOfUniqueOriginalUrls: number = await Url.count();
      let url: HydratedDocument<Url> = new Url({
        short_url: numOfUniqueOriginalUrls + 1,
        original_url,
      });
      savedUrl = await url.save();
      return savedUrl;
    }
  } catch (err) {
    return err;
  }
};

export const findOneByShortUrl = async (short_url: string | null) => {
  const foundUrlByShort = await Url.findOne({ short_url }, { _id: 0 });
  try {
    if (foundUrlByShort) {
      return foundUrlByShort.original_url;
    } else {
      return;
    }
  } catch (err) {
    return response.status(500).send({ msg: "in the catch block" });
  }
};
