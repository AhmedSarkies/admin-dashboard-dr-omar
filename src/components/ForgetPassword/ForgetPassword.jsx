import React from "react";

import image from "../../assets/images/anonymous.png";
import { toast } from "react-toastify";
import { object, string } from "yup";
import { useFormik } from "formik";

const ForgetPassword = () => {
  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: object().shape({
      email: string()
        .email("يجب ادخال البريد الالكتروني بشكل صحيح")
        .required("يجب ادخال البريد الالكتروني"),
    }),
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
        <img src={image} alt="logo" className="login-logo mb-2" />
        <h6 className="login-title">
          أدخل بريدك الإلكتروني لإعادة تعيين كلمة المرور الخاصة بك
        </h6>
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
            placeholder="البريد الالكتروني"
            value={formik.values.email}
            onChange={handleInputChange}
          />
          <label htmlFor="email" className="label-form">
            البريد الالكتروني
          </label>
        </div>
        <button type="submit" className="btn submit-btn w-100">
          إرسال
        </button>
      </form>
    </div>
  );
};

export default ForgetPassword;
