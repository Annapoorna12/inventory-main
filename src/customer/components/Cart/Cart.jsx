import React, { useState } from "react";
import "./Cart.css";
import DisplayRazorpay from './payment';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Cart = ({
  cartItems,
  updateCartQuantity,
  removeFromCart,
  CheckOutfunction,
  userID
}) => {
  const [CheckOutStatus, setCheckOutStatus] = useState(true);

  const totalPrice = cartItems.reduce(
    (price, item) => price + item.Quantity * item.Price,
    0
  );

  const checkOut = (amount, cartMasterID) => {
    if (!userID) {
      toast.error("Please login to continue");
      return;
    }

    if (cartItems.some(item => item.Quantity > item.pqty)) {
      toast.error("Please check the quantity of the products in your cart");
      return;
    }

    if(cartItems.length < 0) {
      toast.error("Please Add Prooduct to your cart");
      return;
    }

    DisplayRazorpay(amount, CheckOutfunction, cartMasterID);
  };
 
  return (
    <>
      <section className="cart-items">
        <div className="container cart-flex">
          <div className="cart-details">
            {cartItems.length === 0 && (
              <h1 className="no-items product">
                There are no items in the cart.
              </h1>
            )}
            {cartItems.map((item) => {
              const productQty = item.Price * item.Quantity;
              return (
                <div
                  className="cart-list product d_flex cart-responsive"
                  key={item.cartChildID}
                >
                  <div className="img">
                    <img
                      src={`../../../../src/uploads/${item.productImage}`}
                      alt="Picture of this item is unavailable"
                    />
                  </div>
                  <div className="cart-details">
                    <h3>Name: {item.productName}</h3>
                    <h3>Price: {item.Price}</h3>
                    <h4>
                      {item.Price} * {item.Quantity}
                    </h4>
                    <span>₹ {productQty}</span>
                  </div>
                  <div className="cart-items-function">
                    <div className="removeCart">
                      <button onClick={() => removeFromCart(item)}>
                        <i className="fa-solid fa-xmark"></i>
                      </button>
                    </div>
                    <div className="cartControl d_flex">
                      <button
                        className="inCart"
                        onClick={() => updateCartQuantity(item.cartChildID,'increment')}
                      >
                        <i className="fa fa-plus"></i>
                      </button>
                      <button
                        className="delCart"
                        onClick={() => updateCartQuantity(item.cartChildID,'decrement')}
                      >
                        <i className="fa fa-minus"></i>
                      </button>
                    </div>
                  </div>
                  <div className="cart-item-price"></div>
                </div>
              );
            })}
          </div>
          <div className="cart-total product-cart">
            <h2>Cart Summary</h2>
            <div className="d_flex">
              <h4>Total Price :</h4>
              <h3>₹ {totalPrice}</h3>
            </div>
            {userID && cartItems.length > 0 && <button className="checkout" onClick={() => checkOut(totalPrice, cartItems[0].cartMasterID)}>
              Checkout Now!
            </button>
            }
          </div>
        </div>
      </section>
    </>
  );
};

export default Cart;
