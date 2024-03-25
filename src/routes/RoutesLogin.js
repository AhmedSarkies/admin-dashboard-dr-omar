import React from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { LoginLayout, Login } from "../components";

const RoutesLogin = () => (
  <Routes>
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
    </Route>
  </Routes>
);

export default RoutesLogin;
