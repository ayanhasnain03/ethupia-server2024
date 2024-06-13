// app.js
import express from "express";
import { config } from "dotenv";
import connectDB from "./config/db.js";
import ErrorMiddleware from "./middleware/errorMiddleware.js";

import userRoute from "./routes/userRoute.js";

//config
config({ path: "./config/config.env" });
connectDB();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/user", userRoute);

app.listen(process.env.PORT, () => {
  console.log(`Server listening on port ${process.env.PORT || 3000}`);
});

app.use(ErrorMiddleware);