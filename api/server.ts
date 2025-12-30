import "reflect-metadata";
import express from "express";
import { VercelRequest, VercelResponse } from "@vercel/node";
import { router } from "../src/routes";
import { AppDataSource } from "../src/database";

const app = express();
app.use(express.json());

let isInitialized = false;

const initializeDatabase = async () => {
  if (!isInitialized && !AppDataSource.isInitialized) {
    try {
      await AppDataSource.initialize();
      isInitialized = true;
      console.log("✅ Database connected");
    } catch (error) {
      console.error("❌ Database error:", error);
      throw error;
    }
  }
};

// Add routes
app.use(router);

// Export handler
export default async (req: VercelRequest, res: VercelResponse) => {
  try {
    await initializeDatabase();
    // @ts-ignore
    return app(req, res);
  } catch (error: any) {
    return res.status(500).json({
      message: "Database initialization failed",
      error: error.message,
    });
  }
};
