# TigerGraph Driver

This driver uses the Fetch API and can be used in custom JavaScript runtimes that implement the Fetch API (i.e. Vercel Edge Functions, Cloudflare Workers, deno, etc). [The Fetch API is stable in Node.js](https://blog.logrocket.com/fetch-api-node-js/), so this driver could probably be used in Node.js runtimes, but this driver has not been tested in a production Node.js environment.


## Node.js version requirements

The native Fetch implementation for Node.js is available beginning in v21. So ensure that your Node.js version is at least v21 or higher. You can check your current Node.js version using the following command:

```
node -v
```

If your Node.js version is below v21, then you will need to upgrade to the latest version. You can use a version manager like Volta or nvm (Node Version Manager) or download the latest version directly from the official Node.js website.

---

# TODOS

* Figure out how to stream large data responses. Since this API code uses Cloudflare Workers (which run in a V8 environment instead of a Node.js environment), I should use the browser-based Fetch API.
    * Read about the [Streams API concepts](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API/Concepts).
    * Look at the [Hono.js Streaming Helper](https://hono.dev/docs/helpers/streaming).
    * For Node.js environments, search for "nodejs fetch api stream".
        * Maybe the Node.js Fetch API is the same as the browser-based Fetch API. 
        * For ideas, look at Neo4j's streaming API: [Consuming Records with Streaming API](https://github.com/neo4j/neo4j-javascript-driver?tab=readme-ov-file#consuming-records-with-streaming-api)
* Learn about connection pooling and find out how to close connections after a query has finished. Maybe I can look at how the Neo4j driver handles this. I don't think the connections need to be closed because I don't think there is anything keeping them open. It appears that an auth token is being passed with each request, which establishes the connection for the duration of the request, and then once the request has completed, then the connection appears to be closed automatically.    


## Connection Pooling

NOTE: It is not necessary to create a connection pool right now, but I would like to create one later for apps that have high traffic and lots of database connections.

### Learn About Connection Pooling

* [What is a distributed database and how do they work?](https://www.cockroachlabs.com/blog/what-is-a-distributed-database/)
* [What is connection pooling, and why should you care](https://www.cockroachlabs.com/blog/what-is-connection-pooling/)
* [Socket in Computer Network](https://www.geeksforgeeks.org/socket-in-computer-network/)
* [Connection Pool Overview](https://www.mongodb.com/docs/manual/administration/connection-pool-overview/) (MongoDB). 
    * This talks a bit about sharded cluster connection pooling, which may or may not be important. 
* [node-postgres > Pooling](https://node-postgres.com/features/pooling)
* Do you need connection pooling in a completely serverless architecture? It doesn't appear that a completely serverless architecture can even benefit from connection pooling because (1) you probably can't share a connection among various serverless functions that are running in isolation and (2) since serverless databases can scale automatically, then they probably don't crash from high traffic spikes. However, TigerGraph is a distributed database, not a serverless database.
* Since TigerGraph is a distributed database, do I need to do anything different to create a connection pool? Since it’s a distributed database, any [database server] node can coordinate a query (https://www.cockroachlabs.com/blog/what-is-connection-pooling/). There are two different types of connection pools:
    * __Client-side connection pools__ are where you configure your application code to use connection pools, which manages the number of client (i.e. application) connections to the database. 
    * __Server-side connection pools__ are where your database server can be configure to use connection pools, which manages the different database servers that are available for your application to connected to. It seems that distributed databases don't need connection pools configured for the database server because you can configure them to scale up or down to handle traffic spikes. (See https://documentation.sas.com/doc/en/bicdc/9.4/biasag/n08003intelplatform00srvradm.htm)
    * Since TigerGraph is a distributed database, then we don't need to worry about server-side connection pools. Se we are only concerned with client-side connection pooling. See what Cockroach Labs, which is a distributed database, says about [Serverless Function Best Practices](https://www.cockroachlabs.com/docs/stable/serverless-function-best-practices) and what Vercel says about [Connection Pooling with Serverless Functions](https://vercel.com/guides/connection-pooling-with-serverless-functions). If you are using a traditional application server (e.g. Express.js), then you will need to configure connection pooling.

### JavaScript Connection Pool Repos To Look At For Examples

* [pg-pool](https://github.com/brianc/node-postgres/blob/master/packages/pg-pool/index.js) (PostgreSQL)
    * Look at the different ways to connect to the database through a connection pool: [node-postgres](https://node-postgres.com/features/connecting).
    * pg-pool is a module within the [node-postgres](https://github.com/brianc/node-postgres?tab=readme-ov-file) monorepo. There might be some other modules in there that would also be helpful to port over to TigerGraph.
* [MongoDB](https://github.com/mongodb-js/mongodb-core/blob/master/lib/connection/pool.js)
