import "reflect-metadata";
import express, { Request, Response, NextFunction } from "express";
import { router } from "../src/routes";
import { AppDataSource } from "../src/database";
import cors from "cors";

const app = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "*",
    credentials: true,
  })
);

// Health check route
app.get("/", (req: Request, res: Response) => {
  return res.status(200).json({
    message: "API is running!",
    environment: process.env.NODE_ENV || "production",
    database: AppDataSource.isInitialized ? "connected" : "disconnected",
  });
});

// Adicionar rotas
app.use(router);

// Middleware de erro global
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("❌ Error:", err);
  res.status(err.statusCode || 500).json({
    message: err.message || "Internal server error",
  });
});

// Rota 404
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: "Route not found" });
});

// Inicializar banco de dados
let isInitialized = false;

const initializeDatabase = async () => {
  if (!isInitialized && !AppDataSource.isInitialized) {
    try {
      await AppDataSource.initialize();
      isInitialized = true;
      console.log("✅ Database initialized");
    } catch (err) {
      console.error("❌ Database error:", err);
      throw err;
    }
  }
};

// Exportar handler para Vercel
export default async (req: Request, res: Response) => {
  try {
    await initializeDatabase();
    return app(req, res);
  } catch (error) {
    console.error("Handler error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? String(error) : undefined,
    });
  }
};
