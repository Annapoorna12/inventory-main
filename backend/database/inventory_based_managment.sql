-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Mar 26, 2024 at 01:09 PM
-- Server version: 10.4.27-MariaDB
-- PHP Version: 8.2.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `inventory_based_managment`
--

-- --------------------------------------------------------

--
-- Table structure for table `cartchild`
--

CREATE TABLE `cartchild` (
  `cartChildID` int(11) NOT NULL,
  `cartMasterID` int(10) NOT NULL,
  `ProductID` int(10) NOT NULL,
  `Quantity` int(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cartchild`
--

INSERT INTO `cartchild` (`cartChildID`, `cartMasterID`, `ProductID`, `Quantity`) VALUES
(3, 1, 3, 2),
(4, 1, 2, 1),
(5, 3, 3, 1),
(6, 3, 2, 1);

-- --------------------------------------------------------

--
-- Table structure for table `cartmaster`
--

CREATE TABLE `cartmaster` (
  `cartMasterID` int(11) NOT NULL,
  `UserID` int(11) NOT NULL,
  `Cart_status` int(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `cartmaster`
--

INSERT INTO `cartmaster` (`cartMasterID`, `UserID`, `Cart_status`) VALUES
(1, 2, 0),
(3, 2, 0),
(6, 2, 1);

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `CategoryID` int(11) NOT NULL,
  `CategoryName` varchar(100) NOT NULL,
  `CategoryStatus` int(11) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`CategoryID`, `CategoryName`, `CategoryStatus`) VALUES
(1, 'ssd', 1),
(2, 'sds', 1);

-- --------------------------------------------------------

--
-- Table structure for table `material_purchases`
--

CREATE TABLE `material_purchases` (
  `PurchaseID` int(11) NOT NULL,
  `Purchaser_id` int(10) NOT NULL,
  `SupplierID` int(11) DEFAULT NULL,
  `PurchaseName` text DEFAULT NULL,
  `Quantity` int(11) DEFAULT NULL,
  `PurchaseAmount` decimal(10,2) NOT NULL,
  `PurchaseDate` date DEFAULT NULL,
  `InvoiceImage` text NULL,
  `notification` text NULL,
  `payment_status` int(1) NOT NULL DEFAULT 0,
  `payment_date` date DEFAULT NULL,
  `approve_status` int(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `material_purchases`
--

INSERT INTO `material_purchases` (`PurchaseID`, `Purchaser_id`, `SupplierID`, `PurchaseName`, `Quantity`, `PurchaseAmount`, `PurchaseDate`, `InvoiceImage`, `notification`, `payment_status`, `payment_date`, `approve_status`) VALUES
(1, 7, 8, 'masd', 20, '1200.00', '2024-03-23', '1711261952587-98668071.pdf', 'Material is out of stock!', 1, '2024-03-24', 1);

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `OrderID` int(11) NOT NULL,
  `UserID` int(11) DEFAULT NULL,
  `OrderDate` date DEFAULT NULL,
  `TotalAmount` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`OrderID`, `UserID`, `OrderDate`, `TotalAmount`) VALUES
(2, 2, '2024-03-22', '500.00'),
(3, 2, '2024-03-22', '300.00');

-- --------------------------------------------------------

--
-- Table structure for table `order_details`
--

CREATE TABLE `order_details` (
  `OrderDetailID` int(11) NOT NULL,
  `OrderID` int(11) DEFAULT NULL,
  `ProductID` int(11) DEFAULT NULL,
  `Quantity` int(11) DEFAULT NULL,
  `UnitPrice` decimal(10,2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `order_details`
--

INSERT INTO `order_details` (`OrderDetailID`, `OrderID`, `ProductID`, `Quantity`, `UnitPrice`) VALUES
(4, 2, 3, 2, '200.00'),
(5, 2, 2, 1, '100.00'),
(7, 3, 3, 1, '200.00'),
(8, 3, 2, 1, '100.00');

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `paymentID` int(11) NOT NULL,
  `orderID` int(10) NOT NULL,
  `paymentDate` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `payments`
--

INSERT INTO `payments` (`paymentID`, `orderID`, `paymentDate`) VALUES
(1, 2, '2024-03-22'),
(2, 3, '2024-03-22');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `ProductID` int(11) NOT NULL,
  `Name` varchar(100) NOT NULL,
  `Description` text DEFAULT NULL,
  `Price` decimal(10,2) NOT NULL,
  `Quantity` int(11) NOT NULL,
  `productImage` text NOT NULL,
  `CategoryID` int(11) DEFAULT NULL,
  `product_status` int(1) NOT NULL DEFAULT 0,
  `product_approve_status` int(1) NOT NULL DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`ProductID`, `Name`, `Description`, `Price`, `Quantity`, `productImage`, `CategoryID`, `product_status`, `product_approve_status`) VALUES
(2, 'product', 'new product', '100.00', 12, '1710729309917-176302286.jpg', 1, 1, 1),
(3, 'mms', 'kalmn', '200.00', 19, '1710745460612-316948736.jpg', 1, 1, 1);

-- --------------------------------------------------------

--
-- Table structure for table `stocks`
--

CREATE TABLE `stocks` (
  `StockID` int(11) NOT NULL,
  `ProductID` int(11) NOT NULL,
  `Quantity` int(11) DEFAULT NULL,
  `ExpiryDate` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `stocks`
--

INSERT INTO `stocks` (`StockID`, `ProductID`, `Quantity`, `ExpiryDate`) VALUES
(2, 2, 12, '2024-03-29'),
(3, 3, 19, '2024-03-26');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `UserID` int(11) NOT NULL,
  `FullName` varchar(20) NOT NULL,
  `Username` varchar(50) NOT NULL,
  `Password` varchar(255) NOT NULL,
  `Email` varchar(100) NOT NULL,
  `ContactNumber` varchar(10) NOT NULL,
  `Address` text NOT NULL,
  `Role` enum('User','Sales','Supplier','Employee','Admin') NOT NULL,
  `user_status` int(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`UserID`, `FullName`, `Username`, `Password`, `Email`, `ContactNumber`, `Address`, `Role`, `user_status`) VALUES
(1, 'Adminstrator', 'admin@gmail.com', 'admin', 'admin@gmail.com', '9895459416', 'heheh', 'Admin', 1),
(2, 'roshan1', 'roshan', '1234', 'roshan@gmail.com', '9895459416', 'aluva', 'User', 1),
(4, 'custom', 'cd', '11', 'rs@gmail.com', '9895459416', '1234', 'User', 1),
(5, 'Roshan Francis', 'roshannew', '11', 'roshannew@gmail.com', '9839497912', 'Aluva', 'User', 1),
(6, 'employe1', 'emple', '11', 'employe@gmail.com', '9895459416', 'asokapura', 'Employee', 1),
(7, 'sales manager', 'sales', '1234', 'sale@gmail.com', '9895459411', 'asas', 'Sales', 1),
(8, 'supplier one', 'supplier', '1234', 'supplier@gmail.com', '9894373487', 'supllier a home', 'Supplier', 1),
(9, 'new', 'new1', '1234', 'new@gmail.com', '9895459416', 'aadd', 'User', 1);

-- --------------------------------------------------------

--
-- Table structure for table `wages`
--

CREATE TABLE `wages` (
  `wageID` int(11) NOT NULL,
  `UserID` int(11) NOT NULL,
  `timeperiod` text NOT NULL,
  `workedHours` int(10) NOT NULL,
  `wageperHour` decimal(10,2) NOT NULL,
  `totalAmount` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `wages`
--

INSERT INTO `wages` (`wageID`, `UserID`, `timeperiod`, `workedHours`, `wageperHour`, `totalAmount`) VALUES
(1, 6, 'January-2023', 40, '400.00', '16000.00');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cartchild`
--
ALTER TABLE `cartchild`
  ADD PRIMARY KEY (`cartChildID`),
  ADD KEY `cartMasterID` (`cartMasterID`),
  ADD KEY `ProductID` (`ProductID`);

--
-- Indexes for table `cartmaster`
--
ALTER TABLE `cartmaster`
  ADD PRIMARY KEY (`cartMasterID`),
  ADD KEY `UserID` (`UserID`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`CategoryID`);

--
-- Indexes for table `material_purchases`
--
ALTER TABLE `material_purchases`
  ADD PRIMARY KEY (`PurchaseID`),
  ADD KEY `material_purchases_ibfk_1` (`SupplierID`),
  ADD KEY `Purchaser_id` (`Purchaser_id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`OrderID`),
  ADD KEY `UserID` (`UserID`);

--
-- Indexes for table `order_details`
--
ALTER TABLE `order_details`
  ADD PRIMARY KEY (`OrderDetailID`),
  ADD KEY `OrderID` (`OrderID`),
  ADD KEY `ProductID` (`ProductID`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`paymentID`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`ProductID`),
  ADD KEY `CategoryID` (`CategoryID`);

--
-- Indexes for table `stocks`
--
ALTER TABLE `stocks`
  ADD PRIMARY KEY (`StockID`),
  ADD KEY `ProductID` (`ProductID`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`UserID`);

--
-- Indexes for table `wages`
--
ALTER TABLE `wages`
  ADD PRIMARY KEY (`wageID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `cartchild`
--
ALTER TABLE `cartchild`
  MODIFY `cartChildID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `cartmaster`
--
ALTER TABLE `cartmaster`
  MODIFY `cartMasterID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `CategoryID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `material_purchases`
--
ALTER TABLE `material_purchases`
  MODIFY `PurchaseID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `OrderID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `order_details`
--
ALTER TABLE `order_details`
  MODIFY `OrderDetailID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `paymentID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `ProductID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `stocks`
--
ALTER TABLE `stocks`
  MODIFY `StockID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `UserID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `wages`
--
ALTER TABLE `wages`
  MODIFY `wageID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `cartchild`
--
ALTER TABLE `cartchild`
  ADD CONSTRAINT `cartchild_ibfk_1` FOREIGN KEY (`cartMasterID`) REFERENCES `cartmaster` (`cartMasterID`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `cartchild_ibfk_2` FOREIGN KEY (`ProductID`) REFERENCES `products` (`ProductID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `cartmaster`
--
ALTER TABLE `cartmaster`
  ADD CONSTRAINT `cartmaster_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `material_purchases`
--
ALTER TABLE `material_purchases`
  ADD CONSTRAINT `material_purchases_ibfk_1` FOREIGN KEY (`SupplierID`) REFERENCES `users` (`UserID`),
  ADD CONSTRAINT `material_purchases_ibfk_3` FOREIGN KEY (`Purchaser_id`) REFERENCES `users` (`UserID`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`UserID`) REFERENCES `users` (`UserID`);

--
-- Constraints for table `order_details`
--
ALTER TABLE `order_details`
  ADD CONSTRAINT `order_details_ibfk_1` FOREIGN KEY (`OrderID`) REFERENCES `orders` (`OrderID`),
  ADD CONSTRAINT `order_details_ibfk_2` FOREIGN KEY (`ProductID`) REFERENCES `products` (`ProductID`);

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `products_ibfk_1` FOREIGN KEY (`CategoryID`) REFERENCES `categories` (`CategoryID`);

--
-- Constraints for table `stocks`
--
ALTER TABLE `stocks`
  ADD CONSTRAINT `stocks_ibfk_1` FOREIGN KEY (`ProductID`) REFERENCES `products` (`ProductID`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
