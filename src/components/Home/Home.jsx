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

const Home = () => {
  const { t } = useTranslation();
  const linkItems = [
    {
      title: t("linkItems.home"),
      path: "/dr-omar/dashboard",
      icon: <IoMdHome />,
    },
    // {
    //   title: t("linkItems.profile"),
    //   path: "/dr-omar/profile",
    //   icon: <IoPerson />,
    // },
    {
      title: t("linkItems.subAdmins"),
      path: "/dr-omar/sub-admins",
      icon: <MdAdminPanelSettings />,
    },
    {
      title: t("linkItems.users"),
      path: "/dr-omar/users",
      icon: <HiUsers />,
    },
    {
      title: t("linkItems.messages"),
      path: "/dr-omar/messages",
      icon: <MdOutlineMarkunread />,
    },
    {
      title: t("linkItems.settingsApp"),
      path: "/dr-omar/settings",
    },
    // {
    //   title: t("linkItems.prayerTime"),
    //   path: "/dr-omar/prayer-time",
    // },
    {
      title: t("linkItems.codeContent"),
      path: "/dr-omar/code-content",
    },
    {
      title: t("linkItems.slider"),
      path: "/dr-omar/introduction-page",
    },
    {
      title: t("linkItems.termsAndConditions"),
      path: "/dr-omar/terms&conditions",
    },
    // {
    //   title: t("linkItems.links"),
    //   path: "/dr-omar/links",
    // },
    {
      title: t("linkItems.mainCategoriesBooks"),
      path: "/dr-omar/main-categories-book",
    },
    {
      title: t("linkItems.subCategoriesBooks"),
      path: "/dr-omar/sub-categories-book",
    },
    {
      title: t("linkItems.categoriesAudio"),
      path: "/dr-omar/categories-audio",
    },
    {
      title: t("linkItems.categoriesImage"),
      path: "/dr-omar/categories-image",
    },
    {
      title: t("linkItems.categoriesArticle"),
      path: "/dr-omar/categories-article",
    },
    {
      title: t("linkItems.elder"),
      path: "/dr-omar/elder",
      icon: <SiGooglescholar />,
    },
    {
      title: t("linkItems.books"),
      path: "/dr-omar/books",
      icon: <GiBookshelf />,
    },
    {
      title: t("linkItems.audios"),
      path: "/dr-omar/audios",
      icon: <GiSoundWaves />,
    },
    {
      title: t("linkItems.images"),
      path: "/dr-omar/images",
      icon: <SlPicture />,
    },
    {
      title: t("linkItems.articles"),
      path: "/dr-omar/articles",
      icon: <MdArticle />,
    },
    // {
    //   title: t("linkItems.mostListening"),
    //   path: "/dr-omar/most-listening",
    //   icon: <FaAssistiveListeningSystems />,
    // },
  ];
  const [menu, setMenu] = useState(false);
  const location = useLocation();
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
      <div className="dashboard">
        <Header menu={menu} toggleMenu={toggleMenu} linkItems={linkItems} />
        <Outlet />
      </div>
      <Sidebar menu={menu} linkItems={linkItems} logo={logo} />
    </div>
  );
};

export default Home;
