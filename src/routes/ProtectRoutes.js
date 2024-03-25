import React from "react";
import { RoutesHome, RoutesLogin } from "./";

const ProtectRoutes = ({ auth }) => (auth ? <RoutesHome /> : <RoutesLogin />);

export default ProtectRoutes;
