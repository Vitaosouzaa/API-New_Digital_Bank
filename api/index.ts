import { VercelRequest, VercelResponse } from "@vercel/node";

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

    // Dynamically import and use the Express app
    const { default: app } = await import("../src");

    // Use express app as middleware
    return new Promise((resolve, reject) => {
      (app as any).handle(req, res, (err: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(undefined);
        }
      });
    });
  } catch (error: any) {
    console.error("Handler error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
      stack: error.stack,
    });
  }
}
