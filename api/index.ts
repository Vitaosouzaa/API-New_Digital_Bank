import "reflect-metadata";
import express, { Request, Response, NextFunction } from "express";
import { router } from "../src/routes";
import { AppDataSource } from "../src/database";
import cors from "cors";

const app = express();

// Configuração CORS completa
app.use(
  cors({
    origin: true, // Aceita qualquer origem em desenvolvimento
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Handler para requisições OPTIONS (preflight)
app.options("*", cors());

// Middleware
app.use(express.json());

// Health check route
app.get("/", (req: Request, res: Response) => {
  return res.status(200).json({
    message: "API is running!",
    environment: process.env.NODE_ENV || "production",
    database: AppDataSource.isInitialized ? "connected" : "disconnected",
  });
});

// Debug route para diagnóstico
app.get("/debug", async (req: Request, res: Response) => {
  try {
    const hasDbUrl = !!process.env.DATABASE_URL;
    const dbUrlLength = process.env.DATABASE_URL?.length || 0;
    
    return res.status(200).json({
      message: "Debug info",
      environment: process.env.NODE_ENV,
      database: {
        isInitialized: AppDataSource.isInitialized,
        hasUrl: hasDbUrl,
        urlLength: dbUrlLength,
        type: AppDataSource.options.type,
      },
      env: {
        hasJwtSecret: !!process.env.JWT_SECRET,
        hasFrontendUrl: !!process.env.FRONTEND_URL,
      },
    });
  } catch (error) {
    return res.status(500).json({
      error: "Debug failed",
      details: String(error),
    });
  }
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
  } catch (error: any) {
    console.error("Handler error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: String(error),
      details: {
        name: error?.name,
        message: error?.message,
        code: error?.code,
      },
    });
  }
};
