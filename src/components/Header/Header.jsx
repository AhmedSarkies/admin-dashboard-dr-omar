import React from "react";
import { MdMenu, MdOutlineLogout } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";

const Header = ({ menu, toggleMenu }) => {
  const navigate = useNavigate();
  // get the title page from router
  const location = useLocation();

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
            تسجيل الخروج
          </button>
          {/* <button className="btn lang-btn">E</button> */}
        </div>
        <div className="dashboard-header-title">
          <h6 className="login-title">
            {location.pathname?.includes("elder")
              ? "العلماء"
              : location.pathname?.includes("images")
              ? "الصور"
              : location.pathname?.includes("articles")
              ? "المقالات"
              : location.pathname?.includes("books")
              ? "الكتب"
              : location.pathname?.includes("audios")
              ? "الصوتيات"
              : location.pathname?.includes("categories-book")
              ? "تصنيفات الكتب"
              : location.pathname?.includes("categories-audio")
              ? "تصنيفات الصوتيات"
              : location.pathname?.includes("categories-image")
              ? "تصنيفات الصور"
              : location.pathname?.includes("categories-article")
              ? "تصنيفات المقالات"
              : "الصفحة الرئيسية"}
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
