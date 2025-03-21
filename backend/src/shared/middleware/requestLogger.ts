import { Request, Response, NextFunction } from "express";
import logger from "../core/logger";
import winston from "winston";

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const requestId = Math.random().toString(36).substring(2, 15);
  req.requestId = requestId;
  req.logger = logger.child({ requestId });

  next();
};

export const incomingLogger = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  req.logger.info("Incoming Request", {
    method: req.method,
    originalUrl: req.originalUrl,
    headers: req.headers,
    body: req.body,
    query: req.query,
  });
  next();
};

declare module "express-serve-static-core" {
  interface Request {
    requestId: string;
    logger: winston.Logger;
  }
}
