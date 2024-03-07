import React from "react";
import { Link } from "react-router-dom";

const Sidebar = ({ menu, linkItems, image }) => {
  return (
    <div className={`sidebar${menu ? " active" : ""}`}>
      <div className="sidebar-header d-flex justify-content-center align-items-center pt-4 pb-4">
        <img src={image} alt="logo" />
      </div>
      <div className="sidebar-body">
        <ul className="sidebar-list">
          {linkItems.map((item, index) => (
            <li className="sidebar-item" key={index}>
              <Link to={item.path} className="sidebar-link">
                {item.icon}
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
