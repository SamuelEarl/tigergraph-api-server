// TODO: ENHANCEMENT: I want to looking into streaming responses from this tgQuery() function.
// Look at the [Hono.js Streaming Helper](https://hono.dev/docs/helpers/streaming).
// I can also read about the [Streams API concepts](https://developer.mozilla.org/en-US/docs/Web/API/Streams_API/Concepts) and search for "nodejs fetch api stream".

import { type Context } from "hono";

/**
 * This function is used to send fetch requests to a TigerGraph cluster.
 * 
 * The [Built-in Endpoints](https://docs.tigergraph.com/tigergraph-server/4.1/api/built-in-endpoints-v3) page shows the built-in REST API endpoints that can be used with this function, including running installed queries for openCypher/GQL ([Run an installed query (GET)](https://docs.tigergraph.com/tigergraph-server/4.1/api/built-in-endpoints-v3#_run_an_installed_query_get), [Run an installed query (POST)](https://docs.tigergraph.com/tigergraph-server/4.1/api/built-in-endpoints-v3#_run_an_installed_query_post)).
 * 
 * @param {string} c - The Cloudflare Workers context object.
 * @param {string} method - The HTTP method (e.g. "GET", "POST", "PUT", "PATCH", "DELETE") associated with the request.
 * @param {string} path - The endpoint path. The path should be prefixed with a `/` and can include path parameters, but not query parameters. Query parameters should be passed in the `queryStringParams` argument.
 * @param {object} queryStringParams - An object of key/value pairs representing the query parameters for the request. Query parameters are often used to search/sort/filter on data.
 * @param {object} payload - An object of key/value pairs that will be sent in the request body. If you want to pass a payload but no query params, then pass an empty object as the `queryStringParams` argument and then pass the necessary payload object.
 * @param {object} additionalHeaders - An object of key/value pairs that are wrapped in quotes, like this: 
 * { "Accept": "application/json" }
 * The headers object already includes the following headers by default: 
 * { "Authorization": `Bearer ${c.var.tgToken}`, "Content-Type": "application/json" }
 * If more headers are needed, then you can pass those to this argument.
 * @returns {Promise<object>} Returns a Promise object that contains the JSON response from the request. A call to this `tgQuery()` function needs to be awaited in order to return the JSON response.
 * 
 * EXAMPLES
 * * EXAMPLE 1: Send a GET request for a single node record.
 * @example
 * ```
 * const response = await tgQuery(
 *   c,
 *   "GET", 
 *   `/users/get-user-data/${user.id}`,
 * );
 * ```
 * 
 * * EXAMPLE 2: Send a GET request with querystring params.
 * @example
 * ```
 * let searchTerm = "comfortable shoes";
 * const response = await tgQuery(
 *   c,
 *   "GET", 
 *   `/search`,
 *   {
 *     q: searchTerm,
 *     limit: 10,
 *     offset: 0,
 *   },
 * );
 * ```
 * 
 * * EXAMPLE 3: Send a POST request.
 * @example
 * ```
 * const response = await tgQuery(
 *   c,
 *   "POST", 
 *   `/products/create-product`,
 *   {},
 *   {
 *     name: "T-Shirt",
 *     price: 2500
 *   },
 * );
 * ```
 * 
 * * EXAMPLE 4: Send a PUT request.
 * @example
 * ```
 * const response = await tgQuery(
 *   c,
 *   "PUT",
 *   `/products/update-product/${product.id}`,
 *   {},
 *   {
 *     price: 2000
 *   }, 
 * );
 * ```
 * 
 * * EXAMPLE 5: Send a DELETE request.
 * @example
 * ```
 * const response = await tgQuery(
 *   c,
 *   "DELETE",
 *   `/products/delete-product/${product.id}`, 
 * );
 * ```
 */
