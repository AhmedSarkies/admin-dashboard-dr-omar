import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Col, Modal, ModalBody, ModalHeader, Row, Spinner } from "reactstrap";
import { MdRemoveRedEye, MdSend } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";
import { FaLock, FaLockOpen } from "react-icons/fa";
import {
  getMessagesApi,
  toggleMessage,
} from "../../store/slices/messagesSlice";
import { useFiltration } from "../../hooks";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";

const Messages = () => {
  const { t } = useTranslation();
  const role = Cookies.get("_role");
  const getMessagesCookies = Cookies.get("GetMessage");
  const dispatch = useDispatch();
  const { messages, loading, error, loadingToggleMessage } = useSelector(
    (state) => state.messages
  );
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

  // Read Message
  const handleReadMessage = (message) => {
    setToggle({
      ...toggle,
      readMessage: !toggle.readMessage,
      message: message,
    });
    if (message.status === 0) {
      dispatch(toggleMessage(message.id)).then((res) => {
        if (res.error) {
          dispatch(getMessagesApi());
          console.log("error", res.error);
        }
      });
    }
  };

  // Toggle Message
  const handleToggleMessage = (message) => {
    dispatch(toggleMessage(message.id)).then((res) => {
      if (!res.error) {
        dispatch(getMessagesApi());
      } else {
        dispatch(getMessagesApi());
        console.log("error", res.error);
      }
    });
  };

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
                <tr
                  key={result?.id + new Date().getDate()}
                  className={`table-tr${
                    result?.status === 0 ? " not-read" : ""
                  }`}
                >
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
                          onClick={() => handleReadMessage(result)}
                        />
                        {result?.status === 1 ? (
                          <FaLockOpen
                            style={{
                              cursor: loadingToggleMessage
                                ? "not-allowed"
                                : "pointer",
                              pointerEvents: loadingToggleMessage
                                ? "none"
                                : "auto",
                            }}
                            onClick={() => handleToggleMessage(result)}
                          />
                        ) : (
                          <FaLock
                            style={{
                              cursor: loadingToggleMessage
                                ? "not-allowed"
                                : "pointer",
                              pointerEvents: loadingToggleMessage
                                ? "none"
                                : "auto",
                            }}
                            onClick={() => handleToggleMessage(result)}
                          />
                        )}
                      </span>
                    </td>
                  )}
                </tr>
              ))}
              {/* Read Message*/}
              <Modal
                isOpen={toggle.readMessage}
                toggle={() => {
                  setToggle({
                    ...toggle,
                    readMessage: !toggle.readMessage,
                  });
                  if (toggle.message?.status === 0) {
                    dispatch(getMessagesApi());
                  }
                }}
                centered={true}
                keyboard={true}
                size={"md"}
                contentClassName="modal-read-more modal-add-scholar"
              >
                <ModalHeader
                  toggle={() => {
                    setToggle({
                      ...toggle,
                      readMessage: !toggle.readMessage,
                    });
                    if (toggle.message?.status === 0) {
                      dispatch(getMessagesApi());
                    }
                  }}
                  dir="rtl"
                >
                  {toggle.message?.first_name}
                  <IoMdClose
                    onClick={() => {
                      setToggle({
                        ...toggle,
                        readMessage: !toggle.readMessage,
                      });
                      if (toggle.message?.status === 0) {
                        dispatch(getMessagesApi());
                      }
                    }}
                  />
                </ModalHeader>
                <ModalBody>
                  <Row className="d-flex flex-row-reverse justify-content-center align-items-center p-3 pb-0 pt-0">
                    <Col lg={12}>
                      <div className="form-group-container d-flex flex-column align-items-end mb-3">
                        <label htmlFor="name" className="form-label">
                          {t("message.columns.name")}
                        </label>
                        <input
                          type="text"
                          className="form-input w-100"
                          id="name"
                          placeholder={t("message.columns.name")}
                          name="name"
                          value={toggle.message?.first_name}
                          disabled
                        />
                      </div>
                      <div className="form-group-container d-flex flex-column align-items-end mb-3">
                        <label htmlFor="email" className="form-label">
                          {t("message.columns.email")}
                        </label>
                        <input
                          type="text"
                          className="form-input w-100"
                          id="email"
                          placeholder={t("notifications.columns.email")}
                          name="email"
                          value={toggle.message?.email}
                          disabled
                        />
                      </div>
                      <div className="form-group-container d-flex flex-column align-items-end mb-3">
                        <label htmlFor="phone" className="form-label">
                          {t("message.columns.phone")}
                        </label>
                        <input
                          type="text"
                          className="form-input w-100"
                          id="phone"
                          placeholder={t("message.columns.phone")}
                          name="phone"
                          value={toggle.message?.phone}
                          disabled
                        />
                      </div>
                    </Col>
                    <Col lg={12}>
                      <div className="form-group-container d-flex flex-column align-items-end">
                        <label htmlFor="content" className="form-label">
                          {t("message.columns.content")}
                        </label>
                        <textarea
                          className="form-input"
                          id="content"
                          placeholder={t("message.columns.content")}
                          name="content"
                          value={toggle.message?.subject}
                          disabled
                        ></textarea>
                      </div>
                    </Col>
                  </Row>
                  <Row className="d-flex flex-row-reverse justify-content-center align-items-center p-3 pt-0">
                    <Col lg={12}>
                      <div className="form-group-container d-flex flex-row-reverse justify-content-lg-start justify-content-center gap-3 pt-3">
                        <a
                          className="add-btn"
                          href={`mailto:${toggle.message?.email}`}
                        >
                          <MdSend />
                          {t("send")}
                        </a>
                        <button
                          type="button"
                          className="cancel-btn"
                          onClick={() => {
                            setToggle({
                              ...toggle,
                              readMessage: !toggle.readMessage,
                            });
                            if (toggle.message?.status === 0) {
                              dispatch(getMessagesApi());
                            }
                          }}
                        >
                          {t("cancel")}
                        </button>
                      </div>
                    </Col>
                  </Row>
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
