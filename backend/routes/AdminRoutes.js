const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../config/db');


const router = express.Router();
require('dotenv').config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || 'secret-key';


function checkAdminRole(req, res, next) {
    const token = req.cookies.token;

    jwt.verify(token, JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            console.error(err);
            return res.sendStatus(403);
        }

        const { user } = decoded;

        if (user && user.role === 'Admin') {
            req.user = user;
            next();
        } else {
            res.sendStatus(403);
        }
    });
}

// router.get('/data', checkAdminRole, (req, res) => {
//     res.json({ message: 'This route is protected.', user: req.user });
// });

router.post('/addcustomer', (req, res) => {
    console.log(req.body);
    const { CustomerName, Mobnum, Email, Address, Password, Username } = req.body.data;
    const role = "User"

    // Check if the username or email already exists in the database
    const sqlCheck = "SELECT * FROM users WHERE Username = ? OR Email = ?";
    db.query(sqlCheck, [Username, Email], (sqlCheckErr, checkResult) => {
        if (sqlCheckErr) {
            return res.status(500).json({ message: "Error:" });
        }

        if (checkResult.length > 0) {
            return res.status(200).json({ message: "Sorry, email or username is already associated with an account." });
        }
        const sqlAddCustomer = "INSERT INTO users (FullName, ContactNumber, Email, Address, Password, Username,Role) VALUES (?, ?, ?, ?, ?, ?,?)";
        db.query(sqlAddCustomer, [CustomerName, Mobnum, Email, Address, Password, Username,role], (sqlAddErr, addResult) => {
            if (sqlAddErr) {
                console.log(sqlAddErr)
                return res.status(500).json({ message: "Error adding customer:" });
            }
            return res.status(200).json({ message: "successfull." });
        });
    });
});

router.post('/addEmployee', (req, res) => {
    console.log(req.body);
    const { CustomerName, Mobnum, Email, Address, Password, Username } = req.body.data;
    const role = "Employee"

    // Check if the username or email already exists in the database
    const sqlCheck = "SELECT * FROM users WHERE Username = ? OR Email = ?";
    db.query(sqlCheck, [Username, Email], (sqlCheckErr, checkResult) => {
        if (sqlCheckErr) {
            return res.status(500).json({ message: "Error:" });
        }

        if (checkResult.length > 0) {
            return res.status(200).json({ message: "Sorry, email or username is already associated with an account." });
        }
        const sqlAddCustomer = "INSERT INTO users (FullName, ContactNumber, Email, Address, Password, Username,Role) VALUES (?, ?, ?, ?, ?, ?,?)";
        db.query(sqlAddCustomer, [CustomerName, Mobnum, Email, Address, Password, Username,role], (sqlAddErr, addResult) => {
            if (sqlAddErr) {
                console.log(sqlAddErr)
                return res.status(500).json({ message: "Error adding customer:" });
            }
            return res.status(200).json({ message: "successfull." });
        });
    });
});

router.post('/addSalesManager', (req, res) => {
    console.log(req.body);
    const { CustomerName, Mobnum, Email, Address, Password, Username } = req.body.data;
    const role = "Sales"

    // Check if the username or email already exists in the database
    const sqlCheck = "SELECT * FROM users WHERE Username = ? OR Email = ?";
    db.query(sqlCheck, [Username, Email], (sqlCheckErr, checkResult) => {
        if (sqlCheckErr) {
            return res.status(500).json({ message: "Error:" });
        }

        if (checkResult.length > 0) {
            return res.status(200).json({ message: "Sorry, email or username is already associated with an account." });
        }
        const sqlAddCustomer = "INSERT INTO users (FullName, ContactNumber, Email, Address, Password, Username,Role) VALUES (?, ?, ?, ?, ?, ?,?)";
        db.query(sqlAddCustomer, [CustomerName, Mobnum, Email, Address, Password, Username,role], (sqlAddErr, addResult) => {
            if (sqlAddErr) {
                console.log(sqlAddErr)
                return res.status(500).json({ message: "Error adding customer:" });
            }
            return res.status(200).json({ message: "successfull" });
        });
    });
});

