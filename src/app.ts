import express from "express";
import cors from "cors";
import { createArticlesRouter } from "./articlesRouter";
import { errorHandler, notFoundHandler } from "./errorHandler";
import { Config } from "./config";
import { createDb } from "./db";
import {
  inMemoryArticlesCompositionRoot,
  sqlArticlesCompositionRoot,
} from "./articlesCompositionRoot";

export const createApp = (config: Config) => {
  const app = express();
  app.use(cors());
  app.use(express.json());

  const db = config.DATABASE_URL ? createDb(config.DATABASE_URL) : null;
  const articleDeps = db
    ? sqlArticlesCompositionRoot(db)
    : inMemoryArticlesCompositionRoot();
  app.use(createArticlesRouter(articleDeps));

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
