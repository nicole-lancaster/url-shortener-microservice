require("dotenv").config();
import mongoose from "mongoose";

type EnvVariables = {
    MONGO_URI: string;
}

type UrlType = {
    short_url: number;
    original_url: string
};

try {
    mongoose.connect((process.env as EnvVariables).MONGO_URI)
    console.log("DB connection successful!");
} catch (err) {
    console.log("DB connection not successful!");
}


// defines the shape of the documents (rows) within that collection
const urlSchema = new mongoose.Schema<UrlType>({
    short_url: { type: Number, required: true },
    original_url: { type: String, required: true }
});

// A model allows you to create instances of your objects, called documents
export const UrlDocument: mongoose.Model<UrlType, {}, {}> = mongoose.model<UrlType>("Url", urlSchema);