router.post('/addSupplier', (req, res) => {
    console.log(req.body);
    const { CustomerName, Mobnum, Email, Address, Password, Username } = req.body.data;
    const role = "Supplier"

    // Check if the username or email already exists in the database
    const sqlCheck = "SELECT * FROM users WHERE Username = ? OR Email = ?";
    db.query(sqlCheck, [Username, Email], (sqlCheckErr, checkResult) => {
        if (sqlCheckErr) {
            return res.status(500).json({ message: "Error:" });
        }

        if (checkResult.length > 0) {
            return res.status(200).json({ message: "Sorry, email or username is already associated with an account." });
        }
        const sqlAddCustomer = "INSERT INTO users (FullName, ContactNumber, Email, Address, Password, Username,Role) VALUES (?, ?, ?, ?, ?, ?,?)";
        db.query(sqlAddCustomer, [CustomerName, Mobnum, Email, Address, Password, Username,role], (sqlAddErr, addResult) => {
            if (sqlAddErr) {
                console.log(sqlAddErr)
                return res.status(500).json({ message: "Error adding customer:" });
            }
            return res.status(200).json({ message: "successfull" });
        });
    });
});

router.post('/addcategory', (req, res) => {
    console.log(req.body);
    const { CategoryName } = req.body.data;

    // Check if the username or email already exists in the database
    const sqlCheck = "SELECT * FROM categories WHERE CategoryName = ? ";
    db.query(sqlCheck, [CategoryName], (sqlCheckErr, checkResult) => {
        if (sqlCheckErr) {
            return res.status(500).json({ message: "Error:" });
        }

        if (checkResult.length > 0) {
            return res.status(200).json({ message: "Sorry, Category is already present." });
        }
        const sqlAddCustomer = "INSERT INTO categories (CategoryName) VALUES (?)";
        db.query(sqlAddCustomer, [CategoryName], (sqlAddErr, addResult) => {
            if (sqlAddErr) {
                console.log(sqlAddErr)
                return res.status(500).json({ message: "Error adding category:" });
            }
            return res.status(200).json({ message: "successfull" });
        });
    });
});

