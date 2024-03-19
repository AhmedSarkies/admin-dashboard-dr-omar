import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Col,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Spinner,
} from "reactstrap";
import anonymous from "../../assets/images/anonymous.png";
import { MdAdd, MdDeleteOutline } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { IoMdClose, IoMdEye } from "react-icons/io";
import {
  getSlidersApi,
  addSliderApi,
  updateSliderApi,
  deleteSliderApi,
  getSliders,
  addSlider,
  updateSlider,
  deleteSlider,
} from "../../store/slices/sliderSlice";
import { useFormik } from "formik";
import Swal from "sweetalert2";
import { ImUpload } from "react-icons/im";
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { useFiltration, useSchema } from "../../hooks";

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

  // Filtration, Sorting, Pagination
  const {
    PaginationUI,
    handleSort,
    handleSearch,
    handleToggleColumns,
    results,
  } = useFiltration({
    rowData: sliders,
    toggle,
    setToggle,
  });
  // Columns
  const columns = [
    { id: 1, name: "image", label: t("settings.slider.columns.image") },
    { id: 2, name: "title", label: t("settings.slider.columns.title") },
    {
      id: 3,
      name: "description",
      label: t("settings.slider.columns.description"),
    },
    { id: 4, name: "order", label: t("settings.slider.columns.order") },
    { id: 5, name: "status", label: t("status") },
    { id: 6, name: "control", label: t("action") },
  ];

  // Formik
  const formik = useFormik({
    initialValues: {
      image: {
        file: "",
        preview: "",
      },
      title: "",
      order: "",
      status: "",
      description: "",
    },
    validationSchema: validationSchema.slider,
    onSubmit: (values) => {
      const formData = new FormData();
      formData.append("status", values.status);
      formData.append("id", values.id);
      if (values.image.file !== "") {
        formData.append("image", values.image.file);
      }
      if (values.id) {
        dispatch(
          updateSliderApi({
            id: values.id,
            title: values.title,
            image: values.image.file,
            status: values.status,
          })
        ).then((res) => {
          if (!res.error) {
            dispatch(
              updateSlider({
                id: values.id,
                title: values.title,
                image: values.image.file,
                status: values.status,
              })
            );
            setToggle({
              ...toggle,
              edit: !toggle.edit,
            });
            formik.handleReset();
            toast.success(t("toast.image.updatedSuccess"));
          } else {
            toast.error(t("toast.image.updatedError"));
          }
        });
      } else {
        dispatch(addSliderApi(formData)).then((res) => {
          if (!res.error) {
            dispatch(
              addSlider({
                ...values,
                image: values.image.preview,
              })
            );
            setToggle({
              ...toggle,
              add: !toggle.add,
            });
            formik.handleReset();
            toast.success(t("toast.image.addedSuccess"));
          } else {
            toast.error(t("toast.image.addedError"));
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
  const handleEdit = (picture) => {
    formik.setValues({
      ...picture,
      image: picture?.image,
      status: picture?.status,
      pictureCategory: {
        title: picture?.pictureCategory?.title,
        id: picture?.pictureCategory?.id,
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
            dispatch(deleteSlider(picture?.id));
            Swal.fire({
              title: `${t("titleDeletedSuccess")} ${picture?.title}`,
              text: `${t("titleDeletedSuccess")} ${picture?.title} ${t(
                "textDeletedSuccess"
              )}`,
              icon: "success",
              confirmButtonColor: "#0d1d34",
              confirmButtonText: t("doneDeletedSuccess"),
            }).then(() => toast.success(t("toast.image.deletedSuccess")));
          } else {
            toast.error(t("toast.image.deletedError"));
          }
        });
      }
    });
  };

  // get data from api
  useEffect(() => {
    try {
      dispatch(getSlidersApi()).then((res) => {
        if (!res.error) {
          dispatch(getSliders(res.payload));
        }
      });
    } catch (error) {
      console.log(error);
    }
  }, [dispatch]);

  return (
    <div className="scholar-container mt-4 m-3">
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
                  {t("settings.slider.columns.title")}
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
                  {t("settings.slider.columns.description")}
                  {toggle.sortColumn === columns[2].name ? (
                    toggle.sortOrder === "asc" ? (
                      <TiArrowSortedUp />
                    ) : (
                      <TiArrowSortedDown />
                    )
                  ) : null}
                </th>
              )}
              {toggle.toggleColumns.order && (
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
              )}
              {toggle.toggleColumns.control && (
                <th className="table-th">{t("action")}</th>
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
          {results?.length === 0 && error === null && !loading && (
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
          {results?.length > 0 && error === null && loading === false && (
            <tbody>
              {results?.map((result) => (
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
                    <td className="table-td">{result?.description}</td>
                  )}
                  {toggle.toggleColumns.order && (
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
                  )}
                  {toggle.toggleColumns.control && (
                    <td className="table-td">
                      <span className="table-btn-container">
                        <IoMdEye />
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
          {t("settings.slider.addTitle")}
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
              <Col lg={7} className="mb-5">
                <div
                  className="form-group-container d-flex flex-column align-items-end mb-3"
                  style={{ marginTop: "-4px" }}
                >
                  <label htmlFor="title" className="form-label">
                    {t("settings.slider.columns.title")}
                  </label>
                  <input
                    type="text"
                    className="form-input w-100"
                    id="title"
                    placeholder={t("settings.slider.columns.title")}
                    name="title"
                    value={formik.values.title}
                    onChange={formik.handleChange}
                  />
                  {formik.errors.title && formik.touched.title ? (
                    <span className="error">{formik.errors.title}</span>
                  ) : null}
                </div>
                <div
                  className="form-group-container d-flex flex-column align-items-end mb-3"
                  style={{ marginTop: "-4px" }}
                >
                  <label htmlFor="order" className="form-label">
                    {t("settings.slider.columns.order")}
                  </label>
                  <input
                    type="text"
                    className="form-input w-100"
                    id="order"
                    placeholder={t("settings.slider.columns.order")}
                    name="order"
                    value={formik.values.order}
                    onChange={formik.handleChange}
                  />
                  {formik.errors.order && formik.touched.order ? (
                    <span className="error">{formik.errors.order}</span>
                  ) : null}
                </div>
                <div className="form-group-container d-flex flex-column justify-content-center align-items-end mb-3">
                  <label htmlFor="status" className="form-label">
                    {t("status")}
                  </label>
                  <div
                    className={`dropdown form-input ${
                      toggle.status ? "active" : ""
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setToggle({
                          ...toggle,
                          status: !toggle.status,
                        });
                      }}
                      className="dropdown-btn d-flex justify-content-between align-items-center"
                    >
                      {formik.values.status === "Private"
                        ? t("private")
                        : formik.values.status === "Public"
                        ? t("public")
                        : t("status")}
                      <TiArrowSortedUp
                        className={`dropdown-icon ${
                          toggle.status ? "active" : ""
                        }`}
                      />
                    </button>
                    <div
                      className={`dropdown-content ${
                        toggle.status ? "active" : ""
                      }`}
                    >
                      <button
                        type="button"
                        className={`item ${
                          formik.values.status === "Private" ? "active" : ""
                        }`}
                        value="Private"
                        name="status"
                        onClick={() => {
                          setToggle({
                            ...toggle,
                            status: !toggle.status,
                          });
                          formik.setFieldValue("status", "Private");
                        }}
                      >
                        {t("private")}
                      </button>
                      <button
                        type="button"
                        className={`item ${
                          formik.values.status === "Public" ? "active" : ""
                        }`}
                        value="Public"
                        name="status"
                        onClick={() => {
                          setToggle({
                            ...toggle,
                            status: !toggle.status,
                          });
                          formik.setFieldValue("status", "Public");
                        }}
                      >
                        {t("public")}
                      </button>
                    </div>
                  </div>
                  {formik.errors.status && formik.touched.status ? (
                    <span className="error">{formik.errors.status}</span>
                  ) : null}
                </div>
                <div className="form-group-container d-flex flex-column align-items-end gap-3 mt-3">
                  <label htmlFor="description" className="form-label">
                    {t("settings.slider.columns.description")}
                  </label>
                  <textarea
                    className="form-input"
                    id="description"
                    placeholder={t("settings.slider.columns.description")}
                    name="description"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                  ></textarea>
                  {formik.errors.description && formik.touched.description ? (
                    <span className="error">{formik.errors.description}</span>
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
      {/* Edit Slider  */}
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
          {t("settings.slider.editTitle")}
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
              <Col
                lg={5}
                className="d-flex flex-column justify-content-center align-items-center"
              >
                <Col
                  lg={12}
                  className="d-flex flex-column justify-content-center align-items-center"
                >
                  <div className="image-preview-container d-flex justify-content-center align-items-center">
                    <label
                      htmlFor={
                        formik.values.image.file === undefined
                          ? ""
                          : formik.values.image.file === ""
                          ? "image"
                          : ""
                      }
                      className="form-label d-flex justify-content-center align-items-center"
                    >
                      <img
                        src={
                          formik.values?.image?.preview
                            ? formik.values.image?.preview
                            : formik.values.image?.preview === undefined
                            ? formik.values.image
                            : anonymous
                        }
                        alt="avatar"
                        className="image-preview"
                        style={{
                          width: "90px",
                          height: "90px",
                          objectFit: "cover",
                        }}
                        onClick={() =>
                          formik.values.image.file
                            ? setToggle({
                                ...toggle,
                                imagePreview: !toggle.imagePreview,
                              })
                            : formik.values.image.file === ""
                            ? ""
                            : setToggle({
                                ...toggle,
                                imagePreview: !toggle.imagePreview,
                              })
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
                              formik.values?.image
                                ? formik.values.image?.preview
                                  ? formik.values.image?.preview
                                  : formik.values.image
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
                {formik.errors.image && formik.touched.image ? (
                  <span className="error text-center">
                    {formik.errors.image}
                  </span>
                ) : null}
              </Col>
              <Col lg={7} className="mb-5">
                <div
                  className="form-group-container d-flex flex-column align-items-end mb-3"
                  style={{ marginTop: "-4px" }}
                >
                  <label htmlFor="title" className="form-label">
                    {t("settings.slider.columns.title")}
                  </label>
                  <input
                    type="text"
                    className="form-input w-100"
                    id="title"
                    placeholder={t("settings.slider.columns.title")}
                    name="title"
                    value={formik.values.title}
                    onChange={formik.handleChange}
                  />
                  {formik.errors.title && formik.touched.title ? (
                    <span className="error">{formik.errors.title}</span>
                  ) : null}
                </div>
                <div
                  className="form-group-container d-flex flex-column align-items-end mb-3"
                  style={{ marginTop: "-4px" }}
                >
                  <label htmlFor="order" className="form-label">
                    {t("settings.slider.columns.order")}
                  </label>
                  <input
                    type="text"
                    className="form-input w-100"
                    id="order"
                    placeholder={t("settings.slider.columns.order")}
                    name="order"
                    value={formik.values.order}
                    onChange={formik.handleChange}
                  />
                  {formik.errors.order && formik.touched.order ? (
                    <span className="error">{formik.errors.order}</span>
                  ) : null}
                </div>
                <div className="form-group-container d-flex flex-column justify-content-center align-items-end mb-3">
                  <label htmlFor="status" className="form-label">
                    {t("status")}
                  </label>
                  <div
                    className={`dropdown form-input ${
                      toggle.status ? "active" : ""
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setToggle({
                          ...toggle,
                          status: !toggle.status,
                        });
                      }}
                      className="dropdown-btn d-flex justify-content-between align-items-center"
                    >
                      {formik.values.status === "Private"
                        ? t("private")
                        : formik.values.status === "Public"
                        ? t("public")
                        : t("status")}
                      <TiArrowSortedUp
                        className={`dropdown-icon ${
                          toggle.status ? "active" : ""
                        }`}
                      />
                    </button>
                    <div
                      className={`dropdown-content ${
                        toggle.status ? "active" : ""
                      }`}
                    >
                      <button
                        type="button"
                        className={`item ${
                          formik.values.status === "Private" ? "active" : ""
                        }`}
                        value="Private"
                        name="status"
                        onClick={() => {
                          setToggle({
                            ...toggle,
                            status: !toggle.status,
                          });
                          formik.setFieldValue("status", "Private");
                        }}
                      >
                        {t("private")}
                      </button>
                      <button
                        type="button"
                        className={`item ${
                          formik.values.status === "Public" ? "active" : ""
                        }`}
                        value="Public"
                        name="status"
                        onClick={() => {
                          setToggle({
                            ...toggle,
                            status: !toggle.status,
                          });
                          formik.setFieldValue("status", "Public");
                        }}
                      >
                        {t("public")}
                      </button>
                    </div>
                  </div>
                  {formik.errors.status && formik.touched.status ? (
                    <span className="error">{formik.errors.status}</span>
                  ) : null}
                </div>
                <div className="form-group-container d-flex flex-column align-items-end gap-3 mt-3">
                  <label htmlFor="description" className="form-label">
                    {t("settings.slider.columns.description")}
                  </label>
                  <textarea
                    className="form-input"
                    id="description"
                    placeholder={t("settings.slider.columns.description")}
                    name="description"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                  ></textarea>
                  {formik.errors.description && formik.touched.description ? (
                    <span className="error">{formik.errors.description}</span>
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
      {/* Preview Slider */}
      <Modal
        isOpen={toggle.previewSlider}
        toggle={() =>
          setToggle({
            ...toggle,
            previewSlider: !toggle.previewSlider,
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
              previewSlider: !toggle.previewSlider,
            })
          }
        >
          {formik.values?.title}
          <IoMdClose
            onClick={() =>
              setToggle({
                ...toggle,
                previewSlider: !toggle.previewSlider,
              })
            }
          />
        </ModalHeader>
        <ModalBody>
          <div className="read-more-container text-center">
            <h3 className="text-center mb-3">{formik.values?.title}</h3>
            <img
              src={formik.values?.image}
              alt={formik.values?.title || "avatar"}
              className="read-more-image mb-3"
              style={{
                maxWidth: "700px",
                maxHeight: "400px",
                objectFit: "cover",
              }}
            />
            <div className="content text-end">{formik.values?.order}</div>
            <div className="content text-end">{formik.values?.description}</div>
          </div>
        </ModalBody>
      </Modal>
      {/* Pagination */}
      {results?.length > 0 && error === null && loading === false && (
        <PaginationUI />
      )}
    </div>
  );
};

export default Slider;
