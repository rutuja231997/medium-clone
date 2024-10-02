import { Hono } from "hono";
import { verify } from "hono/jwt";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";

export const tagRouter = new Hono<{
  Bindings: { DATABASE_URL: string; JWT_SECRET: string };
  Variables: { userId: string; userPenName: string };
}>();

tagRouter.use("/*", async (c, next) => {
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
      return c.json({ message: "Your are not logged in || Unauthorized" });
    }
  } catch (ex) {
    c.status(403);
    return c.json({ message: "Credentials failed" });
  }
});

tagRouter.post("/select-topics", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  const userId = c.get("userId");
  const selectedTopics = body.topicName;

  try {
    if (!Array.isArray(selectedTopics) || selectedTopics.length < 3) {
      return c.json({ error: "Please select at least 3 topics" }, 400);
    }

    // Check if the user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return c.json({ error: "User not found" }, 404);
    }

    const existingTopics = await prisma.topic.findMany({
      where: { topicName: { in: selectedTopics } },
    });

    const existingTopicNames = existingTopics.map((t) => t.topicName);
    const newTopicNames = selectedTopics.filter(
      (topic: string) => !existingTopicNames.includes(topic)
    );

    //create new topics if necessary
    const newTopics = await prisma.$transaction(
      newTopicNames.map((name: string) =>
        prisma.topic.create({
          data: {
            topicName: name,
            createdAt: new Date(),
            user: {
              connect: { id: userId },
            },
          },
        })
      )
    );

    const topicsToAssociate = [...existingTopics, ...newTopics];

    const userTopics = await prisma.$transaction(
      topicsToAssociate.map((topic) =>
        prisma.userTopic.upsert({
          where: { userId_topicId: { userId: userId, topicId: topic.id } },
          create: { userId: userId, topicId: topic.id },
          update: {}, //do nothing if it already exist
        })
      )
    );

    return c.json({
      message: "Topics successfully associated with the user",
      topics: topicsToAssociate,
      userTopics: userTopics,
    });
  } catch (ex) {
    console.log(ex);
    c.status(403);
    return c.json({ error: "could not save selected topics", message: ex });
  }
});

tagRouter.get("/user-topics", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const userId = c.get("userId");

  try {
    const UserTopics = await prisma.userTopic.findMany({
      where: { userId: userId },
      include: { topic: true, user: true },
    });

    return c.json({
      message: "successfully fetched user's selected topics",
      UserTopics,
    });
  } catch (ex) {
    return c.json({
      message: "Error while fetching user's selected topics",
      error: ex,
    });
  }
});
