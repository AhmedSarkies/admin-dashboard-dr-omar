import i18next from "i18next";
import cookies from "js-cookie";
import React, { useEffect } from "react";
import { MdMenu, MdOutlineLogout } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";

const Header = ({ menu, toggleMenu, linkItems }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const lng = cookies.get("i18next") || "ar";

  useEffect(() => {
    document.documentElement.lang = lng;
  }, [lng]);

  return (
    <>
      <div className={`overlay${menu ? " active" : ""}`}></div>
      <div className="dashboard-header">
        <div className="dashboard-header-btns">
          <button
            className="btn logout-btn"
            onClick={() => navigate("/dr-omar/login", { replace: true })}
          >
            <MdOutlineLogout />
            {lng === "en" ? "Logout" : "تسجيل الخروج"}
          </button>
          <button
            className="btn lang-btn"
            onClick={() =>
              i18next.language === "en"
                ? i18next.changeLanguage("ar")
                : i18next.changeLanguage("en")
            }
          >
            {lng === "ar" ? "EN" : "ع"}
          </button>
        </div>
        <div className="dashboard-header-title">
          <h6 className="login-title">
            {linkItems.find((item) => item.path === location.pathname)?.title}
          </h6>
          <button className="btn menu-btn" onClick={toggleMenu}>
            <MdMenu />
          </button>
        </div>
      </div>
    </>
  );
};

export default Header;
