import { ArticleRepository } from "./article";
import { Kysely } from "kysely";
import { DB } from "./dbTypes";

export const sqlArticleRepository = (db: Kysely<DB>): ArticleRepository => {
  return {
    async create(article) {
      await db.insertInto("article").values(article).execute();
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
      await db.deleteFrom("tags").where("tags.articleId", "=", id);
      if (tagList.length > 0) {
        await db
          .insertInto("tags")
          .values(tagList.map((tag) => ({ name: tag, articleId: id })))
          .execute();
      }
    },
    async findBySlug(slug) {},
  };
};
