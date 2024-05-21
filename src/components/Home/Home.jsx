import React, { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { IoMdHome } from "react-icons/io";
import { SiGooglescholar } from "react-icons/si";
import { GiBookshelf, GiSoundWaves } from "react-icons/gi";
import { SlPicture } from "react-icons/sl";
import {
  MdAdminPanelSettings,
  MdArticle,
  MdOutlineMarkunread,
} from "react-icons/md";
import { useTranslation } from "react-i18next";
import { Header, Sidebar } from "../";
import logo from "../../assets/images/logo.jpg";
import { HiUsers } from "react-icons/hi2";
import { IoPerson } from "react-icons/io5";
import { FaBell } from "react-icons/fa";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { getAdminData } from "../../store/slices/subAdminSlice";
import { Spinner } from "reactstrap";

const Home = () => {
  const { t } = useTranslation();
  const role = Cookies.get("_role");
  const getUserCookies = Cookies.get("GetUser");
  const getTermsConditionsCookies = Cookies.get("GetTermsConditions");
  const getSpecialContentCookies = Cookies.get("GetSpecialContent");
  const getSettingsCookies = Cookies.get("GetSettings");
  const getIntroductionPageBookCookies = Cookies.get("GetIntroductionPage");
  const getSubBooksCategoriesCookies = Cookies.get("GetSubBooksCategories");
  const getMainCategoriesBookCookies = Cookies.get("GetMainCategoriesBook");
  const getImageCategoriesCookies = Cookies.get("GetImageCategories");
  const getBooksCategoriesCookies = Cookies.get("GetBooksCategories");
  const getAudiosCategoriesCookies = Cookies.get("GetAudiosCategories");
  const getArticlesCategoriesCookies = Cookies.get("GetArticlesCategories");
  const getImageCookies = Cookies.get("GetImage");
  const getElderCookies = Cookies.get("GetElder");
  const getBookCookies = Cookies.get("GetBook");
  const getAudioCookies = Cookies.get("GetAudio");
  const getArticlesCookies = Cookies.get("GetArticles");
  const getAdminCookies = Cookies.get("GetAdmin");
  const getMessageCookies = Cookies.get("GetMessage");
  const getNotificationCookies = Cookies.get("GetNotification");
  const [menu, setMenu] = useState(false);
  const location = useLocation();
  const linkItems = [
    {
      title: t("linkItems.home"),
      path: "/dr-omar/dashboard",
      icon: <IoMdHome />,
      display: true,
    },
    {
      title: t("linkItems.profile"),
      path: "/dr-omar/profile",
      icon: <IoPerson />,
      display: true,
    },
    {
      title: t("linkItems.subAdmins"),
      path: "/dr-omar/sub-admins",
      icon: <MdAdminPanelSettings />,
      display: role === "admin" ? true : getAdminCookies === "1" && true,
    },
    {
      title: t("linkItems.users"),
      path: "/dr-omar/users",
      icon: <HiUsers />,
      display: role === "admin" ? true : getUserCookies === "1" && true,
    },
    {
      title: t("linkItems.settingsApp"),
      path: "/dr-omar/settings",
      display: role === "admin" ? true : getSettingsCookies === "1" && true,
    },
    // {
    //   title: t("linkItems.prayerTime"),
    //   path: "/dr-omar/prayer-time",
    // },
    {
      title: t("linkItems.codeContent"),
      path: "/dr-omar/code-content",
      display:
        role === "admin" ? true : getSpecialContentCookies === "1" && true,
    },
    {
      title: t("linkItems.introductionPage"),
      path: "/dr-omar/introduction-page",
      display:
        role === "admin"
          ? true
          : getIntroductionPageBookCookies === "1" && true,
    },
    {
      title: t("linkItems.termsAndConditions"),
      path: "/dr-omar/terms&conditions",
      display:
        role === "admin" ? true : getTermsConditionsCookies === "1" && true,
    },
    // {
    //   title: t("linkItems.links"),
    //   path: "/dr-omar/links",
    // },
    {
      title: t("linkItems.mainCategoriesBooks"),
      path: "/dr-omar/main-categories-book",
      display:
        role === "admin" ? true : getMainCategoriesBookCookies === "1" && true,
    },
    {
      title: t("linkItems.subCategoriesBooks"),
      path: "/dr-omar/sub-main-categories-book",
      display:
        role === "admin" ? true : getSubBooksCategoriesCookies === "1" && true,
    },
    {
      title: t("linkItems.subSubCategoriesBooks"),
      path: "/dr-omar/sub-sub-categories-book",
      display:
        role === "admin" ? true : getBooksCategoriesCookies === "1" && true,
    },
    {
      title: t("linkItems.categoriesAudio"),
      path: "/dr-omar/categories-audio",
      display:
        role === "admin" ? true : getAudiosCategoriesCookies === "1" && true,
    },
    {
      title: t("linkItems.categoriesImage"),
      path: "/dr-omar/categories-image",
      display:
        role === "admin" ? true : getImageCategoriesCookies === "1" && true,
    },
    {
      title: t("linkItems.categoriesArticle"),
      path: "/dr-omar/categories-article",
      display:
        role === "admin" ? true : getArticlesCategoriesCookies === "1" && true,
    },
    {
      title: t("linkItems.elder"),
      path: "/dr-omar/elders",
      icon: <SiGooglescholar />,
      display: role === "admin" ? true : getElderCookies === "1" && true,
    },
    {
      title: t("linkItems.books"),
      path: "/dr-omar/books",
      icon: <GiBookshelf />,
      display: role === "admin" ? true : getBookCookies === "1" && true,
    },
    {
      title: t("linkItems.audios"),
      path: "/dr-omar/audios",
      icon: <GiSoundWaves />,
      display: role === "admin" ? true : getAudioCookies === "1" && true,
    },
    {
      title: t("linkItems.images"),
      path: "/dr-omar/images",
      icon: <SlPicture />,
      display: role === "admin" ? true : getImageCookies === "1" && true,
    },
    {
      title: t("linkItems.articles"),
      path: "/dr-omar/articles",
      icon: <MdArticle />,
      display: role === "admin" ? true : getArticlesCookies === "1" && true,
    },
    {
      title: t("linkItems.notifications"),
      path: "/dr-omar/notifications",
      icon: <FaBell />,
      display: role === "admin" ? true : getNotificationCookies === "1" && true,
    },
    {
      title: t("linkItems.messages"),
      path: "/dr-omar/messages",
      icon: <MdOutlineMarkunread />,
      display: role === "admin" ? true : getMessageCookies === "1" && true,
    },
    // {
    //   title: t("linkItems.mostListening"),
    //   path: "/dr-omar/most-listening",
    //   icon: <FaAssistiveListeningSystems />,
    // },
  ];

  const dispatch = useDispatch();
  const { adminData, loadingAdminData } = useSelector(
    (state) => state.subAdmin
  );

  useEffect(() => {
    try {
      dispatch(getAdminData());
    } catch (error) {
      console.log("error", error);
    }
  }, [dispatch, location.pathname]);

  //   Add adminData to cookies
  useEffect(() => {
    try {
      if (adminData) {
        // Set Token in Cookies
        Cookies.set("_user", adminData?.name, {
          expires: 30,
          secure: true,
          sameSite: "strict",
          path: "/",
        });
        Cookies.set("_role", adminData?.powers, {
          expires: 30,
          secure: true,
          sameSite: "strict",
          path: "/",
        });
        Cookies.set("_email", adminData?.email, {
          expires: 30,
          secure: true,
          sameSite: "strict",
          path: "/",
        });
        Cookies.set("_phone", adminData?.phone, {
          expires: 30,
          secure: true,
          sameSite: "strict",
          path: "/",
        });
        Cookies.set("_image", adminData?.image, {
          expires: 30,
          secure: true,
          sameSite: "strict",
          path: "/",
        });
        Cookies.set("_active", adminData?.active, {
          expires: 30,
          secure: true,
          sameSite: "strict",
          path: "/",
        });
        adminData?.permissions?.map((permission) =>
          Cookies.set(permission, 1, {
            expires: 30,
            secure: true,
            sameSite: "strict",
            path: "/",
          })
        );
      }
    } catch (error) {
      console.log("error", error);
    }
  }, [adminData]);

  useEffect(() => {
    try {
      if (Cookies.get("_active") === "0") {
        Cookies.remove("_auth");
        Cookies.remove("_user");
        Cookies.remove("_role");
        Cookies.remove("_email");
        Cookies.remove("_phone");
        Cookies.remove("_image");
        Cookies.remove("_active");
        linkItems.map((item) => Cookies.remove(item.title));
      }
      if (!Cookies.get("_auth")) {
        window.location.href = "/login";
      }
    } catch (error) {
      console.log("error", error);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleMenu = () => {
    setMenu(!menu);
  };
  const closeMenu = (e) => {
    if (e.key === "Escape" || e.target.classList.contains("overlay")) {
      setMenu(false);
    }
  };
  useEffect(() => {
    setMenu(false);
  }, [location.pathname]);
  useEffect(() => {
    document.addEventListener("click", closeMenu);
    document.addEventListener("keydown", closeMenu);
    return () => {
      document.removeEventListener("click", closeMenu);
    };
  }, []);

  return (
    <div className="dashboard-container">
      {loadingAdminData ? (
        <Spinner
          style={{
            width: "5rem",
            height: "5rem",
            position: "absolute",
            top: "50%",
            left: "50%",
          }}
          type="grow"
        />
      ) : (
        <>
          <div className="dashboard">
            <Header menu={menu} toggleMenu={toggleMenu} linkItems={linkItems} />
            <Outlet />
          </div>
          <Sidebar menu={menu} linkItems={linkItems} logo={logo} />
        </>
      )}
    </div>
  );
};

export default Home;
