import { VercelRequest, VercelResponse } from "@vercel/node";
import express from "express";

// Crie uma instância mínima do Express apenas para Vercel
const app = express();
app.use(express.json());

// Import routes
import "../src/routes";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,OPTIONS,PATCH,DELETE,POST,PUT"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization"
  );

  // Handle preflight request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    // Health check
    if (req.url === "/" || req.url === "/api") {
      return res.status(200).json({
        message: "API is running!",
        timestamp: new Date().toISOString(),
        method: req.method,
        url: req.url,
      });
    }

    // Debug endpoint
    if (req.url === "/api/debug" || req.url === "/debug") {
      return res.status(200).json({
        message: "Debug info",
        env: {
          hasDbUrl: !!process.env.DATABASE_URL,
          hasJwtSecret: !!process.env.JWT_SECRET,
          nodeEnv: process.env.NODE_ENV || "production",
        },
        request: {
          method: req.method,
          url: req.url,
        },
      });
    }

    // Roteie manualmente para as rotas da sua API
    const { UserController } = await import(
      "../src/controllers/UserController"
    );
    const userController = new UserController();

    if (req.url?.startsWith("/user") || req.url?.startsWith("/api/user")) {
      switch (req.method) {
        case "POST":
          return userController.createUser(req as any, res as any);
        case "GET":
          return userController.getUser(req as any, res as any);
        case "DELETE":
          return userController.deleteUser(req as any, res as any);
        default:
          return res.status(405).json({ message: "Method not allowed" });
      }
    }

    return res.status(404).json({ message: "Route not found" });
  } catch (error: any) {
    console.error("Handler error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
}
