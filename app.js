// app.js
import express from "express";
import { config } from "dotenv";
import connectDB from "./config/db.js";
import ErrorMiddleware from "./middleware/errorMiddleware.js";
import cookieParser from "cookie-parser";

import userRoute from "./routes/userRoute.js";
import projectRoute from "./routes/projectRoute.js";

//config
config({ path: "./config/config.env" });
connectDB();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/api/user", userRoute);
app.use("/api/project", projectRoute);

app.listen(process.env.PORT, () => {
  console.log(`Server listening on port ${process.env.PORT || 3000}`);
});

app.use(ErrorMiddleware);
