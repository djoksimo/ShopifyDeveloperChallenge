const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const http = require('http');

const productRoutes = require('./routes/product');
const cartRoutes = require('./routes/cart');

mongoose.connect('mongodb://localhost:27017/marketplace', { useNewUrlParser: true });
const db = mongoose.connection;
db.on('error', ()=> {console.log( 'FAILED to connect to mongoose')});
db.once('open', () => {
  console.log( 'Connected to mongoose');
});

const app = express();

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', '*');
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'POST, PATCH, DELETE, GET');
    return res.status(200).json({});
  }
  next();
});

app.use('/product', productRoutes);
app.use('/cart', cartRoutes);

app.use((req, res, next) => {
  const error = new Error('Route not found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    message: `Error: ${error.message}`,
  });
});

app.listen(3000, () => console.log('Marketplace Server Now Running On localhost:3000'));
