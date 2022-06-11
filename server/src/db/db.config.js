import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

(async () => {
  await mongoose
    .connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then((res) => {
      console.log("DB is connected !!");
    })
    .catch((err) => console.log(err));
})();
