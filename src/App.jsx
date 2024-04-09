import { Routes, Route } from "react-router-dom";
import React, { Suspense, lazy,useState } from "react";
import "./App.css";
// import { LoginPage } from "./pages/Login";
// import { Secret } from "./pages/Secret";

//protected Route
import { ProtectedRoute } from "./components/ProtectedRoute";
import { ProtectedRouteUser } from "./components/ProtectedRouteUser";
import { AuthProvider } from "./hooks/useAuth";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'sweetalert2/src/sweetalert2.scss'

//admin route
import Dashboard from "./pages/AdminDashboard";
import Customers from "./pages/Customers";
import EmployeView from "./pages/Employe";
import SalesManager from "./pages/SalesManagerView";
import CategorieView from "./pages/CategoryView";
import ProductView from "./pages/ProductsView";

//customer

// import Home from "./pages/Home";
// import HomePage from "./customer/HomePage";
// import CartPage from "./customer/Cart";
// import ProductPage from "./customer/Products";
// import LoginPage from "./customer/Login";
// import RegisterPage from "./customer/register";



import flashDealsData from "./customer/components/FlashDeals/flashDealsData";
import shopData from "./customer/components/Shop/shopData";
import AllProductsData from "./customer/components/Allproducts/allProductsData";
import Loginpage from "./customer/pages/loginpage/Loginpage";
import Registrationpage from "./customer/pages/registrationpage/Registrationpage";
import Homepage from "./customer/pages/homepage/Homepage";
import Singleproductpage from "./customer/pages/product-details/Singleproductpage";
import ErrorNotFound from "./customer/components/ErrorNotFoundPage/ErrorNotFound";
import Cartpage from "./customer/pages/cartpage/Cartpage";
import Allproductspage from "./customer/pages/all-productspage/Allproductspage";
import OrdersPage from "./customer/pages/Orders/Orders";
import AdminOrdersView from "./pages/AdminViewOrders";
import { ProtectedRouteSales } from "./components/ProtectedRouteSales";

//sales Manager components
import SalesManagerDash from "./pages/SalesManagerDash";
import SalesViewCategory from "./pages/SalesViewCategory";
import SalesViewProducts from "./pages/SalesViewProduct";
import SalesViewCustomer from "./pages/SalesViewCustomer";
import SalesViewEmployee from "./pages/SalesViewEmployee";
import AdminViewSupplier from "./pages/AdminViewSupplier";
import SalesViewSupplier from "./pages/SalesViewSupplier";
import SalesManagerViewOrders from "./pages/SalesManagerViewOrders";
import PurchasePage from "./pages/Purchase";
import SupplierDash from "./pages/SupplierDash";
import { ProtectedRouteSupplier } from "./components/ProtectedRouteSupplier";
import SupplierViewpayout from "./pages/supplierPayout";
import AdminViewPurchases from "./pages/AdminViewPayout";
import AdminViewWages from "./pages/AdminViewWage";


