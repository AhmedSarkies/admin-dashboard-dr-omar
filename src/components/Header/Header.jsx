import i18next from "i18next";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { MdMenu, MdOutlineLogout } from "react-icons/md";
import { useLocation } from "react-router-dom";

const Header = ({ menu, toggleMenu, linkItems }) => {
  const location = useLocation();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);

  // Logout Function
  const logout = () => {
    setLoading(true);
    try {
      // Remove Cookies on Logout Click Event but make it in 3 seconds
      const timer = setTimeout(() => {
        Cookies.remove("_auth");
        Cookies.remove("_user");
        Cookies.remove("_role");
        Cookies.remove("_email");
        Cookies.remove("_phone");
        Cookies.remove("_image");
        Cookies.remove("_active");
        Cookies.remove("_id");
        setLoading(false);
        window.location.href = "/dr-omar/login";
      }, 3000);
      return () => clearTimeout(timer);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.documentElement.lang = t("lng") === "EN" ? "en" : "ar";
  }, [t]);

  return (
    <>
      <div className={`overlay${menu ? " active" : ""}`}></div>
      <div className="dashboard-header">
        <div className="dashboard-header-btns">
          <button
            className={`btn logout-btn${loading ? " loading-btn" : ""}`}
            onClick={() => {
              logout();
            }}
          >
            {loading ? (
              t("loading")
            ) : (
              <>
                <MdOutlineLogout />
                {t("headerLogout")}
              </>
            )}
          </button>
          <button
            className="btn lang-btn"
            onClick={() =>
              i18next.language === "en"
                ? i18next.changeLanguage("ar")
                : i18next.changeLanguage("en")
            }
          >
            {t("lng")}
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
