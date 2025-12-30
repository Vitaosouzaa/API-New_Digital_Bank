import "reflect-metadata";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";

const app = express();

// Configuração CORS completa
const corsOptions = {
  origin: true,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.json());

// Health check route
app.get("/", (req: Request, res: Response) => {
  return res.status(200).json({
    message: "API is running!",
    timestamp: new Date().toISOString(),
  });
});

// Debug route
app.get("/api/debug", (req: Request, res: Response) => {
  return res.status(200).json({
    message: "Debug endpoint",
    env: {
      hasDbUrl: !!process.env.DATABASE_URL,
      hasJwtSecret: !!process.env.JWT_SECRET,
      nodeEnv: process.env.NODE_ENV,
    },
  });
});

// Importar e adicionar rotas com tratamento de erro
let router: any;
let AppDataSource: any;
let dbInitialized = false;

const initializeApp = async () => {
  if (dbInitialized) return;

  try {
    // Importar módulos dinamicamente
    const routesModule = await import("../src/routes");
    const databaseModule = await import("../src/database");

    router = routesModule.router;
    AppDataSource = databaseModule.AppDataSource;

    // Inicializar banco de dados
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log("✅ Database initialized");
    }

    // Adicionar rotas
    app.use(router);

    dbInitialized = true;
  } catch (error: any) {
    console.error("❌ Initialization error:", error);
    throw error;
  }
};

// Middleware de erro global
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("❌ Error:", err);
  return res.status(err.statusCode || 500).json({
    message: err.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// Rota 404
app.use((req: Request, res: Response) => {
  return res.status(404).json({
    message: "Route not found",
    path: req.path,
  });
});

// Exportar handler para Vercel
export default async (req: Request, res: Response) => {
  try {
    await initializeApp();
    return app(req, res);
  } catch (error: any) {
    console.error("Handler error:", error);
    return res.status(500).json({
      message: "Server initialization failed",
      error: error.message,
      details: error.stack,
    });
  }
};
