import { Router } from "express";
import omit from "lodash.omit";
import { NotFoundError } from "./NotFoundError";
import { incrementIdGenerator } from "./incrementIdGenerator";
import { inMemoryArticleRepository } from "./inMemoryArticleRepository";
import { createArticle } from "./createArticle";
import { clock } from "./clock";
import { ArticleInput, UpdateArticleInput } from "./parseArticleInput";
import { updateArticle } from "./updateArticle";
import { sqlArticleRepository } from "./sqlArticleRepository";
import { createDb } from "./db";

export const articlesRouter = Router();
const articleIdGenerator = incrementIdGenerator(String);
const articleRepository = process.env.DATABASE_URL
  ? sqlArticleRepository(createDb(process.env.DATABASE_URL))
  : inMemoryArticleRepository();

articlesRouter.post("/api/articles", async (req, res, next) => {
  // http
  const input = ArticleInput.parse(req.body.article);
  const article = await createArticle(
    articleRepository,
    articleIdGenerator,
    clock
  )(input);
  res.json({ article: omit(article, "id") });
});

articlesRouter.put("/api/articles/:slug", async (req, res, next) => {
  const articleInput = UpdateArticleInput.parse(req.body.article);
  const slug = req.params.slug;
  const article = await updateArticle(articleRepository, clock)(
    slug,
    articleInput
  );
  res.json({ article: omit(article, "id") });
});

articlesRouter.get("/api/articles/:slug", async (req, res, next) => {
  const slug = req.params.slug;

  const existingArticle = await articleRepository.findBySlug(slug);

  if (!existingArticle) {
    throw new NotFoundError(`Article with slug ${slug} does not exist`);
  }
  res.json({ article: omit(existingArticle, "id") });
});
