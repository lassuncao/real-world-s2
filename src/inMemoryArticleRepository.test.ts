import { articleRepositoryContract } from "./articleRepositoryContract.test";
import { inMemoryArticleRepository } from "./inMemoryArticleRepository";

const clean = async () => {};

articleRepositoryContract("in-memory", inMemoryArticleRepository, clean);
