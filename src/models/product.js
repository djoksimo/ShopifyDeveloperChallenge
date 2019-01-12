const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, required: true, auto: true },
  title: { type: String, required: true },
  price: { type: Number, required: true },
  inventoryCount: { type: Number, required: true },
});

module.exports = mongoose.model("Product", productSchema);
