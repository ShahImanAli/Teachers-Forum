import dotenv from "dotenv";
dotenv.config({
  path: "./.env",
});

import { app } from "./app.js";
import connectDB from "./db/index.js";

connectDB()
  .then(() => {
    if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
      app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
      });
    }
  })
  .catch((error) => {
    console.error("MongoDb Connection Failed! ", error);
  });

export default app;
