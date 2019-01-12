const Cart = require('../models/cart');

class CartService {
  async create(data) {
    return data.save();
  }

  async findById(id) {
    return Cart.findById(id).populate('products').exec(); // Aggregate products associated with product ids
  }

  async update(id, data) {
    return Cart.updateOne({ _id: id }, { $set: data }).exec();
  }
}

module.exports = CartService;
