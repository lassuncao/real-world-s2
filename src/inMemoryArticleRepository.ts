import { Article, ArticleId, Slug } from "./article";


type X = ReturnType<typeof inMemoryArticleRepository>;

export const inMemoryArticleRepository = () => {
  const articles: Record<ArticleId, Article> = {};

  return {
    async create(article: Article): Promise<void> {
      articles[article.id] = article;
    },
    async update(article: Article): Promise<void> {
      articles[article.id] = article;
    },
    async findBySlug(slug: Slug): Promise<Article | null> {
      const article = Object.values(articles).find(
        (article) => article.slug === slug
      );
      return article ?? null;
    },
  };
};
