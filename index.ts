import { app } from "./src/app";
import { AddressInfo } from "net";
// require("./src/db/database")

const listener = app.listen(process.env.PORT || 3001, () => {
  const address = listener.address() as AddressInfo;
  console.log("App is listening on port " + address.port);
});