router.get('/listProducts', (req, res) => {
    const sqlQuery = `SELECT * FROM products inner join stocks on products.ProductID = stocks.ProductID`;

    db.query(sqlQuery, (err, results) => {
    if (err) {
        console.error("Error fetching products:", err);
        return res.status(500).json({ message: "Error fetching products." });
    }
    res.json(results);
    });
});

    router.get('/customerlist', (req, res) => {
        const sqlQuery = `SELECT * FROM users WHERE Role = 'User'`;
    
        // Execute the query
        db.query(sqlQuery, (err, results) => {
        if (err) {
            console.error("Error fetching users:", err);
            return res.status(500).json({ message: "Error fetching users." });
        }
            res.json(results);
        });
    });

    router.get('/Employeelist', (req, res) => {
        const sqlQuery = `SELECT * FROM users WHERE Role = 'Employee'`;
    
        // Execute the query
        db.query(sqlQuery, (err, results) => {
        if (err) {
            console.error("Error fetching users:", err);
            return res.status(500).json({ message: "Error fetching users." });
        }
        res.json(results);
        });
    });

    router.get('/SalesManagerList', (req, res) => {
        const sqlQuery = `SELECT * FROM users WHERE Role = 'Sales'`;
    
        // Execute the query
        db.query(sqlQuery, (err, results) => {
        if (err) {
            console.error("Error fetching users:", err);
            return res.status(500).json({ message: "Error fetching users." });
        }
        res.json(results);
        });
    });

    router.get('/SuppliersList', (req, res) => {
        const sqlQuery = `SELECT * FROM users WHERE Role = 'Supplier'`;
    
        // Execute the query
        db.query(sqlQuery, (err, results) => {
        if (err) {
            console.error("Error fetching users:", err);
            return res.status(500).json({ message: "Error fetching users." });
        }
        res.json(results);
        });
    });

    router.get('/categories', (req, res) => {
        const sqlQuery = `SELECT * FROM categories`;
    
        // Execute the query
        db.query(sqlQuery, (err, results) => {
        if (err) {
            console.error("Error fetching categories:", err);
            return res.status(500).json({ message: "Error fetching users." });
        }
        res.json(results);
        });
    });

    router.put('/updateCategory', (req, res) => {
        const { CategoryName } = req.body.data;
        const oldCategory = req.body.oldData.CategoryName;
        const CategoryID = req.body.oldData.CategoryID;
    
    
        const updateCategory = () => {
            const sqlUpdateQuery = `UPDATE categories SET CategoryName = ? WHERE CategoryID = ?`;
            db.query(sqlUpdateQuery, [CategoryName, CategoryID], (err, results) => {
                if (err) {
                    console.error("Error updating category:", err);
                    return res.status(500).json({ message: "Error updating category." });
                }
                return res.status(200).json({ message: "Update successful" });
            });
        };
    
        const checkAndUpdateCategory = () => {
            const sqlQuery = `SELECT * FROM categories WHERE CategoryName = ?`;
            db.query(sqlQuery, [CategoryName], (err, results) => {
                if (err) {
                    console.error("Error fetching categories:", err);
                    return res.status(500).json({ message: "Error fetching categories." });
                }
                if (results.length > 0) {
                    return res.status(200).json({ message: "Category already exists." });
                } else {
                    updateCategory();
                }
            });
        };
    
        if (CategoryName !== oldCategory) {
            checkAndUpdateCategory();
        } else {
            updateCategory();
        }
    });
    
    

  router.put('/updatecustomer', async (req, res) => {

    console.log(req.body);
    const UserID = req.body.oldData.UserID;
    const OldEmail = req.body.oldData.Email;
    const OldUsername = req.body.oldData.Username;

    const { FullName, ContactNumber, Email, Address, Password, Username } = req.body.data;


function updateCustomer() {
    const sqlQuery = "UPDATE users SET FullName = ?, ContactNumber = ?, Email = ?, Address = ?, Password = ?, Username = ? WHERE UserID = ?";
    const sqlParams = [FullName, ContactNumber, Email, Address, Password, Username, UserID];
    console.log(sqlQuery, sqlParams);
    db.query(sqlQuery, sqlParams, (UpdateError, UpdateResult) => {
        if (UpdateError) {
            console.log(UpdateError);
            return res.status(500).json({ message: "Error while updating customer" });
        }
        if (UpdateResult) {
            console.log("Updated");
            return res.status(200).json({ message: "Updation successfull!" });
        }
    });
}

    if (Email !== OldEmail && Username !== OldUsername) {
        console.log("if")
        db.query("SELECT * FROM users WHERE Email = ? OR Username = ?",
            [Email, Username],
            (CheckError, UserCheck) => {
                if (CheckError) {
                    console.error("Error checking for duplicate user:", CheckError);
                    return res.status(500).json({ message: "Internal server error" });
                }
                if (UserCheck.length > 0) {
                    console.log(UserCheck);
                    console.log("User Exists");
                    return res.status(200).json({ message: "Email or username is already associated with another account" });
                }else{
                    updateCustomer();
                }
            });
    } else if(Username !== OldUsername) {
        console.log("2")

        db.query("SELECT * FROM users WHERE Username = ?",
        [Username],
        (CheckError, UserCheck) => {
            if (CheckError) {
                // Handle query error
                console.error("Error checking for duplicate user:", CheckError);
                return res.status(500).json({ message: "Internal server error" });
            }
            if(UserCheck.length > 0) {
                return res.status(200).json({ message: "Username is already associated with another account" });
            }else{
                updateCustomer();
            }
        }); 
    }else if (Email !== OldEmail) {
        console.log("3")
        db.query("SELECT * FROM users WHERE Email = ?",
        [Email],
        (CheckError, UserCheck) => {
            if (CheckError) {
                // Handle query error
                console.error("Error checking for duplicate user:", CheckError);
                return res.status(500).json({ message: "Internal server error" });
            }
            if(UserCheck.length > 0) {
                console.log(UserCheck)
                return res.status(200).json({ message: "Email is already associated with another account" });
            }else{
                updateCustomer();
            }
        });
    }else{
        console.log("else")
        updateCustomer();
    } 
});



