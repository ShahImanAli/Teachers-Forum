import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import dns from "node:dns/promises";
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const app = express();

const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map((origin) => origin.trim())
  : [/^http:\/\/localhost:\d+$/]; // Enable multiple origins properly (important for Vercel)

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      const isAllowed = allowedOrigins.some((allowedOrigin) => {
        if (allowedOrigin instanceof RegExp) {
          return allowedOrigin.test(origin);
        }
        return allowedOrigin === origin;
      });

      if (isAllowed) {
        callback(null, origin);
      } else {
        // Fallback for Vercel to help debug, returning the exact origin if in production
        // It's safer to explicitly allow it during setup, but you should refine this later
        if (process.env.NODE_ENV === "production" || process.env.VERCEL) {
          callback(null, origin);
        } else {
          callback(new Error("Not allowed by CORS"));
        }
      }
    },
    credentials: true,
  })
);

// configuration for Json data
app.use(express.json({ limit: "16kb" }));

//configuration for url data (matlab jb url sy data aaye gaa)
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

//yeh public assets folder hai koi bhi access kar sakta hai
app.use(express.static("public"));

//mai apnay server sy user ky browser mai cookies set and access kar sako
app.use(cookieParser());

//Routes are imported in similar way as below in the end of app.js file

//Routes import
import userRouter from "./routes/user.routes.js";
import verificationRouter from "./routes/verification.routes.js";
import classroomRouter from "./routes/classroom.routes.js";
import commentRouter from "./routes/comment.routes.js";
import assignmentRouter from "./routes/assignment.routes.js";

// import authRouter from "./routes/auth.routes.js";

// Error handling middleware (registered after all routes)
import { errorHandler } from "./middlewares/error.middleware.js";

//Routes declaration
app.use("/api/v1/users", userRouter);
app.use("/api/v1/verification", verificationRouter);
app.use("/api/v1/classrooms", classroomRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/assignments", assignmentRouter);

// Centralized error handler
app.use(errorHandler);

export { app };
