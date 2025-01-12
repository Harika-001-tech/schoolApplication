for backend:
npm install
node app.js to run the application 
it will display the transactions based on api 
https://school-backend-5.onrender.com/api/transactions
it will fetch all transaction details 
https://school-backend-5.onrender.com/api/transactions/school/67308b27e9bbcdf5f22d24c23
fetches only particluar school details 

https://school-backend-5.onrender.com/api/check-status?custom_order_id=test41
this will fetch details of custom_order_id of test41

Post method:
https://school-backend-5.onrender.com/api/transactions/status-update
updates the status of given id 

{
  "_id": "6730e74326c65c39b0ee0248",
  "status": "SUCCESS",
  "transaction_amount": 15000,
  "gateway": "Stripe",
  "bank_reference": "STP12345"
}

it will be updated as :
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

Post method :
https://school-backend-5.onrender.com/api/webhook

this updates the webhook:
{{
  "status": 200,
  "order_info": {
    "order_id": "6730d9b926c65c39b0ee015e",
    "order_amount": 10000,
    "transaction_amount": 22000,
    "gateway": "PhonePe",
    "bank_reference": "YESBNK222"
  }
}
 updates as :
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

backend is deployed using render : this base url:https://school-backend-5.onrender.com

Front end :
is deployed using vercel :
to start application npm install and npm start 
this is react application deployed link:https://school-frontend-eight.vercel.app/
