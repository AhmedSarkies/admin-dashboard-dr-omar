import React from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  AccordionBody,
  AccordionHeader,
  AccordionItem,
  UncontrolledAccordion,
} from "reactstrap";
import { IoMdSettings } from "react-icons/io";
import { BiCategory } from "react-icons/bi";

const Sidebar = ({ menu, linkItems, logo }) => {
  const { t } = useTranslation();

  return (
    <div className={`sidebar${menu ? " active" : ""}`}>
      <div className="sidebar-header d-flex justify-content-center align-items-center pt-4 pb-4">
        <img src={logo} alt="logo" width={150} />
      </div>
      <div className="sidebar-body">
        <ul className="sidebar-list">
          {linkItems.slice(0, 4).map((item, index) => (
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
          <div className="sidebar-item dropdown">
            <UncontrolledAccordion stayOpen>
              <AccordionItem>
                <AccordionHeader targetId="1">
                  <span className="icon d-flex justify-content-between align-items-center gap-2">
                    <IoMdSettings size={28} />
                    <span className="title">{t("linkItems.settings")}</span>
                  </span>
                </AccordionHeader>
                <AccordionBody accordionId="1">
                  {linkItems.slice(4, 10).map((item, index) => (
                    <li key={index} className="ps-0 pe-0 mb-3">
                      <NavLink
                        className={({ isActive }) =>
                          isActive ? "sidebar-link active" : "sidebar-link"
                        }
                        to={item.path}
                      >
                        <span className="title">{item.title}</span>
                      </NavLink>
                    </li>
                  ))}
                </AccordionBody>
              </AccordionItem>
            </UncontrolledAccordion>
          </div>
          <div className="sidebar-item dropdown">
            <UncontrolledAccordion stayOpen>
              <AccordionItem>
                <AccordionHeader targetId="1">
                  <span className="icon d-flex justify-content-between align-items-center gap-2">
                    <BiCategory size={28} />
                    <span className="title">{t("linkItems.categories")}</span>
                  </span>
                </AccordionHeader>
                <AccordionBody accordionId="1">
                  {linkItems.slice(10, 15).map((item, index) => (
                    <li key={index} className="ps-0 pe-0 mb-3">
                      <NavLink
                        className={({ isActive }) =>
                          isActive ? "sidebar-link active" : "sidebar-link"
                        }
                        to={item.path}
                      >
                        <span className="title">{item.title}</span>
                      </NavLink>
                    </li>
                  ))}
                </AccordionBody>
              </AccordionItem>
            </UncontrolledAccordion>
          </div>
          {linkItems.slice(15).map((item, index) => (
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