export async function tgQuery(
  //  Two things are needed from the context object in order to complete a request: (1) The domain of the TigerGraph cluster. (2) The TigerGraph token that is returned from the `POST /requesttoken` endpoint.
  c: Context,
  method: string, 
  path: string, 
  queryStringParams: object = {}, 
  payload: object = {}, 
  additionalHeaders: object = {}
) {
  const headers = {
    "Authorization": `Bearer ${c.var.tgToken}`,
    "Content-Type": "application/json"
  };

  const options: RequestInit = {
    method: method,
    headers: headers,
  };

  // If additional headers are passed to this function, then include them in the headers object by using the spread operator.
  options.headers = { ...options.headers, ...additionalHeaders };

  // If a queryStringParams object is passed to this function, then convert it to a string of query params.
  if (Object.keys(queryStringParams).length > 0) {
    // @ts-ignore: The `new URLSearchParams()` constructor accepts objects as arguments (https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams#examples), but TypeScript still shows errors when passing objects to the `new URLSearchParams()` constructor (see https://github.com/microsoft/TypeScript/issues/15338).
    path = `${path}?${new URLSearchParams(queryStringParams)}`;
  }

  // If a payload object is passed to this function, then add a body to the options object and stringify the payload for the request body.
  if (Object.keys(payload).length > 0) {
    options.body = JSON.stringify(payload);
  }

  const scheme = "https";
  const port = 443;
  const url = `${scheme}://${c.env.TIGERGRAPH_DOMAIN}:${port}${path}`;

  const response = await fetch(url, options);

  if (!response.ok) {
    const result = await response.json();
    throw new Error(`
      RESPONSE STATUS: ${response.status} | ${response.statusText}
      METHOD: ${method}
      URL: ${url}
      PAYLOAD: ${options.body}
      ERRORS: ${JSON.stringify(result)}
    `);
  }

  return response.json();
}


/**
 * [Run an installed query (GET)](https://docs.tigergraph.com/tigergraph-server/4.1/api/built-in-endpoints#_run_an_installed_query_get)
 * 
 * _NOTE: This function is a wrapper around the `tgQuery()` function. If you need more flexibility or options with the queries that you run, then use the `tgQuery()` function._
 * 
 * @param {string} c - The Cloudflare Workers context object.
 * @param {string} queryName - The name of the installed query that you want to run against your graph.
 * @param {object} queryStringParams - An object of key/value pairs representing the query parameters for the request. Query parameters are often used to search/sort/filter on data.
 * @returns {Promise<object>} Returns a Promise object that contains the JSON response from the request. A call to this `tgGet()` function needs to be awaited in order to return the JSON response.
 * 
 * EXAMPLES:
 * * Send a GET request with querystring params.
 * @example
 * ```
 * const response = await tgGet(
 *   c,
 *   "name_of_query",
 *   {
 *     firstName: "Tom",
 *     lastName: "Jones",
 *     age: 25,
 *   },
 * );
 * ```
 */
export async function tgGet(c: Context, queryName: string, queryStringParams: object = {}) {
  const path = `/restpp/query/${c.env.TIGERGRAPH_GRAPH_NAME}/${queryName}`;
  return tgQuery(c, "GET", path, queryStringParams);
}


/**
 * [Run an installed query (POST)](https://docs.tigergraph.com/tigergraph-server/4.1/api/built-in-endpoints#_run_an_installed_query_post)
 * 
 * _NOTE: This function is a wrapper around the `tgQuery()` function. If you need more flexibility or options with the queries that you run, then use the `tgQuery()` function._
 * 
 * @param {string} c - The Cloudflare Workers context object.
 * @param {string} queryName - The name of the installed query that you want to run against your graph.
 * @param {object} payload - An object of key/value pairs that will be sent in the request body.
 * @returns {Promise<object>} Returns a Promise object that contains the JSON response from the request. A call to this `tgPost()` function needs to be awaited in order to return the JSON response.
 * 
 * EXAMPLES:
 * * Send a POST request with a payload (i.e. a request body).
 * @example
 * ```
 * const response = await tgPost(
 *   c,
 *   "name_of_query",
 *   {
 *     productName: "T-Shirt",
 *     price: 2500
 *   },
 * );
 * ```
 */
export async function tgPost(c: Context, queryName: string, payload: object = {}) {
  const path = `/restpp/query/${c.env.TIGERGRAPH_GRAPH_NAME}/${queryName}`;
  return tgQuery(c, "POST", path, {}, payload);
}
