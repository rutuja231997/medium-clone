import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { verify } from "hono/jwt";
import { withAccelerate } from "@prisma/extension-accelerate";

export const commentRouter = new Hono<{
  Bindings: { DATABASE_URL: string; JWT_SECRET: string };
  Variables: {
    userId: string;
  };
}>();

//get comments for as post (unprotected)
commentRouter.get("/post/:postId", async (c) => {
  try {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const postId = c.req.param("postId");
    const page = parseInt(c.req.query("page") || "1");
    const pageSize = parseInt(c.req.query("pageSize") || "10");

    const comments = await prisma.comment.findMany({
      where: {
        postId: postId,
        parentId: null,
      },
      include: {
        user: { select: { id: true, name: true, profilePic: true } },
        children: {
          include: {
            user: { select: { id: true, name: true, profilePic: true } },
            claps: { select: { id: true } },
          },
        },
        claps: { select: { id: true } },
      },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    const totalCount = await prisma.comment.count({
      where: {
        postId: postId,
        parentId: null,
      },
    });

    return c.json({
      comments,
      totalPages: Math.ceil(totalCount / pageSize),
      currentPage: page,
    });
  } catch (error) {
    c.status(500);
    return c.json({ error: "Failed to fetch comments" });
  }
});

//middleware code
commentRouter.use("/*", async (c, next) => {
  try {
    const authHeader = c.req.header("authorization") || "";
    const token = authHeader.split(" ")[1];
    const user = await verify(token, c.env.JWT_SECRET);

    if (user && typeof user.id === "string") {
      c.set("userId", user.id);
      await next();
    } else {
      c.status(403);
      return c.json({ error: "Unauthorized || user is not logged in" });
    }
  } catch (error) {
    c.status(403);
    return c.json({ error: "Credentials failed" });
  }
});

commentRouter.post("/", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  const userId = c.get("userId");

  try {
    const comment = await prisma.comment.create({
      data: {
        message: body.message,
        userId: userId,
        postId: body.postId,
        parentId: body.parentId,
        createdAt: new Date(),
      },
      include: {
        user: { select: { id: true, name: true, profilePic: true } },
      },
    });
    if (comment.message.length === 0) {
      return c.json({ message: "No comments Yet" });
    }
    return c.json(comment);
  } catch (error) {
    c.status(500);
    return c.json({ error: "Failed to create comment" });
  }
});

//update a comment
commentRouter.put("/edit/:id", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const commentId = c.req.param("id");
  const body = await c.req.json();
  const userId = c.get("userId");

  try {
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: { userId: true },
    });

    if (comment?.userId !== userId) {
      c.status(403);
      return c.json({ error: "Unauthorized" });
    }

    const updatedComment = await prisma.comment.update({
      where: { id: commentId },
      data: {
        message: body.message,
      },
    });
    return c.json(updatedComment);
  } catch (error) {
    return c.json({ error: "Failed to update comment" });
  }
});

//Delete a comment
commentRouter.delete("/delete/:id", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const commentId = c.req.param("id");
  const userId = c.get("userId");

  try {
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: { userId: true },
    });

    if (comment?.userId !== userId) {
      c.status(403);
      return c.json({ error: "Unauthorized" });
    }

    const response = await prisma.comment.delete({
      where: { id: commentId },
    });
    return c.json({
      message: "comment deleted successfully",
      //   response: { id: response.id },
      id: response.id,
    });
  } catch (error) {
    return c.json({ error: "Failed to delete comment" });
  }
});

//toggle clap on a comment
commentRouter.post("/clap/:id", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const commentId = c.req.param("id");
  const userId = c.get("userId");

  try {
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: { postId: true },
    });

    if (!comment) {
      c.status(404);
      return c.json({ error: "comment not found yet" });
    }

    const existingClap = await prisma.clap.findFirst({
      where: { userId, commentId },
    });

    if (existingClap) {
      const deleteClap = await prisma.clap.delete({
        where: { id: existingClap.id },
      });
      return c.json({ message: "clap removed", id: deleteClap.id });
    } else {
      const createClap = await prisma.clap.create({
        data: {
          userId: userId,
          commentId: commentId,
          postId: comment.postId,
        },
      });
      return c.json({ message: "create new clap", createClap });
    }
  } catch (error) {
    console.log("Error toggling clap:", error);
    c.status(500);
    return c.json({ error: "error occurred while toggling the clap" });
  }
});
