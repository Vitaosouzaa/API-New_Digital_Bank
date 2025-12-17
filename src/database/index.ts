import { DataSource } from "typeorm";
import { User } from "../entities/User";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: "./src/database/db.sqlite",
  entities: [User],
  migrations: ["./src/database/migrations/*.ts"],
});

// Inicialização realizada uma única vez em src/index.ts
