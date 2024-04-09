const express = require('express');
const cors = require('cors');
var path = require('path');
const cookieParser = require('cookie-parser');
var logger = require('morgan');
var createError = require('http-errors');
var db = require('./config/db');
const Razorpay = require("razorpay");
const multer = require('multer');
const shortid = require('shortid');
const razorpayClient = new Razorpay({
    key_id: "rzp_test_5x82urML6UdoaR",
    key_secret: "KlOeJ3iPQxBiPJcH7Fh5dSqX",
});


const AdminRoutes = require('./routes/AdminRoutes');
const StaffRoutes = require('./routes/StaffRoutes');
const UsersRoutes = require('./routes/UserRoutes');
const loginRoutes = require('./routes/LoginRoute');

require('dotenv').config();

const jwt = require('jsonwebtoken');
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || 'secret-key';
const app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json({ limit: '50mb'}));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}))
app.options('*', cors())

app.get('/', (req, res) => {
    res.render('index'); 
});

app.get('/check-token', (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.json({ isValid: false });
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            console.error('token verification error');
            return res.json({ isValid: false });
        }
        res.json({ isValid: true });
    });
});


app.post('/api/logout', (req, res) => {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: 'Token not provided' });
    }

    jwt.verify(token, JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            console.error(err);
            return res.status(401).json({ message: 'Invalid token' });
        }
        res.clearCookie('token');
        res.json({ message: 'Logout successful' });
    });
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../src/uploads')); 
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

app.post('/api/addProduct', upload.single('Image'), (req, res) => {
    const { Name, Description, Price, Quantity, CategoryID,Role,ExpiryDate} = req.body;

    let product_status = 0,approved_status = 0 ;
    if(Role === "Admin"){
        product_status = 1, approved_status =1;
    }
    // Check if product with the same name already exists
    const checkQuery = 'SELECT * FROM products WHERE Name = ?';
    db.query(checkQuery, [Name], (error, results) => {
        if (error) {
            console.error('Error checking product existence:', error);
            return res.status(500).json({ message: 'Error checking product existence.' });
        }

        if (results.length > 0) {
            return res.status(200).json({ message: 'A product with this name already exists.' });
        }

        // If product name doesn't exist, proceed with image upload
        const Image = req.file.filename;
        console.log(`Image upload:`, Image);
        // Insert product details into the database
        const insertProductQuery = 'INSERT INTO products (Name, Description, Price, Quantity, CategoryID,productImage,product_status,product_approve_status) VALUES (?, ?, ?, ?, ?, ?,?,?)';
        db.query(insertProductQuery, [Name, Description, Price, Quantity, CategoryID, Image,product_status,approved_status], (err, result) => {
            if (err) {
                console.error('Error adding product:', err);
                return res.status(500).json({ message: 'Error adding product. Please try again.' });
            }

            const ProductID = result.insertId;

            // Insert ProductID into the stocks table
            const insertStockQuery = 'INSERT INTO stocks (ProductID, Quantity,ExpiryDate) VALUES (?, ?,?)';
            db.query(insertStockQuery, [ProductID, Quantity,ExpiryDate], (err) => {
                if (err) {
                    console.error('Error adding stock:', err);
                    return res.status(500).json({ message: 'Error adding stock. Please try again.' });
                }
                return res.status(200).json({ message: 'Product added successfully.' });
            });
        });
    });
});


app.put('/api/updateproductImage',upload.single('Image'),(req,res)=>{
    const {ProductID} = req.body
    const Image = req.file.filename;
    const sql = "UPDATE products SET productImage = ? WHERE ProductID = ?";
    db.query(sql,[ProductID,Image],(error,result)=>{
        if(error){
            console.log(error);
           return res.status(500).json({message: "Error updating product Image!"});
        }
        return res.status(200).json({message: "Product Image updated"})
    })

})

app.post('/api/upload-image', upload.single('image'), (req, res) => {

    const id  = req.body.id;
    const image = req.file.filename; 
  
    
    // SQL query to update the image name
    const query = `UPDATE material_purchases SET InvoiceImage = ? WHERE PurchaseID = ?`;
  
    // Execute the query
    db.query(query, [image, id], (error, results) => {
      if (error) {
        console.log(error);
        res.status(500).json({ error: 'Error updating image name' });
        return;
      }
      console.log('Image name updated successfully');
      res.status(200).json({ message: 'Image uploaded and name updated successfully' });
    });
  });

app.get('/api/active-categories', (req, res) => {
    const sqlQuery = `SELECT * FROM categories where CategoryStatus = 1`;

    // Execute the query
    db.query(sqlQuery, (err, results) => {
    if (err) {
        console.error("Error fetching categories:", err);
        return res.status(500).json({ message: "Error fetching category." });
    }
    res.json(results);
    });
});

const GST_RATE = 0.18; // Assuming GST rate is 18%

// Function to calculate total amount including GST
const calculateTotalWithGST = (amount) => {
  const gstAmount = amount * GST_RATE;
  const totalWithGST = amount + gstAmount;
  return totalWithGST;
};


app.post('/api/razorpay', async (req, res) => {
    const payment_capture = 1;
    const currency = "INR";
    const amount = req.body.amt;

    const options = {
        amount: calculateTotalWithGST(amount) * 100,
        currency: currency,
        receipt: shortid.generate(),
        payment_capture: payment_capture
    };
    console.log(options)
    
    try {
        const response = await razorpayClient.orders.create(options);
        res.json({
            id: response.id,
            currency: response.currency,
            amount: response.amount
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred while creating Razorpay order' });
    }
});



// Use the admin routes module
app.use('/api',loginRoutes);
app.use('/api/admin', AdminRoutes);
app.use('/api/staff', StaffRoutes);
app.use('/api/users', UsersRoutes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
  });
  
  // error handler
  app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
  
    // render the error page
    res.status(err.status || 500);
    res.render('error');
  });

  
console.log('connected');

module.exports = app;
