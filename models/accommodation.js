const mongoose = require('mongoose');

const accommodationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['Studio', 'Shared', 'En-suite', 'One Bedroom'],
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    amenities: [String],
    imageUrl: {
      type: String,
      default: 'https://via.placeholder.com/300x200',
    },
    available: {
      type: Boolean,
      default: true,
    },
    distanceFromCampus: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Accommodation', accommodationSchema);