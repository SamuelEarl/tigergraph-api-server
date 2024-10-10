/**
 * The code for this function was created with the information from this page:
 * [Send REST Requests to a Cluster](https://docs.tigergraph.com/cloud/main/solutions/access-solution/rest-requests#_3_generate_a_token)
 */

interface IPostData {
  secret: string;
  lifetime?: number;
}

export async function requestTgToken(
  domain: string,
  secret: string,
  tokenLifetime: number = 0,
) {
  try {
    const postData:IPostData = {
      secret: secret,
    };

    // The tokenLifetime parameter is optional, but if it is passed to this function, then add it to the postData that gets sent in the token request.
    if (tokenLifetime) {
      postData.lifetime = tokenLifetime;
    }

    const scheme = "https";
    const port = 443;
    const path = "/restpp/requesttoken";
    const url = `${scheme}://${domain}:${port}${path}`;

    const response = await fetch(url, {
      method: "POST",
      body: JSON.stringify(postData),
    });

    if (!response.ok) {
      const result = await response.json();
      throw new Error(`
        RESPONSE STATUS: ${response.status} | ${response.statusText}
        METHOD: POST
        URL: ${url}
        PAYLOAD: ${postData}
        ERRORS: ${JSON.stringify(result)}
      `);
    }

    return response.json();
  }
  catch(err) {
    console.error("requestTgToken", err);
  }
}
