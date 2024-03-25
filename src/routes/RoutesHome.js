import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import {
  Home,
  Dashboard,
  SubAdmins,
  Users,
  Messages,
  Settings,
  Slider,
  TermsAndConditions,
  CategoriesArticle,
  CategoriesImage,
  CategoriesAudio,
  CategoriesBook,
  SubCategoriesBook,
  Elder,
  Articles,
  Audios,
  Books,
  Images,
  CodeContent,
} from "../components";

const RoutesHome = () => (
  <Routes>
    <Route path="/dr-omar" element={<Home />}>
      <Route path="" element={<Navigate to="/dr-omar/dashboard" />} />
      <Route path="login" element={<Navigate to="/dr-omar/dashboard" />} />
      <Route path="*" element={<Dashboard />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="sub-admins" element={<SubAdmins />} />
      <Route path="users" element={<Users />} />
      <Route path="messages" element={<Messages />} />
      <Route path="settings" element={<Settings />} />
      <Route path="code-content" element={<CodeContent />} />
      <Route path="slider" element={<Slider />} />
      <Route path="terms&conditions" element={<TermsAndConditions />} />
      <Route path="categories-article" element={<CategoriesArticle />} />
      <Route path="categories-image" element={<CategoriesImage />} />
      <Route path="categories-audio" element={<CategoriesAudio />} />
      <Route path="main-categories-book" element={<CategoriesBook />} />
      <Route path="sub-categories-book" element={<SubCategoriesBook />} />
      <Route path="elder" element={<Elder />} />
      <Route path="articles" element={<Articles />} />
      <Route path="audios" element={<Audios />} />
      <Route path="books" element={<Books />} />
      <Route path="images" element={<Images />} />
    </Route>
  </Routes>
);

export default RoutesHome;
