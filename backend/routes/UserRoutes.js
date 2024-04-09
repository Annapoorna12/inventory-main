const express = require('express');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
require('dotenv').config();

const router = express.Router();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || 'secret-key';

// Middleware for checking user role
function checkUserRole(req, res, next) {
    const authcookie = req.cookies.authcookie;

    jwt.verify(authcookie, JWT_SECRET_KEY, (err, data) => {
        if (err) {
            res.sendStatus(403);
        } else if (data.user && data.user.role === 'user') {
            req.user = data.user;
            next();
        } else {
            res.status(403);
        }
    });
}

  router.post('/delete-from-cart',(req,res)=>{
    const { cartChildID} = req.body
    console.log(cartChildID)
    db.query('DELETE FROM cartChild where cartChildID = ? ',[cartChildID],(err,result)=>{
      if(err){
        console.log(err)
        return res.status(200).json({success:false})
      } 
      return res.status(200).json({success:true})
    })
  })

router.get('/view-active-products', (req, res) => {
    // Logic for fetching staff-specific data from the database
    db.query("SELECT products.*, stocks.Quantity, CASE WHEN stocks.Quantity = 0 THEN 'Out of Stock' ELSE 'In Stock' END as StockStatus , CASE WHEN stocks.ExpiryDate < CURDATE() THEN 'Expired' ELSE 'Available' END AS Status FROM products INNER JOIN stocks ON products.ProductID = stocks.ProductID WHERE products.product_status = 1 AND products.product_approve_status = 1", (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Internal server error' });
        }
        res.status(200).json({results});
    });
});

router.post('/addtocart',(req,res)=>{
    const userID = req.body.userID;
    const productID = req.body.productID;
    const quantity = 1;

    db.query('START TRANSACTION', (err) => {
        if (err) {
          console.error('Error starting transaction:', err);
          return;
        }    
        db.query('SELECT CartMasterID FROM cartMaster WHERE UserID = ? AND Cart_status = ?', [userID, 1], (err, results) => {
          if (err) {
            console.error('Error checking cart:', err);
            db.query('ROLLBACK', (err) => {
              if (err) {
                console.error('Error rolling back transaction:', err);
              }
            });
            return;
          }
    
          if (results.length > 0) {
            // Cart already exists
            const cartMasterID = results[0].CartMasterID;    
            db.query('SELECT * FROM cartChild WHERE CartMasterID = ? AND ProductID = ?', [cartMasterID, productID], (err, results) => {
              if (err) {
                console.error('Error checking product in cart:', err);
                db.query('ROLLBACK', (err) => {
                  if (err) {
                    console.error('Error rolling back transaction:', err);
                  }
                });
                return;
              }
    
              if (results.length > 0) {
                // Product already exists, update the quantity
                db.query('UPDATE cartChild SET Quantity = Quantity + ? WHERE CartMasterID = ? AND ProductID = ?', [quantity, cartMasterID, productID], (err) => {
                  if (err) {
                    console.error('Error updating quantity:', err);
                    db.query('ROLLBACK', (err) => {
                      if (err) {
                        console.error('Error rolling back transaction:', err);
                      }
                    });
                    return;
                  }
    
                  // Commit the transaction
                  db.query('COMMIT', (err) => {
                    if (err) {
                      console.error('Error committing transaction:', err);
                    }
                  });
                });
              } else {
                // Product does not exist, insert new entry
                db.query('INSERT INTO cartChild (CartMasterID, ProductID, Quantity) VALUES (?, ?, ?)', [cartMasterID, productID, quantity], (err) => {
                  if (err) {
                    console.error('Error inserting new product:', err);
                    db.query('ROLLBACK', (err) => {
                      if (err) {
                        console.error('Error rolling back transaction:', err);
                      }
                    });
                    return;
                  }
    
                  // Commit the transaction
                  db.query('COMMIT', (err) => {
                    if (err) {
                      console.error('Error committing transaction:', err);
                    }
                  });
                });
              }
            });
          } else {

            db.query('INSERT INTO cartMaster (UserID, Cart_status) VALUES (?, ?)', [userID, 1], (err, result) => {
              if (err) {
                console.error('Error creating new cart:', err);
                db.query('ROLLBACK', (err) => {
                  if (err) {
                    console.error('Error rolling back transaction:', err);
                  }
                });
                return;
              }
    
              const cartMasterID = result.insertId;
              db.query('INSERT INTO cartChild (CartMasterID, ProductID, Quantity) VALUES (?, ?, ?)', [cartMasterID, productID, quantity], (err) => {
                if (err) {
                  console.error('Error inserting product into new cart:', err);
                  db.query('ROLLBACK', (err) => {
                    if (err) {
                      console.error('Error rolling back transaction:', err);
                    }
                  });
                  return;
                }
    
                db.query('COMMIT', (err) => {
                  if (err) {
                    console.error('Error committing transaction:', err);
                  }
                  return res.status(200).json({success: true, message: "Product Added To Cart"})
                });
              });
            });
          }
        });
      });
})

