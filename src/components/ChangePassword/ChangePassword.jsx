import React, { useState } from "react";
import { useFormik } from "formik";
import {
  Col,
  Row,
} from "reactstrap";
import { object, ref, string } from "yup";

import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const ChangePassword = () => {
  const { t } = useTranslation();
  const [toggle, setToggle] = useState({});
  const navigate = useNavigate();
  const changePasswordFormik = useFormik({
    initialValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: object().shape({
      oldPassword: string().required("يجب ادخال كلمة المرور القديمة"),
      newPassword: string()
        .min(8, "يجب ادخال كلمة مرور لا تقل عن 8 احرف")
        .required("يجب ادخال كلمة المرور الجديدة"),
      confirmPassword: string()
        .oneOf([ref("newPassword"), null], "كلمة المرور غير متطابقة")
        .required("يجب ادخال تأكيد كلمة المرور"),
    }),
    onSubmit: (values) => {
      console.log(values);
    },
  });

  const handleInputChangePassword = (e) => {
    changePasswordFormik.handleChange(e);
  };

  return (
    <div className="profile-container">
      <Row className="justify-content-center">
        <Col>
          <div className="profile">
            <form
              className="d-flex justify-content-center align-items-center flex-column gap-3 w-100"
              onSubmit={changePasswordFormik.handleSubmit}
            >
              <div className="form-group">
                <input
                  type="password"
                  className="form-control"
                  id="oldPassword"
                  placeholder="*********"
                  name="oldPassword"
                  value={changePasswordFormik.values.oldPassword}
                  onChange={handleInputChangePassword}
                />
                <label htmlFor="oldPassword" className="label-form">
                  {t("profile.oldPassword")}
                </label>
              </div>
              <div className="error-container">
                {changePasswordFormik.touched.oldPassword &&
                changePasswordFormik.errors.oldPassword ? (
                  <span className="error">
                    {changePasswordFormik.errors.oldPassword}
                  </span>
                ) : null}
              </div>
              <div className="form-group">
                <input
                  type="newPassword"
                  className="form-control"
                  id="newPassword"
                  placeholder="*********"
                  name="newPassword"
                  value={changePasswordFormik.values.newPassword}
                  onChange={handleInputChangePassword}
                />
                <label htmlFor="newPassword" className="label-form">
                  {t("profile.newPassword")}
                </label>
              </div>
              <div className="error-container">
                {changePasswordFormik.touched.newPassword &&
                changePasswordFormik.errors.newPassword ? (
                  <span className="error">
                    {changePasswordFormik.errors.newPassword}
                  </span>
                ) : null}
              </div>
              <div className="form-group">
                <input
                  type="confirmPassword"
                  className="form-control"
                  id="confirmPassword"
                  placeholder="*********"
                  name="confirmPassword"
                  value={changePasswordFormik.values.confirmPassword}
                  onChange={handleInputChangePassword}
                />
                <label htmlFor="confirmPassword" className="label-form">
                  {t("profile.confirmPassword")}
                </label>
              </div>
              <div className="error-container">
                {changePasswordFormik.touched.confirmPassword &&
                changePasswordFormik.errors.confirmPassword ? (
                  <span className="error">
                    {changePasswordFormik.errors.confirmPassword}
                  </span>
                ) : null}
              </div>
              <div className="form-group d-flex justify-content-end gap-2">
                <button
                  className="change-password-btn"
                  onClick={() => navigate("/dr-omar/profile")}
                >
                  {t("cancel")}
                </button>
                <button
                  type="submit"
                  className="add-btn"
                  onClick={() =>
                    setToggle({
                      ...toggle,
                      changePassword: !toggle.changePassword,
                    })
                  }
                >
                  {t("update")}
                </button>
              </div>
            </form>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default ChangePassword;
