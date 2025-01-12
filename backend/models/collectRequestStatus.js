const mongoose = require('mongoose');

// Define the schema for collect_request_status
const collectRequestStatusSchema = new mongoose.Schema(
  {
    collect_id: { type: mongoose.Schema.Types.ObjectId, required: true }, // Reference to collect_request
    status: { type: String, required: true }, // Status (e.g., PENDING, SUCCESS)
    payment_method: { type: String, default: 'NA' },
    gateway: { type: String, default: 'NA' },
    transaction_amount: { type: Number }, // Optional
    bank_reference: { type: String }, // Optional
  },
  { collection: 'collect_request_status' } // Explicitly specify the collection name
);

// Export the model
const CollectRequestStatus = mongoose.model('CollectRequestStatus', collectRequestStatusSchema);
module.exports = CollectRequestStatus;
