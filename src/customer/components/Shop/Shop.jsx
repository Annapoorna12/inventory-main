import React, { useEffect ,useState} from "react";
import Categ from "./Categ";
import { useNavigate } from "react-router-dom";
import Shopcart from "./Shopcart";
import "./shop.css";
import ServiceURL from '../../../constants/url';
import axios from "axios";



const Shop = ({ shopItems, addToCart}) => {
  const navigate = useNavigate();
  const [userID ,setUserID] = useState('');

  const [products, setProducts] = useState([]);

  // const [selectedCategory, setSelectedCategory] = useState('All');
  const fetchdata = () => {
      axios.get(`${ServiceURL}/users/view-active-products`).then(response=>{
        console.log(response.data.results)
        setProducts(response.data.results)
    })
  }
  useEffect(() =>{
    fetchdata();
    const userData = JSON.parse(localStorage.getItem('data'));
    if (userData != null && userData.Role == 'User') {
      console.log(userData[0].UserID);
      setUserID(userData[0].UserID);
    } else {
      setUserID('');
    }
  },[])

  const AddtoCart = (productID) => {
    console.log('AddtoCart', productID,userID)
    axios.post(`${ServiceURL}/users/addtocart`,{
      userID: userID,
      productID: productID
    }).then((response) => {
        console.log(response.data);
        navigate('/cart');
        if(response.data.success){
        }
    }).catch((error) =>{
      console.error(error);
    });
  }

  const handleRedirect = () => {
    // Add the path you want to redirect to
    const targetPath = "/all-products";
    navigate(targetPath);
  };

  return (
    <>
      <section className="shop background">
        <div className="container shop-container">
          {/* <Categ shopItems={products} addToCart={AddtoCart} /> */}
          <div className="shop-main">
            <div className="heading heading-view-all" style={{paddingTop:'20px'}}>
              <div className="heading-left row f_flex">
                <h2 style={{paddingLeft:'30px'}}>Products</h2>
              </div>
              <div onClick={handleRedirect} className="heading-right row">
                <span>View All</span>
                <i className="fa fa-caret-right"></i>
              </div>
            </div>
            <div className="product-content">
              <Shopcart shopItems={products} addToCart={AddtoCart} userID={userID} />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Shop;
