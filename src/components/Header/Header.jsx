import i18next from "i18next";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { MdMenu, MdOutlineLogout } from "react-icons/md";
import { useLocation } from "react-router-dom";

const permissions = [
  {
    id: 15,
    name: "addAdmin",
  },
  {
    id: 32,
    name: "addArticles",
  },
  {
    id: 28,
    name: "addArticlesCategories",
  },
  {
    id: 4,
    name: "addAudio",
  },
  {
    id: 72,
    name: "addAudiosCategories",
  },
  {
    id: 52,
    name: "addBook",
  },
  {
    id: 44,
    name: "addBooksCategories",
  },
  {
    id: 11,
    name: "addElder",
  },
  {
    id: 24,
    name: "addImage",
  },
  {
    id: 20,
    name: "addImageCategories",
  },
  {
    id: 64,
    name: "addIntroductionPage",
  },
  {
    id: 40,
    name: "addMainCategoriesBook",
  },
  {
    id: 36,
    name: "addMessage",
  },
  {
    id: 68,
    name: "addNotification",
  },
  {
    id: 60,
    name: "addSettings",
  },
  {
    id: 8,
    name: "addSpecialContent",
  },
  {
    id: 48,
    name: "addSubBooksCategories",
  },
  {
    id: 56,
    name: "addTermsConditions",
  },
  {
    id: 17,
    name: "deleteAdmin",
  },
  {
    id: 34,
    name: "deleteArticles",
  },
  {
    id: 30,
    name: "deleteArticlesCategories",
  },
  {
    id: 6,
    name: "deleteAudio",
  },
  {
    id: 74,
    name: "deleteAudiosCategories",
  },
  {
    id: 54,
    name: "deleteBook",
  },
  {
    id: 46,
    name: "deleteBooksCategories",
  },
  {
    id: 13,
    name: "deleteElder",
  },
  {
    id: 26,
    name: "deleteImage",
  },
  {
    id: 22,
    name: "deleteImageCategories",
  },
  {
    id: 66,
    name: "deleteIntroductionPage",
  },
  {
    id: 42,
    name: "deleteMainCategoriesBook",
  },
  {
    id: 38,
    name: "deleteMessage",
  },
  {
    id: 70,
    name: "deleteNotification",
  },
  {
    id: 62,
    name: "deleteSettings",
  },
  {
    id: 50,
    name: "deleteSubBooksCategories",
  },
  {
    id: 58,
    name: "deleteTermsConditions",
  },
  {
    id: 2,
    name: "deleteUser",
  },
  {
    id: 16,
    name: "editAdmin",
  },
  {
    id: 33,
    name: "editArticles",
  },
  {
    id: 29,
    name: "editArticlesCategories",
  },
  {
    id: 5,
    name: "editAudio",
  },
  {
    id: 73,
    name: "editAudiosCategories",
  },
  {
    id: 53,
    name: "editBook",
  },
  {
    id: 45,
    name: "editBooksCategories",
  },
  {
    id: 12,
    name: "editElder",
  },
  {
    id: 25,
    name: "editImage",
  },
  {
    id: 21,
    name: "editImageCategories",
  },
  {
    id: 65,
    name: "editIntroductionPage",
  },
  {
    id: 41,
    name: "editMainCategoriesBook",
  },
  {
    id: 37,
    name: "editMessage",
  },
  {
    id: 69,
    name: "editNotification",
  },
  {
    id: 61,
    name: "editSettings",
  },
  {
    id: 9,
    name: "editSpecialContent",
  },
  {
    id: 49,
    name: "editSubBooksCategories",
  },
  {
    id: 57,
    name: "editTermsConditions",
  },
  {
    id: 1,
    name: "editUser",
  },
  {
    id: 18,
    name: "GetAdmin",
  },
  {
    id: 31,
    name: "GetArticles",
  },
  {
    id: 27,
    name: "GetArticlesCategories",
  },
  {
    id: 7,
    name: "GetAudio",
  },
  {
    id: 71,
    name: "GetAudiosCategories",
  },
  {
    id: 51,
    name: "GetBook",
  },
  {
    id: 43,
    name: "GetBooksCategories",
  },
  {
    id: 14,
    name: "GetElder",
  },
  {
    id: 23,
    name: "GetImage",
  },
  {
    id: 19,
    name: "GetImageCategories",
  },
  {
    id: 63,
    name: "GetIntroductionPage",
  },
  {
    id: 39,
    name: "GetMainCategoriesBook",
  },
  {
    id: 35,
    name: "GetMessage",
  },
  {
    id: 67,
    name: "GetNotification",
  },
  {
    id: 59,
    name: "GetSettings",
  },
  {
    id: 10,
    name: "GetSpecialContent",
  },
  {
    id: 47,
    name: "GetSubBooksCategories",
  },
  {
    id: 55,
    name: "GetTermsConditions",
  },
  {
    id: 3,
    name: "GetUser",
  },
];

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
        Object.keys(Cookies.get()).map((cookie) => {
          if (
            permissions.map((permission) => permission.name).includes(cookie) ||
            cookie === "_auth" ||
            cookie === "_user" ||
            cookie === "_role" ||
            cookie === "_email" ||
            cookie === "_phone" ||
            cookie === "_image" ||
            cookie === "_active" ||
            cookie === "_id"
          ) {
            Cookies.remove(cookie);
          }
          return null;
        });
        setLoading(false);
        window.location.href = "/dr-omar/login";
      }, 3000);
      return () => clearTimeout(timer);
    } catch (error) {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (Cookies.get("_active") === "0") {
      // remove all cookies
      Object.keys(Cookies.get()).map((cookie) => {
        if (
          permissions.map((permission) => permission.name).includes(cookie) ||
          cookie === "_auth" ||
          cookie === "_user" ||
          cookie === "_role" ||
          cookie === "_email" ||
          cookie === "_phone" ||
          cookie === "_image" ||
          cookie === "_active" ||
          cookie === "_id"
        ) {
          Cookies.remove(cookie);
        }
        return null;
      });
      window.location.href = "/dr-omar/login";
    }
  }, [location.pathname]);

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
