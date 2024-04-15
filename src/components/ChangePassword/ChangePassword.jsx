import React from "react";
import { useFormik } from "formik";
import { Col, Row } from "reactstrap";

import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { changePassword } from "../../store/slices/profileSlice";
import useSchema from "../../hooks/useSchema";
import { toast } from "react-toastify";

const initialValues = {
  current_password: "",
  new_password: "",
  new_password_confirmation: "",
};

const ChangePassword = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { validationSchema } = useSchema();
  const navigate = useNavigate();
  const { id } = useParams();
  const formik = useFormik({
    initialValues,
    validationSchema: validationSchema.ChangePassword,
    onSubmit: (values) => {
      dispatch(
        changePassword({
          id,
          ...values,
        })
      ).then((res) => {
        if (res.meta.requestStatus === "fulfilled") {
          navigate("/dr-omar/profile");
          toast.success(t("toast.profile.passwordSuccess"));
        } else {
          toast.error(t("toast.profile.passwordError"));
        }
      });
    },
  });

  const handleChange = (e) => {
    formik.handleChange(e);
  };

  const cancelChangePassword = () => {
    navigate("/dr-omar/profile");
  };

  return (
    <div className="profile-container">
      <Row className="justify-content-center">
        <Col>
          <div className="profile">
            <form
              className="d-flex justify-content-center align-items-center flex-column gap-3 w-100"
              onSubmit={formik.handleSubmit}
            >
              <div className="form-group">
                <input
                  type="password"
                  className="form-control"
                  id="current_password"
                  placeholder="*********"
                  name="current_password"
                  value={formik.values.current_password}
                  onChange={handleChange}
                />
                <label htmlFor="current_password" className="label-form">
                  {t("profile.oldPassword")}
                </label>
              </div>
              <div className="error-container">
                {formik.touched.current_password &&
                formik.errors.current_password ? (
                  <span className="error">
                    {formik.errors.current_password}
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
                  value={formik.values.new_password}
                  onChange={handleChange}
                />
                <label htmlFor="new_password" className="label-form">
                  {t("profile.newPassword")}
                </label>
              </div>
              <div className="error-container">
                {formik.touched.new_password && formik.errors.new_password ? (
                  <span className="error">{formik.errors.new_password}</span>
                ) : null}
              </div>
              <div className="form-group">
                <input
                  type="password"
                  className="form-control"
                  id="new_password_confirmation"
                  placeholder="*********"
                  name="new_password_confirmation"
                  value={formik.values.new_password_confirmation}
                  onChange={handleChange}
                />
                <label
                  htmlFor="new_password_confirmation"
                  className="label-form"
                >
                  {t("profile.confirmPassword")}
                </label>
              </div>
              <div className="error-container">
                {formik.touched.new_password_confirmation &&
                formik.errors.new_password_confirmation ? (
                  <span className="error">
                    {formik.errors.new_password_confirmation}
                  </span>
                ) : null}
              </div>
              <div className="form-group d-flex justify-content-end gap-2">
                <button
                  type="button"
                  className="change-password-btn"
                  onClick={cancelChangePassword}
                >
                  {t("cancel")}
                </button>
                <button type="submit" className="add-btn">
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
