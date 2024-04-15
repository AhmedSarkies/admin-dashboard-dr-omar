import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Col,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
  Row,
  Spinner,
} from "reactstrap";
import { MdAdd, MdDeleteOutline } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";
import { ImUpload } from "react-icons/im";
import {
  getSlidersApi,
  addSliderApi,
  updateSliderApi,
  deleteSliderApi,
} from "../../store/slices/sliderSlice";
import { useFormik } from "formik";
import Swal from "sweetalert2";
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { useFiltration, useSchema } from "../../hooks";
import anonymous from "../../assets/images/anonymous.png";
import Cookies from "js-cookie";

const Slider = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { validationSchema } = useSchema();
  const { sliders, loading, error } = useSelector((state) => state.slider);
  const [toggle, setToggle] = useState({
    add: false,
    edit: false,
    imagePreview: false,
    status: false,
    elders: false,
    pictureCategories: false,
    activeColumn: false,
    toggleColumns: {
      image: true,
      title: true,
      description: true,
      order: true,
      status: true,
      control: true,
    },
    sortColumn: "",
    sortOrder: "asc",
    rowsPerPage: 5,
    currentPage: 1,
  });
  const lng = Cookies.get("i18next") || "ar";
  // Change Language
  useEffect(() => {
    document.documentElement.lang = lng;
  }, [lng]);

  // Filtration, Sorting, Pagination
  const {
    PaginationUI,
    handleSort,
    handleSearch,
    handleToggleColumns,
    searchResults,
  } = useFiltration({
    rowData: sliders,
    toggle,
    setToggle,
  });
  // Columns
  const columns = [
    { id: 1, name: "image", label: t("settings.slider.columns.image") },
    { id: 2, name: "title", label: t("settings.slider.columns.title.title") },
    {
      id: 3,
      name: "description",
      label: t("settings.slider.columns.description.description"),
    },
    // { id: 4, name: "order", label: t("settings.slider.columns.order") },
    // { id: 5, name: "status", label: t("status") },
    { id: 4, name: "control", label: t("action") },
  ];

  // Formik
  const formik = useFormik({
    initialValues: {
      image: {
        file: "",
        preview: "",
      },
      titleAr: "",
      titleEn: "",
      order: "",
      status: "",
      descriptionAr: "",
      descriptionEn: "",
    },
    validationSchema: validationSchema.slider,
    onSubmit: (values) => {
      const formData = new FormData();
      formData.append("titleAr", values.titleAr);
      formData.append("bodyAr", values.descriptionAr);
      formData.append("titleEn", values.titleEn);
      formData.append("bodyEn", values.descriptionEn);
      if (values.image.file !== "") {
        formData.append("image", values.image.file);
      }
      if (values.id) {
        formData.append("id", values.id);
        dispatch(updateSliderApi(formData)).then((res) => {
          if (!res.error) {
            setToggle({
              ...toggle,
              edit: !toggle.edit,
            });
            formik.handleReset();
            toast.success(t("toast.slider.updatedSuccess"));
            dispatch(getSlidersApi());
          } else {
            toast.error(t("toast.slider.updatedError"));
          }
        });
      } else {
        dispatch(addSliderApi(formData)).then((res) => {
          if (!res.error) {
            setToggle({
              ...toggle,
              add: !toggle.add,
            });
            formik.handleReset();
            toast.success(t("toast.slider.addedSuccess"));
            dispatch(getSlidersApi());
          } else {
            toast.error(t("toast.slider.addedError"));
          }
        });
      }
    },
  });

  // Handle Image Change
  const handleImageChange = (e) => {
    const file = e.currentTarget.files[0];
    if (file) {
      formik.setFieldValue("image", {
        file: file,
        preview: URL.createObjectURL(file),
      });
    }
  };

  // Handle Edit Picture
  const handleEdit = (slider) => {
    formik.setValues({
      ...formik.values,
      id: slider.id,
      titleAr: slider.titleAr,
      titleEn: slider.titleEn,
      descriptionAr: slider.bodyAr,
      descriptionEn: slider.bodyEn,
      image: {
        file: "",
        preview: slider.image,
      },
    });
    setToggle({
      ...toggle,
      edit: !toggle.edit,
    });
  };

  // Delete Picture
  const handleDelete = (picture) => {
    Swal.fire({
      title: t("titleDeleteAlert") + picture?.title + "?",
      text: t("textDeleteAlert"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#0d1d34",
      confirmButtonText: t("confirmButtonText"),
      cancelButtonText: t("cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteSliderApi(picture?.id)).then((res) => {
          if (!res.error) {
            dispatch(getSlidersApi());
            Swal.fire({
              title: `${t("titleDeletedSuccess")} ${picture?.title}`,
              text: `${t("titleDeletedSuccess")} ${picture?.title} ${t(
                "textDeletedSuccess"
              )}`,
              icon: "success",
              confirmButtonColor: "#0d1d34",
              confirmButtonText: t("doneDeletedSuccess"),
            }).then(() => toast.success(t("toast.slider.deletedSuccess")));
          } else {
            toast.error(t("toast.slider.deletedError"));
          }
        });
      }
    });
  };

  // get data from api
  useEffect(() => {
    try {
      dispatch(getSlidersApi());
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
          {t("settings.slider.addTitle")}
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
              {/* Show and Hide Columns */}
              {toggle.toggleColumns.image && (
                <th className="table-th" onClick={() => handleSort(columns[0])}>
                  {t("settings.slider.columns.image")}
                  {toggle.sortColumn === columns[0].name ? (
                    toggle.sortOrder === "asc" ? (
                      <TiArrowSortedUp />
                    ) : (
                      <TiArrowSortedDown />
                    )
                  ) : null}
                </th>
              )}
              {toggle.toggleColumns.title && (
                <th className="table-th" onClick={() => handleSort(columns[1])}>
                  {t("settings.slider.columns.title.title")}
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
                <th className="table-th" onClick={() => handleSort(columns[2])}>
                  {t("settings.slider.columns.description.description")}
                  {toggle.sortColumn === columns[2].name ? (
                    toggle.sortOrder === "asc" ? (
                      <TiArrowSortedUp />
                    ) : (
                      <TiArrowSortedDown />
                    )
                  ) : null}
                </th>
              )}
              {/* {toggle.toggleColumns.order && (
                <th className="table-th" onClick={() => handleSort(columns[3])}>
                  {t("settings.slider.columns.order")}
                  {toggle.sortColumn === columns[3].name ? (
                    toggle.sortOrder === "asc" ? (
                      <TiArrowSortedUp />
                    ) : (
                      <TiArrowSortedDown />
                    )
                  ) : null}
                </th>
              )}
              {toggle.toggleColumns.status && (
                <th className="table-th" onClick={() => handleSort(columns[4])}>
                  {t("status")}
                  {toggle.sortColumn === columns[4].name ? (
                    toggle.sortOrder === "asc" ? (
                      <TiArrowSortedUp />
                    ) : (
                      <TiArrowSortedDown />
                    )
                  ) : null}
                </th>
              )} */}
              {toggle.toggleColumns.control && (
                <th className="table-th">{t("action")}</th>
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
          {searchResults?.length === 0 && error === null && !loading && (
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
          {searchResults?.length > 0 && error === null && loading === false && (
            <tbody>
              {searchResults?.map((result) => (
                <tr key={result?.id + new Date().getDate()}>
                  {toggle.toggleColumns.image && (
                    <td className="table-td">
                      <img
                        src={result?.image === "" ? anonymous : result?.image}
                        alt="scholar"
                        className="scholar-img"
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "cover",
                        }}
                      />
                    </td>
                  )}
                  {toggle.toggleColumns.title && (
                    <td className="table-td">{result?.title}</td>
                  )}
                  {toggle.toggleColumns.description && (
                    <td className="table-td">{result?.body}</td>
                  )}
                  {/* {toggle.toggleColumns.order && (
                    <td className="table-td">{result?.order}</td>
                  )}
                  {toggle.toggleColumns.status && (
                    <td className="table-td">
                      <span
                        className="table-status badge"
                        style={{
                          backgroundColor:
                            result?.status === "Public"
                              ? "green"
                              : result?.status === "Private"
                              ? "red"
                              : "red",
                        }}
                      >
                        {result?.status === "Public"
                          ? t("public")
                          : result?.status === "Private"
                          ? t("private")
                          : t("private")}
                      </span>
                    </td>
                  )} */}
                  {toggle.toggleColumns.control && (
                    <td className="table-td">
                      <span className="table-btn-container">
                        <FaEdit
                          className="edit-btn"
                          onClick={() => {
                            handleEdit(result);
                            setToggle({
                              ...toggle,
                              add: !toggle.add,
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
      {/* Add Slider */}
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
          {formik.values.id
            ? t("settings.slider.editTitle")
            : t("settings.slider.addTitle")}
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
            <Row className="d-flex justify-content-center align-items-center mb-3">
              <Col
                lg={5}
                className="d-flex flex-column justify-content-center align-items-center"
              >
                <div className="image-preview-container d-flex justify-content-center align-items-center">
                  <label
                    htmlFor={formik.values.image.preview ? "" : "image"}
                    className="form-label d-flex justify-content-center align-items-center"
                  >
                    <img
                      src={
                        formik.values.image && formik.values.image.preview
                          ? formik.values.image.preview
                          : anonymous
                      }
                      alt="avatar"
                      className="image-preview"
                      onClick={() =>
                        formik.values.image && formik.values.image.preview
                          ? setToggle({
                              ...toggle,
                              imagePreview: !toggle.imagePreview,
                            })
                          : ""
                      }
                    />
                    <Modal
                      isOpen={toggle.imagePreview}
                      toggle={() =>
                        setToggle({
                          ...toggle,
                          imagePreview: !toggle.imagePreview,
                        })
                      }
                      centered={true}
                      keyboard={true}
                      size={"md"}
                      contentClassName="modal-preview-image modal-add-scholar"
                    >
                      <ModalHeader
                        toggle={() =>
                          setToggle({
                            ...toggle,
                            imagePreview: !toggle.imagePreview,
                          })
                        }
                      >
                        <IoMdClose
                          onClick={() =>
                            setToggle({
                              ...toggle,
                              imagePreview: !toggle.imagePreview,
                            })
                          }
                        />
                      </ModalHeader>
                      <ModalBody className="d-flex flex-wrap justify-content-center align-items-center">
                        <img
                          src={
                            formik.values.image && formik.values.image.preview
                              ? formik.values.image.preview
                              : anonymous
                          }
                          alt="avatar"
                          className="image-preview"
                        />
                      </ModalBody>
                      <ModalFooter className="p-md-4 p-2">
                        <div className="form-group-container d-flex justify-content-center align-items-center">
                          <button
                            className="delete-btn cancel-btn"
                            onClick={() => {
                              setToggle({
                                ...toggle,
                                imagePreview: !toggle.imagePreview,
                              });
                              formik.setFieldValue("image", {
                                file: "",
                                preview: "",
                              });
                            }}
                          >
                            {t("delete")}
                          </button>
                        </div>
                      </ModalFooter>
                    </Modal>
                  </label>
                </div>
                <div className="form-group-container d-flex justify-content-lg-start justify-content-center flex-row-reverse">
                  <label htmlFor="image" className="form-label">
                    <ImUpload /> {t("chooseImage")}
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    className="form-input form-img-input"
                    id="image"
                    onChange={handleImageChange}
                  />
                </div>
                {formik.errors.image && formik.touched.image ? (
                  <span className="error text-center">
                    {formik.errors.image}
                  </span>
                ) : null}
              </Col>
            </Row>
            <Row className="d-flex justify-content-center align-items-center ps-3 pe-3">
              <Col lg={6}>
                <div
                  className="form-group-container d-flex flex-column align-items-end mb-3"
                  style={{ marginTop: "-4px" }}
                >
                  <label htmlFor="titleAr" className="form-label">
                    {t("settings.slider.columns.title.ar")}
                  </label>
                  <input
                    type="text"
                    className="form-input w-100"
                    id="titleAr"
                    placeholder={t("settings.slider.columns.title.ar")}
                    name="titleAr"
                    value={formik.values.titleAr}
                    onChange={formik.handleChange}
                  />
                  {formik.errors.titleAr && formik.touched.titleAr ? (
                    <span className="error">{formik.errors.titleAr}</span>
                  ) : null}
                </div>
              </Col>
              <Col lg={6}>
                <div
                  className="form-group-container d-flex flex-column align-items-end mb-3"
                  style={{ marginTop: "-4px" }}
                >
                  <label htmlFor="titleEn" className="form-label">
                    {t("settings.slider.columns.title.en")}
                  </label>
                  <input
                    type="text"
                    className="form-input w-100"
                    id="titleEn"
                    placeholder={t("settings.slider.columns.title.en")}
                    name="titleEn"
                    value={formik.values.titleEn}
                    onChange={formik.handleChange}
                  />
                  {formik.errors.titleEn && formik.touched.titleEn ? (
                    <span className="error">{formik.errors.titleEn}</span>
                  ) : null}
                </div>
              </Col>
            </Row>
            <Row className="d-flex justify-content-center align-items-center ps-3 pe-3 mb-3">
              <Col lg={6}>
                <div className="form-group-container d-flex flex-column align-items-end gap-3 mt-3">
                  <label htmlFor="descriptionAr" className="form-label">
                    {t("settings.slider.columns.description.ar")}
                  </label>
                  <textarea
                    className="form-input"
                    id="descriptionAr"
                    placeholder={t("settings.slider.columns.description.ar")}
                    name="descriptionAr"
                    value={formik.values.descriptionAr}
                    onChange={formik.handleChange}
                  ></textarea>
                  {formik.errors.descriptionAr &&
                  formik.touched.descriptionAr ? (
                    <span className="error">{formik.errors.descriptionAr}</span>
                  ) : null}
                </div>
              </Col>
              <Col lg={6}>
                <div className="form-group-container d-flex flex-column align-items-end gap-3 mt-3">
                  <label htmlFor="descriptionEn" className="form-label">
                    {t("settings.slider.columns.description.en")}
                  </label>
                  <textarea
                    className="form-input"
                    id="descriptionEn"
                    placeholder={t("settings.slider.columns.description.en")}
                    name="descriptionEn"
                    value={formik.values.descriptionEn}
                    onChange={formik.handleChange}
                  ></textarea>
                  {formik.errors.descriptionEn &&
                  formik.touched.descriptionEn ? (
                    <span className="error">{formik.errors.descriptionEn}</span>
                  ) : null}
                </div>
              </Col>
            </Row>
            <Row className="d-flex justify-content-center align-items-center ps-3 pe-3 mb-3">
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
                    ) : formik.values.id ? (
                      t("edit")
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
      {/* Pagination */}
      {searchResults?.length > 0 && error === null && loading === false && (
        <PaginationUI />
      )}
    </div>
  );
};

export default Slider;
