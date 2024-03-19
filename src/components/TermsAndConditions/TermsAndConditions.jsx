import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Col, Modal, ModalBody, ModalHeader, Row, Spinner } from "reactstrap";
import { MdAdd, MdDeleteOutline } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import {
  getCodeContentsApi,
  getCodeContents,
  deleteCodeContentApi,
  deleteCodeContent,
} from "../../store/slices/codeContentSlice";
import Swal from "sweetalert2";
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";
import { toast } from "react-toastify";
import { useFiltration } from "../../hooks";
import Cookies from "js-cookie";

const TermsAndConditions = () => {
  const { t } = useTranslation();
  const formik = useFormik({
    initialValues: {},
    onSubmit: (values) => {
      console.log(values);
    },
  });
  const dispatch = useDispatch();
  const { codeContent, loading, error } = useSelector(
    (state) => state.codeContent
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
      title: true,
      country: true,
      description: true,
      control: true,
    },
  });
  const lng = Cookies.get("i18next") || "ar";

  useEffect(() => {
    document.documentElement.lang = lng;
  }, [lng]);
  // Filtration, Sorting, Pagination
  // Columns
  const columns = [
    {
      id: 1,
      name: "title",
      label: t("settings.termsAndConditions.columns.title"),
    },
    {
      id: 2,
      name: "country",
      label: t("settings.termsAndConditions.columns.country"),
    },
    {
      id: 3,
      name: "description",
      label: t("settings.termsAndConditions.columns.description"),
    },
    { id: 4, name: "control", label: t("action") },
  ];
  const {
    PaginationUI,
    handleSort,
    handleSearch,
    handleToggleColumns,
    results,
  } = useFiltration({
    rowData: codeContent,
    toggle,
    setToggle,
  });

  const handleInputChange = (e) => {
    formik.handleChange(e);
  };

  // Handle Edit Book Category
  const handleEdit = (bookSubCategory) => {
    formik.setValues({ ...bookSubCategory, isEditing: true });
    setToggle({
      ...toggle,
      edit: !toggle.edit,
    });
  };

  // Delete Book Category
  const handleDelete = (bookSubCategory) => {
    Swal.fire({
      title: t("titleDeleteAlert") + bookSubCategory?.title + "?",
      text: t("textDeleteAlert"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#0d1d34",
      confirmButtonText: t("confirmButtonText"),
      cancelButtonText: t("cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteCodeContentApi(bookSubCategory?.id)).then((res) => {
          if (!res.error) {
            dispatch(deleteCodeContent(bookSubCategory?.id));
            Swal.fire({
              title: `${t("titleDeletedSuccess")} ${bookSubCategory?.title}`,
              text: `${t("titleDeletedSuccess")} ${bookSubCategory?.title} ${t(
                "textDeletedSuccess"
              )}`,
              icon: "success",
              confirmButtonColor: "#0d1d34",
              confirmButtonText: t("doneDeletedSuccess"),
            }).then(() => toast.success(t("toast.category.deletedSuccess")));
          } else {
            toast.error(t("toast.category.deletedError"));
          }
        });
      }
    });
  };

  // get data from api
  useEffect(() => {
    try {
      dispatch(getCodeContentsApi()).then((res) => {
        if (!res.error) {
          dispatch(getCodeContents(res.payload));
          dispatch(getCodeContentsApi()).then((res) => {
            if (!res.error && res.payload.length > 0) {
              dispatch(getCodeContents(res.payload));
            }
          });
        }
      });
    } catch (error) {
      console.log(error);
    }
  }, [dispatch]);

  return (
    <>
      <div className="scholar-container mt-4 m-3">
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
                style={{
                  width: "180px",
                }}
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
                {toggle.toggleColumns?.title && (
                  <th
                    className="table-th"
                    onClick={() => handleSort(columns[0])}
                  >
                    {t("settings.termsAndConditions.columns.title")}
                    {toggle.sortColumn === columns[0].name ? (
                      toggle.sortOrder === "asc" ? (
                        <TiArrowSortedUp />
                      ) : (
                        <TiArrowSortedDown />
                      )
                    ) : null}
                  </th>
                )}
                {toggle.toggleColumns?.country && (
                  <th
                    className="table-th"
                    onClick={() => handleSort(columns[1])}
                  >
                    {t("settings.termsAndConditions.columns.country")}
                    {toggle.sortColumn === columns[1].name ? (
                      toggle.sortOrder === "asc" ? (
                        <TiArrowSortedUp />
                      ) : (
                        <TiArrowSortedDown />
                      )
                    ) : null}
                  </th>
                )}
                {toggle.toggleColumns.description && (
                  <th
                    className="table-th"
                    onClick={() => handleSort(columns[2])}
                  >
                    {t("settings.termsAndConditions.columns.description")}
                    {toggle.sortColumn === columns[2].name ? (
                      toggle.sortOrder === "asc" ? (
                        <TiArrowSortedUp />
                      ) : (
                        <TiArrowSortedDown />
                      )
                    ) : null}
                  </th>
                )}
                {toggle.toggleColumns.control && (
                  <th
                    className="table-th"
                    onClick={() => handleSort(columns[3])}
                  >
                    {t("action")}
                    {toggle.sortColumn === columns[3].name ? (
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
                  <td className="table-td" colSpan="4">
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
                  <td className="table-td" colSpan="4">
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
                  <td className="table-td" colSpan="4">
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
                  <td className="table-td" colSpan="4">
                    <p className="no-data no-columns mb-0">{t("noColumns")}</p>
                  </td>
                </tr>
              </tbody>
            )}
            {/* Data */}
            {results?.length > 0 && error === null && loading === false && (
              <tbody>
                {results?.map((result) => (
                  <tr key={result?.id + new Date().getDate()}>
                    {toggle.toggleColumns?.title && (
                      <td className="table-td title">
                        {lng === "ar" ? result?.title.ar : result?.title.en}
                      </td>
                    )}
                    {toggle.toggleColumns?.country && (
                      <td className="table-td country">
                        {lng === "ar" ? result?.country.ar : result?.country.en}
                      </td>
                    )}
                    {toggle.toggleColumns?.description && (
                      <td className="table-td description">
                        {lng === "ar"
                          ? result?.description.ar
                          : result?.description.en}
                      </td>
                    )}
                    {toggle.toggleColumns?.control && (
                      <td className="table-td">
                        <span className="table-btn-container">
                          <FaEdit
                            className="edit-btn"
                            onClick={() => {
                              handleEdit(result);
                            }}
                          />
                          <MdDeleteOutline
                            className="delete-btn"
                            onClick={() => handleDelete(result)}
                          />
                        </span>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            )}
          </table>
        </div>
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
              <Row className="d-flex flex-row-reverse justify-content-between align-items-center p-3">
                <Col lg={6} className="mb-3">
                  <div className="form-group mb-4">
                    <input
                      type="text"
                      className="form-control"
                      id="arabicTitle"
                      name="arabicTitle"
                      placeholder={t(
                        "settings.termsAndConditions.columns.ar.title"
                      )}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="arabicTitle" className="label-form">
                      {t("settings.termsAndConditions.columns.ar.title")}
                    </label>
                  </div>
                  <div className="error-container">
                    {formik.errors.arabicTitle &&
                      formik.touched.arabicTitle && (
                        <p className="error">{formik.errors.arabicTitle}</p>
                      )}
                  </div>
                </Col>
                <Col lg={6} className="mb-3">
                  <div className="form-group mb-4">
                    <input
                      type="text"
                      className="form-control"
                      id="arabicCountry"
                      name="arabicCountry"
                      placeholder={t(
                        "settings.termsAndConditions.columns.ar.country"
                      )}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="arabicCountry" className="label-form">
                      {t("settings.termsAndConditions.columns.ar.country")}
                    </label>
                  </div>
                  <div className="error-container">
                    {formik.errors.arabicCountry &&
                      formik.touched.arabicCountry && (
                        <p className="error">{formik.errors.arabicCountry}</p>
                      )}
                  </div>
                </Col>
                <Col lg="12">
                  <div className="form-group mb-4">
                    <textarea
                      className="form-control"
                      id="arabicDescription"
                      name="arabicDescription"
                      placeholder={t(
                        "settings.termsAndConditions.columns.ar.description"
                      )}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="arabicDescription" className="label-form">
                      {t("settings.termsAndConditions.columns.ar.description")}
                    </label>
                  </div>
                  <div className="error-container">
                    {formik.errors.arabicDescription &&
                      formik.touched.arabicDescription && (
                        <p className="error">
                          {formik.errors.arabicDescription}
                        </p>
                      )}
                  </div>
                </Col>
                {/* <Col lg={6} className="mb-5">
                  <div className="form-group mb-4">
                    <input
                      type="text"
                      className="form-control"
                      id="englishTitle"
                      name="englishTitle"
                      placeholder={t(
                        "settings.termsAndConditions.columns.en.title"
                      )}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="englishTitle" className="label-form">
                      {t("settings.termsAndConditions.columns.en.title")}
                    </label>
                  </div>
                  <div className="error-container">
                    {formik.errors.englishTitle &&
                      formik.touched.englishTitle && (
                        <p className="error">{formik.errors.englishTitle}</p>
                      )}
                  </div>
                  <div className="form-group mb-4">
                    <textarea
                      className="form-control"
                      id="englishDescription"
                      name="englishDescription"
                      placeholder={t(
                        "settings.termsAndConditions.columns.en.description"
                      )}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="englishDescription" className="label-form">
                      {t("settings.termsAndConditions.columns.en.description")}
                    </label>
                  </div>
                  <div className="error-container">
                    {formik.errors.englishDescription &&
                      formik.touched.englishDescription && (
                        <p className="error">
                          {formik.errors.englishDescription}
                        </p>
                      )}
                  </div>
                </Col> */}
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
              });
              formik.handleReset();
            }}
          >
            {t("subCategoriesBooks.editTitle")}
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
              <Row className="d-flex flex-row-reverse justify-content-between align-items-center p-3">
                <Col lg={6} className="mb-3">
                  <div className="form-group mb-4">
                    <input
                      type="text"
                      className="form-control"
                      id="arabicTitle"
                      name="arabicTitle"
                      placeholder={t(
                        "settings.termsAndConditions.columns.ar.title"
                      )}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="arabicTitle" className="label-form">
                      {t("settings.termsAndConditions.columns.ar.title")}
                    </label>
                  </div>
                  <div className="error-container">
                    {formik.errors.arabicTitle &&
                      formik.touched.arabicTitle && (
                        <p className="error">{formik.errors.arabicTitle}</p>
                      )}
                  </div>
                </Col>
                <Col lg={6} className="mb-3">
                  <div className="form-group mb-4">
                    <input
                      type="text"
                      className="form-control"
                      id="arabicCountry"
                      name="arabicCountry"
                      placeholder={t(
                        "settings.termsAndConditions.columns.ar.country"
                      )}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="arabicCountry" className="label-form">
                      {t("settings.termsAndConditions.columns.ar.country")}
                    </label>
                  </div>
                  <div className="error-container">
                    {formik.errors.arabicCountry &&
                      formik.touched.arabicCountry && (
                        <p className="error">{formik.errors.arabicCountry}</p>
                      )}
                  </div>
                </Col>
                <Col lg="12">
                  <div className="form-group mb-4">
                    <textarea
                      className="form-control"
                      id="arabicDescription"
                      name="arabicDescription"
                      placeholder={t(
                        "settings.termsAndConditions.columns.ar.description"
                      )}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="arabicDescription" className="label-form">
                      {t("settings.termsAndConditions.columns.ar.description")}
                    </label>
                  </div>
                  <div className="error-container">
                    {formik.errors.arabicDescription &&
                      formik.touched.arabicDescription && (
                        <p className="error">
                          {formik.errors.arabicDescription}
                        </p>
                      )}
                  </div>
                </Col>
                {/* <Col lg={6} className="mb-5">
                  <div className="form-group mb-4">
                    <input
                      type="text"
                      className="form-control"
                      id="englishTitle"
                      name="englishTitle"
                      placeholder={t(
                        "settings.termsAndConditions.columns.en.title"
                      )}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="englishTitle" className="label-form">
                      {t("settings.termsAndConditions.columns.en.title")}
                    </label>
                  </div>
                  <div className="error-container">
                    {formik.errors.englishTitle &&
                      formik.touched.englishTitle && (
                        <p className="error">{formik.errors.englishTitle}</p>
                      )}
                  </div>
                  <div className="form-group mb-4">
                    <textarea
                      className="form-control"
                      id="englishDescription"
                      name="englishDescription"
                      placeholder={t(
                        "settings.termsAndConditions.columns.en.description"
                      )}
                      onChange={handleInputChange}
                    />
                    <label htmlFor="englishDescription" className="label-form">
                      {t("settings.termsAndConditions.columns.en.description")}
                    </label>
                  </div>
                  <div className="error-container">
                    {formik.errors.englishDescription &&
                      formik.touched.englishDescription && (
                        <p className="error">
                          {formik.errors.englishDescription}
                        </p>
                      )}
                  </div>
                </Col> */}
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
        {/* Pagination */}
        {results.length > 0 && error === null && loading === false && (
          <PaginationUI />
        )}
      </div>
      <div className="scholar-container mt-5 mb-5 m-3">
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
      </div>
    </>
  );
};

export default TermsAndConditions;
