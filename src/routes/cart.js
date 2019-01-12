const express = require('express');
const router = express.Router();
let CartManager = require('../managers/cart');

const cartManager = new CartManager();

router.post('/new', async (req, res) => {
  const result = await cartManager.create();
  const { status, json } = result;
  res.status(status).json(json);
});

router.get('/', async (req, res) => {
  const result = await cartManager.findById(req.query);
  const { status, json } = result;
  res.status(status).json(json);
});

router.patch('/complete', async (req, res) => {
  const result = await cartManager.checkout(req.query);
  const { status, json } = result;
  res.status(status).json(json);
});



module.exports = router;
