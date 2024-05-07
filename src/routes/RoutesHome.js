import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import {
  Home,
  Dashboard,
  SubAdmins,
  Users,
  Messages,
  Settings,
  IntroductionPage,
  TermsAndConditions,
  CategoriesArticle,
  CategoriesImage,
  CategoriesAudio,
  CategoriesBook,
  SubCategoriesBook,
  Elders,
  Articles,
  Audios,
  Books,
  Images,
  CodeContent,
  Profile,
  ChangePassword,
  EditProfile,
  Notifications,
  User,
  Elder,
  SubSubCategoriesBook,
} from "../components";
import Cookies from "js-cookie";

const RoutesHome = () => {
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

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dr-omar" />} />
      <Route path="/*" element={<Navigate to="/dr-omar" />} />
      <Route path="*" element={<Navigate to="/dr-omar" />} />
      <Route path="/dr-omar" element={<Home />}>
        <Route path="" element={<Navigate to="/dr-omar/dashboard" />} />
        <Route path="login" element={<Navigate to="/dr-omar/dashboard" />} />
        <Route path="*" element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="profile" element={<Profile />} />
        <Route path="profile/change-password" element={<ChangePassword />} />
        <Route path="profile/edit-profile" element={<EditProfile />} />
        {(role === "admin" || (getAdminCookies === "1" && true)) && (
          <Route path="sub-admins" element={<SubAdmins />} />
        )}
        {(role === "admin" || (getUserCookies === "1" && true)) && (
          <>
            <Route path="users" element={<Users />} />
            <Route path="users/:id" element={<User />} />
            {(role === "admin" || (getNotificationCookies === "1" && true)) && (
              <Route path="notifications" element={<Notifications />} />
            )}
            {(role === "admin" ||
              (getSpecialContentCookies === "1" && true)) && (
              <Route path="code-content" element={<CodeContent />} />
            )}
          </>
        )}
        {(role === "admin" || (getMessageCookies === "1" && true)) && (
          <Route path="messages" element={<Messages />} />
        )}
        {(role === "admin" || (getSettingsCookies === "1" && true)) && (
          <Route path="settings" element={<Settings />} />
        )}
        {(role === "admin" ||
          (getIntroductionPageBookCookies === "1" && true)) && (
          <Route path="introduction-page" element={<IntroductionPage />} />
        )}
        {(role === "admin" || (getTermsConditionsCookies === "1" && true)) && (
          <Route path="terms&conditions" element={<TermsAndConditions />} />
        )}
        {(role === "admin" ||
          (getArticlesCategoriesCookies === "1" && true)) && (
          <Route path="categories-article" element={<CategoriesArticle />} />
        )}
        {(role === "admin" || (getImageCategoriesCookies === "1" && true)) && (
          <Route path="categories-image" element={<CategoriesImage />} />
        )}
        {(role === "admin" || (getAudiosCategoriesCookies === "1" && true)) && (
          <Route path="categories-audio" element={<CategoriesAudio />} />
        )}
        {(role === "admin" ||
          (getMainCategoriesBookCookies === "1" && true)) && (
          <Route path="main-categories-book" element={<CategoriesBook />} />
        )}
        {(role === "admin" ||
          (getSubBooksCategoriesCookies === "1" && true)) && (
          <Route
            path="sub-main-categories-book"
            element={<SubCategoriesBook />}
          />
        )}
        {(role === "admin" || (getBooksCategoriesCookies === "1" && true)) && (
          <Route
            path="sub-sub-categories-book"
            element={<SubSubCategoriesBook />}
          />
        )}
        {(role === "admin" || (getElderCookies === "1" && true)) && (
          <>
            <Route path="elders" element={<Elders />} />
            <Route path="elders/:id" element={<Elder />} />
          </>
        )}
        {(role === "admin" || (getArticlesCookies === "1" && true)) && (
          <Route path="articles" element={<Articles />} />
        )}
        {(role === "admin" || (getAudioCookies === "1" && true)) && (
          <Route path="audios" element={<Audios />} />
        )}
        {(role === "admin" || (getBookCookies === "1" && true)) && (
          <Route path="books" element={<Books />} />
        )}
        {(role === "admin" || (getImageCookies === "1" && true)) && (
          <Route path="images" element={<Images />} />
        )}
        {/* <Route path="most-listening" element={<MostListening />} /> */}
      </Route>
    </Routes>
  );
};

export default RoutesHome;
