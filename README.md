# School Backend and Frontend

## Backend

To run the backend application, follow the steps below:

### Installation

1. Install the necessary dependencies:
   ```bash
   npm install
Run the application:

bash
Copy code
node app.js
The backend will be running and can be accessed via the base URL:
https://school-backend-5.onrender.com

Available API Endpoints
1. Get All Transactions
Fetches all transaction details:

bash
Copy code
GET https://school-backend-5.onrender.com/api/transactions
2. Get Transactions for a Particular School
Fetches transaction details for a specific school:

bash
Copy code
GET https://school-backend-5.onrender.com/api/transactions/school/{schoolId}
Example:

bash
Copy code
GET https://school-backend-5.onrender.com/api/transactions/school/67308b27e9bbcdf5f22d24c23
3. Check Transaction Status by Custom Order ID
Fetches details of a specific transaction based on custom_order_id:

bash
Copy code
GET https://school-backend-5.onrender.com/api/check-status?custom_order_id={customOrderId}
Example:

bash
Copy code
GET https://school-backend-5.onrender.com/api/check-status?custom_order_id=test41
4. Update Transaction Status
Update the status of a transaction. Send a POST request with the following body:

bash
Copy code
POST https://school-backend-5.onrender.com/api/transactions/status-update
Request Body:

json
Copy code
{
  "_id": "6730e74326c65c39b0ee0248",
  "status": "SUCCESS",
  "transaction_amount": 15000,
  "gateway": "Stripe",
  "bank_reference": "STP12345"
}
Response:

json
Copy code
{
  "message": "Transaction status updated successfully",
  "transaction": {
    "_id": "6730e74326c65c39b0ee0248",
    "collect_id": "6730d9b926c65c39b0ee016f",
    "status": "SUCCESS",
    "payment_method": "NA",
    "gateway": "Stripe",
    "transaction_amount": 15000,
    "bank_refrence": "YESBNK259",
    "bank_reference": "STP12345"
  }
}
5. Webhook Update
Update the transaction status using a webhook. Send a POST request with the following body:

bash
Copy code
POST https://school-backend-5.onrender.com/api/webhook
Request Body:

json
Copy code
{
  "status": 200,
  "order_info": {
    "order_id": "6730d9b926c65c39b0ee015e",
    "order_amount": 10000,
    "transaction_amount": 22000,
    "gateway": "PhonePe",
    "bank_reference": "YESBNK222"
  }
}
Response:

json
Copy code
{
  "message": "Transaction status updated",
  "updatedTransaction": {
    "acknowledged": true,
    "modifiedCount": 0,
    "upsertedId": null,
    "upsertedCount": 0,
    "matchedCount": 0
  }
}
Frontend
The frontend is a React application, deployed on Vercel. Follow the steps below to run the application:

Installation
Install the necessary dependencies:

bash
Copy code
npm install
Run the application:

bash
Copy code
npm start
The frontend will be available at: https://school-frontend-eight.vercel.app

Deployment
Backend: Deployed on Render
Base URL: https://school-backend-5.onrender.com

Frontend: Deployed on Vercel
URL: https://school-frontend-eight.vercel.app
