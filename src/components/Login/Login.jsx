import React from "react";
import { useNavigate } from "react-router-dom";

import { useFormik } from "formik";
import { useSchema } from "../../hooks";

import logo from "../../assets/images/logo.jpg";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import Http from "../../Http";

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { validationSchema } = useSchema();
  const submitHandler = async (values) => {
    try {
      const response = await Http({
        method: "POST",
        url: "/login",
        data: values,
        withCredentials: true,
      });
      if (response.status === 200) {
        navigate("/dashboard", { replace: true, state: response.data });
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      //   userType: "",
    },
    validationSchema: validationSchema.login,
    onSubmit: (values) => {
      if (
        values.email !== "admin@gmail.com" &&
        values.password !== "admin123"
      ) {
        toast.error("الحساب غير موجود");
        submitHandler(values);
      } else {
        navigate("/dr-omar/dashboard", { replace: true, state: values });
      }
    },
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
        {/* <div className="form-group radio-group mt-2">
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
                </div> */}
        <button type="submit" className="btn submit-btn w-100">
          {t("auth.login.submit")}
        </button>
      </form>
      {/* <Link to="/dr-omar/forget-password" className="forget-password">
        {t("auth.login.forgetPassword")}
      </Link> */}
    </div>
  );
};

export default Login;
