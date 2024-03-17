import { Navigate, Route, Routes } from "react-router-dom";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpApi from "i18next-http-backend";
import {
  Login,
  Dashboard,
  ForgetPassword,
  Elder,
  Home,
  LoginLayout,
  CategoriesArticle,
  CategoriesImage,
  CategoriesAudio,
  CategoriesBook,
  SubCategoriesBook,
  Articles,
  Audios,
  Books,
  Images,
  Profile,
  Messages,
  SubAdmins,
  MostListening,
} from "./components";

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(HttpApi)
  .init({
    fallbackLng: "en",
    detection: {
      order: [
        "cookie",
        "htmlTag",
        "path",
        "localStorage",
        "sessionStorage",
        "navigator",
        "subdomain",
      ],
      caches: ["cookie"],
    },
    backend: {
      loadPath: "/locale/{{lng}}/translation.json",
    },
  });

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
          <Route path="elder" element={<Elder />} />
          <Route path="categories-article" element={<CategoriesArticle />} />
          <Route path="categories-image" element={<CategoriesImage />} />
          <Route path="categories-audio" element={<CategoriesAudio />} />
          <Route path="main-categories-book" element={<CategoriesBook />} />
          <Route path="sub-categories-book" element={<SubCategoriesBook />} />
          <Route path="articles" element={<Articles />} />
          <Route path="audios" element={<Audios />} />
          <Route path="books" element={<Books />} />
          <Route path="images" element={<Images />} />
          <Route path="profile" element={<Profile />} />
          <Route path="sub-admins" element={<SubAdmins />} />
          <Route path="messages" element={<Messages />} />
          <Route path="most-listening" element={<MostListening />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
