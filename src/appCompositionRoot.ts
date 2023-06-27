import { createDb } from "./db";
import {
  inMemoryArticlesCompositionRoot,
  sqlArticlesCompositionRoot,
} from "./article/application/articlesCompositionRoot";
import { Config } from "./config";
import { createArticlesRouter } from "./article/api/articlesRouter";

export const appCompositionRoot = (config: Config) => {
  const db = config.DATABASE_URL ? createDb(config.DATABASE_URL) : null;

  const articleDeps = db
    ? sqlArticlesCompositionRoot(db)
    : inMemoryArticlesCompositionRoot();

  const articlesRouter = createArticlesRouter(articleDeps);

  const clean = async () => {
    if (db) {
      await db.deleteFrom("article").execute();
    }
  };

  return { articlesRouter, clean };
};
