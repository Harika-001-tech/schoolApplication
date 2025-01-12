const mongoose = require('mongoose');

// Define the schema for collect_request
const collectRequestSchema = new mongoose.Schema(
  {
    school_id: { type: String, required: true },
    trustee_id: { type: String }, // Optional
    gateway: { type: String, required: true },
    order_amount: { type: Number, required: true },
    custom_order_id: { type: String, required: true },
  },
  { collection: 'collect_request' } // Explicitly specify the collection name
);

// Export the model
const CollectRequest = mongoose.model('CollectRequest', collectRequestSchema);
module.exports = CollectRequest;
