// backend/models/Product.js
const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true
  },
  publicId: {
    type: String,
    required: true
  },
  isPrimary: {
    type: Boolean,
    default: false
  }
});

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: function() {
      return this.category === 'fashion';
    }
  },
  category: {
    type: String,
    required: true,
    enum: ['fashion', 'jewellery', 'stoles-scarves'],
  },
  subcategory: {
    type: String,
    enum: ['necklace', 'earrings', 'rings'],
    required: function() {
      return this.category === 'jewellery';
    }
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  description: {
    type: String,
    required: true
  },
  media: [mediaSchema],
  whatsappNumber: {
    type: String,
    required: true,
    default: '+919979007261'
  },
  stockStatus: {
    type: String,
    required: true,
    enum: ['instock', 'soldout', 'customization'],
    default: 'instock'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index for efficient queries
productSchema.index({ category: 1, subcategory: 1 });

module.exports = mongoose.model('Product', productSchema);