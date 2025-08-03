const fetch = require("node-fetch");

exports.handler = async (event) => {
  const { username } = event.queryStringParameters;

  const res = await fetch(`https://api.roblox.com/users/get-by-username?username=${username}`);
  const data = await res.json();

  return {
    statusCode: 200,
    body: JSON.stringify(data),
  };
};
