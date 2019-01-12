const Product = require('../models/product');

class ProductService {
  async create(data) {
    return data.save();
  }

  async findById(id) {
    return Product.findById(id).exec();
  }

  async getAll() {
    return Product.find().exec();
  }

  async getAvailable() {
    return Product.find(
      { inventoryCount: { $gt: 0 } }).exec();
  }

  async update(id, data) {
    return Product.update({ id }, { $set: data }).exec();
  }
}

module.exports = ProductService;
