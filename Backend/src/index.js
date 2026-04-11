//continue of 2nd way to connect to db
import dotenv from "dotenv";
dotenv.config({
  path: "./.env",
});

import { app } from "./app.js";
import connectDB from "./db/index.js";

//jb async function complete hota hai tou woh aik promise return karta hai
connectDB()
  .then(() => {
    // Only listen if not running in Serverless/Vercel environment
    if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
      app.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
      });
    }
  })
  .catch((error) => {
    console.error("MongoDb Connection Failed! ", error);
  });

// Export app for Vercel serverless deployment
export default app;

// *1st way to connect to db *

// import express from 'express';
// const app = express();

// //iffe function use kiya hai for db connection
// (async () => {
//     try {
//         await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//         app.on("error", (error) => {
//             console.error("Error", error);
//             throw error;
//         })

//         app.listen(process.env.PORT, () => {
//             console.log(`Server is running on port ${process.env.PORT}`);
//         })

//      }
//     catch (error) {
//         console.error("Error", error);
//         throw error;

//     }

// })();
