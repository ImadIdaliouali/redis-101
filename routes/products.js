const express = require("express");
const axios = require("axios");
const qs = require("querystring");
const { createClient } = require("redis");

const router = express.Router();

const client = createClient();
client.on("connect", () => console.log("Connected to Redis"));
client.on("error", (err) => console.log("Redis Client Error", err));

(async () => {
  await client.connect();
})();

const URL = "https://dummyjson.com/products";

router.get("/", async (req, res) => {
  const q = qs.encode(req.query);
  const response = await get(`${URL}?${q}`);
  res.json(response);
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  const response = await axios.get(`${URL}/${id}`);
  res.json(response.data);
});

module.exports = router;

const get = (url) => {
  return new Promise(async (resolve, reject) => {
    const response = await client.get(url);
    if (response) {
      resolve(JSON.parse(response));
    } else {
      const response = await axios.get(url);
      await client.set(url, JSON.stringify(response.data.products));
      await client.expire(url, 10);
      resolve(response.data.products);
    }
  });
};
