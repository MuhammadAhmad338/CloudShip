import { timingSafeEqual } from "node:crypto";
import type { RequestHandler } from "express";
import { config } from "../config.js";

export const requireApiKey: RequestHandler = (request, response, next) => {
  const authorization = request.header("authorization");
  const suppliedKey = authorization?.startsWith("Bearer ") ? authorization.slice(7) : "";
  const expected = Buffer.from(config.API_KEY);
  const received = Buffer.from(suppliedKey);

  if (expected.length !== received.length || !timingSafeEqual(expected, received)) {
    response.status(401).json({ error: "Unauthorized" });
    return;
  }

  next();
};