const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const CollectRequest = require('../models/collectRequest');
const CollectRequestStatus = require('../models/collectRequestStatus');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

// MongoDB connection URI
app.use(bodyParser.json());
app.use(cors());

// MongoDB Connection
const mongoURI = process.env.MONGO_URI;

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .catch(err => console.log('MongoDB connection error:', err));

// Fetch All Transactions
const ObjectId = mongoose.Types.ObjectId;

router.get('/transactions', async (req, res) => {
  try {
    const transactions = await CollectRequestStatus.aggregate([
      {
        $addFields: {
          collect_id: { $toObjectId: "$collect_id" }, 
        },
      },
      {
        $lookup: {
          from: 'collect_request',
          localField: 'collect_id',
          foreignField: '_id',
          as: 'collectDetails',
        },
      },
      { $unwind: '$collectDetails' },
      {
        $project: {
          collect_id: 1,
          school_id: '$collectDetails.school_id',
          gateway: '$collectDetails.gateway',
          order_amount: '$collectDetails.order_amount',
          transaction_amount: 1,
          status: 1,
          custom_order_id: '$collectDetails.custom_order_id',
        },
      },
    ]);

    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching transactions' });
  }
});

// Fetch Transactions by School
router.get('/transactions/school/:schoolId', async (req, res) => {
  try {
    const { schoolId } = req.params;

    const transactions = await CollectRequestStatus.aggregate([
      {
        $addFields: {
          collect_id: { $toObjectId: "$collect_id" },
        },
      },
      {
        $lookup: {
          from: 'collect_request',
          localField: 'collect_id',
          foreignField: '_id',
          as: 'collectDetails',
        },
      },
      { $unwind: '$collectDetails' },
      {
        $match: {
          'collectDetails.school_id': schoolId,
        },
      },
      {
        $project: {
          collect_id: 1,
          school_id: '$collectDetails.school_id',
          gateway: '$collectDetails.gateway',
          order_amount: '$collectDetails.order_amount',
          transaction_amount: 1,
          status: 1,
          custom_order_id: '$collectDetails.custom_order_id',
        },
      },
    ]);

    if (transactions.length === 0) {
      return res.status(404).json({ message: 'No transactions found for this schoolId' });
    }

    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching transactions' });
  }
});

// Transaction Status Check
router.get('/check-status', async (req, res) => {
  try {
    const { custom_order_id } = req.query;

    if (!custom_order_id) {
      return res.status(400).json({ message: 'Custom order ID is required' });
    }

    const transaction = await CollectRequestStatus.aggregate([
      {
        $addFields: {
          collect_id: { $toObjectId: "$collect_id" },
        },
      },
      {
        $lookup: {
          from: 'collect_request',
          localField: 'collect_id',
          foreignField: '_id',
          as: 'collectDetails',
        },
      },
      { $unwind: '$collectDetails' },
      {
        $match: {
          'collectDetails.custom_order_id': custom_order_id,
        },
      },
      {
        $project: {
          collect_id: 1,
          school_id: '$collectDetails.school_id',
          gateway: '$collectDetails.gateway',
          order_amount: '$collectDetails.order_amount',
          transaction_amount: 1,
          status: 1,
          custom_order_id: '$collectDetails.custom_order_id',
        },
      },
    ]);

    if (!transaction || transaction.length === 0) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.status(200).json(transaction[0]);
  } catch (error) {
    res.status(500).json({ error: `Error fetching transaction status: ${error.message}` });
  }
});

// Webhook Endpoint for Status Updates
router.post('/webhook', async (req, res) => {
  try {
    const { status, order_info } = req.body;

    if (!status || !order_info || !order_info.order_id) {
      return res.status(400).json({ message: 'Invalid payload' });
    }

    const { order_id, order_amount, transaction_amount, gateway, bank_reference } = order_info;
    const collect_id = order_id;

    const transaction = await CollectRequestStatus.aggregate([
      {
        $addFields: {
          collect_id: { $toObjectId: "$collect_id" },
        },
      },
      {
        $match: {
          collect_id: new ObjectId(collect_id),
        },
      },
      {
        $set: {
          status: status,
          transaction_amount: transaction_amount,
          gateway: gateway,
          bank_reference: bank_reference,
        },
      },
      {
        $project: {
          _id: 1,
          collect_id: 1,
          status: 1,
          transaction_amount: 1,
          gateway: 1,
          bank_reference: 1,
        },
      },
    ]);

    if (transaction.length === 0) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    const updatedTransaction = await CollectRequestStatus.updateOne(
      { collect_id: new ObjectId(collect_id) },
      {
        $set: {
          status: status,
          transaction_amount: transaction_amount,
          gateway: gateway,
          bank_reference: bank_reference,
        },
      }
    );

    res.status(200).json({ message: 'Transaction status updated', updatedTransaction });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Post status update 
router.post('/transactions/status-update', async (req, res) => {
  try {
    const { _id, status, transaction_amount, gateway, bank_reference } = req.body;

    if (!_id || !status || !transaction_amount || !gateway || !bank_reference) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (!ObjectId.isValid(_id)) {
      return res.status(400).json({ message: 'Invalid _id format' });
    }

    const updatedTransaction = await CollectRequestStatus.findOneAndUpdate(
      { _id: new ObjectId(_id) },
      {
        $set: {
          status,
          transaction_amount,
          gateway,
          bank_reference,
        },
      },
      { new: true }
    );

    if (!updatedTransaction) {
      return res.status(404).json({ message: 'Transaction not found' });
    }

    res.status(200).json({
      message: 'Transaction status updated successfully',
      transaction: updatedTransaction,
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

module.exports = router;