function App() {

  // pulling data from data files & storing it in variables here
  const { productItems } = flashDealsData;
  const { shopItems } = shopData;
  const { allProductsData } = AllProductsData;

  const [cartItems, setCartItems] = useState([]);

  const addToCart = (product) => {
    const productExists = cartItems.find((item) => item.id === product.id);
    if (productExists) {
      setCartItems(
        cartItems.map((item) =>
          item.id === product.id
            ? { ...productExists, qty: productExists.qty + 1 }
            : item
        )
      );
      toast.success("Item quantity increased");
    } else {
      setCartItems([...cartItems, { ...product, qty: 1 }]);
      toast.success("Item added to cart");
    }
  };
 
  const deleteFromCart = (product) => {
    const productExists = cartItems.find((item) => item.id === product.id);
    if (productExists.qty === 1) {
      const shouldRemove = window.confirm(
        "Are you sure you want to remove this item from the cart?"
      );

      if (shouldRemove) {
        setCartItems(cartItems.filter((item) => item.id !== product.id));
        toast.success("Item removed from cart");
      }
    } else {
      setCartItems(
        cartItems.map((item) =>
          item.id === product.id
            ? { ...productExists, qty: productExists.qty - 1 }
            : item
        )
      );
      toast.success("Item quantity decreased");
    }
  };

  const checkOut = (cartItems) => {
    if (cartItems.length <= 0) {
      toast.error("Add an item in the cart to checkout");
    } else {
      const confirmOrder = window.confirm(
        "Are you sure you want to order all these products?"
      );

      if (confirmOrder) {
        // Clear the cart by setting it to a new array or an empty array
        setCartItems([]);
        toast.success("Order placed, Thanks!!");
      }
    }
  };

  const removeFromCart = (product) => {
    const shouldRemove = window.confirm(
      "Are you sure you want to remove this item from the cart?"
    );

    if (shouldRemove) {
      setCartItems(cartItems.filter((item) => item.id !== product.id));
      toast.success("Item removed from cart");
    }
  };

  return (
    <div>
    <ToastContainer />
    <AuthProvider>
          {/* customer Routes */}
      <Routes>
      <Route
            path="/"
            element={
              <Homepage
                productItems={productItems}
                cartItems={cartItems}
                addToCart={addToCart}
                shopItems={shopItems}
              />
            }
          />
          <Route
            path="/cart"
            element={
              <Cartpage
                cartItems={cartItems}
                addToCart={addToCart}
                deleteFromCart={deleteFromCart}
                checkOut={checkOut}
                removeFromCart={removeFromCart}
              />
            }
          />
          <Route path="/login" element={<Loginpage cartItems={cartItems} />} />
          <Route
            path="/registration"
            element={<Registrationpage cartItems={cartItems} />}
          />
          <Route
            path="/all-products"
            element={
              <Allproductspage
                cartItems={cartItems}
                allProductsData={allProductsData}
                addToCart={addToCart}
              />
            }
          />

        <Route
            path="/orders"
            element={
              // <ProtectedRouteUser>
              <OrdersPage
                cartItems={cartItems}
                allProductsData={allProductsData}
                addToCart={addToCart}                
              />
              // </ProtectedRouteUser>
            }
          />
          <Route
            path="/all-products/:id"
            element={
              <Singleproductpage
                cartItems={cartItems}
                allProductsData={allProductsData}
                addToCart={addToCart}
              />
            }
          />
          

        {/* <Route path="/" element={<HomePage/>} />
        <Route path="/cart" element={<CartPage/>} />
        <Route path="/prodcutview" element={<ProductPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} /> */}
        {/* <Route path="/profile" element={<ProtectedRouteUser> <ProfileDisplay /></ProtectedRouteUser>} /> */}


      {/* {admin} */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      <Route
          path="/Customers"
          element={
            <ProtectedRoute>
              <Customers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Employee"
          element={
            <ProtectedRoute>
              <EmployeView />
            </ProtectedRoute>
          }
        />
        <Route
          path="/SalesManager"
          element={
            <ProtectedRoute>
              <SalesManager />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pay"
          element={
            <ProtectedRoute>
              <AdminViewPurchases />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Categories"
          element={
            <ProtectedRoute>
              <CategorieView />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Wages"
          element={
            <ProtectedRoute>
              <AdminViewWages />
            </ProtectedRoute>
          }
        />
        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <ProductView />
            </ProtectedRoute>
          }
        />
        <Route
          path="/supplier"
          element={
            <ProtectedRoute>
              <AdminViewSupplier />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sales"
          element={
            <ProtectedRoute>
              <AdminOrdersView />
            </ProtectedRoute>
          }
        />

        {/* {Sales Manager Route} */}
        <Route
          path="/sales-dash"
          element={
            <ProtectedRouteSales>
              <SalesManagerDash />
            </ProtectedRouteSales>
          }
        />
        <Route
          path="/sales-view-Categories"
          element={
            <ProtectedRouteSales>
              <SalesViewCategory />
            </ProtectedRouteSales>
          }
        />

      <Route
          path="/sales-view-Categories"
          element={
            <ProtectedRouteSales>
              <SalesViewCategory />
            </ProtectedRouteSales>
          }
        />
        <Route
          path="/sales-products"
          element={
            <ProtectedRouteSales>
              <SalesViewProducts />
            </ProtectedRouteSales>
          }
        />
        <Route
          path="/sales-products"
          element={
            <ProtectedRouteSales>
              <SalesViewProducts />
            </ProtectedRouteSales>
          }
        />
        <Route
          path="/sales-view-Customers"
          element={
            <ProtectedRouteSales>
              <SalesViewCustomer />
            </ProtectedRouteSales>
          }
        />
        <Route
          path="/sales-view-Employee"
          element={
            <ProtectedRouteSales>
              <SalesViewEmployee />
            </ProtectedRouteSales>
          }
        />
        <Route
          path="/sales-view-supplier"
          element={
            <ProtectedRouteSales>
              <SalesViewSupplier />
            </ProtectedRouteSales>
          }
        />
        <Route
          path="/sales-view-orders"
          element={
            <ProtectedRouteSales>
              <SalesManagerViewOrders />
            </ProtectedRouteSales>
          }
        />
        <Route
          path="/purchase"
          element={
            <ProtectedRouteSales>
              <PurchasePage />
            </ProtectedRouteSales>
          }
        />
        {/* {Supplier Route} */}
        <Route
          path="/Supplier-dash"
          element={
            <ProtectedRouteSupplier>
              <SupplierDash />
            </ProtectedRouteSupplier>
          }
        />
        <Route
          path="/supplier-payout"
          element={
            <ProtectedRouteSupplier>
              <SupplierViewpayout />
            </ProtectedRouteSupplier>
          }
        />
        {/* Catch-all route for 404 errors */}
        <Route path="*" element={<ErrorNotFound cartItems={cartItems} />} />
      </Routes>
    </AuthProvider>
    </div>
  );
}

export default App;