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

const linkItems = [
  {
    icon: <IoMdHome />,
    title: "الصفحة الرئيسية",
    path: "/dr-omar/dashboard",
  },
  {
    title: "الملف الشخصي",
    path: "/dr-omar/profile",
    icon: <IoPerson />,
  },
  {
    title: "المسؤولين الفرعيين",
    path: "/dr-omar/sub-admins",
    icon: <IoPeople />,
  },
  {
    title: "الرسائل",
    path: "/dr-omar/messages",
    icon: <MdOutlineMarkunread />,
  },
  {
    title: "العلماء",
    path: "/dr-omar/elder",
    icon: <SiGooglescholar />,
  },
  {
    title: "تصنيفات الكتب الرئيسية",
    path: "/dr-omar/main-categories-book",
    icon: <BiCategory />,
  },
  {
    title: "تصنيفات الكتب الفرعية",
    path: "/dr-omar/sub-categories-book",
    icon: <BiCategory />,
  },
  {
    title: "الكتب",
    path: "/dr-omar/books",
    icon: <GiBookshelf />,
  },
  {
    title: "تصنيفات الصوتيات",
    path: "/dr-omar/categories-audio",
    icon: <BiCategory />,
  },
  {
    title: "الصوتيات",
    path: "/dr-omar/audios",
    icon: <GiSoundWaves />,
  },
  {
    title: "تصنيفات الصور",
    path: "/dr-omar/categories-image",
    icon: <BiCategory />,
  },
  {
    title: "الصور",
    path: "/dr-omar/images",
    icon: <SlPicture />,
  },
  {
    title: "تصنيفات المقالات",
    path: "/dr-omar/categories-article",
    icon: <BiCategory />,
  },
  {
    title: "المقالات",
    path: "/dr-omar/articles",
    icon: <IoIosDocument />,
  },
  {
    title: "الاكثر استماع",
    path: "/dr-omar/most-listening",
    icon: <FaAssistiveListeningSystems />,
  },
];

const Home = () => {
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
