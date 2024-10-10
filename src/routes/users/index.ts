import { Hono, type Context } from "hono";
import { v4 as uuidv4 } from "uuid";
import { type Bindings } from "../..";
import { tgQuery, tgGet, tgPost } from "../../db/tigergraph-driver";


const api = new Hono<{ Bindings: Bindings }>();

api.get("/", async (c: Context) => {
  return c.json({ message: "Hello from TigerGraph" });
});

api.get("/get-endpoints", async (c: Context) => {
  const response = await tgQuery(
    c,
    "GET",
    "/restpp/endpoints"
  );
  console.log("get-endpoints RESPONSE:", response);
  return c.json({ data: response });
});

// CONTINUE HERE:
// TODO: Copy the query here as a reference. Or maybe I should look at the backup files to see if they have the query string in plain text. In GraphStudio >> "Write Queries" there is a "Download queries" button (down arrow icon) to the right of the "Graph queries" title and above the "Search" bar. I might be able to download all of my installed queries and save those in my backups folder.

api.post("/create-user-account-and-user", async (c: Context) => {

  // This is how an openCypher query should look:

  // CREATE OR REPLACE DISTRIBUTED OPENCYPHER QUERY create_user_account_and_user(
  //   STRING firstName, 
  //   STRING lastName, 
  //   STRING email,
  //   STRING permissionsString
  // ) FOR GRAPH My_App_Dev {
  //   CREATE (ua:UserAccount {
  //     permissions: permissions
  //   })
  //   CREATE (u:User {
  //     firstName: firstName,
  //     lastName: lastName,
  //     email: email
  //   })
  //   MERGE (ua)-[r:ACCOUNT_OWNER]->(u)
  //   RETURN ua, u
  // }
  
  // NOTE: I am pretty sure that the `LIST<STRING> permissions` param is correctly declared, but it throws errors in the GraphStudio UI. See https://docs.tigergraph.com/gsql-ref/4.1/ddl-and-loading/attribute-data-types#_collection_types
  // I found out that large parts of openCypher are not supported in TigerGraph. See https://docs.tigergraph.com/gsql-ref/4.1/opencypher-in-gsql/opencypher-in-gsql. So I will have to learn GSQL for the parts that are not supported and then I can use openCypher/GQL for the parts that are supported.

  const response = await tgPost(
    c,
    "create_user_account_and_user_gsql",
    {
      userAccountId: uuidv4(),
      userId: uuidv4(),
      firstName: "John",
      lastName: "Doe",
      email: "john@example.com",
      permissions: JSON.stringify([ "create:budgets", "read:budgets", "update:budgets", "delete:budgets" ]),
    }
  );
  console.log("POST /create-user-account-and-user RESPONSE:", JSON.stringify(response));
  return c.json({ data: response });
});

api.get("/get-user-and-user-account", async (c: Context) => {
  const response = await tgGet(
    c,
    "get_user_and_user_account",
    {
      email: "john@example.com",
    }
  );
  console.log("GET /get-user-account-and-user RESPONSE:", JSON.stringify(response));
  return c.json({ data: response });
});

export default api;
