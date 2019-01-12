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

  // Add product to inventory
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
          message: 'Product added to database',
          request: {
            type: 'POST',
            url: `http://localhost:3000${route}/new`,
          },
          result,
        },
      };
    } catch (error) {
      return { status: 500, json: error };
    }
  }

  // Find all products
  async find(query) {
    const { isAvailable } = query;
    let result = {};
    try {
      if (isAvailable) {
        // only return products with available inventory
        result = await this.productService.getAvailable();
      } else {
        result = await this.productService.getAll();
      }

      if (!result) {
        return {
          status: 404,
          json: {
            message: '0 products found',
          },
        };
      }

      return {
        status: 200,
        json: {
          message: 'Products pulled from database',
          request: {
            type: 'GET',
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

  // Find product by ID
  async findById(id) {
    try {
      const result = await this.productService.findById(id);
      if (!result) {
        return {
          status: 404,
          json: {
            message: 'Product not found',
          },
        };
      }

      return {
        status: 200,
        json: {
          message: 'Product pulled from database',
          request: {
            type: 'GET',
            url: `http://localhost:3000${route}/id/${id}`,
          },
          result,
        },
      };
    } catch (error) {
      console.log(error);
      return { status: 500, json: error };
    }
  }

  // Add product to cart
  async purchase(body) {
    // TODO: add permission to purchase only if authorized with JWT
    const { productId, cartId } = body;
    try {
      let product = await this.productService.findById(productId);
      if (product.inventoryCount === 0) {
        return {
          status: 204,
          json: {
            message: 'Item not available in inventory'
          }
        };
      } else {
        let cart = await this.cartService.findById(cartId);
        if (!cart) {
          return {
            status: 400,
            json: {
              message: 'Cart does not exist'
            }
          }
        }

        cart.products.push(product);
        cart.subtotalCost += product.price;
        const cartResult = await this.cartService.update(cartId, cart);
        return {
          status: 200,
          json: {
            message: 'Product purchased successfully',
            request: {
              type: 'PATCH',
              url: `http://localhost:3000${route}purchase`,
            },
            cartResult,
          },
        };
      }
    } catch (error) {
      return { status: 500, json: error };
    }
  }

}

module.exports = ProductManager;
