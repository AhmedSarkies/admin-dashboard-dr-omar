import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Col, Modal, ModalBody, ModalHeader, Row, Spinner } from "reactstrap";
import { MdSend } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import {
  sendCodeContent,
  sendCodeContentAll,
} from "../../store/slices/codeContentSlice";
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";
import { toast } from "react-toastify";
import { useFiltration, useSchema } from "../../hooks";
import { getUsers } from "../../store/slices/userSlice";

const CodeContent = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { validationSchema } = useSchema();
  const { users, loading, error } = useSelector((state) => state.user);
  const [toggle, setToggle] = useState({
    add: false,
    searchTerm: "",
    activeColumn: false,
    activeRows: false,
    rowsPerPage: 5,
    currentPage: 1,
    sortColumn: "",
    sortOrder: "asc",
    toggleColumns: {
      id: true,
      name: true,
      email: true,
      send: true,
    },
  });

  // Formik
  const formik = useFormik({
    initialValues: {
      User_id: "",
      code: "",
    },
    validationSchema: validationSchema.codeContent,
    onSubmit: (values) => {
      if (toggle.everyOne) {
        dispatch(sendCodeContentAll(values)).then((res) => {
          if (!res.error) {
            toast.success(t("toast.codeContent.addedSuccess"));
            setToggle({
              ...toggle,
              add: !toggle.add,
              everyOne: false,
            });
            dispatch(getUsers());
            formik.handleReset();
          } else {
            toast.error(t("toast.codeContent.addedError"));
            dispatch(getUsers());
          }
        });
      } else {
        dispatch(sendCodeContent(values)).then((response) => {
          if (sendCodeContent.fulfilled.match(response)) {
            toast.success(t("toast.codeContent.addedSuccess"));
            setToggle({
              ...toggle,
              add: !toggle.add,
            });
            formik.handleReset();
          } else if (sendCodeContent.rejected.match(response)) {
            toast.error(t("toast.codeContent.addedError"));
          }
        });
      }
    },
  });

  // Filtration, Sorting, Pagination
  // Columns
  const columns = [
    { id: 0, name: "id", label: t("user.columns.id") },
    { id: 1, name: "name", label: t("user.columns.name") },
    { id: 2, name: "email", label: t("user.columns.email") },
    { id: 3, name: "send", label: t("settings.codeContent.columns.send") },
  ];
  const {
    PaginationUI,
    handleSort,
    handleSearch,
    handleToggleColumns,
    searchResults,
  } = useFiltration({
    rowData: users,
    toggle,
    setToggle,
  });

  // Handle Add
  const handleAdd = (result) => {
    setToggle({
      ...toggle,
      add: !toggle.add,
      everyOne: false,
    });
    formik.setFieldValue("User_id", result?.id);
  };

  // get data from api
  useEffect(() => {
    try {
      dispatch(getUsers());
    } catch (error) {
      console.log(error);
    }
  }, [dispatch]);

  return (
    <div className="scholar-container mt-4 m-sm-3 m-0">
      <div className="table-header">
        <button
          className="add-btn send"
          onClick={() =>
            setToggle({
              ...toggle,
              add: !toggle.add,
              everyOne: true,
            })
          }
        >
          <MdSend />
          {t("settings.codeContent.sendTitleEveryOne")}
        </button>
      </div>
      <div className="scholar">
        <div className="table-header">
          {/* Search */}
          <div className="search-container form-group-container form-input">
            <input
              type="text"
              className="form-input"
              placeholder={t("search")}
              value={toggle.searchTerm}
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
                <th className="table-th" onClick={() => handleSort(columns[0])}>
                  {t("user.columns.id")}
                  {toggle.sortColumn === columns[0].name ? (
                    toggle.sortOrder === "asc" ? (
                      <TiArrowSortedUp />
                    ) : (
                      <TiArrowSortedDown />
                    )
                  ) : null}
                </th>
              )}
              {toggle.toggleColumns?.name && (
                <th className="table-th" onClick={() => handleSort(columns[1])}>
                  {t("user.columns.name")}
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
                  {t("user.columns.email")}
                  {toggle.sortColumn === columns[2].name ? (
                    toggle.sortOrder === "asc" ? (
                      <TiArrowSortedUp />
                    ) : (
                      <TiArrowSortedDown />
                    )
                  ) : null}
                </th>
              )}
              {toggle.toggleColumns?.send && (
                <th className="table-th">
                  {t("settings.codeContent.columns.send")}
                </th>
              )}
            </tr>
          </thead>
          {/* Error */}
          {error !== null && loading === false && (
            <tbody>
              <tr className="no-data-container">
                <td className="table-td" colSpan="3">
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
                <td className="table-td" colSpan="3">
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
                <td className="table-td" colSpan="3">
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
                <td className="table-td" colSpan="3">
                  <p className="no-data no-columns mb-0">{t("noColumns")}</p>
                </td>
              </tr>
            </tbody>
          )}
          {/* Data */}
          {searchResults?.length > 0 && error === null && loading === false && (
            <tbody>
              {searchResults?.map((result) => (
                <tr key={result?.id + new Date().getDate()}>
                  <td className="table-td id">{result?.id}</td>
                  <td className="table-td name">{result?.name}</td>
                  <td className="table-td email">
                    <a href={`mailto:${result?.email}`}>{result?.email}</a>
                  </td>
                  <td className="table-td send">
                    <MdSend
                      className="btn-edit"
                      style={{
                        color: "green",
                        cursor: "pointer",
                      }}
                      onClick={() => handleAdd(result)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>
      {/* Add Book */}
      <Modal
        isOpen={toggle.add}
        toggle={() => {
          setToggle({
            ...toggle,
            add: !toggle.add,
          });
          formik.handleReset();
        }}
        centered={true}
        keyboard={true}
        size={"md"}
        contentClassName="modal-add-book modal-add-scholar"
      >
        <ModalHeader
          toggle={() => {
            setToggle({
              ...toggle,
              add: !toggle.add,
            });
            formik.handleReset();
          }}
        >
          {t("settings.codeContent.sendTitle")}
          <IoMdClose
            onClick={() => {
              setToggle({
                ...toggle,
                add: !toggle.add,
              });
              formik.handleReset();
            }}
          />
        </ModalHeader>
        <ModalBody>
          <form className="overlay-form" onSubmit={formik.handleSubmit}>
            <Row className="d-flex justify-content-center align-items-center p-3">
              <Col lg={12}>
                {/* Code */}
                <div className="form-group-container d-flex flex-column align-items-end mb-3">
                  <label htmlFor="code" className="form-label">
                    {t("settings.codeContent.columns.code")}
                  </label>
                  <input
                    type="text"
                    id="code"
                    name="code"
                    className="form-input w-100"
                    placeholder={t("settings.codeContent.columns.code")}
                    value={formik.values.code}
                    onChange={formik.handleChange}
                  />
                  {formik.errors.code && formik.touched.code ? (
                    <span className="error">{formik.errors.code}</span>
                  ) : null}
                </div>
              </Col>
            </Row>
            <Row className="d-flex justify-content-center align-items-center p-3">
              <Col lg={12}>
                <div className="form-group-container d-flex flex-row-reverse justify-content-lg-start justify-content-center gap-3">
                  <button type="submit" className="add-btn">
                    {/* loading */}
                    {loading ? (
                      <span
                        className="spinner-border spinner-border-sm"
                        role="status"
                        aria-hidden="true"
                      ></span>
                    ) : (
                      t("settings.codeContent.columns.send")
                    )}
                  </button>
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => {
                      setToggle({
                        ...toggle,
                        add: !toggle.add,
                      });
                      formik.handleReset();
                    }}
                  >
                    {t("cancel")}
                  </button>
                </div>
              </Col>
            </Row>
          </form>
        </ModalBody>
      </Modal>
      {/* Pagination */}
      {searchResults?.length > 0 && error === null && loading === false && (
        <PaginationUI />
      )}
    </div>
  );
};

export default CodeContent;
