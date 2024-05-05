import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { Modal, ModalBody, ModalHeader, Spinner } from "reactstrap";

import { MdRemoveRedEye, MdSend } from "react-icons/md";
import { IoMdClose } from "react-icons/io";

import { getMessagesApi } from "../../store/slices/messagesSlice";

import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";
import { useFiltration } from "../../hooks";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";

const Messages = () => {
  const { t } = useTranslation();
  const lang = Cookies.get("i18next");
  const role = Cookies.get("_role");
  const getMessagesCookies = Cookies.get("GetMessage");
  const dispatch = useDispatch();
  const { messages, loading, error } = useSelector((state) => state.messages);
  const [toggle, setToggle] = useState({
    add: false,
    readMessage: false,
    searchTerm: "",
    activeColumn: false,
    activeRows: false,
    rowsPerPage: 5,
    currentPage: 1,
    sortColumn: "",
    sortOrder: "asc",
    toggleColumns: {
      id: true,
      first_name: true,
      subject: true,
      email: true,
      phone: true,
      readMessage: true,
    },
    message: {
      first_name: "",
      email: "",
      phone: "",
      subject: "",
    },
  });

  // Filtration, Sorting, Pagination
  // Columns
  const columns = [
    { id: 0, name: "id", label: t("index") },
    { id: 1, name: "first_name", label: t("message.columns.name") },
    { id: 2, name: "phone", label: t("message.columns.phone") },
    { id: 3, name: "email", label: t("message.columns.email") },
    { id: 4, name: "subject", label: t("message.columns.content") },
    { id: 5, name: "readMessage", label: t("message.columns.read") },
  ];
  const {
    PaginationUI,
    handleSort,
    handleSearch,
    handleToggleColumns,
    searchResults,
  } = useFiltration({
    rowData: messages,
    toggle,
    setToggle,
  });

  // get data from api
  useEffect(() => {
    try {
      if (getMessagesCookies === "1" || role === "admin") {
        dispatch(getMessagesApi());
      }
    } catch (error) {
      console.log(error);
    }
  }, [dispatch, getMessagesCookies, role]);

  return (
    <div className="scholar-container mt-4 m-sm-3 m-0">
      <div className="scholar">
        <div className="table-header">
          {/* Search */}
          <div
            className="search-container form-group-container form-input"
            style={{
              width: "30%",
            }}
          >
            <input
              type="text"
              className="form-input"
              placeholder={t("searchMessage")}
              onChange={handleSearch}
            />
          </div>
          {/* Show and Hide Columns */}
          <div className="dropdown columns form-input">
            <button
              type="button"
              onClick={() => {
                setToggle({
                  ...toggle,
                  activeColumn: !toggle.activeColumn,
                });
              }}
              className="dropdown-btn d-flex justify-content-between align-items-center"
            >
              <span>{t("columnsFilter")}</span>
              <TiArrowSortedUp
                className={`dropdown-icon ${
                  toggle.activeColumn ? "active" : ""
                }`}
              />
            </button>
            <div
              className={`dropdown-content ${
                toggle.activeColumn ? "active" : ""
              }`}
              style={{
                width: "180px",
                maxHeight: "160px",
              }}
            >
              {columns.map((column) => (
                <button
                  type="button"
                  key={column.id}
                  className={`item filter`}
                  onClick={() => handleToggleColumns(column.name)}
                >
                  <span className="d-flex justify-content-start align-items-center gap-2">
                    <input
                      type="checkbox"
                      className="checkbox-column"
                      checked={toggle.toggleColumns[column.name]}
                      readOnly
                    />
                    <span>{column.label}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
        <table className="table-body">
          <thead>
            <tr>
              {toggle.toggleColumns?.id && (
                <th className="table-th">{t("index")}</th>
              )}
              {toggle.toggleColumns?.first_name && (
                <th className="table-th" onClick={() => handleSort(columns[1])}>
                  {t("message.columns.name")}
                  {toggle.sortColumn === columns[1].name ? (
                    toggle.sortOrder === "asc" ? (
                      <TiArrowSortedUp />
                    ) : (
                      <TiArrowSortedDown />
                    )
                  ) : null}
                </th>
              )}
              {toggle.toggleColumns?.phone && (
                <th className="table-th" onClick={() => handleSort(columns[2])}>
                  {t("message.columns.phone")}
                  {toggle.sortColumn === columns[2].name ? (
                    toggle.sortOrder === "asc" ? (
                      <TiArrowSortedUp />
                    ) : (
                      <TiArrowSortedDown />
                    )
                  ) : null}
                </th>
              )}
              {toggle.toggleColumns?.email && (
                <th className="table-th" onClick={() => handleSort(columns[3])}>
                  {t("message.columns.email")}
                  {toggle.sortColumn === columns[3].name ? (
                    toggle.sortOrder === "asc" ? (
                      <TiArrowSortedUp />
                    ) : (
                      <TiArrowSortedDown />
                    )
                  ) : null}
                </th>
              )}
              {toggle.toggleColumns?.subject && (
                <th className="table-th" onClick={() => handleSort(columns[4])}>
                  {t("message.columns.content")}
                  {toggle.sortColumn === columns[4].name ? (
                    toggle.sortOrder === "asc" ? (
                      <TiArrowSortedUp />
                    ) : (
                      <TiArrowSortedDown />
                    )
                  ) : null}
                </th>
              )}
              {toggle.toggleColumns?.readMessage && (
                <th className="table-th">{t("message.columns.read")}</th>
              )}
            </tr>
          </thead>
          {/* Error */}
          {error !== null && loading === false && (
            <tbody>
              <tr className="no-data-container">
                <td className="table-td" colSpan="6">
                  <p className="no-data mb-0">
                    {error === "Network Error"
                      ? t("networkError")
                      : error === "Request failed with status code 404"
                      ? t("noData")
                      : error === "Request failed with status code 500"
                      ? t("serverError")
                      : t("someError")}
                  </p>
                </td>
              </tr>
            </tbody>
          )}
          {/* Loading */}
          {loading && (
            <tbody>
              <tr className="no-data-container">
                <td className="table-td" colSpan="6">
                  <div className="no-data mb-0">
                    <Spinner
                      color="primary"
                      style={{
                        height: "3rem",
                        width: "3rem",
                      }}
                    >
                      Loading...
                    </Spinner>
                  </div>
                </td>
              </tr>
            </tbody>
          )}
          {/* No Data */}
          {searchResults?.length === 0 && error === null && !loading && (
            <tbody>
              <tr className="no-data-container">
                <td className="table-td" colSpan="6">
                  <p className="no-data mb-0">{t("noData")}</p>
                </td>
              </tr>
            </tbody>
          )}
          {/* There is no any columns */}
          {Object.values(toggle.toggleColumns).every(
            (column) => column === false
          ) && (
            <tbody>
              <tr className="no-data-container">
                <td className="table-td" colSpan="6">
                  <p className="no-data no-columns mb-0">{t("noColumns")}</p>
                </td>
              </tr>
            </tbody>
          )}
          {/* Data */}
          {searchResults?.length > 0 && error === null && loading === false && (
            <tbody>
              {searchResults?.map((result, idx) => (
                <tr key={result?.id + new Date().getDate()}>
                  {toggle.toggleColumns?.id && (
                    <td className="table-td">{idx + 1}#</td>
                  )}
                  {toggle.toggleColumns?.first_name && (
                    <td className="table-td name">{result?.first_name}</td>
                  )}
                  {toggle.toggleColumns?.phone && (
                    <td className="table-td phone">
                      <a href={`tel${result?.phone}`}>{result?.phone}</a>
                    </td>
                  )}
                  {toggle.toggleColumns?.email && (
                    <td className="table-td email">
                      <a href={`mailto:${result?.email}`}>{result?.email}</a>
                    </td>
                  )}
                  {toggle.toggleColumns?.subject && (
                    <td className="table-td subject">
                      {result?.subject.length > 20
                        ? result?.subject.slice(0, 20) + "..."
                        : result?.subject}
                    </td>
                  )}
                  {toggle.toggleColumns?.readMessage && (
                    <td className="table-td read-more">
                      <span className="table-btn-container">
                        <a
                          href={`mailto:${result?.email}`}
                          className="text-success"
                        >
                          <MdSend className="text-success" />
                        </a>
                        <MdRemoveRedEye
                          onClick={() =>
                            setToggle({
                              ...toggle,
                              readMessage: !toggle.readMessage,
                              message: result,
                            })
                          }
                        />
                      </span>
                    </td>
                  )}
                </tr>
              ))}
              {/* Read Message*/}
              <Modal
                isOpen={toggle.readMessage}
                toggle={() =>
                  setToggle({
                    ...toggle,
                    readMessage: !toggle.readMessage,
                  })
                }
                centered={true}
                keyboard={true}
                size={"md"}
                contentClassName="modal-read-more modal-add-scholar"
              >
                <ModalHeader
                  toggle={() =>
                    setToggle({
                      ...toggle,
                      readMessage: !toggle.readMessage,
                    })
                  }
                  dir="rtl"
                >
                  {toggle.message?.first_name}
                  <IoMdClose
                    onClick={() =>
                      setToggle({
                        ...toggle,
                        readMessage: !toggle.readMessage,
                      })
                    }
                  />
                </ModalHeader>
                <ModalBody>
                  <div className="read-more-container text-center">
                    {/* <h3 className="text-center mb-3">
                      {toggle.message?.first_name}
                    </h3> */}
                    <div
                      className={`content ${
                        lang === "ar" ? "text-end" : "text-start"
                      }`}
                      dir={`${lang === "ar" ? "rtl" : "ltr"}`}
                    >
                      {t("message.columns.phone")}
                      {": "}
                      {toggle.message?.phone}
                    </div>
                    <div
                      className={`content ${
                        lang === "ar" ? "text-end" : "text-start"
                      }`}
                      dir={`${lang === "ar" ? "rtl" : "ltr"}`}
                    >
                      {t("message.columns.email")}
                      {": "}
                      {toggle.message?.email}
                    </div>
                    <div
                      className={`content ${
                        lang === "ar" ? "text-end" : "text-start"
                      }`}
                      dir={`${lang === "ar" ? "rtl" : "ltr"}`}
                    >
                      {t("message.columns.content")}
                      {": "}
                      <br />
                      <p className="text-center">{toggle.message?.subject}</p>
                    </div>
                  </div>
                </ModalBody>
              </Modal>
            </tbody>
          )}
        </table>
      </div>
      {/* Pagination */}
      {searchResults?.length > 0 && error === null && loading === false && (
        <PaginationUI />
      )}
    </div>
  );
};

export default Messages;
