/* eslint-disable no-unused-vars */
import { Navigate, Route, Routes } from "react-router-dom";
import locale from "./utils/locale";
import {
  LoginLayout,
  Login,
  ForgetPassword,
  Home,
  Dashboard,
  // Profile,
  SubAdmins,
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
  MostListening,
  CodeContent,
  PrayerTime,
  Links,
} from "./components";

const App = () => {
  return (
    <div className="App">
      <Routes>
        {/* <Route
          path="/"
          element={<Navigate to="/dr-omar/login" replace={true} />}
        /> */}
        <Route path="/" element={<LoginLayout />}>
          <Route
            path=""
            element={<Navigate to="/dr-omar/login" replace={true} />}
          />
          <Route
            path="*"
            element={<Navigate to="/dr-omar/login" replace={true} />}
          />
          <Route
            path="dr-omar"
            element={<Navigate to="/dr-omar/login" replace={true} />}
          />
          <Route path="dr-omar/login" element={<Login />} />
          <Route path="dr-omar/forget-password" element={<ForgetPassword />} />
        </Route>
        <Route path="/dr-omar" element={<Home />}>
          <Route path="*" element={<Dashboard />} />
          <Route path="dashboard" element={<Dashboard />} />
          {/* <Route path="profile" element={<Profile />} /> */}
          <Route path="sub-admins" element={<SubAdmins />} />
          <Route path="messages" element={<Messages />} />
          <Route path="settings" element={<Settings />} />
          <Route path="prayer-time" element={<PrayerTime />} />
          <Route path="code-content" element={<CodeContent />} />
          <Route path="slider" element={<Slider />} />
          <Route path="terms&conditions" element={<TermsAndConditions />} />
          <Route path="links" element={<Links />} />
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
          <Route path="most-listening" element={<MostListening />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
