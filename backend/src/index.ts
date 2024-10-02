import { Hono } from "hono";
import { cors } from "hono/cors";
import userRouter from "./routes/user";
import { blogRouter } from "./routes/blog";
import { bookmarkRouter } from "./routes/bookmark";
import clapRouter from "./routes/clap";
import { commentRouter } from "./routes/comment";
import { profileRouter } from "./routes/profile";
import { tagRouter } from "./routes/tag";

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
    R2_UPLOAD: R2Bucket;
    R2_SUBDOMAIN_URL: string;
  };
}>();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});
app.use("/*", cors());
app.route("/api/v1/user", userRouter);
app.route("/api/v1/blog", blogRouter);
app.route("/api/v1/bookmark", bookmarkRouter);
app.route("/api/v1/clap", clapRouter);
app.route("/api/v1/comment", commentRouter);
app.route("/api/v1/profile", profileRouter);
app.route("/api/v1/tag", tagRouter);
app.route("/api/v1/clap", clapRouter);

export default app;
