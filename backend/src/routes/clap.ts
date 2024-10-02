import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { verify } from "hono/jwt";

const clapRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: string;
    userPenName: string;
  };
}>();

clapRouter.use("/*", async (c, next) => {
  try {
    const authHeader = c.req.header("authorization") || "";
    const token = authHeader && authHeader.split(" ")[1];
    const user = await verify(token, c.env.JWT_SECRET);

    if (
      user &&
      typeof user.id === "string" &&
      typeof user.penName === "string"
    ) {
      c.set("userId", user.id);
      c.set("userPenName", user.penName);
      await next();
    } else {
      c.status(403);
      return c.json({ message: "Unauthorized || user is not logged in" });
    }
  } catch (error) {
    c.status(403);
    return c.json({
      message: "Credentials failed",
    });
  }
});

clapRouter.post("/", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const body = await c.req.json();
    const userId = c.get("userId");
    const postId = body.postId;
    const userPenName = c.get("userPenName");
    const MAX_CLAPS = 49;

    if (!userId || !postId) {
      return c.json({ message: "Inputs incorrect" }, 400);
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { authorPenName: true },
    });

    if (!post) {
      return c.json({ error: "Post not found" }, 404);
    }

    if (post.authorPenName === userPenName) {
      return c.json({ message: "users can not like own post" }, 400);
    }

    const existingClap = await prisma.clap.findMany({
      where: { userId: userId, postId: postId },
    });

    if (existingClap.length <= MAX_CLAPS) {
      const newClap = await prisma.clap.create({
        data: {
          userId: userId,
          postId: postId,
          createdAt: new Date(),
        },
      });

      return c.json({
        newClap: { id: newClap.id, clapCount: newClap.clapCount },
      });
    } else {
      c.status(400);
      return c.json({ message: "user like a post limit is exceed" });
    }
  } catch (ex) {
    console.log("Error occurred while posting clap", ex);
    return c.json({ error: "Internal server error" }, 500);
  }
});

clapRouter.get("/:postId/hasLiked", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const postId = c.req.param("postId");
  const userId = c.get("userId");

  try {
    if (!postId) {
      c.status(400);
      return c.json({ message: "post id is required" });
    }

    const existingClap = await prisma.clap.findFirst({
      where: { userId: userId, postId: postId },
    });

    // const hasLikedStatus = !!existingClap;
    const hasLikedStatus = existingClap ? true : false;

    const clapCount = await prisma.clap.count({
      where: { postId: postId },
    });

    return c.json({
      hasLikedStatus,
      clapCount,
      message: "hasLiked status and totalClapCount is return...",
    });
  } catch (ex) {
    console.log("Error checking if user liked the blog", ex);
    return c.json({ message: "Error checking if user liked the blog" }, 500);
  }
});

export default clapRouter;