router.put('/UpdateUserStatus', (req, res) => {
    const {UserID,user_status} =req.body.data;
    let status = 1;
    if(user_status === 1){
        status = 0;
    }
    const sqlQuery = `UPDATE users set user_status = ? WHERE UserID = ?`;
    console.log(status,UserID);
    db.query(sqlQuery, [status,UserID],(err, results) => {
      if (err) {
        console.error("Error fetching users:", err);
        return res.status(500).json({ message: "Error fetching users." });
      }
      res.status(200).json({message: "Status Updated"});
    });
  });

  router.put('/upateProductStatus', (req, res) => {
    const {ProductID,product_status} =req.body.data;
    let status = 1;
    if(product_status === 1){
        status = 0;
    }
    const sqlQuery = `UPDATE products set product_status = ? WHERE ProductID = ?`;
    console.log(status,ProductID);
    db.query(sqlQuery, [status,ProductID],(err, results) => {
      if (err) {
        console.error("Error fetching users:", err);
        return res.status(500).json({ message: "Error fetching users." });
      }
      res.status(200).json({message: "Status Updated"});
    });
  });

  router.put('/UpdateCategoryStatus', (req, res) => {
    const {CategoryID,CategoryStatus} =req.body.data;
    let status = 1;
    if(CategoryStatus === 1){
        status = 0;
    }
    const sqlQuery = `UPDATE categories set CategoryStatus = ? WHERE CategoryID = ?`;

    db.query(sqlQuery, [status,CategoryID],(err, results) => {
      if (err) {
        console.error("Error fetching users:", err);
        return res.status(500).json({ message: "Error fetching users." });
      }
      res.status(200).json({message: "Status Updated"});
    });
  });


  router.put('/updateProduct', (req, res) => {
    // const productId = req.params.productId;
    const { Name, Description, Price, Quantity, CategoryID, ExpiryDate } = req.body.data;
    const {ProductID} = req.body;
    // console.log(req.body.data)
    console.log([Name, Description, Price, Quantity, CategoryID, ProductID])
    // Check if the product exists
    const checkQuery = 'SELECT * FROM products WHERE Name = ?';
    db.query(checkQuery, [Name], (error, results) => {
      if (error) {
        console.error('Error checking product existence:', error);
        return res.status(500).json({ success: false, message: 'Error checking product existence.' });
      }
  
      const updateQuery = 'UPDATE products SET Name = ?, Description = ?, Price = ?, Quantity = ?, CategoryID = ? WHERE ProductID = ?';
      db.query(updateQuery, [Name, Description, Price, Quantity, CategoryID, ProductID], (error) => {
        if (error) {
          console.error('Error updating product:', error);
          return res.status(500).json({ success: false, message: 'Error updating product. Please try again.' });
        }

        db.query('update stocks set ExpiryDate = ? ,Quantity = ? where ProductID=?',[ExpiryDate,Quantity,ProductID],(err,result)=>{    
            if(err){
                console.log(err);
                return res.status(500).json({ success: false, message: 'Product Updation Failed.' });
            }
            if(result){
                console.log("updated");
                return res.status(200).json({ success: true, message: 'Product Updated.' });
            }
        });
      });        
    });
  });

  router.get('/GetOrderDetails', (req, res) => {
    console.log(req.body)
    // Check if userID is provided in the request body  
      const query = `SELECT o.OrderID, u.FullName,u.Email,u.ContactNumber,u.Address, o.OrderDate, o.TotalAmount, CONCAT('[', GROUP_CONCAT(JSON_OBJECT('ProductName', p.Name, 'Quantity', od.Quantity, 'UnitPrice', od.UnitPrice) SEPARATOR ','), ']') AS ProductDetails FROM orders o INNER JOIN (SELECT od.OrderID, od.ProductID, od.Quantity, od.UnitPrice FROM order_details od ORDER BY od.OrderID, od.OrderDetailID) od ON o.OrderID = od.OrderID INNER JOIN products p ON od.ProductID = p.ProductID INNER JOIN users u ON o.UserID = u.UserID GROUP BY o.OrderID, u.FullName, o.OrderDate, o.TotalAmount
      `;
  
      db.query(query, (err, results) => {
        if (err) {
          console.error('Error executing MySQL query:', err);
          return res.status(500).json({ error: 'Database error',err });
        }
  
        if (results.length === 0) {
          console.log(results);
          return res.status(200).json({ message: 'No orders found for the specified user' });
        }
  
        return res.status(200).json({ orders: results });
      });
  });


  router.get('/getdata', (req, res) => {
    // Query to fetch total number of users
    const usersQuery = `SELECT COUNT(*) AS totalUsers FROM users`;
  
    // Query to fetch total number of orders
    const ordersQuery = `SELECT COUNT(*) AS totalOrders FROM orders`;
  
    // Query to fetch total number of products
    const productsQuery = `SELECT COUNT(*) AS totalProducts FROM products`;
  
    // Query to fetch total profit
    const profitQuery = `SELECT SUM(TotalAmount) AS totalProfit FROM orders`;
  
    // Array to store the results of each query
    const results = [];
  
    // Execute the queries sequentially
    db.query(usersQuery, (err, usersResult) => {
      if (err) {
        console.error('Error executing usersQuery:', err);
        return res.status(500).json({ error: 'Database error', err });
      }
      results.push(usersResult[0]);
  
      db.query(ordersQuery, (err, ordersResult) => {
        if (err) {
          console.error('Error executing ordersQuery:', err);
          return res.status(500).json({ error: 'Database error', err });
        }
        results.push(ordersResult[0]);
  
        db.query(productsQuery, (err, productsResult) => {
          if (err) {
            console.error('Error executing productsQuery:', err);
            return res.status(500).json({ error: 'Database error', err });
          }
          results.push(productsResult[0]);
  
          db.query(profitQuery, (err, profitResult) => {
            if (err) {
              console.error('Error executing profitQuery:', err);
              return res.status(500).json({ error: 'Database error', err });
            }
            results.push(profitResult[0]);
  
            // Send the aggregated results as JSON response
            return res.status(200).json({
              totalUsers: results[0].totalUsers,
              totalOrders: results[1].totalOrders,
              totalProducts: results[2].totalProducts,
              totalProfit: results[3].totalProfit
            });
          });
        });
      });
    });
  });

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

