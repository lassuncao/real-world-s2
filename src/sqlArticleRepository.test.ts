import { Article } from "./article";
import assert from "assert";
import { sqlArticleRepository } from "./sqlArticleRepository";
import { createDb } from "./db";

const db = createDb("postgres://user:secret@localhost:5432/conduit");

describe("In memory article repository", function () {
  beforeEach(async () => {
    await db.deleteFrom("article").execute();
  });

  it("should create articles", async function () {
    const article: Article = {
      id: "200db642-a014-46dc-b678-fc2777b4b301",
      slug: "the-title",
      title: "The title",
      body: "body",
      tagList: ["tag1", "tag2"],
      description: "description",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const repository = sqlArticleRepository(db);

    await repository.create(article);

    const result = await repository.findBySlug("the-title");

    assert.deepStrictEqual(result, article);
  });

  it("should update articles", async function () {
    const article: Article = {
      id: "200db642-a014-46dc-b678-fc2777b4b301",
      slug: "the-title",
      title: "The title",
      body: "body",
      tagList: ["tag1", "tag2"],
      description: "description",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const repository = sqlArticleRepository(db);

    await repository.create(article);
    await repository.update({ ...article, body: "updated body" });

    const result = await repository.findBySlug("the-title");

    assert.deepStrictEqual(result!.body, "updated body");
  });

  it("should return null when article not found", async function () {
    const repository = sqlArticleRepository(db);

    const result = await repository.findBySlug("the-title");

    assert.deepStrictEqual(result, null);
  });
});
