const route = '/product/';
const mongoose = require('mongoose');
const ProductService = require('../services/product');
const CartService = require('../services/cart');
const Product = require('../models/product');

class ProductManager {
  constructor() {
    this.productService = new ProductService();
    this.cartService = new CartService();
  }

  async create(productData) {
    const { title, price, inventoryCount } = productData;
    const newProduct = new Product({
      _id: new mongoose.Types.ObjectId(),
      title: title,
      price: price,
      inventoryCount: inventoryCount,
    });
    try {
      const result = await this.cartService.create(newProduct);
      return {
        status: 201,
        json: {
          message: "Product added to database",
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

  async find(query) {
    const { isAvailable } = query;
    let result = {};
    try {
      if (isAvailable === true) {
        // only return products with available inventory
        result = await this.productService.getAvailable();
      } else {
        result = await this.productService.getAll();
      }

      if (!result) {
        return {
          status: 404,
          json: {
            message: "0 products found",
          },
        };
      }

      return {
        status: 200,
        json: {
          message: "Products pulled from database",
          request: {
            type: "GET",
            url: `http://localhost:3000${route}/all`,
          },
          result,
        },
      };
    } catch(error) {
      console.log(error);
      return { status: 500, json: error };
    }

  }
  async findById(query) {
    const { id } = query;
    try {
      const result = await this.productService.findById(id);
      if (!result) {
        return {
          status: 404,
          json: {
            message: "Product not found",
          },
        };
      }

      return {
        status: 200,
        json: {
          message: "Product pulled from database",
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

  async purchase(body) {
    // TODO: add permission to purchase only if authorized with JWT
    const { productId, cartId } = body;
    try {
      const product = await this.productService.findById(productId);
      if (product.inventoryCount === 0) {
        return {
          status: 501,
          message: "Item not available in inventory"
        };
      } else {
        const cart = await this.cartService.findById(cartId);
        cart.products.push(productId);
        cart.subtotalCost += product.price;
        const cartResult = await this.cartService.update(cartId, cart);
        product.inventoryCount -= 1;
        const productResult = await this.productService.update(productId, product);
        return {
          status: 200,
          json: {
            message: "Product purchased successfully",
            request: {
              type: "PATCH",
              url: `http://localhost:3000${route}/purchase`,
            },
            cartResult,
            productResult
          },
        };
      }
    } catch (error) {
      return { status: 500, json: error };
    }
  }

}

module.exports = ProductManager;
