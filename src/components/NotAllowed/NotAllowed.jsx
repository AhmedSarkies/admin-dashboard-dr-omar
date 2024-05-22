import React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const NotAllowed = () => {
  const { t } = useTranslation();
  return (
    <div
      className="scholar-container mt-4 m-sm-3 m-0"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        height: "85vh",
      }}
    >
      <div
        className="scholar"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          height: "100%",
        }}
      >
        <h4>{t("notAllowed")}</h4>
        <p>
          <Link to="/">{t("goBack")}</Link>
        </p>
      </div>
    </div>
  );
};

export default NotAllowed;
