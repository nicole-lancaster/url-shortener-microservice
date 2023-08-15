import express from "express";
export const app = express();
import { AddressInfo } from "net";

const listener = app.listen(process.env.PORT || 3000, () => {
  const address = listener.address() as AddressInfo;
  console.log("App is listening on port " + address.port);
});
