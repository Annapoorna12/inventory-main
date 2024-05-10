import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import axios from 'axios';
import ServiceURL from "../../../constants/url"

const Navbar = ({ cartItems }) => {
  const [mobileMenu, setMobileMenu] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  const [login, setLogin] = useState(false);
  const { logout } = useAuth();
  useEffect(() => {
    const userData = localStorage.getItem("data");
    if (userData !== null) {
      setLogin(true);
    } else {
      setLogin(false);
    }
  }, []);
  const getCartCount = () => {
    if (login) {
      const userData = JSON.parse(localStorage.getItem("data"));
      const UserID = userData[0].UserID;
      axios.post(`${ServiceURL}/users/cartCount`, { id: UserID })
        .then((response) => {
          if (response.data.success) {
            setCartCount(response.data.cartCount);
          } else {
            setCartCount(0);
          }
        })
        .catch((error) => {
          console.error("Error fetching cart count:", error);
          setCartCount(0);
        });
    } else {
      setCartCount(0);
    }
  };

  useEffect(() => {
    getCartCount();
  }, [login]);

  return (
    <>
      <header className="container">
        <div className="menu-items">
          
          <ul
            className={
              mobileMenu ? "nav-links-MobileMenu" : "link f_flex capitalize"
            }
            onClick={() => setMobileMenu(false)}
          >
            <li>
              <Link aria-label="Home" className="link-hover" to="/">
                Home
              </Link>
            </li>
            <li>
              <Link
                aria-label="All Products"
                className="link-hover"
                to="/all-products"
              >
                All Products
              </Link>
            </li>
            {!login ? (
            
            <> 
            <li>
              <Link aria-label="Login" className="link-hover" to="/login">
                Login
              </Link>
            </li>
            <li>
              <Link
                aria-label="Registration"
                className="link-hover"
                to="/registration"
              >
                Registration
              </Link>
            </li>
            </> ) : (
              <>
              <li>
              <Link aria-label="Login" className="link-hover" to="/orders">
                Orders
              </Link>
            </li>
            <li onClick={logout}>
              <Link aria-label="Login" className="link-hover" to="">
                Logout
              </Link>
            </li>
            <li>
              <div className="icon f_flex width">
            {/* <Link aria-label="Login page" to="/">
              <i className="fa fa-user icon-circle"></i>
            </Link> */}
            
            <div className="cart" style={{}}>
            {/* Move the cart div to the right end */}
              <Link to="/cart">
                <i className="fa fa-shopping-bag icon-circle"></i>
                <span>{login ? cartCount : 0}</span>
              </Link>
            </div>
            
          </div>
          </li>
          {/* <li>
              <div className="icon f_flex width">
            {/* <Link aria-label="Login page" to="/">
              <i className="fa fa-user icon-circle"></i>
            </Link> */}
            
            {/* <div className="cart" style={{}}> */}
            {/* Move the cart div to the right end */}
              .{/*<Link to="/profile">
                <i className="fa fa-user icon-circle"></i>
              </Link>
            </div>
            
          </div>
          </li> */}
          </>
            )   
          }
            
          </ul>
        </div>
        <button
          aria-label="Menu bar"
          className="toggle"
          onClick={() => setMobileMenu(!mobileMenu)}
        >
          {mobileMenu ? (
            <i className="fas fa-times close home-btn"></i>
          ) : (
            <i className="fa fa-bars open"></i>
          )}
        </button>
      </header>
    </>
  );
};

export default Navbar;
