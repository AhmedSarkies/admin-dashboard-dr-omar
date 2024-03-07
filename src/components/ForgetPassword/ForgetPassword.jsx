import React from "react";

const ForgetPassword = () => {
  return (
    <div className="login forget-password-page">
      <div className="login-header d-flex flex-column justify-content-center align-items-center gap-2">
        <img
          src="https://via.placeholder.com/150"
          alt="logo"
          className="login-logo mb-2"
        />
        <h6 className="login-title">
          أدخل بريدك الإلكتروني لإعادة تعيين كلمة المرور الخاصة بك
        </h6>
      </div>
      <form className="d-flex justify-content-center align-items-center flex-column gap-3 w-100">
        <div className="form-group">
          <input
            type="email"
            className="form-control"
            id="email"
            placeholder="البريد الالكتروني"
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
