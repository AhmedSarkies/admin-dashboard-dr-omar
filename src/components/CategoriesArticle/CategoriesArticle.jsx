import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Col, Modal, ModalBody, ModalHeader, Row, Spinner } from "reactstrap";
import { MdAdd, MdDeleteOutline } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import {
  getArticlesCategoriesApi,
  addArticleCategoryApi,
  updateArticleCategoryApi,
  deleteArticleCategoryApi,
} from "../../store/slices/articleSlice";
import { useFormik } from "formik";
import Swal from "sweetalert2";
import { useFiltration, useSchema } from "../../hooks";
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

const CategoriesArticle = () => {
  const { t } = useTranslation();
  const role = Cookies.get("_role");
  const getCategoriesArticleCookies = Cookies.get("GetArticlesCategories");
  const addCategoriesArticleCookies = Cookies.get("addArticlesCategories");
  const editCategoriesArticleCookies = Cookies.get("editArticlesCategories");
  const deleteCategoriesArticleCookies = Cookies.get(
    "deleteArticlesCategories"
  );
  const dispatch = useDispatch();
  const { validationSchema } = useSchema();
  const { articleCategories, loading, error } = useSelector(
    (state) => state.article
  );
  const [toggle, setToggle] = useState({
    add: false,
    edit: false,
    searchTerm: "",
    activeColumn: false,
    toggleColumns: {
      id: true,
      category: true,
      control: true,
    },
    sortColumn: "",
    sortOrder: "asc",
    rowsPerPage: 5,
    currentPage: 1,
  });

  // Filtration, Sorting, Pagination
  const {
    PaginationUI,
    handleSort,
    handleSearch,
    handleToggleColumns,
    searchResults,
  } = useFiltration({
    rowData: articleCategories,
    toggle,
    setToggle,
  });
  // Columns
  const columns = [
    { id: 0, name: "id", label: t("index") },
    { id: 1, name: "category", label: t("categories.columns.category") },
    { id: 2, name: "control", label: t("action") },
  ];
  // Formik
  const formik = useFormik({
    initialValues: {
      title: "",
    },
    validationSchema: validationSchema.category,
    onSubmit: (values) => {
      if (
        role === "admin" ||
        (addCategoriesArticleCookies === "1" &&
          getCategoriesArticleCookies === "1") ||
        (editCategoriesArticleCookies === "1" &&
          getCategoriesArticleCookies === "1")
      ) {
        if (values.isEditing) {
          dispatch(
            updateArticleCategoryApi({ id: values.id, title: values.title })
          ).then((res) => {
            if (!res.error) {
              dispatch(getArticlesCategoriesApi());
              setToggle({
                ...toggle,
                edit: !toggle.edit,
              });
              formik.handleReset();
              toast.success(t("toast.category.updatedSuccess"));
            } else {
              dispatch(getArticlesCategoriesApi());
              toast.error(t("toast.category.updatedError"));
            }
          });
        } else {
          dispatch(addArticleCategoryApi(values)).then((res) => {
            if (!res.error) {
              dispatch(getArticlesCategoriesApi());
              setToggle({
                ...toggle,
                add: !toggle.add,
              });
              formik.handleReset();
              toast.success(t("toast.category.addedSuccess"));
            } else {
              dispatch(getArticlesCategoriesApi());
              toast.error(t("toast.category.addedError"));
            }
          });
        }
      }
    },
  });

  // Handle Edit Audio Category
  const handleEdit = (audioCategory) => {
    formik.setValues({ ...audioCategory, isEditing: true });
    setToggle({
      ...toggle,
      edit: !toggle.edit,
    });
  };

  // Delete Article Category
  const handleDelete = (articleCategory) => {
    if (role === "admin" || deleteCategoriesArticleCookies === "1") {
      Swal.fire({
        title: t("titleDeleteAlert") + articleCategory?.title + "?",
        text: t("textDeleteAlert"),
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#0d1d34",
        confirmButtonText: t("confirmButtonText"),
        cancelButtonText: t("cancel"),
      }).then((result) => {
        if (result.isConfirmed) {
          dispatch(deleteArticleCategoryApi(articleCategory?.id)).then(
            (res) => {
              if (!res.error) {
                if (toggle.currentPage > 1 && searchResults.length === 1) {
                  setToggle({
                    ...toggle,
                    currentPage: toggle.currentPage - 1,
                  });
                }
                dispatch(getArticlesCategoriesApi());
                Swal.fire({
                  title: `${t("titleDeletedSuccess")} ${
                    articleCategory?.title
                  }`,
                  text: `${t("titleDeletedSuccess")} ${
                    articleCategory?.title
                  } ${t("textDeletedSuccess")}`,
                  icon: "success",
                  confirmButtonColor: "#0d1d34",
                  confirmButtonText: t("doneDeletedSuccess"),
                }).then(() =>
                  toast.success(t("toast.category.deletedSuccess"))
                );
              } else {
                dispatch(getArticlesCategoriesApi());
                toast.error(t("toast.category.deletedError"));
              }
            }
          );
        }
      });
    }
  };

  // get data from api
  useEffect(() => {
    try {
      if (role === "admin" || getCategoriesArticleCookies === "1") {
        dispatch(getArticlesCategoriesApi());
      }
      if (getCategoriesArticleCookies === "0") {
        Cookies.set("addArticlesCategories", 0, {
          expires: 30,
          secure: true,
          sameSite: "strict",
          path: "/",
        });
        Cookies.set("editArticlesCategories", 0, {
          expires: 30,
          secure: true,
          sameSite: "strict",
          path: "/",
        });
        Cookies.set("deleteArticlesCategories", 0, {
          expires: 30,
          secure: true,
          sameSite: "strict",
          path: "/",
        });
      }
      if (
        role !== "admin" &&
        addCategoriesArticleCookies === "0" &&
        editCategoriesArticleCookies === "0" &&
        deleteCategoriesArticleCookies === "0"
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
  }, [
    dispatch,
    role,
    getCategoriesArticleCookies,
    addCategoriesArticleCookies,
    editCategoriesArticleCookies,
    deleteCategoriesArticleCookies,
  ]);

  return (
    <div className="scholar-container mt-4 m-sm-3 m-0">
      {(role === "admin" ||
        (addCategoriesArticleCookies === "1" &&
          getCategoriesArticleCookies === "1")) && (
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
            {t("categories.addTitle")}
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
              placeholder={t("searchCategoryArticle")}
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
              {toggle.toggleColumns.id && (
                <th className="table-th">{t("index")}</th>
              )}
              {toggle.toggleColumns.category && (
                <th className="table-th" onClick={() => handleSort(columns[1])}>
                  {t("categories.columns.category")}
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
                (addCategoriesArticleCookies === "1" &&
                  getCategoriesArticleCookies === "1") ||
                role === "admin" ||
                (editCategoriesArticleCookies === "1" &&
                  getCategoriesArticleCookies === "1")) &&
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
                    addCategoriesArticleCookies === "0" &&
                    editCategoriesArticleCookies === "0" &&
                    deleteCategoriesArticleCookies === "0"
                      ? 2
                      : 3
                  }
                >
                  <p className="no-data mb-0">
                    {error === "Network Error"
                      ? t("networkError")
                      : error === "Request failed with status code 404"
                      ? t("nodata")
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
                    addCategoriesArticleCookies === "0" &&
                    editCategoriesArticleCookies === "0" &&
                    deleteCategoriesArticleCookies === "0"
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
                    addCategoriesArticleCookies === "0" &&
                    editCategoriesArticleCookies === "0" &&
                    deleteCategoriesArticleCookies === "0"
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
                    addCategoriesArticleCookies === "0" &&
                    editCategoriesArticleCookies === "0" &&
                    deleteCategoriesArticleCookies === "0"
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
                  {toggle.toggleColumns.category && (
                    <td className="table-td name">{result?.title}</td>
                  )}
                  {(role === "admin" ||
                    (addCategoriesArticleCookies === "1" &&
                      getCategoriesArticleCookies === "1") ||
                    role === "admin" ||
                    (editCategoriesArticleCookies === "1" &&
                      getCategoriesArticleCookies === "1")) &&
                    toggle.toggleColumns.control && (
                      <td className="table-td">
                        <span className="table-btn-container">
                          {(role === "admin" ||
                            editCategoriesArticleCookies === "1") && (
                            <FaEdit
                              className="edit-btn"
                              onClick={() => {
                                handleEdit(result);
                                setToggle({
                                  ...toggle,
                                  edit: !toggle.edit,
                                });
                              }}
                            />
                          )}
                          {(role === "admin" ||
                            deleteCategoriesArticleCookies === "1") && (
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
        (addCategoriesArticleCookies === "1" &&
          getCategoriesArticleCookies === "1")) && (
        <>
          {/* Add Audio Category */}
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
              {t("categories.addTitle")}
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
                    <div
                      className="form-group-container d-flex flex-column align-items-end mb-3"
                      style={{ marginTop: "-4px" }}
                    >
                      <label htmlFor="title" className="form-label">
                        {t("categories.columns.category")}
                      </label>
                      <input
                        type="text"
                        className="form-input w-100"
                        id="title"
                        placeholder={t("categories.columns.category")}
                        name="title"
                        value={formik.values.title}
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
      {(role === "admin" ||
        (getCategoriesArticleCookies === "1" &&
          editCategoriesArticleCookies === "1")) && (
        <>
          {/* Edit Audio Category */}
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
              {t("categories.editTitle")}
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
                        {t("categories.columns.category")}
                      </label>
                      <input
                        type="text"
                        className="form-input w-100"
                        id="title"
                        placeholder={t("categories.columns.category")}
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

export default CategoriesArticle;
