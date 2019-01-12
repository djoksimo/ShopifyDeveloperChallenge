const Cart = require('../models/cart');
const mongoose = require('mongoose');
const route = '/cart/';
let CartService = require('../services/cart');
let ProductService = require('../services/product');


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
      return {
        status: 201,
        json: {
          message: 'Cart added to database',
          request: {
            type: 'POST',
            url: `http://localhost:3000${route}`,
          },
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
    const { id } = params;

    try {
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
            url: `http://localhost:3000${route}/${id}`,
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
    // TODO: complete purchase only if authorized with JWT
    const { id } = params;
    try {
      let cart = await this.cartService.findById(id);
      let productIds = [];

      for (let i = 0; i < cart.products.length; i++) {
        productIds.push(cart.products[i]._id);
      }
      const invetoryResult = await this.productService.updateProductInventory(productIds);
      let isValidInventory = true;
      for (let key in invetoryResult) {
        if (invetoryResult.inventoryCount < 0) {
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
            url: `http://localhost:3000${route}/${id}`,
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
}

module.exports = CartManager;
