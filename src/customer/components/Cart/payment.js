// payment.js
import Axios from 'axios';
import ServiceURL from '../../../constants/url';
const DisplayRazorpay = async (amt, regFn, cartMasterID) => {
    const UserData = JSON.parse(localStorage.getItem('data'));
    let name ='',email = '',contact = '';
    if(UserData != null){
        name=UserData[0].FullName;
        email= UserData[0].Email;
        contact= UserData[0].ContactNumber;
    }

    const loadscript = (src) =>{
        return new Promise((resolve) => {
             const script = document.createElement('script');
             script.src = src;
             script.onload = () => {
                 resolve(true)
             }
             script.onerror = () => {
                 resolve(false)
             }
             document.body.appendChild(script);
        }) 
     }

    const res = await loadscript('https://checkout.razorpay.com/v1/checkout.js');

    if(!res){
        alert("Your offline!... server error")
    }

    const data = await Axios.post(`${ServiceURL}/razorpay`,{
        amt:amt,
        headers: {
            'Content-Type': 'application/json'
          }
    });

    console.log(data.data)
    console.log(cartMasterID)
    const options = {
        key: "rzp_test_5x82urML6UdoaR",
        currency: data.data.currency,
        amount: data.data.amount,
        description: "wallet Transaction",
        order_id: data.data.id,
        handler: async function (response){
            console.log(response);
            if (response.razorpay_payment_id) {
                regFn(cartMasterID);
            }
        },
        prefill: {
            name: name,
            email: email,
            contact: contact,
        },
    };
    console.log(options)
    const paymentObject = new window.Razorpay(options)
    paymentObject.open();  
}

export default DisplayRazorpay;
