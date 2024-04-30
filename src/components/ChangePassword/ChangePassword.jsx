import React, { useState } from "react";
import { useFormik } from "formik";
import { Col, Row, Spinner } from "reactstrap";

import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { changePassword } from "../../store/slices/profileSlice";
import useSchema from "../../hooks/useSchema";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Cookies from "js-cookie";

const initialValues = {
  current_password: "",
  new_password: "",
  new_password_confirmation: "",
};

const ChangePassword = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [vars, setVars] = useState({
    show: false,
    showNew: false,
    showConfirm: false,
    loading: false,
  });
  const { validationSchema } = useSchema();
  const navigate = useNavigate();
  const id = Cookies.get("_id");
  const formik = useFormik({
    initialValues,
    validationSchema: validationSchema.ChangePassword,
    onSubmit: (values) => {
      setVars({ ...vars, loading: true });
      dispatch(
        changePassword({
          id,
          ...values,
        })
      ).then((res) => {
        if (res.meta.requestStatus === "fulfilled") {
          setVars({ ...vars, loading: false });
          navigate("/dr-omar/profile");
          toast.success(t("toast.profile.passwordSuccess"));
        } else {
          setVars({ ...vars, loading: false });
          toast.error(t("toast.profile.passwordError"));
        }
      });
    },
  });

  const handleChange = (e) => {
    formik.handleChange(e);
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
              <div className="form-group password change-password-profile">
                <div className="in">
                  <input
                    type={vars.show ? "text" : "password"}
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
                {vars.show ? (
                  <FaEye
                    className="eye"
                    onClick={() => setVars({ ...vars, show: false })}
                  />
                ) : (
                  <FaEyeSlash
                    className="eye"
                    onClick={() => setVars({ ...vars, show: true })}
                  />
                )}
              </div>
              <div className="error-container">
                {formik.touched.current_password &&
                formik.errors.current_password ? (
                  <span className="error">
                    {formik.errors.current_password}
                  </span>
                ) : null}
              </div>
              <div className="form-group password change-password-profile">
                <div className="in">
                  <input
                    type={vars.showNew ? "text" : "password"}
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
                {vars.showNew ? (
                  <FaEye
                    className="eye"
                    onClick={() => setVars({ ...vars, showNew: false })}
                  />
                ) : (
                  <FaEyeSlash
                    className="eye"
                    onClick={() => setVars({ ...vars, showNew: true })}
                  />
                )}
              </div>
              <div className="error-container">
                {formik.touched.new_password && formik.errors.new_password ? (
                  <span className="error">{formik.errors.new_password}</span>
                ) : null}
              </div>
              <div className="form-group password change-password-profile">
                <div className="in">
                  <input
                    type={vars.showConfirm ? "text" : "password"}
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
                {vars.showConfirm ? (
                  <FaEye
                    className="eye"
                    onClick={() => setVars({ ...vars, showConfirm: false })}
                  />
                ) : (
                  <FaEyeSlash
                    className="eye"
                    onClick={() => setVars({ ...vars, showConfirm: true })}
                  />
                )}
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
                  onClick={() => navigate("/dr-omar/profile")}
                >
                  {t("cancel")}
                </button>
                <button
                  type="submit"
                  className={`add-btn${vars.loading ? " loading-btn" : ""}`}
                >
                  {vars.loading ? (
                    <Spinner
                      color="white"
                      style={{
                        height: "1.5rem",
                        width: "1.5rem",
                        borderWidth: "0.2em",
                      }}
                    >
                      Loading...
                    </Spinner>
                  ) : (
                    t("update")
                  )}
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
