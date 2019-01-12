const Cart = require('../models/cart');
const mongoose = require('mongoose');
const route = '/cart/';
let CartService = require('../services/cart');

class CartManager {
  constructor() {
    this.cartService = new CartService();
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
          message: "Cart added to database",
          request: {
            type: "POST",
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
  async findById(query) {
    // TODO: access cart only if authorized with JWT
    const { id } = query;

    try {
      const result = await this.cartService.findById(id);
      if (!result) {
        return {
          status: 404,
          json: {
            message: "Cart not found",
          },
        };
      }

      return {
        status: 200,
        json: {
          message: "Cart pulled from database",
          request: {
            type: "GET",
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
}

module.exports = CartManager;
