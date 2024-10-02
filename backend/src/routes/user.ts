import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { sign } from "hono/jwt";
import { signinInput, signupInput } from "@rutuja231997/medium-clone";

const userRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
}>();

userRouter.post("/signup", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();
  const { success } = signupInput.safeParse(body);
  if (!success) {
    c.status(411);
    return c.json({ message: "Input are not correct" });
  }
  try {
    const email = body.email;
    const pen = `@${email.split("@")[0]}`;

    const user = await prisma.user.create({
      data: {
        name: body.name,
        penName: pen,
        email: body.email,
        password: body.password,
        creationDate: new Date(),
      },
    });
    const token = await sign(
      { id: user.id, penName: user.penName },
      c.env.JWT_SECRET
    );
    console.log("Database URL:", c.env.DATABASE_URL);
    return c.json({
      jwt: token,
      message: "Sign up successful...!!!",
      user: { id: user.id, penName: user.penName, name: user.name },
    });
  } catch (e) {
    c.status(403);
    return c.json({ error: "Already user existed...!!!" });
  }
});

userRouter.post("/signin", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.json();

  const success = signinInput.safeParse(body);
  if (!success) {
    c.status(411);
    return c.json({
      message: "Inputs are not correct",
    });
  }
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: body.email,
        password: body.password,
      },
    });

    if (!user) {
      c.status(403);
      return c.json({ error: "user not found" });
    }

    const token = await sign(
      { id: user.id, penName: user.penName },
      c.env.JWT_SECRET
    );
    c.status(200);
    return c.json({
      message: "Sign in successful...",
      jwt: token,
      user: { id: user.id, penName: user.penName, name: user.name },
    });
  } catch (e) {
    console.log(e);
    c.status(411);
    return c.json({ error: "Inputs aren't correct...!!!" });
  }
});

export default userRouter;
