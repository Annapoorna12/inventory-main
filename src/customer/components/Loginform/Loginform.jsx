import React from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useFormik } from "formik";
import * as Yup from "yup";
import "./loginform.css";
import { useAuth } from '../../../hooks/useAuth';

const Loginform = () => {
  const { login } = useAuth();

  const formik = useFormik({
    initialValues: {
      username: "",
      password: ""
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .max(15, "Must be 15 characters or less")
        .required("Username is required"),
      password: Yup.string()
        .min(4, "Password must be at least 4 characters")
        .required("Password is required")
    }),
    onSubmit: (values) => {
      handleSubmit(values)
    }
  });

  const handleSubmit = async (values) => {
    // console.log(values);
    // setSubmitting(false);
    await login(values)
  };

  return (
    <>
      <section className="loginform">
        <div className="container-login">
          <div className="wrapper">
            <div className="heading-login">
              <h1>Sign In</h1>
              <p>
                New User ?{" "}
                <span>
                  <Link to="/registration">Create an account</Link>
                </span>
              </p>
            </div>
            <form onSubmit={formik.handleSubmit} className="form" action="">
              <label className="label">
                Username
                <input
                  type="text"
                  name="username"
                  {...formik.getFieldProps("username")}
                />
                {formik.touched.username && formik.errors.username ? (
                  <div className="error">{formik.errors.username}</div>
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
                  <div className="error">{formik.errors.password}</div>
                ) : null}
              </label>
              {/* <p className="forgot-pass">
                Forgot Password ?{" "}
                <span>
                  <Link to="/forgot-password">Click here to reset</Link>
                </span>
              </p> */}
              <button type="submit" className="submit-btn">
                Sign In
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default Loginform;
