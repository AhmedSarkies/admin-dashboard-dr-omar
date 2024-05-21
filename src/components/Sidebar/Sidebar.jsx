import React, { useEffect } from "react";
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
import Cookies from "js-cookie";

const Sidebar = ({ menu, linkItems, logo }) => {
  const { t } = useTranslation();
  const role = Cookies.get("_role");
  const getTermsConditionsCookies = Cookies.get("GetTermsConditions");
  const getSpecialContentCookies = Cookies.get("GetSpecialContent");
  const getSettingsCookies = Cookies.get("GetSettings");
  const getIntroductionPageBookCookies = Cookies.get("GetIntroductionPage");
  const getSubBooksCategoriesCookies = Cookies.get("GetSubBooksCategories");
  const getMainCategoriesBookCookies = Cookies.get("GetMainCategoriesBook");
  const getImageCategoriesCookies = Cookies.get("GetImageCategories");
  const getBooksCategoriesCookies = Cookies.get("GetBooksCategories");
  const getAudiosCategoriesCookies = Cookies.get("GetAudiosCategories");
  const getArticlesCategoriesCookies = Cookies.get("GetArticlesCategories");

  useEffect(() => {
    if (role === "admin") {
      linkItems.map((item) => {
        item.display = true;
        return item;
      });
    }
  }, [role, linkItems]);

  console.log(linkItems);

  return (
    <div className={`sidebar${menu ? " active" : ""}`}>
      <div className="sidebar-header d-flex justify-content-center align-items-center pt-4 pb-4">
        <img
          src={logo}
          alt="logo"
          width={150}
          height={150}
          style={{
            borderRadius: "50%",
          }}
        />
      </div>
      <div className="sidebar-body">
        <ul className="sidebar-list">
          {linkItems.slice(0, 4).map((item, index) => (
            <li
              className="sidebar-item"
              key={index}
              style={{
                display:
                  role === "admin"
                    ? "block"
                    : item.display === true
                    ? "block"
                    : "none",
              }}
            >
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
          {(role === "admin" ||
            (getSettingsCookies === "1" &&
              getTermsConditionsCookies === "1" &&
              getSpecialContentCookies === "1" &&
              getIntroductionPageBookCookies === "1")) && (
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
                    {linkItems.slice(4, 8).map((item, index) => (
                      <li
                        key={index}
                        className="ps-0 pe-0 mb-3"
                        style={{
                          display:
                            role === "admin"
                              ? "block"
                              : item.display === true
                              ? "block"
                              : "none",
                        }}
                      >
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
          )}
          {(role === "admin" ||
            (getMainCategoriesBookCookies === "1" &&
              getSubBooksCategoriesCookies === "1" &&
              getBooksCategoriesCookies === "1" &&
              getImageCategoriesCookies === "1" &&
              getAudiosCategoriesCookies === "1" &&
              getArticlesCategoriesCookies === "1")) && (
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
                    {linkItems.slice(8, 14).map((item, index) => (
                      <li
                        key={index}
                        className="ps-0 pe-0 mb-3"
                        style={{
                          display:
                            role === "admin"
                              ? "block"
                              : item.display === true
                              ? "block"
                              : "none",
                        }}
                      >
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
          )}
          {linkItems.slice(14).map((item, index) => (
            <li
              className="sidebar-item"
              key={index}
              style={{
                display:
                  role === "admin"
                    ? "block"
                    : item.display === true
                    ? "block"
                    : "none",
              }}
            >
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
