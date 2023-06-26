// parser - unknown -> structured type

import { z } from "zod";

// validate
export const ArticleInput = z.object({
  title: z.string().min(1),
  body: z.string(),
  description: z.string(),
  tagList: z.array(z.string()),
});
export type ArticleInput = z.infer<typeof ArticleInput>;
export const UpdateArticleInput = ArticleInput.partial();
export type UpdateArticleInput = z.infer<typeof UpdateArticleInput>;
