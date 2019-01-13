const Cart = require('../models/cart');
const mongoose = require('mongoose');
const route = '/cart/';
let CartService = require('../services/cart');
let ProductService = require('../services/product');
const jwt = require("jsonwebtoken");
const secretJwtKey = "9xStlNM+DbJTIQ0zOk+3X10gngEB9JOEKiVMYfAVWfc";


class CartManager {
  constructor() {
    this.cartService = new CartService();
    this.productService = new ProductService();
  }

  // Create new cart
  async create() {
    const newCart = new Cart({
      _id: new mongoose.Types.ObjectId(),
      products: [],
      subtotalCost: 0,
      timeCreated: new Date()
    });
    try {
      const result = await this.cartService.create(newCart);

      // When a cart is created, sign cart id with JWT and return token to shopper
      const token = await this._getToken(result._id);
      return {
        status: 201,
        json: {
          message: 'Cart added to database',
          request: {
            type: 'POST',
            url: `http://localhost:3000${route}/new`,
          },
          token: token,
          result,
        },
      };
    } catch (error) {
      return { status: 500, json: error };
    }
  }

  // Find cart by id
  async findById(params) {
    // TODO: access cart only if authorized with JWT
    const { id, token } = params;

    try {
      // Get cart only if token returns id  corresponding to shopper's cart
      const jwtResult = await this._verifyToken(token);
      if (!jwtResult.id || id !== jwtResult.id) {
        return { status: 403, json: jwtResult };
      }
      const result = await this.cartService.findById(id);
      if (!result) {
        return {
          status: 404,
          json: {
            message: 'Cart not found',
          },
        };
      }

      return {
        status: 200,
        json: {
          message: 'Cart pulled from database',
          request: {
            type: 'GET',
            url: `http://localhost:3000${route}`,
          },
          result,
        },
      };
    } catch (error) {
      console.log(error);
      return { status: 500, json: error };
    }
  }

  // Remove products from cart, reduce subtotal to 0 and reduce inventory of each product
  async checkout(params) {
    const { id, token } = params;
    try {
      // complete purchase only if token returns id of shopper's cart
      const jwtResult = await this._verifyToken(token);
      if (!jwtResult.id || id !== jwtResult.id) {
        return { status: 403, json: jwtResult };
      }
      let cart = await this.cartService.findById(id);
      let productIds = [];

      for (let i = 0; i < cart.products.length; i++) {
        productIds.push(cart.products[i]._id);
      }
      const invetoryResult = await this.productService.updateProductInventory(productIds);
      let isValidInventory = true;
      for (let i = 0; i < invetoryResult.length; i++) {
        if (invetoryResult[i].inventoryCount < 0) {
          isValidInventory = false;
          break;
        }
      }

      if (!isValidInventory) {
        return {
          status: 400,
          json: {
            message: "Not enough products available in requested quantity"
          }
        };
      }
      cart.products = [];
      cart.subtotalCost = 0;
      const cartResult = await this.cartService.update(id, cart);
      return {
        status: 200,
        json: {
          message: 'Cart completed',
          request: {
            type: 'GET',
            url: `http://localhost:3000${route}complete`,
          },
          invetoryResult,
          cartResult
        },
      };
    } catch(error) {
      console.log(error);
      return { status: 500, json: error };
    }
  }

  _getToken(id) {
    return new Promise((resolve) => {
      jwt.sign({ id }, secretJwtKey, (err, token) => {
        resolve(token);
      });
    });
  }

  _verifyToken(token) {
    return new Promise((resolve) => {
      jwt.verify(token, secretJwtKey, (err, authData) => {
        if (err) {
          resolve(err);
        } else {
          resolve(authData);
        }
      });
    });
  }
}

module.exports = CartManager;
