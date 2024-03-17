import React, { useEffect, useState } from "react";

import { IoMdHome } from "react-icons/io";
import { SiGooglescholar } from "react-icons/si";
import { BiCategory } from "react-icons/bi";
import { GiBookshelf, GiSoundWaves } from "react-icons/gi";
import { SlPicture } from "react-icons/sl";
import { IoPerson, IoPeople } from "react-icons/io5";
import { FaAssistiveListeningSystems } from "react-icons/fa";
import { IoIosDocument } from "react-icons/io";

import { Header, Sidebar } from "../";

import logo from "../../assets/images/logo.jpg";

import { Outlet, useLocation } from "react-router-dom";
import { MdOutlineMarkunread } from "react-icons/md";
import { useTranslation } from "react-i18next";

const Home = () => {
  const { t } = useTranslation();
  const linkItems = [
    {
      icon: <IoMdHome />,
      title: t("linkItems.home"),
      path: "/dr-omar/dashboard",
    },
    {
      title: t("linkItems.profile"),
      path: "/dr-omar/profile",
      icon: <IoPerson />,
    },
    {
      title: t("linkItems.subAdmins"),
      path: "/dr-omar/sub-admins",
      icon: <IoPeople />,
    },
    {
      title: t("linkItems.messages"),
      path: "/dr-omar/messages",
      icon: <MdOutlineMarkunread />,
    },
    {
      title: t("linkItems.elder"),
      path: "/dr-omar/elder",
      icon: <SiGooglescholar />,
    },
    {
      title: t("linkItems.mainCategoriesBooks"),
      path: "/dr-omar/main-categories-book",
      icon: <BiCategory />,
    },
    {
      title: t("linkItems.subCategoriesBooks"),
      path: "/dr-omar/sub-categories-book",
      icon: <BiCategory />,
    },
    {
      title: t("linkItems.books"),
      path: "/dr-omar/books",
      icon: <GiBookshelf />,
    },
    {
      title: t("linkItems.categoriesAudio"),
      path: "/dr-omar/categories-audio",
      icon: <BiCategory />,
    },
    {
      title: t("linkItems.audios"),
      path: "/dr-omar/audios",
      icon: <GiSoundWaves />,
    },
    {
      title: t("linkItems.categoriesImage"),
      path: "/dr-omar/categories-image",
      icon: <BiCategory />,
    },
    {
      title: t("linkItems.images"),
      path: "/dr-omar/images",
      icon: <SlPicture />,
    },
    {
      title: t("linkItems.categoriesArticle"),
      path: "/dr-omar/categories-article",
      icon: <BiCategory />,
    },
    {
      title: t("linkItems.articles"),
      path: "/dr-omar/articles",
      icon: <IoIosDocument />,
    },
    {
      title: t("linkItems.mostListening"),
      path: "/dr-omar/most-listening",
      icon: <FaAssistiveListeningSystems />,
    },
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
