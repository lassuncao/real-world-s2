import { ArticleRepository } from "../domain/article";
import { Kysely } from "kysely";
import { DB } from "../../dbTypes";

export const sqlArticleRepository = (db: Kysely<DB>): ArticleRepository => {
  return {
    async create(article) {
      const { tagList, ...cleanArticle } = article;
      await db.insertInto("article").values(cleanArticle).execute();
      if (article.tagList.length > 0) {
        await db
          .insertInto("tags")
          .values(
            article.tagList.map((tag) => ({ name: tag, articleId: article.id }))
          )
          .execute();
      }
    },
    async update({ title, slug, updatedAt, body, description, id, tagList }) {
      await db
        .updateTable("article")
        .set({ title, slug, updatedAt, body, description })
        .where("article.id", "=", id)
        .execute();
      // delete old tags, recrete new tags
      await db.deleteFrom("tags").where("tags.articleId", "=", id).execute();
      if (tagList.length > 0) {
        await db
          .insertInto("tags")
          .values(tagList.map((tag) => ({ name: tag, articleId: id })))
          .execute();
      }
    },
    async findBySlug(slug) {
      const article = await db
        .selectFrom("article")
        .where("slug", "=", slug)
        .selectAll()
        .executeTakeFirst();
      if (!article) return null;
      const tags = await db
        .selectFrom("tags")
        .where("tags.articleId", "=", article.id)
        .select(["tags.name"])
        .execute();
      return {
        ...article,
        tagList: tags.map((item) => item.name),
      };
    },
  };
};