router.put('/update-payment', async (req, res) => {
    const { PurchaseID } = req.body;
  
    const query = `UPDATE material_purchases SET payment_status = 1, payment_date = CURRENT_DATE WHERE PurchaseID = ?`;
    db.query(query, [PurchaseID], (error, result) => {
        if (error) {
        console.error('Error updating payment status:', error);
        return res.status(200).json({ success: false, message: 'Internal server error' });
        }
        return res.status(200).json({ success: true, message: 'Payment status updated successfully' });
    });
  });
  

  router.get('/getusers', (req,res)=> {
      const sql = "SELECT * FROM users WHERE Role = 'Sales' OR Role = 'Employee'";
        db.query(sql, (err, result)=>{
            if(err){
                console.log(err);
            }
            res.status(200).json(result);
        })
  })

  router.get('/getwages', (req,res)=>{
    const sql = "SELECT w.*, users.FullName FROM wages w inner join users on w.UserID = users.UserID";
    db.query(sql,(err,result)=>{
        if(err){
            console.log(err);
            return res.status(500).json({message:"error Reading data"})
        }
        return res.status(200).send(result);
    });
  })

  router.post('/addWage', async (req, res) => {
    const { month, year, workedHours, wageperHour, UserID } = req.body.data;
  
    // Calculate total amount
    const totalAmount = workedHours * wageperHour;
    const timeperiod = `${month}-${year}`;
    console.log(req.body);
    console.log(timeperiod)
    // return;

    try {
      // Check if there is already a record with the same UserID and timeperiod
      const existingRecordQuery = `SELECT * FROM wages WHERE UserID = ? AND timeperiod = ?`;
      const existingRecordParams = [UserID, timeperiod];
  
      db.query(existingRecordQuery, existingRecordParams, (existingRecordErr, existingRecordResults) => {
        if (existingRecordErr) {
          console.error('Error checking existing record:', existingRecordErr);
          return res.status(500).json({ message: 'Error checking existing record. Please try again.' });
        }
  
        if (existingRecordResults.length > 0) {
          return res.status(200).json({ success: false , message: 'Wage already exists for the same UserID and timeperiod' });
        }
  
        // If no existing record, insert the new record into the table
        const insertQuery = `INSERT INTO wages (UserID, timeperiod, workedHours, wageperHour, totalAmount) VALUES (?, ?, ?, ?, ?)`;
        const insertParams = [UserID, timeperiod, workedHours, wageperHour, totalAmount];
  
        db.query(insertQuery, insertParams, (insertErr, insertResults) => {
          if (insertErr) {
            console.error('Error inserting record:', insertErr);
            return res.status(500).json({ message: 'Error inserting record. Please try again.' });
          }
  
          // Send success response
          return res.status(200).json({ success: true, message: 'Record inserted successfully' });
        });
      });
    } catch (error) {
      console.error('Error handling request:', error);
      return res.status(500).json({ message: 'Error handling request. Please try again.' });
    }
  });

  router.post('/addWage', async (req, res) => {
    const { month, year, workedHours, wageperHour, UserID } = req.body.data;
  
    // Calculate total amount
    const totalAmount = workedHours * wageperHour;
    const timeperiod = `${month}-${year}`;
    console.log(req.body);
    console.log(timeperiod)
    // return;

    try {
      // Check if there is already a record with the same UserID and timeperiod
      const existingRecordQuery = `SELECT * FROM wages WHERE UserID = ? AND timeperiod = ?`;
      const existingRecordParams = [UserID, timeperiod];
  
      db.query(existingRecordQuery, existingRecordParams, (existingRecordErr, existingRecordResults) => {
        if (existingRecordErr) {
          console.error('Error checking existing record:', existingRecordErr);
          return res.status(500).json({ message: 'Error checking existing record. Please try again.' });
        }
  
        if (existingRecordResults.length > 0) {
          return res.status(200).json({ success: false , message: 'Wage already exists for the same UserID and timeperiod' });
        }
  
        // If no existing record, insert the new record into the table
        const insertQuery = `INSERT INTO wages (UserID, timeperiod, workedHours, wageperHour, totalAmount) VALUES (?, ?, ?, ?, ?)`;
        const insertParams = [UserID, timeperiod, workedHours, wageperHour, totalAmount];
  
        db.query(insertQuery, insertParams, (insertErr, insertResults) => {
          if (insertErr) {
            console.error('Error inserting record:', insertErr);
            return res.status(500).json({ message: 'Error inserting record. Please try again.' });
          }
  
          // Send success response
          return res.status(200).json({ success: true, message: 'Record inserted successfully' });
        });
      });
    } catch (error) {
      console.error('Error handling request:', error);
      return res.status(500).json({ message: 'Error handling request. Please try again.' });
    }
  });

  router.put('/updateWage', async (req, res) => {
    const { month, year, workedHours, wageperHour, UserID } = req.body.data;
    const { wageID } = req.body;

    // Calculate total amount   
    const totalAmount = workedHours * wageperHour;
    const timeperiod = `${month}-${year}`;
  
    try {
      // Check if the record to be updated exists
      const existingRecordQuery = `SELECT * FROM wages WHERE UserID = ? AND timeperiod = ?`;
      const existingRecordParams = [UserID, timeperiod];
  
      db.query(existingRecordQuery, existingRecordParams, (existingRecordErr, existingRecordResults) => {
        if (existingRecordErr) {
          console.error('Error checking existing record:', existingRecordErr);
          return res.status(500).json({ message: 'Error checking existing record. Please try again.' });
        }
  
        if (existingRecordResults.length > 0) {
          return res.status(200).json({ success: false, message: 'Wage exsist for this User' });
        }
  
        // If the record exists, update it
        const updateQuery = `UPDATE wages SET workedHours = ?, wageperHour = ?, totalAmount = ? , UserID = ? , timeperiod = ? where wageID = ?`;
        const updateParams = [workedHours, wageperHour, totalAmount, UserID, timeperiod,wageID];
  
        db.query(updateQuery, updateParams, (updateErr, updateResults) => {
          if (updateErr) {
            console.error('Error updating record:', updateErr);
            return res.status(500).json({ message: 'Error updating record. Please try again.' });
          }
  
          // Send success response
          return res.status(200).json({ success: true, message: 'Record updated successfully' });
        });
      });
    } catch (error) {
      console.error('Error handling request:', error);
      return res.status(500).json({ message: 'Error handling request. Please try again.' });
    }
  });

  
  router.get('/stocks', (req, res) => {
    const query = `
                SELECT 
                p.ProductID, 
                p.Name AS ProductName, 
                p.Quantity AS ProductQuantity, 
                s.Quantity AS StockQuantity,
                CASE 
                    WHEN s.Quantity = 0 THEN 'Out of Stock'
                    WHEN s.Quantity <= 5 THEN CONCAT('In Stock (Quantity: ', s.Quantity, ', Less than 5 remaining)')
                    ELSE 'In Stock'
                END AS StockStatus
            FROM 
                products p
            LEFT JOIN 
                stocks s ON p.ProductID = s.ProductID where p.Quantity < 0 or p.Quantity <= 5`;

    db.query(query, (err, results) => {
      if (err) {
        console.error('Error querying database:', err);
        res.status(500).json({ error: 'An error occurred while fetching stock data' });
      } else {
        res.status(200).json(results);
      }
    });
  });

module.exports = router;
