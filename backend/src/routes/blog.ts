import { Hono } from "hono";
import { verify } from "hono/jwt";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { createBlogInput, updateBlogInput } from "@rutuja231997/medium-clone";

export const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    userId: string;
    userPenName: string;
  };
}>();

blogRouter.use("/*", async (c, next) => {
  //get the header
  //verify the header
  //if the header is correct, we need can proceed
  //if not, we return the user a 403 status code
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

      return c.json({ message: "You are not logged in || Unauthorized" });
    }
  } catch (e) {
    c.status(403);
    return c.json({ message: "You are not logged in || Credentials failed" });
  }
});

blogRouter.post("/saveDraft", async (c) => {
  const body = await c.req.json();
  const userId = c.get("userId");
  const userPenName = c.get("userPenName");

  //signup zod authentication
  const { success } = createBlogInput.safeParse(body);
  if (!success) {
    c.status(411);
    return c.json({ message: "inputs are not correct" });
  }

  if (!userId) {
    return c.json({ message: "user id not found" }, 411);
  }

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const existingAuthor = await prisma.author.findUnique({
      where: { userId: userId },
    });

    let author;
    if (!existingAuthor) {
      author = await prisma.author.create({
        data: {
          userId: userId,
          creationDate: new Date(),
          penName: userPenName,
        },
      });
    } else {
      author = existingAuthor;
    }

    // Check if a draft with the same title and authorPenName already exists

    const blog = await prisma.post.create({
      data: {
        title: body.title || "",
        content: body.content || "",
        authorPenName: userPenName,
        userPenName: userPenName,
        published: false,
        publishedDate: new Date(),
      },
    });

    return c.json({
      blog: { id: blog.id, title: blog.title, content: blog.content },
      message: "Draft successfully created...!!!",
    });
  } catch (ex) {
    c.status(500);
    return c.json({ message: "error while saving draft...!!!", ex });
  }
});

blogRouter.post("/", async (c) => {
  const body = await c.req.json();
  const userId = c.get("userId");
  const userPenName = c.get("userPenName");

  //signup zod authentication
  const { success } = createBlogInput.safeParse(body);
  if (!success) {
    c.status(411);
    return c.json({
      message: "Inputs are not correct",
    });
  }

  if (!userId) {
    return c.json({ message: "user id not found" }, 411);
  }

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const existingAuthor = await prisma.author.findUnique({
      where: { userId: userId },
    });

    let author;
    if (!existingAuthor) {
      author = await prisma.author.create({
        data: {
          userId: userId,
          creationDate: new Date(),
          penName: userPenName,
        },
      });
    } else {
      author = existingAuthor;
    }

    const topic = await prisma.topic.upsert({
      where: { topicName: body.topicName },
      update: {},
      create: {
        topicName: body.topicName,
        userId: userId,
        createdAt: new Date(),
      },
    });

    const blog = await prisma.$transaction([
      prisma.post.create({
        data: {
          title: body.title,
          content: body.content,
          topicName: topic.topicName || null,
          authorPenName: userPenName,
          userPenName: userPenName,
          published: true,
          publishedDate: new Date(),
        },
      }),

      prisma.user.update({
        where: { id: userId },
        data: {
          postCount: {
            increment: 1,
          },
        },
      }),

      prisma.author.update({
        where: { userId: userId },
        data: {
          postCount: {
            increment: 1,
          },
        },
      }),
    ]);

    return c.json({
      id: blog[0].id,
    });
  } catch (e) {
    let errorMessage = "Unknown error";
    if (e instanceof Error) {
      errorMessage = e.message;
    } else if (typeof e === "string") {
      errorMessage = e;
    } else if (typeof e === "object" && e !== null) {
      errorMessage = JSON.stringify(e);
    }

    console.error("Error in blog creation:", errorMessage);
    c.status(500);
    return c.json({ error: "Internal Server Error", details: errorMessage });
  }
});

blogRouter.put("/edit/:id", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const userPenName = c.get("userPenName");
  const userId = c.get("userId");
  const id = c.req.param("id");

  const body = await c.req.json();

  //signup zod authentication
  const { success } = updateBlogInput.safeParse(body);

  if (!success) {
    c.status(411);
    return c.json({
      message: "Inputs are not correct",
    });
  }

  const existingPost = await prisma.post.findUnique({
    where: { id: id },
    select: {
      authorPenName: true,
    },
  });
  if (!existingPost) {
    c.status(411);
    return c.json({ error: "Post not found...!!!" });
  }

  if (userPenName !== existingPost.authorPenName) {
    c.status(403);
    return c.json({ message: "You are not authorized to edit this post" });
  }

  const topic = await prisma.topic.upsert({
    where: { topicName: body.topicName },
    update: {},
    create: {
      topicName: body.topicName,
      createdAt: new Date(),
      userId: userId,
    },
  });

  const blog = await prisma.post.update({
    where: {
      id: id,
    },
    data: {
      title: body.title,
      content: body.content,
      topicName: topic.topicName || null,
      publishedDate: new Date(),
      published: true,
    },
  });

  return c.json({ id: blog.id });
});

