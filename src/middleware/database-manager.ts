import { createMiddleware } from "hono/factory";
import { type Context } from "hono";
import { getSignedCookie, setSignedCookie } from "hono/cookie";
import { TIGERGRAPH_TOKEN_NAME, COOKIE_OPTIONS } from "../constants";
import { requestTgToken } from "../db/tigergraph-driver";

export const databaseManagerMiddleware = createMiddleware(async (c: Context, next) => {
  try {
    // Check if a TigerGraph token exists in the cookies.
    // NOTE: `getSignedCookie` will return `false` for a specified cookie if the signature was tampered with or is invalid. TODO: I need to test what happens if the cookie has been tampered with.
    const tgToken = await getSignedCookie(c, c.env.TOKEN_ENCRYPTION_SECRET, TIGERGRAPH_TOKEN_NAME);
    // If the tgToken exists, then set it on the context object.
    if (tgToken) {
      c.set("tgToken", tgToken);
      await next();
    }
    // If a tgToken does not exist in the cookies, then request a token from TigerGraph and set it as a signed cookie.
    else {
      const response = await requestTgToken(c.env.TIGERGRAPH_DOMAIN, c.env.TIGERGRAPH_SECRET);
      const stringifiedCookieValue = response.token;
      await setSignedCookie(c, TIGERGRAPH_TOKEN_NAME, stringifiedCookieValue, c.env.TOKEN_ENCRYPTION_SECRET, COOKIE_OPTIONS);
      // Set the tgToken on the context object.
      c.set("tgToken", response.token);
      await next();
    }
  }
  catch (err) {
    console.error(err);
    return c.json({
      "message": `databaseManagerMiddleware ERROR: ${err}`
    });
  }
});
