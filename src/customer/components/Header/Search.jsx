import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
// import axios from "axios";
// import Navbar from "./Navbar";
// import ServiceURL from "../../../constants/url";
import logo from "../../../uploads/cara.png";

const Search = () => {
  
  const [login, setLogin] = useState(false);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("data"));
    if (userData !== null) {
      setLogin(true);
    } else {
      setLogin(false);
    }
  }, []);


  return (
    <>
      <section className="search">
        <div className="container c_flex">
          <div className="logo width">
            
            <Link aria-label="Inventory Home" to="/">
              <img src={logo} className=" ml-32" style={{height: '200px',width: '200px'}}/>
              {/* <h1>Inventory</h1> */}
            </Link>
          </div>
          <div className=" f_flex">
            {/* <Navbar /> */}
          </div>
          <div className=" f_flex">
            {/* <i className="fa fa-search"></i> */}
            {/* <input type="text" placeholder="Search here..." />
            <span>All Categories</span> */}
          </div>
          
          {/* <div className="icon f_flex width"> */}
            {/* <Link aria-label="Login page" to="/">
              <i className="fa fa-user icon-circle"></i>
            </Link> */}
            
            {/* <div className="cart" style={{}}> */}
            {/* Move the cart div to the right end */}
              {/* <Link to="/cart">
                <i className="fa fa-shopping-bag icon-circle"></i>
                <span>{login ? cartCount : 0}</span>
              </Link>
            </div>
          </div> */}
        </div>
      </section>
    </>
  );
};

export default Search;
