import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Col, Modal, ModalBody, ModalHeader, Row, Spinner } from "reactstrap";
import { MdAdd, MdDeleteOutline } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import {
  getPicturesCategoriesApi,
  addPictureCategoryApi,
  updatePictureCategoryApi,
  deletePictureCategoryApi,
  getPicturesCategories,
} from "../../store/slices/pictureSlice";
import { useFormik } from "formik";
import Swal from "sweetalert2";
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";
import { useFiltration, useSchema } from "../../hooks";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

const CategoriesImages = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { validationSchema } = useSchema();
  const { pictureCategories, loading, error } = useSelector(
    (state) => state.picture
  );
  const [toggle, setToggle] = useState({
    add: false,
    edit: false,
    activeColumn: false,
    toggleColumns: {
      title: true,
      control: true,
    },
    sortColumn: "",
    sortOrder: "asc",
    rowsPerPage: 5,
    currentPage: 1,
  });

  // Filtration, Sorting, Pagination
  // Columns
  const columns = [
    { id: 0, name: "title", label: t("categories.columns.category") },
    { id: 1, name: "control", label: t("action") },
  ];
  const {
    PaginationUI,
    handleSort,
    handleSearch,
    handleToggleColumns,
    searchResults,
  } = useFiltration({
    rowData: pictureCategories,
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
      if (values.isEditing) {
        dispatch(
          updatePictureCategoryApi({ id: values.id, title: values.title })
        ).then((res) => {
          if (!res.error) {
            setToggle({
              ...toggle,
              edit: !toggle.edit,
            });
            formik.handleReset();
            toast.success(t("toast.category.updatedSuccess"));
            dispatch(getPicturesCategoriesApi());
          } else {
            toast.error(t("toast.category.updatedError"));
            dispatch(getPicturesCategoriesApi());
          }
        });
      } else {
        dispatch(addPictureCategoryApi(values)).then((res) => {
          if (!res.error) {
            setToggle({
              ...toggle,
              add: !toggle.add,
            });
            formik.handleReset();
            toast.success(t("toast.category.addedSuccess"));
            dispatch(getPicturesCategoriesApi());
          } else {
            toast.error(t("toast.category.addedError"));
            dispatch(getPicturesCategoriesApi());
          }
        });
      }
    },
  });

  // Handle Edit Picture Category
  const handleEdit = (pictureCategory) => {
    formik.setValues({ ...pictureCategory, isEditing: true });
    setToggle({
      ...toggle,
      edit: !toggle.edit,
    });
  };

  // Delete Picture Category
  const handleDelete = (pictureCategory) => {
    Swal.fire({
      title: t("titleDeleteAlert") + pictureCategory?.title + "?",
      text: t("textDeleteAlert"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#0d1d34",
      confirmButtonText: t("confirmButtonText"),
      cancelButtonText: t("cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deletePictureCategoryApi(pictureCategory?.id)).then((res) => {
          if (!res.error) {
            dispatch(getPicturesCategoriesApi());
            Swal.fire({
              title: `${t("titleDeletedSuccess")} ${pictureCategory?.title}`,
              text: `${t("titleDeletedSuccess")} ${pictureCategory?.title} ${t(
                "textDeletedSuccess"
              )}`,
              icon: "success",
              confirmButtonColor: "#0d1d34",
              confirmButtonText: t("doneDeletedSuccess"),
            }).then(() => toast.success(t("toast.category.deletedSuccess")));
          } else {
            dispatch(getPicturesCategoriesApi());
            toast.error(t("toast.category.deletedError"));
          }
        });
      }
    });
  };

  // get data from api
  useEffect(() => {
    try {
      dispatch(getPicturesCategoriesApi()).then((res) => {
        if (!res.error) {
          dispatch(getPicturesCategories(res.payload));
        }
      });
    } catch (error) {
      console.log(error);
    }
  }, [dispatch]);

  return (
    <div className="scholar-container mt-4 m-sm-3 m-0">
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
      <div className="scholar">
        <div className="table-header">
          {/* Search */}
          <div className="search-container form-group-container form-input"
          style={{
              width: "30%",
            }}
          >
            <input
              type="text"
              className="form-input"
              placeholder={t("searchCategoryImage")}
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
              {toggle.toggleColumns.title && (
                <th className="table-th" onClick={() => handleSort(columns[0])}>
                  {t("categories.columns.category")}
                  {toggle.sortColumn === columns[0].name ? (
                    toggle.sortOrder === "asc" ? (
                      <TiArrowSortedUp />
                    ) : (
                      <TiArrowSortedDown />
                    )
                  ) : null}
                </th>
              )}
              {toggle.toggleColumns.control && (
                <th className="table-th" onClick={() => handleSort(columns[1])}>
                  {t("action")}
                  {toggle.sortColumn === columns[1].name ? (
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
                <td className="table-td" colSpan="2">
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
          {searchResults?.length === 0 && error === null && !loading && (
            <tbody>
              <tr className="no-data-container">
                <td className="table-td" colSpan="2">
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
                <td className="table-td" colSpan="2">
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
                  {toggle.toggleColumns?.title && (
                    <td className="table-td name">{result?.title}</td>
                  )}
                  {toggle.toggleColumns.control && (
                    <td className="table-td">
                      <span className="table-btn-container">
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
      {/* Add Picture Category */}
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
              <Col lg={12} className="mb-5">
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
      {/* Edit Picture Category */}
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
              <Col lg={12} className="mb-5">
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
      {searchResults.length > 0 && error === null && loading === false && (
        <PaginationUI />
      )}
    </div>
  );
};

export default CategoriesImages;
