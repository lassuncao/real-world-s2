import { createApp } from "./app";
import { config } from "./config";

const port = config.PORT;
createApp(config).listen(port, () => {
  console.log(`Listening on ${port}`);
});
