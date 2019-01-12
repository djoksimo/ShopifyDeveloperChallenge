const Cart = require('../models/cart');

class CartService {
  async create(data) {
    return data.save();
  }

  async findById(id) {
    return Cart.findById(id).populate('products').exec(); // Attach products associated with product ids
  }

  async update(id, data) {
    return Cart.update({ id }, { $set: data }).exec();
  }
}

module.exports = CartService;
