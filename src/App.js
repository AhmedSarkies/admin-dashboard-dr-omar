import { Navigate, Route, Routes } from "react-router-dom";
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
  Articles,
  Audios,
  Books,
  Images,
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
          <Route path="elder" element={<Elder />} />
          <Route path="categories-article" element={<CategoriesArticle />} />
          <Route path="categories-image" element={<CategoriesImage />} />
          <Route path="categories-audio" element={<CategoriesAudio />} />
          <Route path="categories-book" element={<CategoriesBook />} />
          <Route path="articles" element={<Articles />} />
          <Route path="audios" element={<Audios />} />
          <Route path="books" element={<Books />} />
          <Route path="images" element={<Images />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;
