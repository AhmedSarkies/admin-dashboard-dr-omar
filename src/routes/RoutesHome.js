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
  NotAllowed,
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
        {role === "admin" || (getAdminCookies === "1" && true) ? (
          <Route path="sub-admins" element={<SubAdmins />} />
        ) : (
          <Route
            path="sub-admins"
            element={<Navigate to="/dr-omar/not-allowed" />}
          />
        )}
        {role === "admin" || (getUserCookies === "1" && true) ? (
          <>
            <Route path="users" element={<Users />} />
            <Route path="users/:id" element={<User />} />
            {role === "admin" || (getNotificationCookies === "1" && true) ? (
              <Route path="notifications" element={<Notifications />} />
            ) : (
              <Route
                path="notifications"
                element={<Navigate to="/dr-omar/not-allowed" />}
              />
            )}
            {role === "admin" || (getSpecialContentCookies === "1" && true) ? (
              <Route path="code-content" element={<CodeContent />} />
            ) : (
              <Route
                path="code-content"
                element={<Navigate to="/dr-omar/not-allowed" />}
              />
            )}
          </>
        ) : (
          <Route path="users" element={<Navigate to="/dr-omar/not-allowed" />} />
        )}
        {role === "admin" || (getMessageCookies === "1" && true) ? (
          <Route path="messages" element={<Messages />} />
        ) : (
          <Route
            path="messages"
            element={<Navigate to="/dr-omar/not-allowed" />}
          />
        )}
        {role === "admin" || (getSettingsCookies === "1" && true) ? (
          <Route path="settings" element={<Settings />} />
        ) : (
          <Route
            path="settings"
            element={<Navigate to="/dr-omar/not-allowed" />}
          />
        )}
        {role === "admin" ||
        (getIntroductionPageBookCookies === "1" && true) ? (
          <Route path="introduction-page" element={<IntroductionPage />} />
        ) : (
          <Route
            path="introduction-page"
            element={<Navigate to="/dr-omar/not-allowed" />}
          />
        )}
        {role === "admin" || (getTermsConditionsCookies === "1" && true) ? (
          <Route path="terms&conditions" element={<TermsAndConditions />} />
        ) : (
          <Route
            path="terms&conditions"
            element={<Navigate to="/dr-omar/not-allowed" />}
          />
        )}
        {role === "admin" || (getArticlesCategoriesCookies === "1" && true) ? (
          <Route path="categories-article" element={<CategoriesArticle />} />
        ) : (
          <Route
            path="categories-article"
            element={<Navigate to="/dr-omar/not-allowed" />}
          />
        )}
        {role === "admin" || (getImageCategoriesCookies === "1" && true) ? (
          <Route path="categories-image" element={<CategoriesImage />} />
        ) : (
          <Route
            path="categories-image"
            element={<Navigate to="/dr-omar/not-allowed" />}
          />
        )}
        {role === "admin" || (getAudiosCategoriesCookies === "1" && true) ? (
          <Route path="categories-audio" element={<CategoriesAudio />} />
        ) : (
          <Route
            path="categories-audio"
            element={<Navigate to="/dr-omar/not-allowed" />}
          />
        )}
        {role === "admin" || (getMainCategoriesBookCookies === "1" && true) ? (
          <Route path="main-categories-book" element={<CategoriesBook />} />
        ) : (
          <Route
            path="main-categories-book"
            element={<Navigate to="/dr-omar/not-allowed" />}
          />
        )}
        {role === "admin" || (getSubBooksCategoriesCookies === "1" && true) ? (
          <Route
            path="sub-main-categories-book"
            element={<SubCategoriesBook />}
          />
        ) : (
          <Route
            path="sub-main-categories-book"
            element={<Navigate to="/dr-omar/not-allowed" />}
          />
        )}
        {role === "admin" || (getBooksCategoriesCookies === "1" && true) ? (
          <Route
            path="sub-sub-categories-book"
            element={<SubSubCategoriesBook />}
          />
        ) : (
          <Route
            path="sub-sub-categories-book"
            element={<Navigate to="/dr-omar/not-allowed" />}
          />
        )}
        {role === "admin" || (getElderCookies === "1" && true) ? (
          <>
            <Route path="elders" element={<Elders />} />
            <Route path="elders/:id" element={<Elder />} />
          </>
        ) : (
          <Route path="elders" element={<Navigate to="/dr-omar/not-allowed" />} />
        )}
        {role === "admin" || (getArticlesCookies === "1" && true) ? (
          <Route path="articles" element={<Articles />} />
        ) : (
          <Route
            path="articles"
            element={<Navigate to="/dr-omar/not-allowed" />}
          />
        )}
        {role === "admin" || (getAudioCookies === "1" && true) ? (
          <Route path="audios" element={<Audios />} />
        ) : (
          <Route path="audios" element={<Navigate to="/dr-omar/not-allowed" />} />
        )}
        {role === "admin" || (getBookCookies === "1" && true) ? (
          <Route path="books" element={<Books />} />
        ) : (
          <Route path="books" element={<Navigate to="/dr-omar/not-allowed" />} />
        )}
        {role === "admin" || (getImageCookies === "1" && true) ? (
          <Route path="images" element={<Images />} />
        ) : (
          <Route path="images" element={<Navigate to="/dr-omar/not-allowed" />} />
        )}
        <Route path="not-allowed" element={<NotAllowed />} />
        {/* <Route path="most-listening" element={<MostListening />} /> */}
      </Route>
    </Routes>
  );
};

export default RoutesHome;
