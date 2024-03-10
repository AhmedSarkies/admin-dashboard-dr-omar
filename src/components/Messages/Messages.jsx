import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { Modal, ModalBody, ModalHeader, Spinner } from "reactstrap";

import { MdRemoveRedEye } from "react-icons/md";
import { IoMdClose } from "react-icons/io";

import { getMessagesApi, getMessages } from "../../store/slices/messagesSlice";

import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";
import useFiltration from "../../hooks/useFiltration";
const Messages = () => {
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
    { id: 0, name: "first_name", label: "الاسم" },
    { id: 2, name: "phone", label: "الهاتف" },
    { id: 2, name: "email", label: "البريد الإلكتروني" },
    { id: 3, name: "subject", label: "الرسالة" },
    { id: 4, name: "readMessage", label: "قراءة الرسالة" },
  ];
  const {
    PaginationUI,
    handleSort,
    handleSearch,
    handleToggleColumns,
    results,
  } = useFiltration({
    rowData: messages,
    toggle,
    setToggle,
  });

  // get data from api
  useEffect(() => {
    try {
      dispatch(getMessagesApi()).then((res) => {
        if (!res.error) {
          dispatch(getMessages(res.payload));
        }
      });
    } catch (error) {
      console.log(error);
    }
  }, [dispatch]);

  return (
    <div className="scholar-container mt-4 m-3">
      <div className="scholar">
        <div className="table-header">
          {/* Search */}
          <div className="search-container form-group-container form-input">
            <input
              type="text"
              className="form-input"
              placeholder="بحث"
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
              style={{
                width: "180px",
              }}
            >
              <span>الاعمدة</span>
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
              {toggle.toggleColumns?.first_name && (
                <th className="table-th" onClick={() => handleSort(columns[0])}>
                  الاسم
                  {toggle.sortColumn === columns[0].name ? (
                    toggle.sortOrder === "asc" ? (
                      <TiArrowSortedUp />
                    ) : (
                      <TiArrowSortedDown />
                    )
                  ) : null}
                </th>
              )}
              {toggle.toggleColumns?.phone && (
                <th className="table-th" onClick={() => handleSort(columns[1])}>
                  الهاتف
                  {toggle.sortColumn === columns[1].name ? (
                    toggle.sortOrder === "asc" ? (
                      <TiArrowSortedUp />
                    ) : (
                      <TiArrowSortedDown />
                    )
                  ) : null}
                </th>
              )}
              {toggle.toggleColumns?.email && (
                <th className="table-th" onClick={() => handleSort(columns[2])}>
                  البريد الإلكتروني
                  {toggle.sortColumn === columns[2].name ? (
                    toggle.sortOrder === "asc" ? (
                      <TiArrowSortedUp />
                    ) : (
                      <TiArrowSortedDown />
                    )
                  ) : null}
                </th>
              )}
              {toggle.toggleColumns?.subject && (
                <th className="table-th" onClick={() => handleSort(columns[3])}>
                  الرسالة
                  {toggle.sortColumn === columns[3].name ? (
                    toggle.sortOrder === "asc" ? (
                      <TiArrowSortedUp />
                    ) : (
                      <TiArrowSortedDown />
                    )
                  ) : null}
                </th>
              )}
              {toggle.toggleColumns?.readMessage && (
                <th className="table-th" onClick={() => handleSort(columns[4])}>
                  قراءة الرسالة
                  {toggle.sortColumn === columns[4].name ? (
                    toggle.sortOrder === "asc" ? (
                      <TiArrowSortedUp />
                    ) : (
                      <TiArrowSortedDown />
                    )
                  ) : null}
                </th>
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
                      ? "حدث خطأ في الشبكة"
                      : error === "Request failed with status code 404"
                      ? "لا يوجد بيانات"
                      : error === "Request failed with status code 500"
                      ? "حدث خطأ في الخادم"
                      : "حدث خطأ ما"}
                  </p>
                </td>
              </tr>
            </tbody>
          )}
          {/* Loading */}
          {loading && (
            <tbody>
              <tr className="no-data-container">
                <td className="table-td" colSpan="2">
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
          {results?.length === 0 && error === null && !loading && (
            <tbody>
              <tr className="no-data-container">
                <td className="table-td" colSpan="6">
                  <p className="no-data mb-0">لا يوجد بيانات</p>
                </td>
              </tr>
            </tbody>
          )}
          {/* Data */}
          {results?.length > 0 && error === null && loading === false && (
            <tbody>
              {results?.map((result) => (
                <tr key={result?.id + new Date().getDate()}>
                  <td className="table-td name">{result?.first_name}</td>
                  <td className="table-td phone">
                    <a href={`tel${result?.phone}`}>{result?.phone}</a>
                  </td>
                  <td className="table-td email">
                    <a href={`mailto:${result?.email}`}>{result?.email}</a>
                  </td>
                  <td className="table-td subject">{result?.subject}</td>
                  <td className="table-td read-more">
                    <MdRemoveRedEye
                      onClick={() =>
                        setToggle({
                          ...toggle,
                          readMessage: !toggle.readMessage,
                          message: result,
                        })
                      }
                    />
                  </td>
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
                    <h3 className="text-center mb-3">
                      {toggle.message?.first_name}
                    </h3>
                    <div className="content text-end">
                      {toggle.message?.phone}
                    </div>
                    <div className="content text-end">
                      {toggle.message?.email}
                    </div>
                    <div className="content text-end">
                      {toggle.message?.subject}
                    </div>
                  </div>
                </ModalBody>
              </Modal>
            </tbody>
          )}
        </table>
      </div>
      {/* Pagination */}
      {results.length > 0 && error === null && loading === false && (
        <PaginationUI />
      )}
    </div>
  );
};

export default Messages;
