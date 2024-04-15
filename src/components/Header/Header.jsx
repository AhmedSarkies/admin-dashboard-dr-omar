import i18next from "i18next";
import Cookies from "js-cookie";
import React, { useEffect } from "react";
import { MdMenu, MdOutlineLogout } from "react-icons/md";
import { useLocation } from "react-router-dom";

const Header = ({ menu, toggleMenu, linkItems }) => {
  const location = useLocation();
  const lng = Cookies.get("i18next") || "ar";

  useEffect(() => {
    document.documentElement.lang = lng;
  }, [lng]);

  // Logout Function
  const logout = () => {
    Cookies.remove("_auth");
    Cookies.remove("_user");
    Cookies.remove("_role");
    Cookies.remove("_email");
    Cookies.remove("_phone");
    Cookies.remove("_image");
    Cookies.remove("_active");
    Cookies.remove("_id");
    window.location.href = "/dr-omar/login";
  };

  return (
    <>
      <div className={`overlay${menu ? " active" : ""}`}></div>
      <div className="dashboard-header">
        <div className="dashboard-header-btns">
          <button
            className="btn logout-btn"
            onClick={() => {
              logout();
            }}
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
            {
              linkItems.find(
                (item) =>
                  item.path.toLowerCase() === location.pathname.toLowerCase()
              )?.title
            }
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
