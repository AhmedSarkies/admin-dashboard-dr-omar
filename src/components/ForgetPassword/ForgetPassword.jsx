import React from "react";

import logo from "../../assets/images/logo.jpg";
import { toast } from "react-toastify";
import { useSchema } from "../../hooks";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";

const ForgetPassword = () => {
  const { t } = useTranslation();
  const { validationSchema } = useSchema();
  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: validationSchema.forgetPassword,
    onSubmit: (values) => {
      if (values.email !== "admin@gmail.com") {
        toast.error("الحساب غير موجود");
      } else {
        toast.success(
          "تم ارسال رابط اعادة تعيين كلمة المرور الى بريدك الالكتروني"
        );
      }
    },
  });
  //   Handle Input Change using formik
  const handleInputChange = (e) => {
    formik.handleChange(e);
  };

  return (
    <div className="login forget-password-page">
      <div className="login-header d-flex flex-column justify-content-center align-items-center gap-2">
        <img src={logo} alt="logo" className="login-logo mb-2" />
        <h6 className="login-title">{t("auth.forgetPassword.title")}</h6>
      </div>
      <form
        className="d-flex justify-content-center align-items-center flex-column gap-3 w-100"
        onSubmit={formik.handleSubmit}
      >
        <div className="form-group">
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            placeholder={t("auth.forgetPassword.email")}
            value={formik.values.email}
            onChange={handleInputChange}
          />
          <label htmlFor="email" className="label-form">
            {t("auth.forgetPassword.email")}
          </label>
        </div>
        <button type="submit" className="btn submit-btn w-100">
          {t("auth.forgetPassword.submit")}
        </button>
      </form>
    </div>
  );
};

export default ForgetPassword;
