import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Col, Modal, ModalBody, ModalHeader, Row, Spinner } from "reactstrap";
import { MdAdd, MdDeleteOutline } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import Swal from "sweetalert2";
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";
import { toast } from "react-toastify";
import { useFiltration, useSchema } from "../../hooks";
import Cookies from "js-cookie";
import {
  getTermsAndConditionsApi,
  deleteTermAndConditionApi,
  updateTermAndConditionApi,
  addTermAndConditionApi,
} from "../../store/slices/termsConditionsSlice";

const TermsAndConditions = () => {
  const { t } = useTranslation();
  const role = Cookies.get("_role");
  const getTermsAndConditionsCookies = Cookies.get("GetTermsConditions");
  const addTermsAndConditionsCookies = Cookies.get("addTermsConditions");
  const editTermsAndConditionsCookies = Cookies.get("editTermsConditions");
  const deleteTermsAndConditionsCookies = Cookies.get("deleteTermsConditions");
  const dispatch = useDispatch();
  const { validationSchema } = useSchema();
  const { termsAndConditions, loading, error } = useSelector(
    (state) => state.termsAndConditions
  );
  const [toggle, setToggle] = useState({
    add: false,
    edit: false,
    isBookCategories: false,
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
      text: true,
      control: true,
    },
  });
  const lng = Cookies.get("i18next") || "ar";
  // Change Language
  useEffect(() => {
    document.documentElement.lang = lng;
  }, [lng]);

  const formik = useFormik({
    initialValues: {
      title: "",
      title_en: "",
      text: "",
      text_en: "",
      isEditing: false,
    },
    validationSchema: validationSchema.termsAndConditions,
    onSubmit: (values) => {
      if (
        role === "admin" ||
        (addTermsAndConditionsCookies === "1" &&
          getTermsAndConditionsCookies === "1") ||
        (editTermsAndConditionsCookies === "1" &&
          getTermsAndConditionsCookies === "1")
      ) {
        const formDate = new FormData();
        formDate.append("title", values.title);
        formDate.append("title_en", values.title_en);
        formDate.append("text", values.text);
        formDate.append("text_en", values.text_en);
        if (values.id) {
          formDate.append("id", values.id);
          // Edit
          dispatch(updateTermAndConditionApi(formDate)).then((res) => {
            if (!res.error) {
              dispatch(getTermsAndConditionsApi());
              setToggle({
                ...toggle,
                edit: false,
              });
              toast.success(t("toast.termsAndConditions.updatedSuccess"));
              formik.resetForm();
            } else {
              getTermsAndConditionsApi();
              toast.error(t("toast.termsAndConditions.updatedError"));
            }
          });
        } else {
          // Add
          dispatch(addTermAndConditionApi(formDate)).then((res) => {
            if (!res.error) {
              dispatch(getTermsAndConditionsApi());
              toast.success(t("toast.termsAndConditions.addedSuccess"));
              setToggle({
                ...toggle,
                add: false,
              });
              formik.resetForm();
            } else {
              dispatch(getTermsAndConditionsApi());
              toast.error(t("toast.termsAndConditions.addedError"));
            }
          });
        }
      }
    },
  });

  // Filtration, Sorting, Pagination
  // Columns
  const columns = [
    { id: 0, name: "id", label: t("index") },
    {
      id: 1,
      name: "title",
      label: t("settings.termsAndConditions.columns.title"),
    },
    {
      id: 2,
      name: "text",
      label: t("settings.termsAndConditions.columns.text"),
    },
    { id: 3, name: "control", label: t("action") },
  ];
  const {
    PaginationUI,
    handleSort,
    handleSearch,
    handleToggleColumns,
    searchResults,
  } = useFiltration({
    rowData: termsAndConditions,
    toggle,
    setToggle,
  });

  const handleInputChange = (e) => {
    formik.handleChange(e);
  };

  // Handle Edit term And Condition
  const handleEdit = (termsAndCondition) => {
    formik.setValues({
      title: termsAndCondition?.title,
      title_en: termsAndCondition?.title_en,
      text: termsAndCondition?.text,
      text_en: termsAndCondition?.text_en,
      isEditing: true,
      id: termsAndCondition?.id,
    });
    setToggle({
      ...toggle,
      edit: !toggle.edit,
    });
  };

  // Delete term And Condition
  const handleDelete = (termsAndCondition) => {
    if (role === "admin" || deleteTermsAndConditionsCookies === "1") {
      Swal.fire({
        title:
          t("titleDeleteAlert") + lng === "ar"
            ? termsAndCondition?.title
            : termsAndCondition.title_en + "?",
        text: t("textDeleteAlert"),
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#0d1d34",
        confirmButtonText: t("confirmButtonText"),
        cancelButtonText: t("cancel"),
      }).then((result) => {
        if (result.isConfirmed) {
          dispatch(deleteTermAndConditionApi(termsAndCondition?.id)).then(
            (res) => {
              if (!res.error) {
                if (toggle.currentPage > 1 && searchResults.length === 1) {
                  setToggle({
                    ...toggle,
                    currentPage: toggle.currentPage - 1,
                  });
                }
                dispatch(getTermsAndConditionsApi());
                Swal.fire({
                  title: `${t("titleDeletedSuccess")} ${
                    lng === "ar"
                      ? termsAndCondition?.title
                      : termsAndCondition.title_en
                  }`,
                  text: `${t("titleDeletedSuccess")} ${
                    lng === "ar"
                      ? termsAndCondition?.title
                      : termsAndCondition.title_en
                  } ${t("textDeletedSuccess")}`,
                  icon: "success",
                  confirmButtonColor: "#0d1d34",
                  confirmButtonText: t("doneDeletedSuccess"),
                }).then(() =>
                  toast.success(t("toast.termsAndConditions.deletedSuccess"))
                );
              } else {
                dispatch(getTermsAndConditionsApi());
                toast.error(t("toast.termsAndConditions.deletedError"));
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
      if (role === "admin" || getTermsAndConditionsCookies === "1") {
        dispatch(getTermsAndConditionsApi());
      }
      if (getTermsAndConditionsCookies === "0") {
        Cookies.set("addTermsConditions", 0, {
          expires: 30,
          secure: true,
          sameSite: "strict",
          path: "/",
        });
        Cookies.set("editTermsConditions", 0, {
          expires: 30,
          secure: true,
          sameSite: "strict",
          path: "/",
        });
        Cookies.set("deleteTermsConditions", 0, {
          expires: 30,
          secure: true,
          sameSite: "strict",
          path: "/",
        });
      }
      if (
        role !== "admin" &&
        addTermsAndConditionsCookies === "0" &&
        editTermsAndConditionsCookies === "0" &&
        deleteTermsAndConditionsCookies === "0"
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
    getTermsAndConditionsCookies,
    addTermsAndConditionsCookies,
    editTermsAndConditionsCookies,
    deleteTermsAndConditionsCookies,
  ]);

  return (
    <>
      <div className="scholar-container mt-4 m-sm-3 m-0">
        {(role === "admin" ||
          (addTermsAndConditionsCookies === "1" &&
            getTermsAndConditionsCookies === "1")) && (
          <div className="table-header">
            <button
              className="add-btn"
              onClick={() => {
                setToggle({
                  ...toggle,
                  add: !toggle.add,
                });
                formik.handleReset();
              }}
            >
              <MdAdd />
              {t("settings.termsAndConditions.addTitle")}
            </button>
          </div>
        )}
        <div className="scholar">
          <div className="table-header">
            {/* Search */}
            <div className="search-container form-group-container form-input">
              <input
                type="text"
                className="form-input"
                placeholder={t("search")}
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
                  .filter((column) => column.name !== "control")
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
                  <th
                    className="table-th"
                    onClick={() => handleSort(columns[0])}
                  >
                    {t("index")}
                    {toggle.sortColumn === columns[0].name ? (
                      toggle.sortOrder === "asc" ? (
                        <TiArrowSortedUp />
                      ) : (
                        <TiArrowSortedDown />
                      )
                    ) : null}
                  </th>
                )}
                {toggle.toggleColumns?.title && (
                  <th
                    className="table-th"
                    onClick={() => handleSort(columns[1])}
                  >
                    {t("settings.termsAndConditions.columns.title")}
                    {toggle.sortColumn === columns[1].name ? (
                      toggle.sortOrder === "asc" ? (
                        <TiArrowSortedUp />
                      ) : (
                        <TiArrowSortedDown />
                      )
                    ) : null}
                  </th>
                )}
                {toggle.toggleColumns.text && (
                  <th
                    className="table-th"
                    onClick={() => handleSort(columns[2])}
                  >
                    {t("settings.termsAndConditions.columns.text")}
                    {toggle.sortColumn === columns[2].name ? (
                      toggle.sortOrder === "asc" ? (
                        <TiArrowSortedUp />
                      ) : (
                        <TiArrowSortedDown />
                      )
                    ) : null}
                  </th>
                )}
                {(role === "admin" ||
                  (addTermsAndConditionsCookies === "1" &&
                    getTermsAndConditionsCookies === "1") ||
                  role === "admin" ||
                  (editTermsAndConditionsCookies === "1" &&
                    getTermsAndConditionsCookies === "1")) &&
                  toggle.toggleColumns.control && (
                    <th className="table-th">{t("action")}</th>
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
                      addTermsAndConditionsCookies === "0" &&
                      editTermsAndConditionsCookies === "0" &&
                      deleteTermsAndConditionsCookies === "0"
                        ? 3
                        : 4
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
                      addTermsAndConditionsCookies === "0" &&
                      editTermsAndConditionsCookies === "0" &&
                      deleteTermsAndConditionsCookies === "0"
                        ? 3
                        : 4
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
                      addTermsAndConditionsCookies === "0" &&
                      editTermsAndConditionsCookies === "0" &&
                      deleteTermsAndConditionsCookies === "0"
                        ? 3
                        : 4
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
                      addTermsAndConditionsCookies === "0" &&
                      editTermsAndConditionsCookies === "0" &&
                      deleteTermsAndConditionsCookies === "0"
                        ? 3
                        : 4
                    }
                  >
                    <p className="no-data no-columns mb-0">{t("noColumns")}</p>
                  </td>
                </tr>
              </tbody>
            )}
            {/* Data */}
            {searchResults?.length > 0 &&
              error === null &&
              loading === false && (
                <tbody>
                  {searchResults?.map((result, idx) => (
                    <tr key={result?.id + new Date().getDate()}>
                      {toggle.toggleColumns?.id && (
                        <td className="table-td">{idx + 1}#</td>
                      )}
                      {toggle.toggleColumns?.title && (
                        <td className="table-td title">
                          {lng === "ar" ? result?.title : result?.title_en}
                        </td>
                      )}
                      {toggle.toggleColumns?.text && (
                        <td className="table-td text">
                          {lng === "ar" ? result?.text : result?.text_en}
                        </td>
                      )}
                      {(role === "admin" ||
                        (addTermsAndConditionsCookies === "1" &&
                          getTermsAndConditionsCookies === "1") ||
                        role === "admin" ||
                        (editTermsAndConditionsCookies === "1" &&
                          getTermsAndConditionsCookies === "1")) &&
                        toggle.toggleColumns?.control && (
                          <td className="table-td">
                            <span className="table-btn-container">
                              {(role === "admin" ||
                                editTermsAndConditionsCookies === "1") && (
                                <FaEdit
                                  className="edit-btn"
                                  onClick={() => {
                                    handleEdit(result);
                                  }}
                                />
                              )}
                              {(role === "admin" ||
                                deleteTermsAndConditionsCookies === "1") && (
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
          (addTermsAndConditionsCookies === "1" &&
            getTermsAndConditionsCookies === "1")) && (
          <>
            {/* Add Terms And Conditions */}
            <Modal
              isOpen={toggle.add}
              toggle={() => {
                setToggle({
                  ...toggle,
                  add: !toggle.add,
                  isBookCategories: false,
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
                {t("settings.termsAndConditions.addTitle")}
                <IoMdClose
                  onClick={() => {
                    setToggle({
                      ...toggle,
                      add: !toggle.add,
                      isBookCategories: !toggle.isBookCategories,
                    });
                    formik.handleReset();
                  }}
                />
              </ModalHeader>
              <ModalBody>
                <form className="overlay-form" onSubmit={formik.handleSubmit}>
                  <Row className="d-flex flex-row-reverse justify-content-between align-items-center gap-lg-0 gap-3 p-3 pb-0">
                    <Col lg={6}>
                      <div className="form-group mb-3">
                        <input
                          type="text"
                          className="form-control"
                          id="title"
                          name="title"
                          placeholder={t(
                            "settings.termsAndConditions.columns.ar.title"
                          )}
                          onChange={handleInputChange}
                        />
                        <label htmlFor="title" className="label-form">
                          {t("settings.termsAndConditions.columns.ar.title")}
                        </label>
                      </div>
                      <div className="error-container">
                        {formik.errors.title && formik.touched.title && (
                          <p className="error">{formik.errors.title}</p>
                        )}
                      </div>
                    </Col>
                    {/* <Col lg={6} className="mb-3">
                      <div className="form-group mb-4">
                        <input
                          type="text"
                          className="form-control"
                          id="country"
                          name="country"
                          placeholder={t(
                            "settings.termsAndConditions.columns.ar.country"
                          )}
                          value={formik.values.country}
                          onChange={handleInputChange}
                        />
                        <label htmlFor="country" className="label-form">
                          {t("settings.termsAndConditions.columns.ar.country")}
                        </label>
                      </div>
                      <div className="error-container">
                        {formik.errors.country && formik.touched.country && (
                          <p className="error">{formik.errors.country}</p>
                        )}
                      </div>
                    </Col> */}
                    <Col lg={6}>
                      <div className="form-group mb-3">
                        <input
                          type="text"
                          className="form-control"
                          id="title_en"
                          name="title_en"
                          placeholder={t(
                            "settings.termsAndConditions.columns.en.title"
                          )}
                          onChange={handleInputChange}
                        />
                        <label htmlFor="title_en" className="label-form">
                          {t("settings.termsAndConditions.columns.en.title")}
                        </label>
                      </div>
                      <div className="error-container">
                        {formik.errors.title_en && formik.touched.title_en && (
                          <p className="error">{formik.errors.title_en}</p>
                        )}
                      </div>
                    </Col>
                  </Row>
                  <Row className="d-flex flex-row-reverse justify-content-between align-items-center gap-lg-0 gap-3 p-3 pb-0">
                    {/* <Col lg={6} className="mb-3">
                      <div className="form-group mb-4">
                        <input
                          type="text"
                          className="form-control"
                          id="country_en"
                          name="country_en"
                          placeholder={t(
                            "settings.termsAndConditions.columns.en.country"
                          )}
                          value={formik.values.country_en}
                          onChange={handleInputChange}
                        />
                        <label htmlFor="country_en" className="label-form">
                          {t("settings.termsAndConditions.columns.en.country")}
                        </label>
                      </div>
                      <div className="error-container">
                        {formik.errors.country_en &&
                          formik.touched.country_en && (
                            <p className="error">{formik.errors.country_en}</p>
                          )}
                      </div>
                    </Col> */}
                    <Col lg={6}>
                      <div className="form-group mb-3">
                        <textarea
                          className="form-control"
                          id="text"
                          name="text"
                          placeholder={t(
                            "settings.termsAndConditions.columns.ar.text"
                          )}
                          value={formik.values.text}
                          onChange={handleInputChange}
                        />
                        <label htmlFor="text" className="label-form">
                          {t("settings.termsAndConditions.columns.ar.text")}
                        </label>
                      </div>
                      <div className="error-container">
                        {formik.errors.text && formik.touched.text && (
                          <p className="error">{formik.errors.text}</p>
                        )}
                      </div>
                    </Col>
                    <Col lg={6}>
                      <div className="form-group mb-3">
                        <textarea
                          className="form-control"
                          id="text_en"
                          name="text_en"
                          placeholder={t(
                            "settings.termsAndConditions.columns.en.text"
                          )}
                          value={formik.values.text_en}
                          onChange={handleInputChange}
                        />
                        <label htmlFor="text_en" className="label-form">
                          {t("settings.termsAndConditions.columns.en.text")}
                        </label>
                      </div>
                      <div className="error-container">
                        {formik.errors.text_en && formik.touched.text_en && (
                          <p className="error">{formik.errors.text_en}</p>
                        )}
                      </div>
                    </Col>
                  </Row>
                  <Row className="d-flex flex-row-reverse justify-content-between align-items-center p-3 pb-0">
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
          (editTermsAndConditionsCookies === "1" &&
            getTermsAndConditionsCookies === "1")) && (
          <>
            {/* Edit Terms And Conditions */}
            <Modal
              isOpen={toggle.edit}
              toggle={() => {
                setToggle({
                  ...toggle,
                  edit: !toggle.edit,
                  isBookCategories: false,
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
                    isBookCategories: !toggle.isBookCategories,
                  });
                  formik.handleReset();
                }}
              >
                {t("settings.termsAndConditions.editTitle")}
                <IoMdClose
                  onClick={() => {
                    setToggle({
                      ...toggle,
                      edit: !toggle.edit,
                      isBookCategories: !toggle.isBookCategories,
                    });
                    formik.handleReset();
                  }}
                />
              </ModalHeader>
              <ModalBody>
                <form className="overlay-form" onSubmit={formik.handleSubmit}>
                  <Row className="d-flex flex-row-reverse justify-content-between align-items-center gap-lg-0 gap-3 p-3 pb-0">
                    <Col lg={6}>
                      <div className="form-group mb-3">
                        <input
                          type="text"
                          className="form-control"
                          id="title"
                          name="title"
                          value={formik.values.title}
                          placeholder={t(
                            "settings.termsAndConditions.columns.ar.title"
                          )}
                          onChange={handleInputChange}
                        />
                        <label htmlFor="title" className="label-form">
                          {t("settings.termsAndConditions.columns.ar.title")}
                        </label>
                      </div>
                      <div className="error-container">
                        {formik.errors.title && formik.touched.title && (
                          <p className="error">{formik.errors.title}</p>
                        )}
                      </div>
                    </Col>
                    <Col lg={6}>
                      <div className="form-group mb-3">
                        <input
                          type="text"
                          className="form-control"
                          id="title_en"
                          name="title_en"
                          value={formik.values.title_en}
                          placeholder={t(
                            "settings.termsAndConditions.columns.en.title"
                          )}
                          onChange={handleInputChange}
                        />
                        <label htmlFor="title_en" className="label-form">
                          {t("settings.termsAndConditions.columns.en.title")}
                        </label>
                      </div>
                      <div className="error-container">
                        {formik.errors.title_en && formik.touched.title_en && (
                          <p className="error">{formik.errors.title_en}</p>
                        )}
                      </div>
                    </Col>
                  </Row>
                  <Row className="d-flex flex-row-reverse justify-content-between align-items-center gap-lg-0 gap-3 p-3 pb-0">
                    <Col lg={6}>
                      <div className="form-group mb-3">
                        <textarea
                          className="form-control"
                          id="text"
                          name="text"
                          placeholder={t(
                            "settings.termsAndConditions.columns.ar.text"
                          )}
                          value={formik.values.text}
                          onChange={handleInputChange}
                        />
                        <label htmlFor="text" className="label-form">
                          {t("settings.termsAndConditions.columns.ar.text")}
                        </label>
                      </div>
                      <div className="error-container">
                        {formik.errors.text && formik.touched.text && (
                          <p className="error">{formik.errors.text}</p>
                        )}
                      </div>
                    </Col>
                    <Col lg={6}>
                      <div className="form-group mb-3">
                        <textarea
                          className="form-control"
                          id="text_en"
                          name="text_en"
                          placeholder={t(
                            "settings.termsAndConditions.columns.en.text"
                          )}
                          value={formik.values.text_en}
                          onChange={handleInputChange}
                        />
                        <label htmlFor="text_en" className="label-form">
                          {t("settings.termsAndConditions.columns.en.text")}
                        </label>
                      </div>
                      <div className="error-container">
                        {formik.errors.text_en && formik.touched.text_en && (
                          <p className="error">{formik.errors.text_en}</p>
                        )}
                      </div>
                    </Col>
                  </Row>
                  <Row className="d-flex flex-row-reverse justify-content-between align-items-center p-3 pt-0">
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
                            t("edit")
                          )}
                        </button>
                        <button
                          type="button"
                          className="cancel-btn"
                          onClick={() => {
                            setToggle({
                              ...toggle,
                              add: false,
                              edit: false,
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
        {/* Pagination */}
        {searchResults?.length > 0 && error === null && loading === false && (
          <PaginationUI />
        )}
      </div>
      {/* <div className="scholar-container mt-5 mb-5 m-3">
        <div className="table-header justify-content-center">
          <h3
            className="title"
            style={{
              color: "var(--main-color)",
              fontWeight: "bold",
              fontSize: "1.5rem",
            }}
          >
            {t("settings.termsAndConditions.title")}
          </h3>
        </div>
        <div
          className="profile"
          style={{
            boxShadow: "none",
          }}
        >
          <div className="profile-header d-flex justify-content-end align-items-start">
            <h3
              className="title"
              style={{
                color: "var(--main-color)",
                fontWeight: "bold",
                fontSize: "1.25rem",
              }}
            >
              الشرط الاول
            </h3>
          </div>
          <div className="profile-body">
            <p>الشرط الاول</p>
          </div>
        </div>
      </div> */}
    </>
  );
};

export default TermsAndConditions;
