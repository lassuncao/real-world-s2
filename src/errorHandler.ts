import { ErrorRequestHandler, RequestHandler } from "express";
import { NotFoundError } from "./NotFoundError";
import { ZodError } from "zod";

export const notFoundHandler: RequestHandler = (req, res, next) => {
  throw new NotFoundError();
};

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof NotFoundError) {
    return res.status(404).json({ errors: err.message });
  }
  if (err instanceof ZodError) {
    return res.status(422).json({ errors: err.errors });
  }
  console.error(err);
  res.sendStatus(500);
};
