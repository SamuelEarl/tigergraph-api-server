# Tutorial: Web Development with TigerGraph

---

# Nebula Graph

Should I look into Nebula Graph? I found this comment in a [HackerNews thread](https://news.ycombinator.com/item?id=22051830):

(Sherman here. I'm the founder of Nebula) Nice to meet you here, Manish. Nebula is actually inspired by the Facebook internal project Dragon ([Dragon: A distributed graph query engine](https://engineering.fb.com/2016/03/18/data-infrastructure/dragon-a-distributed-graph-query-engine/)). Fortunately I was one of the founding members of the project. The project was started in 2012. We never heard of dgraph at that time. So I'm not sure who was inspired :-)
The goal of Nebula is to be a general graph database, not just a knowledge graph database. There are some fundamental differences between the two.

# Amazon Neptune

Startups and indie developers beware. Like everything else offered by AWS, this database is targeted at enterprise-level customers. If you search for "how much does neptune serverless cost" you will see something like this:

"Amazon Neptune Serverless costs at least $290 per month, even if you don't use the database. The cost is based on how much you use, measured in Neptune capacity units (NCUs) per hour. Each NCU is roughly equivalent to 2 gibibytes (GiB) of memory, along with the corresponding CPU and networking."

# EdgeDB

EdgeDB is not necessarily a graph database, but it uses many graph concepts that make it very appealing for application development. These are some of the features that I like about EdgeDB:

* Use the right tool for the job. EdgeDB was designed to be the primary database for web and native applications. Most graph databases were originally designed as specialty databases where you can load a dataset from your primary database into your graph database for analysis and to gain new insights. The docs for many graph databases either do not have any information about how to use the graph database with a web app or that documentation is buried somewhere and is often lacking information for handling basic CRUD operations. EdgeDB is "commitment[ed] to providing developers with the best possible tools to create and scale applications effortlessly" (https://www.edgedb.com/blog/edgedb-cloud-free-tier-how-we-stack-up-vs-planetscale-supabase-neon).
* The schema and CRUD operations are designed around graph concepts to allow more flexible data modeling and database operations.
* The resulting dataset that is returned from a query is in a hierarchical format and is the same structure as a GraphQL query result. This is perfect for web apps! The datasets that are returned from graph databases often require complex parsing to get to the necessary data. It is obvious that these graph databases were not designed for web apps.
* EdgeDB offers a free tier that you can use to test ideas and build an MVP.
* Solid infrastructure. EdgeDB is built on top of Postgres, which is battle tested.
* Solid backing and investors, which provides some confidence that EdgeDB will be around for a while.
* EdgeDB branches make it easier to develop and test features by coordinating your code and data for a particular feature.
* After the 1.0 release, they have been able to iterate and add new features much faster than before. (See [The future of EdgeDB (2022) — Yury Selivanov | EdgeDB Day](https://www.youtube.com/watch?v=31k2AoqxWX0))
* EdgeDB is completely open source. Some graph databases are not open source. Maybe that is not a big deal, but that makes me feel a little uneasy because I am used to using open source software.
* EdgeDB supports multiple language drivers, has connection pooling built-in, and has documentation for integrating with serverless functions, including Cloudflare Workers. Neo4j is the largest graph database available, so it has some of this stuff. Other graph databases, like TigerGraph, have almost none of this stuff.
* A lot of smart technology people are either backing EdgeDB or they are involved somehow (e.g. consultants).

---

# Graph Databases: Not Your Grandpa's Database

"I've been a developer for over 20 years and I've worked with a lot of different ORMs and the thing that bothers me most about them is that I already know how to talk to a database. In other words, I know SQL very well.... I tried ditching ORMs in the past and when I did a funny thing happened. I eventually found myself kind of reimplementing an ORM and that's when I came to realize that you can't really escape ORMs. You either use an existing one or you end up building your own. So I think that ORMs are pretty much unavoidable. So the question I am left with is why can't ORMs be a little bit better and a little less frustrating to somebody like myself - a SQL fan." ([The ORM I don't hate (Drizzle)](https://www.youtube.com/watch?v=goHMu2hMNms))

One of the pros of relational databases is that SQL is a standardized query language. Well, if SQL is often abstracted away by ORMs, then is the query language still standardized?

GQL does a very nice job of representing the data that is being queried and it is a pleasure to work with. There is no need to abstract it away with something like an ORM.

---

# TigerGraph Web Development Tutorial

These steps follow the instructions on these pages: 
* pyTigerGraph > [Getting Started](https://docs.tigergraph.com/pytigergraph/current/getting-started/), but these steps show how to use the graphical tools on tgcloud.io.
* [Send REST Requests to a Cluster](https://docs.tigergraph.com/cloud/main/solutions/access-solution/rest-requests)

## Pros and Cons of TigerGraph (from a web development perspective)

### Pros: A few reasons why I looked at TigerGraph in the first place

When I talk about GQL I am talking about ISO-GQL, not GraphQL. (Maybe I should explain the difference between GQL and GraphQL.)

* I love graph data models! Graph data models fit closely to how things are organized in the real world - objects/entities and their relationships to other objects/entities. To me, graph databases are much more intuitive than any other type of database. I have read that some people believe that graph databases can do anything that relational databases can do and more. (For example, see this thread: [Why aren't graph databases more popular?](https://www.quora.com/Why-arent-graph-databases-more-popular)) I don't know if that is true, but the flexibility of a graph data model along with a structured schema and ACID transactions means that I can alter my data model to address any future data needs while maintaining data accuracy, referential integrity, and transactional consistency. This post also provides some interesting insights: [Why Graph Databases Will Win](https://terminusdb.com/blog/why-graph-will-win/).
* [TigerGraph has committed to support openCypher](https://www.tigergraph.com/press-article/tigergraph-announces-commitment-to-support-opencypher-in-gsql/). GQL is the big news in graph database query languages ISO has published GQL ([GQL: The ISO Standard for Graphs Has Arrived](https://neo4j.com/blog/cypher-path-gql/)), so you might be wondering, "If GQL has been published, then why are you concerned about openCypher?" Because [openCypher will pave the road to GQL for Cypher implementers](https://neo4j.com/blog/opencypher-gql-cypher-implementation/). One of the largest factors in deciding whether to use a particular database or not is if it follows industry standards. There tends to be a lot more information and help available for systems that follow industry standards. GQL finally provides a standardized query language for graph databases, which is a massive game changer. The ASCII-Art syntax of the GQL/openCypher query language also feels like an extension of the graph data model. I process information visually (i.e. I am a visual learner) and I can visualize the graph data pretty easily. For me, GQL/openCypher also makes writing queries easier because I can visualize the data that I am trying to create in or read from the database pretty easily. This is how Neo4j describes their Cypher query language: "Visual and Logical: Match patterns of nodes and relationships in the graph using ASCII-Art syntax. These patterns map directly to the domain model drawn in diagrams or on whiteboards. As a result, there is no impedance mismatch between the model, the database, and the query language." (See [Neo4j Cypher Query Language](https://neo4j.com/product/cypher-graph-query-language/).)
* The data that is returned from a query is easy to parse. Neo4j returns very large and complex data structures for even simple queries.
* The TigerGraph Cloud suite is pretty impressive. I really like the schema designer and the variety of data types that can be used to define attributes.

### Cons: A few things that TigerGraph needs to work on

* #1 Issue: Lack of support for GQL/openCypher. In October 2022 TigerGraph announced a "[commitment to support openCypher](https://www.tigergraph.com/press-article/tigergraph-announces-commitment-to-support-opencypher-in-gsql/)". It is now October 2024, and there are still significant parts of openCypher that TigerGraph does not support: [openCypher in GSQL](https://docs.tigergraph.com/gsql-ref/4.1/opencypher-in-gsql/opencypher-in-gsql). In terms of basic CRUD operations, there is no support for creating or updating data in the database. That is pretty significant!
* Lack of official language drivers. One of the biggest obstacles preventing me from using a particular database is if they do not have officially supported drivers for common web development languages (e.g. JavaScript, Python, Go). If a database company does not have officially supported drivers, then it makes me a little leery about whether I am going to be able to get the support I need when I inevitably run into issues. Lack of language drivers also includes lack of support for connection pooling and streaming large amounts of data from my database to my app. Those are opitimization features that I would like to take advantage of in the future.
* Lack of error messages for incorrectly written queries in GraphStudio. If you write a query incorrectly in GraphStudio and try to "install" it, then you will just get a warning telling you to fix the errors. But there is no indication of what is causing the errors. TigerGraph would help their users a lot by implementing some static analysis tools in GraphStudio.
    * Does TigerGraph have a playground similar to GraphQL playgrounds where you can write queries, pass variables to those queries, and run the queries against the database? Maybe these features exist in GraphStudio.


## Step 1: Create a cluster

What is a cluster? See [What Is A Server Cluster?](https://www.racksolutions.com/news/blog/server-cluster-how-it-works/)

1. Login to tgcloud.io.
2. Create a cluster.
    1. Select the "FREE" option.
    2. Then hover over "Start From Scratch" and click "Create".

NOTE: If you are coming back to tgcloud.io and logging in after you have previously created a free cluster, then you will need start your free cluster again:

1. Make sure that you are in the "Clusters" tab in the left column.
2. Look under the heading for "My Clusters". If you have not changed the name, then it will be "cluster-YYYY-MM-DD".
3. To the right of your cluster's name you will see two buttons that are disabled ("Tools" and "Access Management") and an "Overflow" button that has an icon of 3 horizontal dots. Click the "Overflow" button and select "Resume cluster" >> "Resume".
4. You will see a status message next to your cluster name that says, "Resuming...". Your cluster will take a few minutes to start back up and when it is ready that "Resuming..." status message will disappear and the "Tools" and "Access Management" buttons will be enabled.


## Step 2: Create a schema

1. From tgcloud.io, click "Tools" >> GraphStudio.
2. Select your cluster.
3. Click "Design Schema". 
    1. Reference this documentation page: [Design Schema](https://docs.tigergraph.com/gui/current/graphstudio/design-schema).
    2. [Attribute Data Types](https://docs.tigergraph.com/gsql-ref/current/ddl-and-loading/attribute-data-types)
    2. Watch this video (which is a little outdated already) to learn about GraphStudio and how to create a schema. You can skip straight to the section about GraphStudio (20:13).


IMPORTANT NOTE: As you create your schema, make sure to save your changes regularly by clicking the `Save schema` button in the toolbar.


### Graph Naming Conventions

_These naming conventions are listed here as a reference. Skip to the next step and refer back to this section as you create the different parts of your schema._

While I am using openCypher (until GQL is fully implemented in TigerGraph), I will use the naming conventions from the [Cypher Style Guide](https://opencypher.org/resources/).

#### Graph Name

The graph names should use capitalized snake case.

Example: `My_Graph_Dev`, `My_Graph_Prod`

#### Nodes/Vertexes

The node names should be Pascal case, or upper camel case (i.e. the first letter of each word is capitalized). I think node names should also be singular.

Example: `UserAccount`

#### Relationships/Edges

Each relationship/edge should describe the relationship and should use all caps snake case (i.e. all the letters are capitalized and words are separated by underscores). The name of the relationship can simply be a combination of the starting vertex and the target vertex (e.g. `STARTING_VERTEX_NAME_TARGET_VERTEX_NAME`).

Example: `USER_ACCOUNT_USER`

Important Note: One question that needs to be answered is what properties should be stored in relationships vs nodes? This post on StackOverflow helps to answer that question: https://stackoverflow.com/questions/28121589/neo4j-storing-into-relationship-vs-nodes. It might be more useful to store properties in nodes and keep relationships simple. i.e. Just use relationship names that describe the relationship and do not store any properties in the relationships. It might be fine to include a `createdAt` property in the relationship, but it might also be better to store that in the nodes.

#### Properties (for nodes and relationships)

All property names should be camel case. 

Example: `userId`

#### Query Names

The only way to run openCypher queries against a TigerGraph database is through "installed queries," which you can create and save in GraphStudio.

Query names should use snake case.

Example: `get_user_by_id`

*Source: [Write openCypher Queries in TigerGraph](https://docs.tigergraph.com/gui/current/graphstudio/write-open-cypher-queries-in-tigergraph)*


## Step 3: Create a graph

In the graph database world, a graph is a database. So when we say something like, "Create a new graph", it means to create a new database.

Read [CREATE GRAPH](https://docs.tigergraph.com/gsql-ref/current/ddl-and-loading/defining-a-graph-schema#_create_graph) for more details about this step.

1. In GraphStudio, look in the left panel and find the dropdown button labeled "Global View". Click that and select "Create a graph".
2. Give your graph a name. Refer to the naming conventions above. Since you should use different graphs for different environments, you should name your graph based on the environment it is being used in (e.g. "My_App_Dev", "My_App_Prod").
3. Select all the vertex and edges types that you want to include from your schema and click "CREATE".
4. You should see the name of your graph in place of "Global View" in the left panel.


## Step 4: Create a vertex and edge types

Refer to the naming conventions above.

* Make sure that you are in the "Global View" so you can create vertex and edge types that can be applied to all of your graphs.
* To create a vertex, click the `Add local vertex type` button (the `plus circle` icon) in the toolbar.
    * If you want to have a vertex or edge type’s primary ID as an attribute, then click the "Advanced Setting" button and check the box in front of "As attribute". Click "Save". This will allow you to use the vertex or edge’s primary ID like any other attribute of the vertex or edge type in features such as filter, attachment and order. I recommend that you check the "As attribute" box.
* To create an edge, click the `Add local edge type` button (the `arrow` icon) in the toolbar then choose the starting vertex type and the target vertex type.
* To edit a vertex or an edge, double click the vertex or edge in the schema designer or select the vertex or edge in the schema designer and click the `Edit` button (the `pencil` icon) in the toolbar.
* To delete a vertex or an edge, select the vertex or edge in the schema designer then click the `Delete` button (the `trash can` icon) in toolbar.
* To choose multiple vertexes and edges, hold the "Shift" key on your keyboard as you select them in the schema designer.
* To publish changes, click the `Publish` button (the `fat up arrow` icon) in toolbar. (TODO: Figure out why I don't see this button.)

You can apply any or all vertex and edge types to your other graphs:

1. In the left panel, select the graph that you want to add vertex and edge types to.
2. Click the "Settings" button (the gear icon).
3. Select the vertex and edge types that you want to apply.


## Step 5: Export a backup of your graph or import data into your graph

1. In GraphStudio, click the "Home" button.
2. On the homepage, click "Export Current Solution" and follow the prompts.
3. You can import the tarball on the same screen if you need to use your backup.


## Step 6: Generate a secret

1. Create a file to store your environment variables.
    1. If you are using any environment other than Cloudflare Workers, then create a `.env` file in the root of your project and add a variable for your TigerGraph secret (e.g. `TG_SECRET`). 
        1. NOTE: It is good practice to use a different database for each environment. There are a least two different ways to use different secrets for each environment.
            1. You can use multiple `.env` files for each environment (e.g. `.env.development`, `.env.test`, `.env.staging`, `.env.production`) and define the same environment variable in each file (e.g. `TG_SECRET`) but assign the corresponding secret for the given environment. If your framework is configured to load different `.env` files for different environments, then the correct value will be loaded when you start your app.
            2. You can create multiple environment variables for each secret that corresponds to a different environment and put those all in the same `.env` file (e.g. `TG_DEV_SECRET`, `TG_TEST_SECRET`, `TG_STAGING_SECRET`, `TG_PROD_SECRET`). You can then use `if` statements to check the environment and assign the corresponding secret values to your app code.
    2. If you are using Cloudflare Workers, then...
        1. You will use a `wrangler.toml` file for environment variables that you want to check into source control and a `.dev.vars` file for environment variables that you do NOT want to check in to source control. 
        2. The variables that are in the `.dev.vars` file are only accessible in your local development environment.
        3. Make sure to add any environment variables that are used outside of local development (e.g. production, preview, staging) to the Cloudflare Dashboard. Sensitive environment variables, such as secrets, ID values, database connection details, and any other sensitive values that you do not want to be exposed, should be stored as encrypted variables. See https://developers.cloudflare.com/workers/configuration/environment-variables/#add-environment-variables-via-wrangler.
2. From tgcloud.io, click "Tools" >> AdminPortal.
3. If you have multiple clusters, then select the cluster that you are working on. Otherwise, skip to the next step.
4. In the left panel click "Management" >> "Users".
5. The "My Profile" tab will display each graph that you have created in your account, so make sure that you create your secrets under the correct graph(s).
6. Enter a secret alias and click "Add secret". You can name your secret however you want, but a simple name would be something like `TIGERGRAPH_SECRET`.
7. Copy and paste the secret value into your `.env` or `.dev.vars` file and add any necessary environment variables to your web host's environment variables storage.

If you ever need to delete a secret and/or create a new one, then you can do that on the above page. Make sure to update it in each location that it is being used.


## Step 6 (TG Cloud Beta): Get the JWT for the TG Cloud Beta (4.0.0) endpoints.

NOTE: The JWT expires after 12 hours. So I need to ask about two things in the support forums:
1. Is there another way to retrieve the new JWT aside from the way that I have outlined below?
2. Does the JWT get replaced if I am using a paid plan or do I simply need to disable Auto Suspend? You can edit the "Auto Suspend" option in your Workspace by clicking the ... (3 dots) menu >> Edit.


1. In your `.env` file, create an environment variable for your TG Cloud JWT: `TG_JWT = ""`
2. Login at https://beta.tgcloud.io/.
3. Go to your Workgroup.
4. On your Workspace click "Connect" >> "Connect from API".
5. Open a query, like the Built-In `/statistics/{graph_name}` query.
6. Scroll down to the "Code Snippet" section and click the "JavaScript" tab.
7. Copy the Bearer token (just the token - do not include the word "Bearer") and paste it inside the empty quotes of your `TG_JWT` environment variable.



## Step 7: Set TIGERGRAPH_DOMAIN and TIGERGRAPH_GRAPH_NAME environment variables

Creat some other environment variables next to your `TIGERGRAPH_SECRET` environment variable: 

```
TIGERGRAPH_DOMAIN = ""
TIGERGRAPH_GRAPH_NAME = ""
```


### Where to find the `TIGERGRAPH_DOMAIN` value

1. Go to https://tgcloud.io and click "Clusters" in the left panel.
2. Click on the name of the cluster that you are working on.
3. In the "Network Information" box, you will see "Domain". The value for "Domain" is a long ID number followed by `i.tgcloud.io`.
4. Copy and paste that value inside the empty quotes of your `TIGERGRAPH_DOMAIN` variable.

NOTE: If you are using PyTigerGraph, then the `domain` variable will be labelled `host`.


## Where to find the `TIGERGRAPH_GRAPH_NAME` value

1. Go to GraphStudio (from tgcloud.io, click "Tools" >> GraphStudio >> Select your cluster >> Click "Design Schema").
2. In the left panel select "Global View" from the dropdown menu.
3. After "Global View" is selected, click that dropdown menu again and hover over the name of your graph. You should see a tooltip popup with the full name of your graph.


## Step 7: Connect to a TigerGraph Cloud instance through a JavaScript driver

TODO: CONTINUE HERE: Finish this tutorial with a demo about creating your own language driver using JavaScript. Look at the pyTigerGraph docs and GitHub repo for ideas. Look at my `api-fetch-request/index.ts` file in the client side code for ideas on how to write and organize some of the driver code.

The response that is returned from the `/requesttoken` endpoint has this payload:

```json
{
  "code": "REST-0000",
  "expiration": 1616042814,
  "error": false,
  "message": "Generate new token successfully.\nWarning: Tigergraph Support cannot restore access to secrets/tokens for security reasons. Please save your secret/token and keep it safe and accessible.",
  "token": "tohvf6khjqju8jf0r0l1cohhlm8gi5fq"
}
```

The token has a 1 month expiration by default. You could rotate tokens more frequently (e.g. every hour) by setting a shorter expiration (e.g. 1 hour from now) and then checking the token's expiration with each request to your database. If the token is expired, or if it is close to expiring, then send a request for a new token.


## Step 9: Run a query against the TigerGraph database

We will use openCypher as our query language as much as possible (until GQL is fully implemented into TigerGraph). At the time of this writing, the only way to run openCypher queries against a TigerGraph database is through "installed queries."

1. Open GraphStudio (from tgcloud.io, click "Tools" >> GraphStudio).
2. Select a graph. (Installed queries cannot be created in the "Global View.")
3. In the left panel select "Write Queries."
4. Click the "+" button to create a new query.
5. Give your query a name (in snake case).
6. Under "Query type" select "openCypher (preview)."
7. Click "CREATE". A template for your query will appear in the "Write Queries" editor. 
8. Write your query. Refer to the documentation to learn how to pass parameters to a GET request and a payload to a POST request: 
    1. [Run an installed query (GET)](https://docs.tigergraph.com/tigergraph-server/4.1/api/built-in-endpoints-v3#_run_an_installed_query_get)
    2. [Run an installed query (POST)](https://docs.tigergraph.com/tigergraph-server/4.1/api/built-in-endpoints-v3#_run_an_installed_query_post)
    3. TODO: Provide all the details above for how to use GET and POST requests.
9. Click the "Install query" button (up arrow icon). Your query has to be installed before you can run it from your code otherwise you will get a "404 Not Found" error.


IMPORTANT: I found out that large parts of openCypher are not supported in TigerGraph. See https://docs.tigergraph.com/gsql-ref/4.1/opencypher-in-gsql/opencypher-in-gsql. So I will have to learn GSQL for the parts that are not supported and then I can use GQL/openCypher for the parts that are supported.

This is how an openCypher query in GraphStudio should look:

```
CREATE OR REPLACE DISTRIBUTED OPENCYPHER QUERY create_user_account_and_user(
  STRING firstName, 
  STRING lastName, 
  STRING email,
  JSONARRAY permissions
) FOR GRAPH My_App_Dev {
  CREATE (ua:UserAccount {
    permissions: permissions
  })
  CREATE (u:User {
    firstName: firstName,
    lastName: lastName,
    email: email
  })
  MERGE (ua)-[r:ACCOUNT_OWNER]->(u)
  RETURN ua, u
}
```

NOTE: I am pretty sure that the `LIST<STRING> permissions` param is correctly declared, but it throws errors in the GraphStudio UI. See https://docs.tigergraph.com/gsql-ref/4.1/ddl-and-loading/attribute-data-types#_collection_types


1. Write an openCypher query in GraphStudio. See [Write openCypher queries in TigerGraph](https://docs.tigergraph.com/gui/current/graphstudio/write-open-cypher-queries-in-tigergraph).
2. Then use one of the install query endpoints (https://docs.tigergraph.com/tigergraph-server/4.1/api/built-in-endpoints-v3#_run_an_installed_query_post).


[`runInstalledQuery()`](https://docs.tigergraph.com/pytigergraph/current/core-functions/query#_runinstalledquery) inside your API endpoint to run the query against the TigerGraph database.

---

# CRUD Operations

These CRUD operations use installed queries.

## CREATE

Create queries are not available in GQL/openCypher yet. So this query will use GSQL.

For more details, see [INSERT INTO Statement](https://docs.tigergraph.com/gsql-ref/4.1/querying/data-modification-statements#_insert_into_statement).

```
CREATE OR REPLACE DISTRIBUTED QUERY create_user_account_and_user_gsql(
  STRING userAccountId,
  STRING userId,
  STRING firstName, 
  STRING lastName, 
  STRING email,
  STRING permissions
) FOR GRAPH My_App_Dev {
  // Installed queries do not support JSONARRAY types as parameters yet. So in your installed queries you have to set any array parameters as a STRING data type,
  // then you have to JSON.stringify() any arrays before passing them to the installed query, then you have to parse that STRING (array) parameter with 
  // parse_json_array() before you can use it as an array in your installed query.
  // https://docs.tigergraph.com/gsql-ref/4.1/querying/data-types#_jsonarray
  // JSONARRAY parsedPermissions = parse_json_array(permissions);
  
  INSERT INTO UserAccount (PRIMARY_ID, permissions)
                   VALUES (userAccountId, permissions)
  ;
  
  INSERT INTO User (PRIMARY_ID, firstName, lastName, email)
            VALUES (userId, firstName, lastName, email)
  ;
  
  INSERT INTO ACCOUNT_OWNER (FROM, TO)
                     VALUES (userAccountId, userId)
  ;
  
  STRING success_message = "User and user account created successfully!";
  PRINT success_message;
}
```

The installed query will return a data object like this:

```
{
  version: { edition: 'enterprise', api: 'v2', schema: 3 },
  error: false,
  message: '',
  results: [
    { key1: value1 },
    { key2: value2 },
    { key3: value3 }
  ]
}
```

Each `PRINT` statement in the installed query will add another object to the `results` array field of the data object that is returned from the installed query.


NOTES:

1. I think we could write the query directly in our code (instead of creating the query in GraphStudio) by using [`runInterpretedQuery()`](https://docs.tigergraph.com/pytigergraph/current/core-functions/query#_runinterpretedquery). However, `runInterpretedQuery()` might not work with GQL/openCypher queries because these requests go directly to the GSQL server instead of the RESTPP server.
2. But I kind of like the idea of using `runInstalledQuery()` because it allows us to test the query against our database first (similar to how you use Postman to test APIs before hooking up a frontend client) and then we can simply reference the query in our code when it is ready.
3. When we need to change the query from openCypher or GSQL to GQL, then we could probably create new GQL queries in TigerStudio first and only when they are ready would we need to change the references in our code. How cool is that!
4. Storing all of our queries in TigerStudio could be beneficial for data analysis, ML, and AI work. Then we could tap into those queries if/when we want to incorporate more data-driven features into the app. That is awesome!


* Use the [Cyper Query Language Reference](https://opencypher.org/resources/) when creating queries in TigerGraph.
* Follow the [Cypher Style Guide](https://opencypher.org/resources/) when [writing openCypher queries in TigerGraph](https://docs.tigergraph.com/gui/current/graphstudio/write-open-cypher-queries-in-tigergraph).


CONTINUE HERE:
* Watch this video to understand pyTigerGraph (continue at about 23:00): https://docs.tigergraph.com/pytigergraph/current/getting-started/101.
* Reference this page: https://docs.tigergraph.com/pytigergraph/current/core-functions/

* This video helped to understand web development with TigerGraph: [101 Full-Stack App with TigerGraph](https://www.youtube.com/watch?v=j8sa78kTFDw)
* Reference this page: https://docs.tigergraph.com/tigergraph-server/current/api/built-in-endpoints.

TODO: Add this tutorial to my samuelearl.com website. Change the name of one of my YouTube channels to "Sam Not-So-Wise Gamgee" and record a video. I could start like this: "I have had a lot of people ask me, "Not-So-Wise, who do I get started with graph databases? [Record scratching] Actually, most people don't even know what a graph database is. They think it is something related to GraphQL...."

NOTE: Maybe I will call my YouTube channel something that suggests that I am not an expert or that I am a little behind the times or slow.


---

## Step 7: Connect to a TigerGraph Cloud instance through a Python driver

1. In your `.env` file, create variables for `TIGERGRAPH_HOST` and `TIGERGRAPH_GRAPH_NAME`.
2. Follow the instructions here: [Connect to a graph on a TigerGraph Cloud instance](https://docs.tigergraph.com/pytigergraph/current/getting-started/connection#_connect_to_a_graph_on_a_tigergraph_cloud_instance)
3. But instead of hardcoding your connection values into your code, paste those values in your `.env` file and import them like this:

```py
import pyTigerGraph as tg
from dotenv import load_dotenv

load_dotenv()

TG_DEV_HOST = os.getenv("TG_DEV_HOST")
TG_DEV_GRAPH_NAME = os.getenv("TG_DEV_GRAPH_NAME")
TG_DEV_SECRET = os.getenv("TG_DEV_SECRET")

tg_host = ""
tg_graph_name = ""
tg_secret = ""

if LITESTAR_ENV == "development":
    tg_host = TG_DEV_HOST
    tg_graph_name = TG_DEV_GRAPH_NAME
    tg_secret = TG_DEV_SECRET

db = tg.TigerGraphConnection(host=tg_host, graphname=tg_graph_name, gsqlSecret=tg_secret)
db.getToken(tg_secret)
```

This way you can list your `.env` file in your `.gitignore` file, which will prevent you from checking sensitive information into your Git repo.


## Step 8: Initialize your database connection

```py
# /database/main.py

...

try:
    db = tg.TigerGraphConnection(host=tg_host, graphname=tg_graph_name, gsqlSecret=tg_secret)
    db.getToken(tg_secret)
    version = db.getVer()
    print(f"TigerGraph version {version} has been initialized!")
    return
except:
    log_error()
```

In order to use the database (connection) object in an endpoint, you will import the database object at the top of your contorller file, like this:

```py
from database.main import db
```

The database connection will be initialized when your app starts and you can reuse the connection in your other endpoints.
