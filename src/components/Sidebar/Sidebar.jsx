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
  const getUserCookies = Cookies.get("GetUser");
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
  const getImageCookies = Cookies.get("GetImage");
  const getElderCookies = Cookies.get("GetElder");
  const getBookCookies = Cookies.get("GetBook");
  const getAudioCookies = Cookies.get("GetAudio");
  const getArticlesCookies = Cookies.get("GetArticles");
  const getAdminCookies = Cookies.get("GetAdmin");
  const getMessageCookies = Cookies.get("GetMessage");
  const getNotificationCookies = Cookies.get("GetNotification");

  useEffect(() => {
    if (role === "admin") {
      linkItems.map((item) => {
        item.display = true;
        return item;
      });
    }
    if (getAdminCookies === "1") {
      linkItems[2].display = true;
    }
    if (getUserCookies === "1") {
      linkItems[3].display = true;
    }
    if (getSettingsCookies === "1") {
      linkItems[4].display = true;
    }
    if (getSpecialContentCookies === "1") {
      linkItems[5].display = true;
    }
    if (getIntroductionPageBookCookies === "1") {
      linkItems[6].display = true;
    }
    if (getTermsConditionsCookies === "1") {
      linkItems[7].display = true;
    }
    if (getMainCategoriesBookCookies === "1") {
      linkItems[8].display = true;
    }
    if (getSubBooksCategoriesCookies === "1") {
      linkItems[9].display = true;
    }
    if (getBooksCategoriesCookies === "1") {
      linkItems[10].display = true;
    }
    if (getAudiosCategoriesCookies === "1") {
      linkItems[11].display = true;
    }
    if (getImageCategoriesCookies === "1") {
      linkItems[12].display = true;
    }
    if (getArticlesCategoriesCookies === "1") {
      linkItems[13].display = true;
    }
    if (getElderCookies === "1") {
      linkItems[14].display = true;
    }
    if (getBookCookies === "1") {
      linkItems[15].display = true;
    }
    if (getAudioCookies === "1") {
      linkItems[16].display = true;
    }
    if (getImageCookies === "1") {
      linkItems[17].display = true;
    }
    if (getArticlesCookies === "1") {
      linkItems[18].display = true;
    }
    if (getNotificationCookies === "1") {
      linkItems[19].display = true;
    }
    if (getMessageCookies === "1") {
      linkItems[20].display = true;
    }
  }, [
    role,
    getUserCookies,
    getTermsConditionsCookies,
    getSpecialContentCookies,
    getSettingsCookies,
    getIntroductionPageBookCookies,
    getSubBooksCategoriesCookies,
    getMainCategoriesBookCookies,
    getImageCategoriesCookies,
    getBooksCategoriesCookies,
    getAudiosCategoriesCookies,
    getArticlesCategoriesCookies,
    getImageCookies,
    getElderCookies,
    getBookCookies,
    getAudioCookies,
    getArticlesCookies,
    getAdminCookies,
    getMessageCookies,
    getNotificationCookies,
    linkItems,
  ]);

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
                display: item.display ? "block" : "none",
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
                          display: item.display ? "block" : "none",
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
                          display: item.display ? "block" : "none",
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
                display: item.display ? "block" : "none",
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
