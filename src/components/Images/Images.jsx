import React, { useEffect, useRef, useState } from "react";
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
import { IoMdClose } from "react-icons/io";
import {
  getPicturesApi,
  addPictureApi,
  updatePictureApi,
  deletePictureApi,
  getPicturesCategoriesApi,
} from "../../store/slices/pictureSlice";
import { useFormik } from "formik";
import Swal from "sweetalert2";
import { ImUpload } from "react-icons/im";
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { useFiltration, useSchema } from "../../hooks";
import Cookies from "js-cookie";

const Images = () => {
  const { t } = useTranslation();
  const role = Cookies.get("_role");
  const dispatch = useDispatch();
  const { validationSchema } = useSchema();
  const fileRef = useRef();
  const { pictures, pictureCategories, loading, error } = useSelector(
    (state) => state.picture
  );
  const [toggle, setToggle] = useState({
    add: false,
    edit: false,
    imagePreview: false,
    status: false,
    elders: false,
    is_active: false,
    pictureCategories: false,
    activeColumn: false,
    searchTerm: "",
    toggleColumns: {
      id: true,
      image: true,
      category: true,
      visits: true,
      favorites: true,
      downloads: true,
      shares: true,
      status: true,
      activation: true,
      control: true,
    },
    sortColumn: "",
    sortOrder: "asc",
    rowsPerPage: 5,
    currentPage: 1,
  });

  const data = pictures?.map((picture) => {
    return {
      ...picture,
      image_category: {
        title: picture?.image_category?.title,
        id: picture?.image_category?.id,
      },
      is_active: picture?.is_active === 1 ? t("active") : t("inactive"),
      status: picture?.status === "Public" ? t("public") : t("private"),
    };
  });

  // Filtration, Sorting, Pagination
  const {
    PaginationUI,
    handleSort,
    handleSearch,
    handleToggleColumns,
    searchResultsImagesCategory,
  } = useFiltration({
    rowData: data,
    toggle,
    setToggle,
  });

  // Columns
  const columns = [
    { id: 0, name: "id", label: t("index") },
    { id: 1, name: "image", label: t("images.columns.image") },
    { id: 2, name: "category", label: t("images.columns.category") },
    { id: 3, name: "visits", label: t("views") },
    { id: 4, name: "favorites", label: t("favorites") },
    { id: 5, name: "downloads", label: t("downloads") },
    { id: 6, name: "shares", label: t("shares") },
    { id: 7, name: "status", label: t("content") },
    { id: 8, name: "activation", label: t("activation") },
    { id: 9, name: "control", label: t("action") },
  ];

  // Formik
  const formik = useFormik({
    initialValues: {
      image: {
        file: "",
        preview: "",
      },
      status: "",
      is_active: "",
      pictureCategory: {
        title: "",
        id: "",
      },
    },
    validationSchema: validationSchema.image,
    onSubmit: (values) => {
      if (role === "admin") {
        const formData = new FormData();
        formData.append("status", values.status);
        if (values.image.file !== "") {
          formData.append("image", values.image.file);
        }
        if (values?.id) {
          dispatch(
            updatePictureApi({
              id: values.id,
              category_id: values.pictureCategory?.id,
              image: values.image.file,
              status: values.status,
              is_active: values.is_active,
            })
          ).then((res) => {
            if (!res.error) {
              dispatch(getPicturesApi());
              setToggle({
                ...toggle,
                edit: !toggle.edit,
              });
              formik.handleReset();
              toast.success(t("toast.image.updatedSuccess"));
            } else {
              toast.error(t("toast.image.updatedError"));
              dispatch(getPicturesApi());
            }
          });
        } else {
          dispatch(
            addPictureApi({
              image_categories_id: values.pictureCategory?.id,
              image: values.image.file,
              status: values.status,
              is_active: values.is_active,
            })
          ).then((res) => {
            if (!res.error) {
              dispatch(getPicturesApi());
              setToggle({
                ...toggle,
                add: !toggle.add,
              });
              formik.handleReset();
              toast.success(t("toast.image.addedSuccess"));
            } else {
              toast.error(t("toast.image.addedError"));
              dispatch(getPicturesApi());
            }
          });
        }
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

  // Handle Delete Image
  const handleDeleteImage = () => {
    fileRef.current.value = "";
    fileRef.current.files = null;
    formik.setValues({
      ...formik.values,
      image: {
        file: fileRef.current.files[0],
        preview: "",
      },
    });
    setToggle({
      ...toggle,
      imagePreview: false,
    });
  };

  // Handle Edit Picture
  const handleEdit = (picture) => {
    formik.setValues({
      ...picture,
      image: picture?.image,
      status: picture?.status === t("public") ? "Public" : "Private",
      is_active: picture?.is_active === t("active") ? 1 : 0,
      pictureCategory: {
        title: picture?.image_category?.title,
        id: picture?.image_category?.id,
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
        dispatch(deletePictureApi(picture?.id)).then((res) => {
          if (!res.error) {
            if (searchResultsImagesCategory.length === 1) {
              setToggle({
                ...toggle,
                currentPage: 1,
              });
            }
            dispatch(getPicturesApi());
            Swal.fire({
              title: `${t("titleDeletedSuccess")} ${picture?.title}`,
              text: `${t("titleDeletedSuccess")} ${picture?.title} ${t(
                "textDeletedSuccess"
              )}`,
              icon: "success",
              confirmButtonColor: "#0d1d34",
              confirmButtonText: t("doneDeletedSuccess"),
            }).then(() => {
              toast.success(t("toast.image.deletedSuccess"));
            });
          } else {
            toast.error(t("toast.image.deletedError"));
            dispatch(getPicturesApi());
          }
        });
      }
    });
  };

  // get data from api
  useEffect(() => {
    try {
      dispatch(getPicturesApi());
      if (role === "admin") {
        dispatch(getPicturesCategoriesApi());
      }
      if (role !== "admin") {
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
      {role === "admin" && (
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
            {t("images.addTitle")}
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
              placeholder={t("searchImage")}
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
                    key={column?.id}
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
              {toggle.toggleColumns.id && (
                <th className="table-th">{t("index")}</th>
              )}
              {toggle.toggleColumns.image && (
                <th className="table-th" onClick={() => handleSort(columns[1])}>
                  {t("images.columns.image")}
                  {toggle.sortColumn === columns[1].name ? (
                    toggle.sortOrder === "asc" ? (
                      <TiArrowSortedUp />
                    ) : (
                      <TiArrowSortedDown />
                    )
                  ) : null}
                </th>
              )}
              {toggle.toggleColumns.category && (
                <th className="table-th" onClick={() => handleSort(columns[2])}>
                  {t("images.columns.category")}
                  {toggle.sortColumn === columns[2].name ? (
                    toggle.sortOrder === "asc" ? (
                      <TiArrowSortedUp />
                    ) : (
                      <TiArrowSortedDown />
                    )
                  ) : null}
                </th>
              )}
              {toggle.toggleColumns.visits && (
                <th className="table-th" onClick={() => handleSort(columns[3])}>
                  {t("views")}
                  {toggle.sortColumn === columns[3].name ? (
                    toggle.sortOrder === "asc" ? (
                      <TiArrowSortedUp />
                    ) : (
                      <TiArrowSortedDown />
                    )
                  ) : null}
                </th>
              )}
              {toggle.toggleColumns.favorites && (
                <th className="table-th" onClick={() => handleSort(columns[4])}>
                  {t("favorites")}
                  {toggle.sortColumn === columns[4].name ? (
                    toggle.sortOrder === "asc" ? (
                      <TiArrowSortedUp />
                    ) : (
                      <TiArrowSortedDown />
                    )
                  ) : null}
                </th>
              )}
              {toggle.toggleColumns.downloads && (
                <th className="table-th" onClick={() => handleSort(columns[5])}>
                  {t("downloads")}
                  {toggle.sortColumn === columns[5].name ? (
                    toggle.sortOrder === "asc" ? (
                      <TiArrowSortedUp />
                    ) : (
                      <TiArrowSortedDown />
                    )
                  ) : null}
                </th>
              )}
              {toggle.toggleColumns.shares && (
                <th className="table-th" onClick={() => handleSort(columns[6])}>
                  {t("shares")}
                  {toggle.sortColumn === columns[6].name ? (
                    toggle.sortOrder === "asc" ? (
                      <TiArrowSortedUp />
                    ) : (
                      <TiArrowSortedDown />
                    )
                  ) : null}
                </th>
              )}
              {toggle.toggleColumns.status && (
                <th className="table-th" onClick={() => handleSort(columns[7])}>
                  {t("content")}
                  {toggle.sortColumn === columns[7].name ? (
                    toggle.sortOrder === "asc" ? (
                      <TiArrowSortedUp />
                    ) : (
                      <TiArrowSortedDown />
                    )
                  ) : null}
                </th>
              )}
              {toggle.toggleColumns.activation && (
                <th className="table-th" onClick={() => handleSort(columns[8])}>
                  {t("activation")}
                  {toggle.sortColumn === columns[8].name ? (
                    toggle.sortOrder === "asc" ? (
                      <TiArrowSortedUp />
                    ) : (
                      <TiArrowSortedDown />
                    )
                  ) : null}
                </th>
              )}
              {role === "admin" && toggle.toggleColumns.control && (
                <th className="table-th" onClick={() => handleSort(columns[9])}>
                  {t("action")}
                  {toggle.sortColumn === columns[9].name ? (
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
                <td className="table-td" colSpan={role === "admin" ? 10 : 11}>
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
                <td className="table-td" colSpan={role === "admin" ? 10 : 11}>
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
          {searchResultsImagesCategory?.length === 0 &&
            error === null &&
            !loading && (
              <tbody>
                <tr className="no-data-container">
                  <td className="table-td" colSpan={role === "admin" ? 10 : 11}>
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
                <td className="table-td" colSpan={role === "admin" ? 10 : 11}>
                  <p className="no-data no-columns mb-0">{t("noColumns")}</p>
                </td>
              </tr>
            </tbody>
          )}
          {/* Data */}
          {searchResultsImagesCategory?.length > 0 &&
            error === null &&
            loading === false && (
              <tbody>
                {searchResultsImagesCategory?.map((result, idx) => (
                  <tr key={result?.id + new Date().getDate()}>
                    {toggle.toggleColumns?.id && (
                      <td className="table-td">{idx + 1}#</td>
                    )}
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
                    {toggle.toggleColumns.category && (
                      <td className="table-td name">
                        {result?.image_category?.title}
                      </td>
                    )}
                    {toggle.toggleColumns.visits && (
                      <td className="table-td">{result?.visits_count}</td>
                    )}
                    {toggle.toggleColumns.favorites && (
                      <td className="table-td">{result?.favorites_count}</td>
                    )}
                    {toggle.toggleColumns.downloads && (
                      <td className="table-td">{result?.downloads_count}</td>
                    )}
                    {toggle.toggleColumns.shares && (
                      <td className="table-td">{result?.shares_count}</td>
                    )}
                    {toggle.toggleColumns.status && (
                      <td className="table-td">
                        <span
                          className="table-status badge"
                          style={{
                            backgroundColor:
                              result?.status === t("public")
                                ? "green"
                                : result?.status === t("private")
                                ? "red"
                                : "red",
                            cursor: role === "admin" ? "pointer" : "default",
                          }}
                          onClick={() => {
                            if (role === "admin") {
                              dispatch(
                                updatePictureApi({
                                  id: result.id,
                                  category_id: result.image_category.id,
                                  status:
                                    result.status === t("public")
                                      ? "Private"
                                      : "Public",
                                  is_active:
                                    result.is_active === t("active") ? 1 : 0,
                                })
                              ).then((res) => {
                                if (!res.error) {
                                  dispatch(getPicturesApi());
                                  toast.success(
                                    t("toast.image.updatedSuccess")
                                  );
                                } else {
                                  toast.error(t("toast.image.updatedError"));
                                  dispatch(getPicturesApi());
                                }
                              });
                            }
                          }}
                        >
                          {result?.status === t("public")
                            ? t("public")
                            : result?.status === t("private")
                            ? t("private")
                            : t("private")}
                        </span>
                      </td>
                    )}
                    {toggle.toggleColumns.activation && (
                      <td className="table-td">
                        <span
                          className="table-status badge"
                          style={{
                            backgroundColor:
                              result?.is_active === t("active")
                                ? "green"
                                : result?.is_active === t("inactive")
                                ? "red"
                                : "red",
                            cursor: role === "admin" ? "pointer" : "default",
                          }}
                          onClick={() => {
                            if (role === "admin") {
                              dispatch(
                                updatePictureApi({
                                  id: result.id,
                                  category_id: result.image_category.id,
                                  status:
                                    result.status === t("public")
                                      ? "Public"
                                      : "Private",
                                  is_active:
                                    result.is_active === t("active") ? 0 : 1,
                                })
                              ).then((res) => {
                                if (!res.error) {
                                  dispatch(getPicturesApi());
                                  toast.success(
                                    t("toast.image.updatedSuccess")
                                  );
                                } else {
                                  toast.error(t("toast.image.updatedError"));
                                  dispatch(getPicturesApi());
                                }
                              });
                            }
                          }}
                        >
                          {result?.is_active === t("active")
                            ? t("active")
                            : result?.is_active === t("inactive")
                            ? t("inactive")
                            : t("inactive")}
                        </span>
                      </td>
                    )}
                    {role === "admin" && toggle.toggleColumns.control && (
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
        {/* Pagination */}
        {searchResultsImagesCategory?.length > 0 &&
          error === null &&
          loading === false && <PaginationUI />}
      </div>
      {role === "admin" && (
        <>
          {/* Add Image */}
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
              {t("images.addTitle")}
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
                                formik.values.image &&
                                formik.values.image.preview
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
                                onClick={handleDeleteImage}
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
                        ref={fileRef}
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
                    <div className="form-group-container d-flex flex-column align-items-end mb-3">
                      <label htmlFor="pictureCategory" className="form-label">
                        {t("images.columns.category")}
                      </label>
                      <div
                        className={`dropdown form-input ${
                          toggle.pictureCategories ? "active" : ""
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => {
                            setToggle({
                              ...toggle,
                              pictureCategories: !toggle.pictureCategories,
                            });
                          }}
                          className="dropdown-btn dropdown-btn-audio-category d-flex justify-content-between align-items-center"
                        >
                          {formik.values.pictureCategory?.title
                            ? formik.values.pictureCategory?.title
                            : t("chooseCategory")}
                          <TiArrowSortedUp
                            className={`dropdown-icon ${
                              toggle.pictureCategories ? "active" : ""
                            }`}
                          />
                        </button>
                        <div
                          className={`dropdown-content ${
                            toggle.pictureCategories ? "active" : ""
                          }`}
                        >
                          {pictureCategories?.map((category) => (
                            <button
                              type="button"
                              key={category?.id}
                              className={`item ${
                                formik.values.pictureCategory?.id ===
                                category?.id
                                  ? "active"
                                  : ""
                              }`}
                              value={category?.id}
                              name="pictureCategory"
                              onClick={() => {
                                setToggle({
                                  ...toggle,
                                  pictureCategories: !toggle.pictureCategories,
                                });
                                formik.setFieldValue("pictureCategory", {
                                  title: category?.title,
                                  id: category?.id,
                                });
                              }}
                            >
                              {category?.title}
                            </button>
                          ))}
                        </div>
                      </div>
                      {formik.errors.pictureCategory?.title &&
                      formik.touched.pictureCategory?.title ? (
                        <span className="error">
                          {formik.errors.pictureCategory?.title}
                        </span>
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
                    <div className="form-group-container d-flex flex-column justify-content-center align-items-end">
                      <label htmlFor="activation" className="form-label">
                        {t("activation")}
                      </label>
                      <div className="dropdown form-input">
                        <button
                          type="button"
                          onClick={() => {
                            setToggle({
                              ...toggle,
                              is_active: !toggle.is_active,
                            });
                          }}
                          className="dropdown-btn d-flex justify-content-between align-items-center"
                        >
                          {formik.values.is_active === 1
                            ? t("active")
                            : formik.values.is_active === 0
                            ? t("inactive")
                            : t("activation")}
                          <TiArrowSortedUp
                            className={`dropdown-icon ${
                              toggle.is_active ? "active" : ""
                            }`}
                          />
                        </button>
                        <div
                          className={`dropdown-content ${
                            toggle.is_active ? "active" : ""
                          }`}
                        >
                          <button
                            type="button"
                            className={`item ${
                              formik.values.is_active === 0 ? "active" : ""
                            }`}
                            value="inactive"
                            name="activation"
                            onClick={(e) => {
                              setToggle({
                                ...toggle,
                                is_active: !toggle.is_active,
                              });
                              formik.setFieldValue("is_active", 0);
                            }}
                          >
                            {t("inactive")}
                          </button>
                          <button
                            type="button"
                            className={`item ${
                              formik.values.is_active === 1 ? "active" : ""
                            }`}
                            value="active"
                            name="activation"
                            onClick={(e) => {
                              setToggle({
                                ...toggle,
                                is_active: !toggle.is_active,
                              });
                              formik.setFieldValue("is_active", 1);
                            }}
                          >
                            {t("active")}
                          </button>
                        </div>
                      </div>
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
          {/* Edit Image  */}
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
              {t("images.editTitle")}
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
                          ref={fileRef}
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
                    <div className="form-group-container d-flex flex-column align-items-end mb-3">
                      <label htmlFor="pictureCategory" className="form-label">
                        {t("images.columns.category")}
                      </label>
                      <div
                        className={`dropdown form-input ${
                          toggle.pictureCategories ? "active" : ""
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => {
                            setToggle({
                              ...toggle,
                              pictureCategories: !toggle.pictureCategories,
                            });
                          }}
                          className="dropdown-btn dropdown-btn-audio-category d-flex justify-content-between align-items-center"
                        >
                          {formik.values.pictureCategory?.title
                            ? formik.values.pictureCategory?.title
                            : t("chooseCategory")}
                          <TiArrowSortedUp
                            className={`dropdown-icon ${
                              toggle.pictureCategories ? "active" : ""
                            }`}
                          />
                        </button>
                        <div
                          className={`dropdown-content ${
                            toggle.pictureCategories ? "active" : ""
                          }`}
                        >
                          {pictureCategories?.map((category) => (
                            <button
                              type="button"
                              key={category?.id}
                              className={`item ${
                                formik.values.pictureCategory?.id ===
                                category?.id
                                  ? "active"
                                  : ""
                              }`}
                              value={category?.id}
                              name="pictureCategory"
                              onClick={() => {
                                setToggle({
                                  ...toggle,
                                  pictureCategories: !toggle.pictureCategories,
                                });
                                formik.setFieldValue("pictureCategory", {
                                  title: category?.title,
                                  id: category?.id,
                                });
                              }}
                            >
                              {category?.title}
                            </button>
                          ))}
                        </div>
                      </div>
                      {formik.errors.pictureCategory?.title &&
                      formik.touched.pictureCategory?.title ? (
                        <span className="error">
                          {formik.errors.pictureCategory?.title}
                        </span>
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
                    <div className="form-group-container d-flex flex-column justify-content-center align-items-end">
                      <label htmlFor="activation" className="form-label">
                        {t("activation")}
                      </label>
                      <div className="dropdown form-input">
                        <button
                          type="button"
                          onClick={() => {
                            setToggle({
                              ...toggle,
                              is_active: !toggle.is_active,
                            });
                          }}
                          className="dropdown-btn d-flex justify-content-between align-items-center"
                        >
                          {formik.values.is_active === 1
                            ? t("active")
                            : formik.values.is_active === 0
                            ? t("inactive")
                            : t("activation")}
                          <TiArrowSortedUp
                            className={`dropdown-icon ${
                              toggle.is_active ? "active" : ""
                            }`}
                          />
                        </button>
                        <div
                          className={`dropdown-content ${
                            toggle.is_active ? "active" : ""
                          }`}
                        >
                          <button
                            type="button"
                            className={`item ${
                              formik.values.is_active === 0 ? "active" : ""
                            }`}
                            value="inactive"
                            name="activation"
                            onClick={(e) => {
                              setToggle({
                                ...toggle,
                                is_active: !toggle.is_active,
                              });
                              formik.setFieldValue("is_active", 0);
                            }}
                          >
                            {t("inactive")}
                          </button>
                          <button
                            type="button"
                            className={`item ${
                              formik.values.is_active === 1 ? "active" : ""
                            }`}
                            value="active"
                            name="activation"
                            onClick={(e) => {
                              setToggle({
                                ...toggle,
                                is_active: !toggle.is_active,
                              });
                              formik.setFieldValue("is_active", 1);
                            }}
                          >
                            {t("active")}
                          </button>
                        </div>
                      </div>
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
    </div>
  );
};

export default Images;
