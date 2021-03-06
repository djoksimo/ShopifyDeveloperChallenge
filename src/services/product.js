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
    return Product.find({ inventoryCount: { $gt: 0 } }).exec();
  }

  async updateProductInventory(productIds) {
    return Product.updateMany(
      { _id: { $in: productIds }},
      { $inc: { inventoryCount: -1 }}).exec();
  }

  async update(id, data) {
    return Product.updateOne({ _id: id }, { $set: data }).exec();
  }
}

module.exports = ProductService;
