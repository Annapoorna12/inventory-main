import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";

const Navbar = () => {
  const [mobileMenu, setMobileMenu] = useState(false);


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
