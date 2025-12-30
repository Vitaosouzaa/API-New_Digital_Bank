import { DataSource, DataSourceOptions } from "typeorm";
import { User } from "../entities/User";

const isProduction = process.env.NODE_ENV === "production";

// Configuração para produção (PostgreSQL)
const productionConfig: DataSourceOptions = {
  type: "postgres",
  url: process.env.DATABASE_URL || "",
  ssl: { rejectUnauthorized: false },
  entities: [User],
  migrations: ["./src/database/migrations/*.ts"],
  synchronize: false,
  logging: false,
};

// Configuração para desenvolvimento (SQLite)
const developmentConfig: DataSourceOptions = {
  type: "sqlite",
  database: "./src/database/db.sqlite",
  entities: [User],
  migrations: ["./src/database/migrations/*.ts"],
  synchronize: true,
  logging: true,
};

export const AppDataSource = new DataSource(
  isProduction ? productionConfig : developmentConfig
);
