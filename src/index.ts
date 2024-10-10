import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { databaseManagerMiddleware } from "./middleware";
import usersRoutes from "./routes/users";

export type Bindings = {
  Variables: {
    // Variable bindings go here:
    // DB: D1Database
  },
}

const api = new Hono<{ Bindings: Bindings }>();

// -----------------------------
// NOTES ABOUT cors() MIDDLEWARE:
// -----------------------------
// In production deployments, the frontend will send requests from "https://my-production-app.com".
// In preview deployments, the frontend will send requests from "https://some-random-id.tigergraph-ui-client.pages.dev".
// This is why the origin function checks for origins that end with ".tigergraph-ui-client.pages.dev". and then defaults to the "https://my-production-app.com".
// All requests (for both production and preview deployments) are sent to the same backend URL (e.g. "https://api.my-production-app.com"). So make sure to add `my-production-app.com` as a custom domain in Cloudflare Pages and `api.my-production-app.com` as a custom domain in Cloudflare Workers, otherwise you will get CORS errors.
// Cloudflare Pages: "cloudflare.com" >> "Workers & Pages" >> Select the name of your Pages project >> "Custom Domains"
// Cloudflare Workers: "cloudflare.com" >> "Workers & Pages" >> Select the name of your worker >> "Settings" >> "Triggers" >> "Custom Domains"

const apiRoutes = api
  .basePath("/api")
  .use(logger())
  .use(cors({
      origin: (origin, c) => { 
        return origin.endsWith(".tigergraph-ui-client.pages.dev")
          ? origin
          : "https://my-production-app.com";
      },
    }))
  .use(databaseManagerMiddleware)
  .route("/users", usersRoutes)
  ;

export default api;
export type APIType = typeof apiRoutes;
