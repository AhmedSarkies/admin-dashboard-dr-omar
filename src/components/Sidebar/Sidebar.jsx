import React from "react";
import { NavLink } from "react-router-dom";

const Sidebar = ({ menu, linkItems, logo }) => {
  return (
    <div className={`sidebar${menu ? " active" : ""}`}>
      <div className="sidebar-header d-flex justify-content-center align-items-center pt-4 pb-4">
        <img src={logo} alt="logo" width={150} />
      </div>
      <div className="sidebar-body">
        <ul className="sidebar-list">
          {linkItems.map((item, index) => (
            <li className="sidebar-item" key={index}>
              <NavLink
                className={({ isActive }) =>
                  isActive ? "sidebar-link active" : "sidebar-link"
                }
                to={item.path}
              >
                {item.icon}
                {item.title}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
