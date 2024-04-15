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
} from "../components";

const RoutesHome = () => (
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
      <Route path="profile/change-password/:id" element={<ChangePassword />} />
      <Route path="profile/edit-profile/:id" element={<EditProfile />} />
      <Route path="sub-admins" element={<SubAdmins />} />
      <Route path="users" element={<Users />} />
      <Route path="users/:id" element={<User />} />
      <Route path="messages" element={<Messages />} />
      <Route path="notifications" element={<Notifications />} />
      <Route path="settings" element={<Settings />} />
      <Route path="code-content" element={<CodeContent />} />
      <Route path="introduction-page" element={<IntroductionPage />} />
      <Route path="terms&conditions" element={<TermsAndConditions />} />
      <Route path="categories-article" element={<CategoriesArticle />} />
      <Route path="categories-image" element={<CategoriesImage />} />
      <Route path="categories-audio" element={<CategoriesAudio />} />
      <Route path="main-categories-book" element={<CategoriesBook />} />
      <Route path="sub-categories-book" element={<SubCategoriesBook />} />
      <Route path="elders" element={<Elders />} />
      <Route path="elders/:id" element={<Elder />} />
      <Route path="articles" element={<Articles />} />
      <Route path="audios" element={<Audios />} />
      <Route path="books" element={<Books />} />
      <Route path="images" element={<Images />} />
      {/* <Route path="most-listening" element={<MostListening />} /> */}
    </Route>
  </Routes>
);

export default RoutesHome;
