import "reflect-metadata";
import { DataSource } from "typeorm";
import logger from "./logger";
import { UserEntity } from "../entity/userEntity";

class Database {
  private readonly _AppDataSource: DataSource;

  constructor() {
    this._AppDataSource = new DataSource({
      type: "postgres",
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT ?? "5432"),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      migrations: [`${process.cwd()}/migration/*.ts`],
      entities: [UserEntity],
    });
  }

  get AppDataSource() {
    return this._AppDataSource;
  }

  connect() {
    this._AppDataSource
      .initialize()
      .then(() => {
        logger.info("Database connection successful");
      })
      .catch((err) => {
        logger.error("Database connection error", err);
      });
  }
}

const db = new Database();
db.connect();
export const AppDataSource = db.AppDataSource;
