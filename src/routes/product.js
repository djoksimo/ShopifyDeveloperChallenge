const express = require('express');
const router = express.Router();
let ProductManager = require('../managers/product');
const productManager = new ProductManager();

router.post('/new', async (req, res) => {
  const result = await productManager.create(req.body);
  const { status, json } = result;
  res.status(status).json(json);
});

router.get('/all', async (req, res) => {
  const result = await productManager.find(req.query);
  const { status, json } = result;
  res.status(status).json(json);
});

router.get('/:id', async (req, res) => {
  const result = await productManager.findById(req.params.id);
  const { status, json } = result;
  res.status(status).json(json);
});

router.patch('/purchase', async (req, res) => {
  const result = await productManager.purchase(req.body);
  const { status, json } = result;
  res.status(status).json(json);
});

module.exports = router;
