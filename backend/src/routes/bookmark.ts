import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { verify } from "hono/jwt";

export const bookmarkRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: string;
    userPenName: string;
  };
}>();

bookmarkRouter.use("/*", async (c, next) => {
  try {
    const authHeader = c.req.header("authorization") || "";
    const token = authHeader.split(" ")[1];
    const user = await verify(token, c.env.JWT_SECRET);

    if (
      user &&
      typeof user.id === "string" &&
      typeof user.penName === "string"
    ) {
      c.set("userId", user.id);
      c.set("userPenName", user.penName);
      return next();
    } else {
      c.status(403);
      return c.json({ message: "Unauthorized.." });
    }
  } catch (error) {
    c.status(403);
    return c.json({ message: "Credential failed" });
  }
});

bookmarkRouter.get("/me/lists", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const userId = c.req.header("userId");

  if (!userId) {
    c.status(403);
    return c.json({ error: "Invalid user id" });
  }

  try {
    const bookmarks = await prisma.bookmark.findMany({
      where: {
        userId: userId,
      },
      include: {
        posts: {
          select: {
            id: true,
            title: true,
            content: true,
            publishedDate: true,
            published: true,
            bookmarks: true,
            author: {
              select: {
                id: true,
                user: {
                  select: { name: true },
                },
              },
            },
          },
        },
      },
    });
    return c.json({
      payload: bookmarks.map((bookmark) => bookmark.posts),
      bookmarks,
      message: "All posts bookmarked by user",
    });
  } catch (error) {
    console.log("Error while fetching bookmarks:", error);
    // return c.status(500)({ error: "Internal server error" });
    c.status(500);
    return c.json({ error: "Internal Server Error" });
  }
});

bookmarkRouter.post("/", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  const userId = c.get("userId");
  const postId = body.postId;
  const userPenName = c.get("userPenName");

  if (!userId || !postId) {
    c.status(400);
    return c.json({
      message: "Inputs incorrect",
    });
  }

  try {
    const post = await prisma.post.findUnique({
      where: { id: postId },
      select: { authorPenName: true },
    });

    if (!post) {
      return c.json({ error: "Post not found..!" });
    }
    if (post.authorPenName === userPenName) {
      return c.json({ message: "User can not bookmark their own post" }, 400);
    }

    const existingBookmark = await prisma.bookmark.findUnique({
      where: {
        userId_postId: {
          userId: userId,
          postId: postId,
        },
      },
    });

    if (!existingBookmark) {
      const newBookmark = await prisma.bookmark.create({
        data: {
          userId: userId,
          postId: postId,
          createdAt: new Date(),
        },
      });
      return c.json({
        newBookmark: {
          id: newBookmark.id,
          hasBookmarked: newBookmark.hasBookmarked,
          bookmarkCount: newBookmark.bookmarkCount,
        },
        message: "Blog bookmarked successfully..!",
      });
    } else {
      const deleteBookmark = await prisma.bookmark.delete({
        where: {
          id: existingBookmark.id,
        },
      });
      return c.json({
        message: "bookmark deleted on post",
        deleteBookmark: { id: deleteBookmark.id },
      });
    }
  } catch (error) {
    console.log("Error while posting bookmark", error);
    c.status(500);
    return c.json({ error: "Internal server error" });
  }
});

bookmarkRouter.get("/:postId/hasBookmarked", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const postId = c.req.param("postId");
  const userId = c.get("userId");

  if (!postId) {
    return c.json({ message: "post id is required" }, 400);
  }

  try {
    const existingBookmark = await prisma.bookmark.findUnique({
      where: {
        userId_postId: {
          userId: userId,
          postId: postId,
        },
      },
    });
    const hasBookmarkStatus = existingBookmark
      ? existingBookmark.hasBookmarked
      : false;
    const bookmarkCount = await prisma.bookmark.count({
      where: { postId: postId },
    });

    return c.json(
      {
        hasBookmarkStatus: hasBookmarkStatus,
        bookmarkCount: bookmarkCount,
      },
      200
    );
  } catch (ex) {
    console.log("error while checking if user bookmarked a blog", ex);
    return c.json(
      { message: "error while checking if user bookmarked a blog" },
      500
    );
  }
});

bookmarkRouter.delete("/delete/:id", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const userId = c.get("userId");
  const bookmarkId = c.req.param("id");

  if (!userId || !bookmarkId) {
    c.status(400);
    return c.json({
      message: "Inputs incorrect",
    });
  }

  try {
    const bookmark = await prisma.bookmark.delete({
      where: {
        id: bookmarkId,
      },
    });
    return c.json({
      bookmark: { id: bookmark.id },
      message: "bookmark successfully deleted...",
    });
  } catch (error) {
    console.log("error while deleting bookmark", error);
    c.status(500);
    return c.json({ error: "something went wrong" });
  }
});
