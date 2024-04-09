const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
require('dotenv').config();

const router = express.Router();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || 'secret-key';
// Middleware for checking staff role
function checkStaffRole(req, res, next) {
    const authcookie = req.cookies.authcookie;

    jwt.verify(authcookie, JWT_SECRET_KEY , (err, data) => {
        if (err) {
            res.sendStatus(403);
        } else if (data.user && data.user.role === 'staff') {
            req.user = data.user;
            next();
        } else {
            res.sendStatus(403);
        }
    });
}

// Example routes for staff
router.get('/data', checkStaffRole, (req, res) => {
    // Logic for fetching staff-specific data from the database
    db.query('SELECT * FROM staff_data WHERE staff_id = ?', [req.user.username], (err, results) => {
        if (err) {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
            return;
        }
        res.json({ message: 'Staff data fetched successfully', data: results });
    });
});

router.post('/addPurchase', (req, res) => {
    console.log(req.body.data)
    const { SupplierID, PurchaseName, Quantity, PurchaseDate,PurchaseAmount} = req.body.data;
    const { UserID } = req.body;

    const query = `INSERT INTO material_purchases (Purchaser_id,SupplierID, PurchaseName, Quantity, PurchaseDate,PurchaseAmount) 
                   VALUES (?,?, ?, ?, ?,?)`;
    
    // Execute the SQL query
    db.query(query, [UserID,SupplierID, PurchaseName, Quantity, PurchaseDate,PurchaseAmount], (err, result) => {
      if (err) {
        console.error('Error inserting data into purchase table:', err);
        res.status(500).json({ error: 'Error inserting data into purchase table' });
        return;
      }
      console.log('Data inserted into purchase table successfully');
      res.status(200).json({ message: "Purchase Added" });
    });
  });

router.get('/fetchSuppliers', (req,res)=>{
    const sql = "SELECT UserID,FullName FROM users where Role = 'Supplier'";
    db.query(sql, (err,result)=>{
        if(err){
            console.log(err);
            return;
        }
        console.log(result);
        return res.status(200).json({result })
    })
})

router.get('/PurchaseList', (req, res) => {
    const sql = `
        SELECT mp.PurchaseID, mp.Purchaser_id, mp.SupplierID,u2.FullName,mp.PurchaseName, mp.Quantity, 
               mp.PurchaseDate, mp.notification, mp.payment_status,mp.PurchaseAmount, mp.payment_date,mp.approve_status,mp.InvoiceImage
        FROM material_purchases mp 
        INNER JOIN users u1 ON mp.Purchaser_id = u1.UserID AND u1.Role = 'Sales'
        INNER JOIN users u2 ON mp.SupplierID = u2.UserID AND u2.Role = 'Supplier';
    `;

    // Assuming you have a database connection and can execute SQL queries
    db.query(sql, (error, results, fields) => {
        if (error) {
            console.error("Error fetching purchase list:", error);
            res.status(500).json({ error: "Internal server error" });
        } else {
            res.status(200).json({ purchases: results });
        }
    });
});

router.put('/updatePurchase', (req, res) => {
    console.log(req.body)
    const { SupplierID, PurchaseName, Quantity, PurchaseDate, PurchaseAmount } = req.body.data;
    const {PurchaseID}= req.body;

    const query = `UPDATE material_purchases 
                   SET SupplierID=?, PurchaseName=?, Quantity=?, PurchaseDate=?, PurchaseAmount=? 
                   WHERE PurchaseID=?`;


    db.query(query, [SupplierID, PurchaseName, Quantity,PurchaseDate,PurchaseAmount,PurchaseID], (err, result) => {
        if (err) {
            console.error('Error updating purchase:', err);
            res.status(500).json({ error: 'Error updating purchase' });
            return;
        }
        console.log('Purchase updated successfully');
        res.status(200).json({ message: 'Purchase updated successfully' });
    });
});

router.put('/notifysupplier', (req, res) => {
    const {id}= req.body;
    
    const query = `UPDATE material_purchases 
                   SET notification = 'Material is out of stock!' 
                   WHERE PurchaseID=?`;

    // Execute the SQL query
    db.query(query, [id], (err, result) => {
        if (err) {
            console.error('Error updating purchase:', err);
            res.status(500).json({message: 'Notification Failed', error: 'Error updating purchase' });
            return;
        }
        console.log('Purchase updated successfully');
        res.status(200).json({ message: 'Notification has sent' });
    });
});


router.get('/supplier-payoutlist', (req, res) => {
    const { SupplierID } = req.query;
    console.log(SupplierID);

    const sql = `
        SELECT mp.PurchaseID,mp.PurchaseAmount, mp.Purchaser_id, mp.SupplierID, u2.FullName, mp.PurchaseName, mp.Quantity, 
               mp.PurchaseDate, mp.notification, mp.payment_status, mp.payment_date,mp.approve_status,mp.InvoiceImage
        FROM material_purchases mp 
        INNER JOIN users u1 ON mp.Purchaser_id = u1.UserID AND u1.Role = 'Sales'
        INNER JOIN users u2 ON mp.SupplierID = u2.UserID AND u2.Role = 'Supplier'
        WHERE mp.SupplierID = ?
    `;

    db.query(sql, [SupplierID], (error, results, fields) => {
        if (error) {
            console.error("Error fetching purchase list:", error);
            res.status(500).json({ error: "Internal server error" });
        } else {
            console.log(results);
            res.status(200).json({ purchases: results });
        }
    });
});


router.put('/update-approve-status/:purchaseID', (req, res) => {
    const { purchaseID } = req.params;
    const { status } = req.body; // status will be either 1 (approve) or 2 (reject)
  
    // Assuming you have a database connection and can execute SQL queries
    const sql = `UPDATE material_purchases SET approve_status = ? WHERE PurchaseID = ?`;
    db.query(sql, [status, purchaseID], (error, results, fields) => {
      if (error) {
        console.error("Error updating approve status:", error);
        res.status(500).json({ error: "Internal server error" });
      } else {
        res.status(200).json({ message: "Approve status updated successfully" });
      }
    });
  });

// Backend Route to Get Latest Payment Details for Specific Supplier ID
router.get('/supplier/:supplierId/latest-payment', async (req, res) => {
    try {
      const { supplierId } = req.params;
  
      const query = `
      SELECT mp.PurchaseAmount,mp.PurchaseID, mp.Purchaser_id, mp.SupplierID, u2.FullName, mp.PurchaseName, mp.Quantity, mp.PurchaseDate, mp.notification, mp.payment_status, mp.payment_date, mp.approve_status, mp.InvoiceImage FROM material_purchases mp INNER JOIN users u1 ON mp.Purchaser_id = u1.UserID AND u1.Role = 'Sales' INNER JOIN users u2 ON mp.SupplierID = u2.UserID AND u2.Role = 'Supplier' WHERE mp.SupplierID = ? ORDER BY mp.PurchaseDate DESC LIMIT 4;

      `;
  
      // Execute the query to fetch the latest payment details
      db.query(query, [supplierId], (error, results) => {
        if (error) {
          console.error('Error fetching latest payment details:', error);
          return res.status(500).json({ message: 'Internal server error' });
        }
  
        if (results.length === 0) {
          return res.status(404).json({ message: 'No payment details found for the specified supplier' });
        }
  
        return res.status(200).json({ results });
      });
    } catch (error) {
      console.error('Error fetching latest payment details:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  });
  
module.exports = router;
