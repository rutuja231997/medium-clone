import { Hono } from "hono";
import { verify } from "hono/jwt";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";

export const profileRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
    R2_UPLOAD: R2Bucket;
    R2_SUBDOMAIN_URL: string;
  };
  Variables: {
    userId: string;
    userPenName: string;
  };
}>();

profileRouter.use("/*", async (c, next) => {
  try {
    const authHeader = c.req.header("authorization") || "";
    const token = authHeader && authHeader.split(" ")[1];
    const user = await verify(token, c.env.JWT_SECRET);

    if (
      user &&
      typeof user.penName === "string" &&
      typeof user.id === "string"
    ) {
      c.set("userPenName", user.penName);
      c.set("userId", user.id);
      await next();
    } else {
      c.status(403);
      return c.json({ message: "You are not logged in || Unauthorized" });
    }
  } catch (ex) {
    c.status(403);
    return c.json({ message: "You are not logged in || Credentials failed" });
  }
});

// how to @ in api solution
// const userId = c.req.param("id").startsWith("@")
//   ? c.req.param("id").slice(1)
//   : c.req.param("id");

profileRouter.get("/user/:penName", async (c) => {
  const userPenName = c.req.param("penName");
  const authorPenName = c.get("userPenName");

  if (userPenName !== authorPenName) {
    c.status(401);
    return c.json({
      message: "user is not authenticated",
    });
  }

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const user = await prisma.user.findUnique({
      where: { penName: userPenName },
      select: {
        id: true,
        name: true,
        penName: true,
        email: true,
        password: true,
        postCount: true,
        creationDate: true,
        details: true,
        profilePic: true,
        posts: {
          select: {
            id: true,
            title: true,
            content: true,
            publishedDate: true,
            published: true,
            author: {
              select: {
                id: true,
                penName: true,
                user: {
                  select: {
                    name: true,
                  },
                },
              },
            },
          },
        },
        topic: {
          select: {
            id: true,
            topicName: true,
            createdAt: true,
          },
        },
      },
    });

    if (!user) {
      c.status(404);
      return c.json({
        message: "user not found",
      });
    }
    return c.json({
      user,
      isAuthorizedUser: userPenName === authorPenName,
      message: "Found user",
    });
  } catch (e) {
    c.status(411);
    return c.json({
      message: "user not found",
    });
  }
});

// authorProfile api
profileRouter.get("/author/:penName", async (c) => {
  const userPenName = c.req.param("penName");

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const author = await prisma.author.findUnique({
      where: { penName: userPenName },
      select: {
        id: true,
        penName: true,
        creationDate: true,
        postCount: true,
        user: {
          select: {
            name: true,
            email: true,
            details: true,
            profilePic: true,
            creationDate: true,
          },
        },
        posts: {
          select: {
            id: true,
            title: true,
            content: true,
            publishedDate: true,
            published: true,
            author: {
              select: {
                id: true,
                penName: true,
                postCount: true,
                user: {
                  select: {
                    name: true,
                  },
                },
              },
            },
            claps: { select: { id: true, clapCount: true, hasLiked: true } },
            bookmarks: {
              select: { id: true, hasBookmarked: true, bookmarkCount: true },
            },
          },
        },
      },
    });
    return c.json({
      author: author,
      message: "author details successfully fetched...!!!",
    });
  } catch {
    return c.json({
      message: "error while fetching author details...!!!",
    });
  }
});

profileRouter.put("/updateDetails/:penName", async (c) => {
  const penName = c.req.param("penName");
  try {
    const body = await c.req.parseBody();
    const { name, details } = body;
    const profilePic = body["profilePic"];

    if (!name || !details || !profilePic) {
      return c.json({ message: "Name, details, and file are required" }, 400);
    }

    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    if (profilePic instanceof File) {
      const uploadedFile = await c.env.R2_UPLOAD.put(
        profilePic.name,
        profilePic
      );
      const file_Url = `${c.env.R2_SUBDOMAIN_URL}/${uploadedFile?.key}`;

      const user = await prisma.user.update({
        where: { penName: penName },
        data: {
          name: name.toString(),
          details: details.toString(),
          profilePic: file_Url,
        },
      });

      return c.json({
        user: {
          name: user.name,
          details: user.details,
          profilePic: user.profilePic,
        },
      });
    } else {
      return c.json({ message: "Invalid file upload" }, 400);
    }
  } catch (ex) {
    console.log(ex);
    return c.json(
      { message: "An error occurred while updating the profile" },
      500
    );
  }
});

profileRouter.get("/authors", async (c) => {
  // const userPenName = c.get("userPenName");
  // const authorPenName = c.get("userPenName");

  // if (userPenName === authorPenName) {
  //   c.status(401);
  //   return c.json({
  //     error: "user can't display own blogs in staff picks",
  //   });
  // }

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const page = parseInt(c.req.query("page") || "1");
  const limit = parseInt(c.req.query("limit") || "3");

  try {
    const authors = await prisma.author.findMany({
      take: limit,
      select: {
        id: true,
        penName: true,
        postCount: true,
        user: {
          select: {
            name: true,
            penName: true,
            details: true,
            profilePic: true,
            creationDate: true,
          },
        },
        posts: {
          select: {
            id: true,
            title: true,
            content: true,
            publishedDate: true,
            published: true,
            author: {
              select: {
                id: true,
                penName: true,
                postCount: true,
                user: {
                  select: {
                    name: true,
                  },
                },
              },
            },
            claps: { select: { id: true, clapCount: true, hasLiked: true } },
            bookmarks: {
              select: { id: true, hasBookmarked: true, bookmarkCount: true },
            },
          },
        },
      },
    });

    return c.json({
      authors: authors,
      page,
      limit,
      message: "authors details successfully accessed",
    });
  } catch (ex) {
    return c.json(
      {
        error: "error while fetching authors details...!!!",
      },
      411
    );
  }
});
