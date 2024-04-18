import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import toast from 'react-hot-toast';
import { useAuth } from "../../../hooks/useAuth";
import { useState } from "react";

const Registrationform = () => {
  const [alertMsg, setAlertMsg] = useState('');
  
  const navigate = useNavigate('');

  const { register } = useAuth();

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      username: "",
      phone: "",
      address: "",
      password: ""
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      email: Yup.string()
        .email("Invalid email address")
        .required("Email is required"),
      username: Yup.string().required("Username is required"),
      phone: Yup.string()
        .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
        .required("Phone number is required"),
      address: Yup.string().required("Address is required"),
      password: Yup.string()
        .min(4, "Password must be at least 4 characters")
        .required("Password is required")
    }),
    onSubmit: (values) => {
      registerFunction(values)
    }
  });
  
  const registerFunction = async (values) => {
    try {
      let response = await register(values);
      console.log(response);
      if(response.data.message === 'Sorry, email or username is already associated with an account.'){
        setAlertMsg(response.data.message);
      } else {
        toast.success(response.data.message);
        navigate('/login')
        setAlertMsg('');
      }
    } catch (error) {
      console.error("Registration Failed:", error);
      // Handle error response from the server
      setAlertMsg(error.message);
    }
  };

  return (
    <section className="loginform">
      <div className="container-login">
        <div className="wrapper">
          <div className="heading-login">
            <h1>Sign Up</h1>
            <p>
              Already a user ?{" "}
              <span>
                <Link to="/login">Login here</Link>
              </span>
            </p>
          </div>
          <form onSubmit={formik.handleSubmit} className="form" action="">
            <label className="label name" style={{paddingLeft:0}}>
              Full Name <span></span>
              <input
                type="text"
                name="name"
                {...formik.getFieldProps("name")}
              />
              {formik.touched.name && formik.errors.name ? (
                <div className="error" style={{ color: 'red' }}>{formik.errors.name || alertMsg}</div>
              ) : null}
            </label>
            <label className="label">
              Email id
              <input
                type="email"
                name="email"
                {...formik.getFieldProps("email")}
              />
              {formik.touched.email && formik.errors.email ? (
                <div className="error" style={{ color: 'red' }}>{formik.errors.email || alertMsg}</div>
              ) : null}
            </label>
            <label className="label">
              Username
              <input
                type="text"
                name="username"
                {...formik.getFieldProps("username")}
              />
              {formik.touched.username && formik.errors.username ? (
                <div className="error" style={{ color: 'red' }}>{formik.errors.username}</div>
              ) : null}
            </label>
            <label className="label">
              Phone No
              <input
                type="text"
                name="phone"
                {...formik.getFieldProps("phone")}
              />
              {formik.touched.phone && formik.errors.phone ? (
                <div className="error" style={{ color: 'red' }}>{formik.errors.phone}</div>
              ) : null}
            </label>
            <label className="label">
              Address
              <input
                type="text"
                name="address"
                {...formik.getFieldProps("address")}
              />
              {formik.touched.address && formik.errors.address ? (
                <div className="error" style={{ color: 'red' }}>{formik.errors.address}</div>
              ) : null}
            </label>
            <label className="label">
              Password
              <input
                type="password"
                name="password"
                {...formik.getFieldProps("password")}
              />
              {formik.touched.password && formik.errors.password ? (
                <div className="error" style={{ color: 'red' }}>{formik.errors.password}</div>
              ) : null}
            </label>

            <button type="submit" className="submit-btn">
              Sign Up
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Registrationform;