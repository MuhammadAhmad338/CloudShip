import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { config } from "./config.js";
import { pool } from "./db/pool.js";
import { errorHandler, notFoundHandler } from "./middleware/errors.js";
import { requireApiKey } from "./middleware/api-key.js";
import activityRouter from "./routes/activity.js";
import deploymentsRouter from "./routes/deployments.js";
import environmentsRouter from "./routes/environments.js";
import projectsRouter from "./routes/projects.js";

export const app = express();

const allowedOrigins = new Set(config.FRONTEND_ORIGIN.split(",").map((origin) => origin.trim()));

app.disable("x-powered-by");
app.use(helmet());
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.has(origin)) {
      callback(null, true);
      return;
    }
    callback(new Error("Origin is not allowed by CORS"));
  },
  methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
app.use(express.json({ limit: "1mb" }));

app.get("/health/live", (_request, response) => {
  response.json({ status: "ok" });
});

app.get("/health/ready", async (_request, response) => {
  await pool.query("SELECT 1");
  response.json({ status: "ready", database: "connected" });
});

const apiRouter = express.Router();
apiRouter.use(rateLimit({ windowMs: 60_000, limit: 120, standardHeaders: "draft-8", legacyHeaders: false }));
apiRouter.use(requireApiKey);
apiRouter.use("/projects", projectsRouter);
apiRouter.use("/deployments", deploymentsRouter);
apiRouter.use("/environments", environmentsRouter);
apiRouter.use("/activity", activityRouter);
app.use("/api", apiRouter);

app.use(notFoundHandler);
app.use(errorHandler);