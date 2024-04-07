import React from "react";
import { Col, Row } from "reactstrap";

import anonymous from "../../assets/images/anonymous.png";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="profile-container">
      <Row className="justify-content-center">
        <Col xxl="4" xl="5" lg="6" md="7" sm="8">
          <div className="profile">
            <div className="profile-header d-flex justify-content-center align-items-start">
              <img src={anonymous} alt="profile" />
            </div>
            <hr />
            <div className="profile-body">
              <p>
                <span>{t("profile.name")}</span>
                {": "}
                {"محمد"}
              </p>
              <p className="email">
                <span>{t("profile.email")}</span>
                {": "}
                {"admin@gmail.com"}
              </p>
              <p>
                <span>{t("profile.phone")}</span>
                {": "}
                {"01234567890"}
              </p>
            </div>
            <div className="profile-footer">
              <button
                className="change-password-btn"
                onClick={() => navigate("/dr-omar/profile/change-password")}
              >
                {t("profile.changePassword")}
              </button>
              <button
                className="add-btn"
                onClick={() => navigate("/dr-omar/profile/edit-profile")}
              >
                {t("edit")}
              </button>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Profile;
