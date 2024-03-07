import React, { useEffect, useState } from "react";

import { IoMdHome } from "react-icons/io";
import { SiGooglescholar } from "react-icons/si";
import { BiCategory } from "react-icons/bi";
import { GiBookshelf, GiSoundWaves } from "react-icons/gi";
import { SlPicture } from "react-icons/sl";
import { IoPerson, IoPeople } from "react-icons/io5";
import { FaAssistiveListeningSystems, FaSignInAlt } from "react-icons/fa";
import { GoRocket } from "react-icons/go";
import { IoIosDocument } from "react-icons/io";

import { Header, Sidebar } from "../";

import image from "../../assets/images/anonymous.png";

import { Outlet } from "react-router-dom";

const linkItems = [
  {
    icon: <IoMdHome />,
    title: "الصفحة الرئيسية",
    path: "/dr-omar/dashboard",
  },
  { title: "العلماء", path: "/dr-omar/elder", icon: <SiGooglescholar /> },
  {
    title: "تصنيفات الكتب",
    path: "/dr-omar/categories-book",
    icon: <BiCategory />,
  },
  { title: "الكتب", path: "/dr-omar/books", icon: <GiBookshelf /> },
  {
    title: "تصنيفات الصوتيات",
    path: "/dr-omar/categories-audio",
    icon: <BiCategory />,
  },
  { title: "الصوتيات", path: "/dr-omar/audios", icon: <GiSoundWaves /> },
  {
    title: "تصنيفات الصور",
    path: "/dr-omar/categories-image",
    icon: <BiCategory />,
  },
  { title: "الصور", path: "/dr-omar/images", icon: <SlPicture /> },
  {
    title: "تصنيفات المقالات",
    path: "/dr-omar/categories-article",
    icon: <BiCategory />,
  },
  { title: "المقالات", path: "/dr-omar/articles", icon: <IoIosDocument /> },
  {
    title: "الاكثر استماع",
    path: "/dr-omar/most-listening",
    icon: <FaAssistiveListeningSystems />,
  },
  {
    title: "المسؤولين الفرعيين",
    path: "/dr-omar/sub-admins",
    icon: <IoPeople />,
  },
  { title: "صفحات الحسابات" },
  { title: "الملف الشخصي", path: "/dr-omar/profile", icon: <IoPerson /> },
  { title: "تسجيل الدخول", path: "/dr-omar/sign-in", icon: <FaSignInAlt /> },
  { title: "تسجيل حساب جديد", path: "/dr-omar/register", icon: <GoRocket /> },
];

const Home = () => {
  const [menu, setMenu] = useState(false);
  const toggleMenu = () => {
    setMenu(!menu);
  };
  const closeMenu = (e) => {
    if (e.key === "Escape" || e.target.classList.contains("overlay")) {
      setMenu(false);
    }
  };
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
        <Header menu={menu} toggleMenu={toggleMenu} />
        <Outlet />
      </div>
      <Sidebar menu={menu} linkItems={linkItems} image={image} />
    </div>
  );
};

export default Home;
