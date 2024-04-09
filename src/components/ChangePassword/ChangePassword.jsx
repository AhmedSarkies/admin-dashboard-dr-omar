import React, { useState } from "react";
import { useFormik } from "formik";
import {
  Col,
  Row,
} from "reactstrap";
import { object, ref, string } from "yup";

import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { changePassword } from "../../store/slices/subAdminSlice";
import { useDispatch } from "react-redux";

const ChangePassword = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [toggle, setToggle] = useState({});
  const navigate = useNavigate();
  const changePasswordFormik = useFormik({
    initialValues: {
      current_password: "",
      new_password: "",
      new_password_confirmation: "",
    },
    validationSchema: object().shape({
      current_password: string().required("يجب ادخال كلمة المرور القديمة"),
      new_password: string()
        .min(8, "يجب ادخال كلمة مرور لا تقل عن 8 احرف")
        .required("يجب ادخال كلمة المرور الجديدة"),
      new_password_confirmation: string()
        .oneOf([ref("newPassword"), null], "كلمة المرور غير متطابقة")
        .required("يجب ادخال تأكيد كلمة المرور"),
    }),
    onSubmit: (values) => {
      dispatch(changePassword(values));
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
                  id="current_password"
                  placeholder="*********"
                  name="current_password"
                  value={changePasswordFormik.values.current_password}
                  onChange={handleInputChangePassword}
                />
                <label htmlFor="current_password" className="label-form">
                  {t("profile.oldPassword")}
                </label>
              </div>
              <div className="error-container">
                {changePasswordFormik.touched.current_password &&
                changePasswordFormik.errors.current_password ? (
                  <span className="error">
                    {changePasswordFormik.errors.current_password}
                  </span>
                ) : null}
              </div>
              <div className="form-group">
                <input
                  type="password"
                  className="form-control"
                  id="new_password"
                  placeholder="*********"
                  name="new_password"
                  value={changePasswordFormik.values.new_password}
                  onChange={handleInputChangePassword}
                />
                <label htmlFor="new_password" className="label-form">
                  {t("profile.newPassword")}
                </label>
              </div>
              <div className="error-container">
                {changePasswordFormik.touched.new_password &&
                changePasswordFormik.errors.new_password ? (
                  <span className="error">
                    {changePasswordFormik.errors.new_password}
                  </span>
                ) : null}
              </div>
              <div className="form-group">
                <input
                  type="password"
                  className="form-control"
                  id="new_password_confirmation"
                  placeholder="*********"
                  name="new_password_confirmation"
                  value={changePasswordFormik.values.new_password_confirmation}
                  onChange={handleInputChangePassword}
                />
                <label htmlFor="new_password_confirmation" className="label-form">
                  {t("profile.confirmPassword")}
                </label>
              </div>
              <div className="error-container">
                {changePasswordFormik.touched.new_password_confirmation &&
                changePasswordFormik.errors.new_password_confirmation ? (
                  <span className="error">
                    {changePasswordFormik.errors.new_password_confirmation}
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
