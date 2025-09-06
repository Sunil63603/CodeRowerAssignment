//Entry point for the backend API
import dotenv from "dotenv";
dotenv.config(); //load env variables.

import express, { Request, Response, NextFunction } from "express";
import cors from "cors";

//backend logic has been structured into route and controller files.
import configRoutes from "./routes/configRoutes.js";

//call this function and establish connection
import { connectToDB } from "./db/connect.js";

//creating server
const app = express();

//middlewares
app.use(cors());
app.use(express.json());

//defining routes
app.use("/api", configRoutes);

app.use("/health", (_req: Request, res: Response) =>
  res.status(200).json({ status: "ok" })
);

//generic error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ message: `Internal server error` });
});

const BACKEND_PORT = Number(process.env.BACKEND_PORT || 8080);

async function start() {
  try {
    await connectToDB();
    app.listen(BACKEND_PORT, () => {
      console.log(`Server started:http://localhost:${BACKEND_PORT}`);
    });
  } catch (error) {
    console.error(`Failed to start server`, error);
    process.exit(1);
  }
}

start();
