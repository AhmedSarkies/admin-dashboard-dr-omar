import React, { useEffect } from "react";
import Cookies from "js-cookie";
import { ProtectRoutes } from "./routes";
/* eslint-disable no-unused-vars */
import locale from "./utils/locale";

const App = () => {
  const lng = Cookies.get("i18next") || "ar";
  const auth = Cookies.get("_auth");

  useEffect(() => {
    document.documentElement.lang = lng;
  }, [lng]);

  return (
    <div className="App">
      <ProtectRoutes auth={auth} />
    </div>
  );
};

export default App;
