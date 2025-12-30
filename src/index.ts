import "reflect-metadata";
import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import { router } from "./routes";
import { AppDataSource } from "./database";
import cors from "cors";

const server = express();

// Middleware
server.use(express.json());
server.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
}));

// Health check route (antes das outras rotas)
server.get("/", (req: Request, res: Response) => {
  return res.status(200).json({ 
    message: "API is running!",
    environment: process.env.NODE_ENV || 'development',
  });
});

// Inicializar banco de dados ANTES de usar as rotas
AppDataSource.initialize()
  .then(() => {
    console.log("✅ Data Source has been initialized!");
    
    // Só adiciona as rotas depois do DB conectar
    server.use(router);
    
    // Middleware de erro global (deve ser o último)
    server.use((err: any, req: Request, res: Response, next: NextFunction) => {
      console.error("❌ Error:", err);
      res.status(err.statusCode || 500).json({
        message: err.message || "Internal server error",
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
      });
    });
    
    // Rota 404 para endpoints não encontrados
    server.use((req: Request, res: Response) => {
      res.status(404).json({ message: "Route not found" });
    });
    
    // Só inicia o servidor se não estiver no ambiente Vercel
    if (process.env.NODE_ENV !== 'production') {
      const PORT = process.env.PORT || 5000;
      server.listen(PORT, () => console.log(`🚀 SERVER ON PORT ${PORT}`));
    }
  })
  .catch((err) => {
    console.error("❌ Error during Data Source initialization:", err);
    if (process.env.NODE_ENV !== 'production') {
      process.exit(1);
    }
  });

// Exportar para Vercel Serverless Functions
export default server;
