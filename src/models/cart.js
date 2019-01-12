const mongoose = require("mongoose");

const cartSchema = mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, required: true, auto: true },
  products: { type: [mongoose.Schema.Types.ObjectId], required: true, ref: "Product" },
  subtotalCost: { type: Number, required: true },
  timeCreated: { type: Date, required: true },
});

module.exports = mongoose.model("Cart", cartSchema);