blogRouter.get("/blogs", async (c) => {
  try {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const page = parseInt(c.req.query("page") || "1");
    const limit = parseInt(c.req.query("limit") || "30");
    const topicName = c.req.query("topicName");

    const skip = (page - 1) * limit;

    const whereClause = {
      published: true,
      ...(topicName && { topicName }),
    };

    const blogs = await prisma.post.findMany({
      skip,
      take: limit,
      where: whereClause,
      select: {
        id: true,
        title: true,
        content: true,
        publishedDate: true,
        published: true,
        topicName: true,
        author: {
          select: {
            id: true,
            penName: true,
            creationDate: true,
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
        authorPenName: true,
        claps: {
          select: {
            id: true,
            hasLiked: true,
            clapCount: true,
          },
        },
        bookmarks: {
          select: {
            id: true,
            hasBookmarked: true,
            bookmarkCount: true,
          },
        },
      },
    });

    const totalBlogs = await prisma.post.count({
      where: whereClause,
    });

    const totalPages = Math.ceil(totalBlogs / limit);

    if (blogs.length > 0) {
      return c.json({ blogs, page, limit, totalBlogs, totalPages });
    } else {
      return c.json({
        blogs: [],
        message: topicName
          ? `No blogs found for the topic: ${topicName}`
          : "No blogs found",
      });
    }
  } catch (e) {
    return c.json({
      blogs: [],
      message: "Error fetching blogs",
      error: e,
    });
  }
});

//blog delete api
blogRouter.delete("/delete/:id", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const postId = c.req.param("id");
  const userPenName = c.get("userPenName");
  const userId = c.get("userId");

  const existingPost = await prisma.post.findUnique({
    where: { id: postId },
    select: {
      authorPenName: true,
    },
  });

  if (!existingPost) {
    c.status(411);
    return c.json({ error: "Post not found...!!!" });
  }

  if (userPenName !== existingPost.authorPenName) {
    c.status(403);
    return c.json({
      error: "You are not authenticated user to delete this post...!!!",
    });
  }

  // const blog = await prisma.post.delete({
  //   where: {
  //     id: postId,
  //   },
  // });

  const blog = await prisma.$transaction([
    prisma.post.delete({
      where: { id: postId },
    }),

    prisma.user.update({
      where: { id: userId },
      data: {
        postCount: {
          decrement: 1,
        },
      },
    }),

    prisma.author.update({
      where: { userId: userId },
      data: {
        postCount: {
          decrement: 1,
        },
      },
    }),
  ]);

  return c.json({
    message: "blog post successfully deleted...!",
    blog: { id: blog[0] },
  });

  //zod authentication
});

blogRouter.get("/recommended-blogs", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const userId = c.req.header("userId");
  const userPenName = c.req.header("userPenName");

  if (!userId) {
    return c.json({ error: "User ID is required" });
  }

  try {
    //get topics the user is interested in
    const userTopics = await prisma.userTopic.findMany({
      where: { userId: userId },
      include: { topic: true },
    });

    const topic = userTopics.map((ut) => ut.topic);

    const topicName = topic.map((t) => t.topicName);

    //get posts related to these topics
    const recommendedBlogs = await prisma.post.findMany({
      where: {
        topicName: { in: topicName },
        published: true,
        authorPenName: { not: userPenName },
      },
      include: {
        topic: true,
        author: { include: { user: true } },
        claps: true,
        bookmarks: true,
      },
      orderBy: { publishedDate: "desc" },
    });
    c.status(200);
    return c.json({
      message: "successfully fetched recommended blogs..!!!",
      recommendedBlogs: recommendedBlogs,
    });
  } catch (ex) {
    return c.json({ message: "Failed to fetch recommended blogs" }, 500);
  }
});

blogRouter.get("/:id", async (c) => {
  const id = c.req.param("id");
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const blog = await prisma.post.findFirst({
      where: {
        id: id,
      },
      select: {
        id: true,
        title: true,
        content: true,
        publishedDate: true,
        author: {
          select: {
            id: true,
            user: {
              select: {
                name: true,
              },
            },
          },
        },
        claps: {
          select: {
            id: true,
            hasLiked: true,
            clapCount: true,
          },
        },
        bookmarks: {
          select: {
            id: true,
            hasBookmarked: true,
            bookmarkCount: true,
          },
        },
      },
    });

    return c.json({
      blog,
    });
  } catch (e) {
    c.status(411); // 4
    return c.json({
      message: "Error while fetching blog post",
    });
  }
});
