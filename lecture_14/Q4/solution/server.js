import app from "./index.js";
import { connectToMongoDB } from "./src/config/mongodb.js";

app.listen(3001, () => {
  console.log("server is listening at port 3000");
  connectToMongoDB();
});

