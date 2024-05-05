import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Col, Modal, ModalBody, ModalHeader, Row, Spinner } from "reactstrap";
import { MdAdd, MdDeleteOutline } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import {
  getBooksCategoriesApi,
  addBookCategoryApi,
  updateBookCategoryApi,
  deleteBookCategoryApi,
} from "../../store/slices/bookSlice";
import { useFormik } from "formik";
import Swal from "sweetalert2";
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";
import { useFiltration, useSchema } from "../../hooks";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

const CategoriesBook = () => {
  const { t } = useTranslation();
  const role = Cookies.get("_role");
  const getMainCategoriesBooksCookies = Cookies.get("GetMainCategoriesBook");
  const addMainCategoriesBooksCookies = Cookies.get("addMainCategoriesBook");
  const editMainCategoriesBooksCookies = Cookies.get("editMainCategoriesBook");
  const deleteMainCategoriesBooksCookies = Cookies.get(
    "deleteMainCategoriesBook"
  );
  const dispatch = useDispatch();
  const { validationSchema } = useSchema();
  const { bookCategories, loading, error } = useSelector((state) => state.book);
  const [toggle, setToggle] = useState({
    add: false,
    edit: false,
    searchTerm: "",
    activeColumn: false,
    activeRows: false,
    rowsPerPage: 5,
    currentPage: 1,
    sortColumn: "",
    sortOrder: "asc",
    toggleColumns: {
      id: true,
      title: true,
      control: true,
    },
  });

  // Filtration, Sorting, Pagination
  // Columns
  const columns = [
    { id: 0, name: "id", label: t("index") },
    { id: 1, name: "title", label: t("mainCategoriesBooks.columns.category") },
    { id: 2, name: "control", label: t("action") },
  ];
  const {
    PaginationUI,
    handleSort,
    handleSearch,
    handleToggleColumns,
    searchResults,
  } = useFiltration({
    rowData: bookCategories,
    toggle,
    setToggle,
  });

  // Formik
  const formik = useFormik({
    initialValues: {
      title: "",
    },
    validationSchema: validationSchema.category,
    onSubmit: (values) => {
      if (
        role === "admin" ||
        (addMainCategoriesBooksCookies === "1" &&
          getMainCategoriesBooksCookies === "1") ||
        (editMainCategoriesBooksCookies === "1" &&
          getMainCategoriesBooksCookies === "1")
      ) {
        if (values.isEditing) {
          dispatch(
            updateBookCategoryApi({ id: values.id, title: values.title })
          ).then((res) => {
            if (!res.error) {
              dispatch(getBooksCategoriesApi());
              setToggle({
                ...toggle,
                edit: !toggle.edit,
              });
              formik.handleReset();
              toast.success(t("toast.category.updatedSuccess"));
            } else {
              dispatch(getBooksCategoriesApi());
              toast.error(t("toast.category.updatedError"));
            }
          });
        } else {
          dispatch(addBookCategoryApi(values)).then((res) => {
            if (!res.error) {
              dispatch(getBooksCategoriesApi());
              setToggle({
                ...toggle,
                add: !toggle.add,
              });
              formik.handleReset();
              toast.success(t("toast.category.addedSuccess"));
            } else {
              dispatch(getBooksCategoriesApi());
              toast.error(t("toast.category.addedError"));
            }
          });
        }
      }
    },
  });

  // Handle Edit Book Category
  const handleEdit = (bookCategory) => {
    formik.setValues({ ...bookCategory, isEditing: true });
    setToggle({
      ...toggle,
      edit: !toggle.edit,
    });
  };

  // Delete Book Category
  const handleDelete = (bookCategory) => {
    if (role === "admin" || deleteMainCategoriesBooksCookies === "1") {
      Swal.fire({
        title: t("titleDeleteAlert") + bookCategory?.title + "?",
        text: t("textDeleteAlert"),
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#0d1d34",
        confirmButtonText: t("confirmButtonText"),
        cancelButtonText: t("cancel"),
      }).then((result) => {
        if (result.isConfirmed) {
          dispatch(deleteBookCategoryApi(bookCategory?.id)).then((res) => {
            if (!res.error) {
              if (toggle.currentPage > 1 && searchResults.length === 1) {
                setToggle({
                  ...toggle,
                  currentPage: toggle.currentPage - 1,
                });
              }
              dispatch(getBooksCategoriesApi());
              Swal.fire({
                title: `${t("titleDeletedSuccess")} ${bookCategory?.title}`,
                text: `${t("titleDeletedSuccess")} ${bookCategory?.title} ${t(
                  "textDeletedSuccess"
                )}`,
                icon: "success",
                confirmButtonColor: "#0d1d34",
                confirmButtonText: t("doneDeletedSuccess"),
              }).then(() => toast.success(t("toast.category.deletedSuccess")));
            } else {
              dispatch(getBooksCategoriesApi());
              toast.error(t("toast.category.deletedError"));
            }
          });
        }
      });
    }
  };

  // get data from api
  useEffect(() => {
    try {
      if (role === "admin" || getMainCategoriesBooksCookies === "1") {
        dispatch(getBooksCategoriesApi());
      }
      if (getMainCategoriesBooksCookies === "0") {
        Cookies.set("addMainCategoriesBook", 0, {
          expires: 30,
          secure: true,
          sameSite: "strict",
          path: "/",
        });
        Cookies.set("editMainCategoriesBook", 0, {
          expires: 30,
          secure: true,
          sameSite: "strict",
          path: "/",
        });
        Cookies.set("deleteMainCategoriesBook", 0, {
          expires: 30,
          secure: true,
          sameSite: "strict",
          path: "/",
        });
      }
      if (
        role !== "admin" &&
        addMainCategoriesBooksCookies === "0" &&
        editMainCategoriesBooksCookies === "0" &&
        deleteMainCategoriesBooksCookies === "0"
      ) {
        setToggle({
          ...toggle,
          toggleColumns: {
            ...toggle.toggleColumns,
            control: false,
          },
        });
      }
    } catch (error) {
      console.log(error);
    }
    // eslint-disable-next-line
  }, [dispatch, role]);

  return (
    <div className="scholar-container mt-4 m-sm-3 m-0">
      {(role === "admin" ||
        (addMainCategoriesBooksCookies === "1" &&
          getMainCategoriesBooksCookies === "1")) && (
        <div className="table-header">
          <button
            className="add-btn"
            onClick={() =>
              setToggle({
                ...toggle,
                add: !toggle.add,
              })
            }
          >
            <MdAdd />
            {t("mainCategoriesBooks.addTitle")}
          </button>
        </div>
      )}
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
              placeholder={t("searchMainCategoryBook")}
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
              {columns
                .filter((column) =>
                  role === "admin" ? column : column.name !== "control"
                )
                .map((column) => (
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
              {toggle.toggleColumns?.title && (
                <th className="table-th" onClick={() => handleSort(columns[1])}>
                  {t("mainCategoriesBooks.columns.category")}
                  {toggle.sortColumn === columns[1].name ? (
                    toggle.sortOrder === "asc" ? (
                      <TiArrowSortedUp />
                    ) : (
                      <TiArrowSortedDown />
                    )
                  ) : null}
                </th>
              )}
              {(role === "admin" ||
                (addMainCategoriesBooksCookies === "1" &&
                  getMainCategoriesBooksCookies === "1") ||
                role === "admin" ||
                (editMainCategoriesBooksCookies === "1" &&
                  getMainCategoriesBooksCookies === "1")) &&
                toggle.toggleColumns.control && (
                  <th
                    className="table-th"
                    onClick={() => handleSort(columns[2])}
                  >
                    {t("action")}
                    {toggle.sortColumn === columns[2].name ? (
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
                <td
                  className="table-td"
                  colSpan={
                    addMainCategoriesBooksCookies === "0" &&
                    editMainCategoriesBooksCookies === "0" &&
                    deleteMainCategoriesBooksCookies === "0"
                      ? 2
                      : 3
                  }
                >
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
                <td
                  className="table-td"
                  colSpan={
                    addMainCategoriesBooksCookies === "0" &&
                    editMainCategoriesBooksCookies === "0" &&
                    deleteMainCategoriesBooksCookies === "0"
                      ? 2
                      : 3
                  }
                >
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
                <td
                  className="table-td"
                  colSpan={
                    addMainCategoriesBooksCookies === "0" &&
                    editMainCategoriesBooksCookies === "0" &&
                    deleteMainCategoriesBooksCookies === "0"
                      ? 2
                      : 3
                  }
                >
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
                <td
                  className="table-td"
                  colSpan={
                    addMainCategoriesBooksCookies === "0" &&
                    editMainCategoriesBooksCookies === "0" &&
                    deleteMainCategoriesBooksCookies === "0"
                      ? 2
                      : 3
                  }
                >
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
                  {toggle.toggleColumns?.title && (
                    <td className="table-td name">{result?.title}</td>
                  )}
                  {(role === "admin" ||
                    (addMainCategoriesBooksCookies === "1" &&
                      getMainCategoriesBooksCookies === "1") ||
                    role === "admin" ||
                    (editMainCategoriesBooksCookies === "1" &&
                      getMainCategoriesBooksCookies === "1")) &&
                    toggle.toggleColumns?.control && (
                      <td className="table-td">
                        <span className="table-btn-container">
                          {(role === "admin" ||
                            editMainCategoriesBooksCookies === "1") && (
                            <FaEdit
                              className="edit-btn"
                              onClick={() => {
                                handleEdit(result);
                              }}
                            />
                          )}
                          {(role === "admin" ||
                            deleteMainCategoriesBooksCookies === "1") && (
                            <MdDeleteOutline
                              className="delete-btn"
                              onClick={() => handleDelete(result)}
                            />
                          )}
                        </span>
                      </td>
                    )}
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>
      {(role === "admin" ||
        (addMainCategoriesBooksCookies === "1" &&
          getMainCategoriesBooksCookies === "1")) && (
        <>
          {/* Add Book Category */}
          <Modal
            isOpen={toggle.add}
            toggle={() => {
              setToggle({
                ...toggle,
                add: !toggle.add,
              });
            }}
            centered={true}
            keyboard={true}
            size={"md"}
            contentClassName="modal-add-scholar"
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
              {t("mainCategoriesBooks.addTitle")}
              <IoMdClose
                onClick={() => {
                  setToggle({
                    ...toggle,
                    add: !toggle.add,
                  });
                }}
              />
            </ModalHeader>
            <ModalBody>
              <form className="overlay-form" onSubmit={formik.handleSubmit}>
                <Row className="d-flex justify-content-center align-items-center p-3">
                  <Col lg={12}>
                    <div
                      className="form-group-container d-flex flex-column align-items-end mb-3"
                      style={{ marginTop: "-4px" }}
                    >
                      <label htmlFor="title" className="form-label">
                        {t("mainCategoriesBooks.columns.category")}
                      </label>
                      <input
                        type="text"
                        className="form-input w-100"
                        id="title"
                        placeholder={t("mainCategoriesBooks.columns.category")}
                        name="title"
                        value={formik.values?.title}
                        onChange={formik.handleChange}
                      />
                      {formik.errors.title && formik.touched.title ? (
                        <span className="error">{formik.errors.title}</span>
                      ) : null}
                    </div>
                  </Col>
                  <Col lg={12}>
                    <div className="form-group-container d-flex flex-row-reverse justify-content-lg-start justify-content-center gap-3">
                      <button
                        type="submit"
                        className={`add-btn${loading ? " loading-btn" : ""}`}
                      >
                        {/* loading */}
                        {loading ? (
                          <span
                            className="spinner-border spinner-border-sm"
                            role="status"
                            aria-hidden="true"
                          ></span>
                        ) : (
                          t("add")
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
        </>
      )}
      {(role === "admin" ||
        (editMainCategoriesBooksCookies === "1" &&
          getMainCategoriesBooksCookies === "1")) && (
        <>
          {/* Edit Book Category */}
          <Modal
            isOpen={toggle.edit}
            toggle={() => {
              setToggle({
                ...toggle,
                edit: !toggle.edit,
              });
              formik.handleReset();
            }}
            centered={true}
            keyboard={true}
            size={"md"}
            contentClassName="modal-add-scholar"
          >
            <ModalHeader
              toggle={() => {
                setToggle({
                  ...toggle,
                  edit: !toggle.edit,
                });
                formik.handleReset();
              }}
            >
              {t("mainCategoriesBooks.editTitle")}
              <IoMdClose
                onClick={() => {
                  setToggle({
                    ...toggle,
                    edit: !toggle.edit,
                  });
                  formik.handleReset();
                }}
              />
            </ModalHeader>
            <ModalBody>
              <form className="overlay-form" onSubmit={formik.handleSubmit}>
                <Row className="d-flex justify-content-center align-items-center p-3">
                  <Col lg={12}>
                    <div
                      className="form-group-container d-flex flex-column align-items-end mb-3"
                      style={{ marginTop: "-4px" }}
                    >
                      <label htmlFor="title" className="form-label">
                        {t("mainCategoriesBooks.columns.category")}
                      </label>
                      <input
                        type="text"
                        className="form-input w-100"
                        id="title"
                        placeholder={t("mainCategoriesBooks.columns.category")}
                        name="title"
                        value={formik.values?.title}
                        onChange={formik.handleChange}
                      />
                      {formik.errors.title && formik.touched.title ? (
                        <span className="error">{formik.errors.title}</span>
                      ) : null}
                    </div>
                  </Col>
                  <Col lg={12}>
                    <div className="form-group-container d-flex flex-row-reverse justify-content-lg-start justify-content-center gap-3">
                      <button
                        type="submit"
                        className={`add-btn${loading ? " loading-btn" : ""}`}
                      >
                        {/* loading */}
                        {loading ? (
                          <span
                            className="spinner-border spinner-border-sm"
                            role="status"
                            aria-hidden="true"
                          ></span>
                        ) : (
                          t("save")
                        )}
                      </button>
                      <button
                        type="button"
                        className="cancel-btn"
                        onClick={() => {
                          setToggle({
                            ...toggle,
                            edit: !toggle.edit,
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
        </>
      )}
      {/* Pagination */}
      {searchResults?.length > 0 && error === null && loading === false && (
        <PaginationUI />
      )}
    </div>
  );
};

export default CategoriesBook;
