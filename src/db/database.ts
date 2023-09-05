require("dotenv").config();
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

// Create a model - this allows you to create instances of your objects, called documents
const Url = model<Url>("Url", urlSchema);

export const createAndSaveUrl = async (original_url: string) => {
  // connecting to mongoose database
  await connect((process.env as EnvVariables).MONGO_URI);
  console.log("DB connection successful!");
  // the Url() constructor returns in instance of HydratedDocument<Url>
  // Url is a document interface, representing the raw obj structure that Url objects look like
  const url: HydratedDocument<Url> = new Url(
    { _id: 2 },
    { short_url: 2, original_url },
  );
  const savedUrl = await url.save();
  return savedUrl;
};
