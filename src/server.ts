
import app from "./app";
import config from "./config";

const port = config.port || 8080;

app.listen(5000, () => {
  console.log("Server is running on post 5000");
});
