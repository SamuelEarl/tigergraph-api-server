// Do NOT use descriptive names for the cookie/token name:
// https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html#session-id-name-fingerprinting

// These constants are not "secrets" that would expose sensitive information if they were stolen. So they can be checked into Git and do not need to be stored in a `.env.*` or `.dev.vars` file.

// NOTE: This coded name is just random letters. The letters don't mean anything.
export const TIGERGRAPH_TOKEN_NAME = "_rf_jw"

export const COOKIE_OPTIONS = {
  path: "/",
  httpOnly: true,
  secure: true,
  sameSite: "Lax",
} as const;
