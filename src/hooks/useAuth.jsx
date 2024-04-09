import { createContext, useContext,useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState("");
  const navigate = useNavigate();

  const login = async (values) => {
    const username = values.username;
    const password = values.password;
    console.log(username, password);
    try {
      const response = await axios.post(
        "http://localhost:3001/api/login",
        { username, password },
        { withCredentials: true }
      );
      console.log(response)
      if (response.data.Role === "Admin") {
        localStorage.setItem("data", JSON.stringify(response.data));
        navigate('/dashboard');
      } else if (response.data.Role === "User") {
        localStorage.setItem("data", JSON.stringify(response.data.data));
        navigate('/');
      } else if (response.data.Role === "Sales") {
        localStorage.setItem("data", JSON.stringify(response.data));
        navigate('/sales-dash');
      }else if(response.data.Role === "Supplier"){
        localStorage.setItem("data", JSON.stringify(response.data));
        navigate('/Supplier-dash');
      }else if(response.data.message === 'Invalid credentials'){
        toast.error(response.data.message);
      }

    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  const register = async (values) => {
    console.log(values)
    const {name,username,password,phone,address,email} = values;
    const data = {
      CustomerName: name,
      Username: username,
      Password: password,
      Mobnum: phone,
      Address: address,
      Email: email,
    }
    try {
      const response = await axios.post(
        "http://localhost:3001/api/admin/addcustomer",
        { data },
        { withCredentials: true }
      );
      // console.log(response)
      return response;
    } catch (error) {
      console.error("Registration Failed:", error);
      throw error;
    }
    
  }

  const checkAuthValidity = (user) => {
    const UserData = localStorage.getItem("data") ? JSON.parse(localStorage.getItem("data")) : " "; 
    console.log(UserData)
    if(UserData.Role === user){
      return true
    } 
    return false;
  };


  const logout = async () => {
        localStorage.clear();   
        navigate('/login');
};


  const value = useMemo(
    () => ({
      user,
      login,
      logout,
      checkAuthValidity,
      register
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
