import React, { useEffect } from "react";
import { Col, Row } from "reactstrap";

import anonymous from "../../assets/images/anonymous.png";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getProfile } from "../../store/slices/profileSlice";

const Profile = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { profile, loading } = useSelector((state) => state.profile);

  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  return (
    <div className="profile-container">
      <Row className="justify-content-center">
        <Col xxl="4" xl="5" lg="6" md="7" sm="8">
          <div className={`profile ${loading ? "align-items-center" : ""}`}>
            {loading ? (
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            ) : (
              <>
                <div className="profile-header d-flex justify-content-center align-items-start">
                  <img src={profile.image || anonymous} alt={profile.name} />
                </div>
                <hr />
                <div className="profile-body">
                  <p className="name">
                    <span>{t("profile.name")}</span>
                    {": "}
                    {profile.name}
                  </p>
                  <p className="email">
                    <span>{t("profile.email")}</span>
                    {": "}
                    {profile.email}
                  </p>
                  {t("lng") === "EN" ? (
                    <p
                      className="d-flex justify-content-center align-content-center"
                      dir="ltr"
                    >
                      <span>{t("profile.phone")}</span>
                      {": "}
                      {profile.phone}
                    </p>
                  ) : (
                    <p className="d-flex justify-content-center align-content-center">
                      {profile.phone}
                      {" :"}
                      <span>{t("profile.phone")}</span>
                    </p>
                  )}
                </div>
                <div className="profile-footer">
                  <button
                    className="change-password-btn"
                    onClick={() => navigate(`/dr-omar/profile/change-password`)}
                  >
                    {t("profile.changePassword")}
                  </button>
                  <button
                    className="add-btn"
                    onClick={() => navigate(`/dr-omar/profile/edit-profile`)}
                  >
                    {t("edit")}
                  </button>
                </div>
              </>
            )}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Profile;
