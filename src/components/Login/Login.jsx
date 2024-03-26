import React, { useState } from "react";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import Http from "../../Http";
import { useSchema } from "../../hooks";
import logo from "../../assets/images/logo.jpg";

const Login = () => {
  const { t } = useTranslation();
  const { validationSchema } = useSchema();
  const [loading, setLoading] = useState(false);
  const onSubmit = async (values) => {
    setLoading(true);
    try {
      const response = await Http({
        method: "POST",
        url: "/admin/login",
        data: values,
      });
      if (response.status === 200) {
        Cookies.remove("_auth");
        // Set Token in Cookies
        Cookies.set("_auth", JSON.stringify(response.data.data.token), {
          expires: 30,
          secure: true,
          sameSite: "strict",
          path: "/",
          tokenType: "Bearer" + response.data.data.token,
        });
        setLoading(false);
        window.location.href = "/dr-omar/dashboard";
      }
    } catch (error) {
      setLoading(false);
      toast.error(t("toast.login.error"));
    }
  };
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      //   userType: "",
    },
    validationSchema: validationSchema.login,
    onSubmit,
  });
  //   Handle Input Change using formik
  const handleInputChange = (e) => {
    formik.handleChange(e);
  };

  return (
    <div className="login">
      <div className="login-header d-flex flex-column justify-content-center align-items-center gap-2">
        <img src={logo} alt="logo" className="login-logo mb-2" />
        <h6 className="login-title">{t("auth.login.title")}</h6>
      </div>
      <form
        className="d-flex justify-content-center align-items-center flex-column gap-3 w-100"
        onSubmit={formik.handleSubmit}
      >
        <div className="form-group">
          <input
            type="text"
            className="form-control"
            id="email"
            name="email"
            placeholder={t("auth.login.email")}
            value={formik.values.email}
            onChange={handleInputChange}
          />
          <label htmlFor="email" className="label-form">
            {t("auth.login.email")}
          </label>
        </div>
        <div className="error-container">
          {formik.touched.email && formik.errors.email ? (
            <span className="error">{formik.errors.email}</span>
          ) : null}
        </div>
        <div className="form-group">
          <input
            type="password"
            className="form-control"
            id="password"
            placeholder="*********"
            name="password"
            value={formik.values.password}
            onChange={handleInputChange}
          />
          <label htmlFor="password" className="label-form">
            {t("auth.login.password")}
          </label>
        </div>
        <div className="error-container">
          {formik.touched.password && formik.errors.password ? (
            <span className="error">{formik.errors.password}</span>
          ) : null}
        </div>
        {/*<div className="form-group radio-group mt-2">
          <label className="radio admin" htmlFor="admin">
            <input
              type="radio"
              name="userType"
              id="admin"
              value="admin"
              checked={formik.values.userType === "admin"}
              onChange={handleInputChange}
            />
            أدمن
            <div className="radio-btn"></div>
          </label>
          <label className="radio admin sub-admin" htmlFor="sub-admin">
            <input
              type="radio"
              name="userType"
              id="sub-admin"
              value="sub-admin"
              checked={formik.values.userType === "sub-admin"}
              onChange={handleInputChange}
            />
            مسؤول فرعي
            <div className="radio-btn"></div>
          </label>
        </div>*/}
        <button
          type="submit"
          className="btn submit-btn w-100"
          disabled={loading ? true : false}
          style={{
            opacity: 1,
            background: `${
              loading ? "rgb(11 28 48 / 85%)" : "rgb(11 28 48 / 93%)"
            }`,
          }}
        >
          {loading ? (
            <div className="spinner-border text-light" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          ) : (
            t("auth.login.submit")
          )}
        </button>
      </form>
      {/*<Link to="/dr-omar/forget-password" className="forget-password">
        {t("auth.login.forgetPassword")}
      </Link>*/}
    </div>
  );
};

export default Login;
