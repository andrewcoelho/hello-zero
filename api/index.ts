import { Hono } from "hono";
import { setCookie, getCookie } from "hono/cookie";
import { handle } from "hono/vercel";
import { SignJWT } from "jose";

export const config = {
  runtime: "edge",
};

export const app = new Hono().basePath("/api");

// See seed.sql
// In real life you would of course authenticate the user however you like.
const userIDs = [
  "6z7dkeVLNm",
  "ycD76wW4R2",
  "IoQSaxeVO5",
  "WndZWmGkO4",
  "ENzoNm7g4E",
  "dLKecN3ntd",
  "7VoEoJWEwn",
  "enVvyDlBul",
  "9ogaDuDNFx",
];

function randomInt(max: number) {
  return Math.floor(Math.random() * max);
}

app.get("/login", async (c) => {
  const userID = userIDs[randomInt(userIDs.length)];

  setCookie(c, "sessionUserID", userID, {
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });

  return c.json({ userID: userID });
});

app.get("/token", async (c) => {
  const userID = getCookie(c, "sessionUserID");

  if (!userID) {
    return c.json({ error: "No session user ID" }, 401);
  }

  const jwtPayload = {
    sub: userID,
    iat: Math.floor(Date.now() / 1000),
  };

  const jwt = await new SignJWT(jwtPayload)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("1m")
    .sign(new TextEncoder().encode(must(process.env.ZERO_AUTH_SECRET)));

  return c.json({ jwt: jwt });
});

export default handle(app);

function must<T>(val: T) {
  if (!val) {
    throw new Error("Expected value to be defined");
  }
  return val;
}