router.post('/get-cart-data', (req, res) => {
    const userID = req.body.userID;
  
    // SQL query to fetch cart data
    const sql = `SELECT categories.*, cartChild.*,products.Quantity as pqty, products.Price,products.name AS productName, products.description AS productDescription, products.productImage AS productImage FROM cartChild  INNER JOIN products ON cartChild.productID = products.productID INNER JOIN categories ON categories.CategoryID = products.CategoryID WHERE cartChild.cartMasterID = (SELECT cartMasterID FROM cartMaster WHERE userID = ? AND cart_status = 1)`;

    db.query(sql, [userID], (error, results) => {
      if (error) {
        console.error('Error fetching cart data:', error);
        res.status(500).json({ message: 'Internal server error' });
        return;
      }
  
      res.status(200).json({ results });
    });
  });

  router.post('/updateCartQuantity', async (req, res) => {
    const { cartChildID, action } = req.body;
  
    try {
      let sqlQuery, queryParams;
  
      if (action === 'increment') {
        sqlQuery = 'UPDATE cartChild SET Quantity = Quantity + 1 WHERE cartChildID = ?';
        queryParams = [cartChildID];
        db.query(sqlQuery, queryParams,(err)=>{
            if(err){
              return err;
            }
            return res.status(200).json({success: true, message:'Cart quantity updated successfully'})
        })
      } else if (action === 'decrement') {
        sqlQuery = 'SELECT Quantity FROM cartChild WHERE cartChildID = ?';
        queryParams = [cartChildID];
  
        db.query(sqlQuery, queryParams, (QuanityError, QuanityResult) => {
          if (QuanityError) {
            console.log(QuanityError);
            return res.status(500).json({ success: false, message: 'Error getting quantity from the database' });
          }
  
          if (QuanityResult.length === 0) {
            return res.status(404).json({ success: false, message: 'Cart item not found' });
          }
  
          const currentQuantity = QuanityResult[0].Quantity;
  
          if (currentQuantity > 1) {
            sqlQuery = 'UPDATE cartChild SET Quantity = Quantity - 1 WHERE cartChildID = ?';
            queryParams = [cartChildID];
  
            db.query(sqlQuery, queryParams, (updateError, updateResult) => {
              if (updateError) {
                console.log(updateError);
                return res.status(500).json({ success: false, message: 'Error updating quantity in the database' });
              }
  
              if (updateResult.affectedRows === 0) {
                return res.status(404).json({ success: false, message: 'Cart item not found' });
              }
  
              return res.status(200).json({ success: true, message: 'Cart quantity updated successfully' });
            });
          } else {
            sqlQuery = 'DELETE FROM cartChild WHERE cartChildID = ?';
            queryParams = [cartChildID];
  
            db.query(sqlQuery, queryParams, (deleteError, deleteResult) => {
              if (deleteError) {
                console.log(deleteError);
                return res.status(500).json({ success: false, message: 'Error deleting item from the cart' });
              }
  
              if (deleteResult.affectedRows === 0) {
                return res.status(404).json({ success: false, message: 'Cart item not found' });
              }
  
              return res.status(200).json({ success: true, message: 'Cart item deleted successfully' });
            });
          }
        });
      } else {
        return res.status(400).json({ success: false, message: 'Invalid action' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  });
  
  router.post('/cartCount', (req, res) => {
    try {
        const userId = req.body.id;
        const cartCountQuery = 'SELECT COUNT(*) AS cartCount FROM cartchild INNER JOIN cartmaster on cartchild.cartMasterID = cartmaster.cartMasterID  WHERE cartmaster.userID = ? AND cartmaster.Cart_status = 1';

        db.query(cartCountQuery, [userId], (error, rows) => {
            if (error) {
                console.error('Error fetching cart count:', error);
                return res.status(500).json({ success: false, message: 'Server error' });
            }

            if (rows.length === 0) {
                return res.status(404).json({ success: false, message: 'Cart count not found' });
            }

            const cartCount = rows[0].cartCount;

            res.status(200).json({ success: true, cartCount });
        });
    } catch (error) {
        console.error('Error fetching cart count:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

router.post('/checkout', async (req, res) => {
  const { cartMasterID, userID } = req.body;

  db.beginTransaction(async (err) => {
    if (err) {
        console.error('Error starting transaction:', err);
        return res.status(500).json({ success: false, message: 'An error occurred during checkout' });
    }

    try {
        // Calculate total amount
        const totalAmountQuery = `
            SELECT SUM(cc.Quantity * p.Price) AS totalAmount 
            FROM cartChild cc 
            INNER JOIN products p ON cc.productID = p.productID 
            WHERE cc.cartMasterID = ?`;
        db.query(totalAmountQuery, [cartMasterID], async (totalAmountError, totalAmountResult) => {
            if (totalAmountError) {
                handleRollbackAndError(totalAmountError, 'Error calculating total amount');
            }

            console.log(totalAmountResult)
            const totalAmount = totalAmountResult[0].totalAmount;

            // Insert into orders table
            const orderInsertQuery = 'INSERT INTO orders (UserID, OrderDate, TotalAmount) VALUES (?, NOW(), ?)';
            db.query(orderInsertQuery, [userID, totalAmount], async (orderInsertError, orderInsertResult) => {
                if (orderInsertError) {
                    handleRollbackAndError(orderInsertError, 'Error inserting into orders table');
                }

                const orderID = orderInsertResult.insertId;

                // Insert into order_details table
                const orderDetailsInsertQuery = `
                    INSERT INTO order_details (OrderID, ProductID, Quantity, UnitPrice) 
                    SELECT ?, cc.productID, cc.Quantity, p.Price 
                    FROM cartChild cc 
                    INNER JOIN products p ON cc.productID = p.productID 
                    WHERE cc.cartMasterID = ?`;
                db.query(orderDetailsInsertQuery, [orderID, cartMasterID], async (orderDetailsInsertError, orderDetailsInsertResult) => {
                    if (orderDetailsInsertError) {
                        handleRollbackAndError(orderDetailsInsertError, 'Error inserting into order_details table');
                    }

                    // Insert into payment table
                    const paymentInsertQuery = 'INSERT INTO payments (orderID, paymentDate) VALUES (?, NOW())';
                    db.query(paymentInsertQuery, [orderID], async (paymentInsertError, paymentInsertResult) => {
                        if (paymentInsertError) {
                            handleRollbackAndError(paymentInsertError, 'Error inserting into payment table');
                        }

                        // Update cartMaster table
                        const cartMasterUpdateQuery = 'UPDATE cartMaster SET Cart_status = 0 WHERE cartMasterID = ?';
                        db.query(cartMasterUpdateQuery, [cartMasterID], async (cartMasterUpdateError, cartMasterUpdateResult) => {
                            if (cartMasterUpdateError) {
                                handleRollbackAndError(cartMasterUpdateError, 'Error updating cartMaster table');
                            }

                            // Update product quantity in products table
                            const productQuantityUpdateQuery = `
                                UPDATE products p 
                                INNER JOIN cartChild cc ON p.productID = cc.productID 
                                SET p.Quantity = p.Quantity - cc.Quantity 
                                WHERE cc.cartMasterID = ?`;
                            db.query(productQuantityUpdateQuery, [cartMasterID], async (productQuantityUpdateError, productQuantityUpdateResult) => {
                                if (productQuantityUpdateError) {
                                    handleRollbackAndError(productQuantityUpdateError, 'Error updating product quantity');
                                }
                                const stocksUpdateQuery = `
                                    UPDATE stocks s 
                                    INNER JOIN cartChild cc ON s.productID = cc.productID 
                                    SET s.Quantity = s.Quantity - cc.Quantity 
                                    WHERE cc.cartMasterID = ?`;
                                db.query(stocksUpdateQuery, [cartMasterID], async (stocksUpdateError, stocksUpdateResult) => {
                                    if (stocksUpdateError) {
                                        handleRollbackAndError(stocksUpdateError, 'Error updating stocks quantity');
                                    }
                                    // Commit transaction
                                    db.commit((commitErr) => {
                                        if (commitErr) {
                                            console.error('Error committing transaction:', commitErr);
                                            return res.status(500).json({ success: false, message: 'An error occurred during checkout' });
                                        }
                                        
                                        // Transaction successfully completed
                                        return res.status(200).json({ success: true, message: 'Checkout successful' });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    } catch (error) {
        handleRollbackAndError(error, 'Error in transaction');
    }
  });

  function handleRollbackAndError(error, message) {
      db.rollback(() => {
          console.error(message + ':', error);
          return res.status(500).json({ success: false, message: 'An error occurred during checkout' });
      });
  }
});

router.post('/productDetails', (req, res) => {
  const { productId } = req.body;

  const productDetailsQuery = 'SELECT * FROM products WHERE productID = ?';

  db.query(productDetailsQuery, [productId], (error, results) => {
      if (error) {
          console.error('Error fetching product details:', error);
          return res.status(500).json({ success: false, message: 'An error occurred while fetching product details' });
      }

      if (results.length > 0) {
          res.status(200).json({ success: true, product: results });
      } else {
          // If the product is not found, send an error response
          res.status(404).json({ success: false, message: 'Product not found' });
      }
  });
});

router.post('/GetOrderDetails', (req, res) => {
  const { userID } = req.body;
  console.log(req.body)

  // Check if userID is provided in the request body
  if (!userID) {
    return res.status(400).json({ error: 'User ID is required' });
  }

    const query = `SELECT u.FullName, u.Email, u.ContactNumber, u.Address, o.OrderID, o.UserID, o.OrderDate, o.TotalAmount, CONCAT('[', GROUP_CONCAT(JSON_OBJECT('ProductName', p.Name, 'Quantity', od.Quantity, 'UnitPrice', od.UnitPrice) SEPARATOR ','), ']') AS ProductDetails FROM orders o INNER JOIN (SELECT od.OrderID, od.ProductID, od.Quantity, od.UnitPrice FROM order_details od ORDER BY od.OrderID, od.OrderDetailID) od ON o.OrderID = od.OrderID INNER JOIN products p ON od.ProductID = p.ProductID INNER JOIN users u ON o.UserID = u.UserID WHERE o.UserID = ? GROUP BY o.OrderID, o.UserID, o.OrderDate, o.TotalAmount;
    `;

    db.query(query, [userID], (err, results) => {
      if (err) {
        console.error('Error executing MySQL query:', err);
        return res.status(500).json({ error: 'Database error' });
      }

      if (results.length === 0) {
        console.log(results);
        return res.status(200).json({ message: 'No orders found for the specified user' });
      }

      return res.status(200).json({ orders: results });
    });
});

  
module.exports = router;
