import "reflect-metadata";
import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import { router } from "./routes";
import { AppDataSource } from "./database";
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

// Health check route (antes das outras rotas)
app.get("/", (req: Request, res: Response) => {
  return res.status(200).json({
    message: "API is running!",
    environment: process.env.NODE_ENV || "development",
    database: AppDataSource.isInitialized ? "connected" : "disconnected",
  });
});

// Adicionar rotas
app.use(router);

// Middleware de erro global (deve ser o último)
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("❌ Error:", err);
  res.status(err.statusCode || 500).json({
    message: err.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// Rota 404 para endpoints não encontrados
app.use((req: Request, res: Response) => {
  res.status(404).json({ message: "Route not found" });
});

// Inicializar banco de dados (lazy initialization para Vercel)
const initializeDatabase = async () => {
  if (!AppDataSource.isInitialized) {
    try {
      await AppDataSource.initialize();
      console.log("✅ Data Source has been initialized!");
    } catch (err) {
      console.error("❌ Error during Data Source initialization:", err);
      throw err;
    }
  }
};

// Para desenvolvimento local
if (process.env.NODE_ENV !== "production") {
  initializeDatabase().then(() => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 SERVER ON PORT ${PORT}`));
  });
}

// Exportar handler para Vercel Serverless
export default async (req: Request, res: Response) => {
  await initializeDatabase();
  return app(req, res);
};
