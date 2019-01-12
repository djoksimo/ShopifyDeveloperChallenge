const express = require('express');
const router = express.Router();
let CartManager = require('../managers/cart');

const cartManager = new CartManager();

router.post("/", async (req, res) => {
  const result = await cartManager.create();
  const { status, json } = result;
  res.status(status).json(json);
});

router.get("/id", async (req, res) => {
  const result = await cartManager.find(req.query);
  const { status, json } = result;
  res.status(status).json(json);
});

router.patch("/", async (req, res) => {
  const result = await cartManager.update(req.body);
  const { status, json } = result;
  res.status(status).json(json);
});

module.exports = router;
