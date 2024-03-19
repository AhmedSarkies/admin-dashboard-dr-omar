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

import { MdAdd, MdDeleteOutline } from "react-icons/md";
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";
import { FaEdit } from "react-icons/fa";
import { ImUpload } from "react-icons/im";
import { IoMdClose, IoMdEye } from "react-icons/io";
import anonymous from "../../assets/images/anonymous.png";
import {
  deleteArticleApi,
  getArticles,
  getArticlesApi,
  addArticleApi,
  updateArticleApi,
  getArticlesCategoriesApi,
  getArticlesCategories,
  deleteArticle,
} from "../../store/slices/articleSlice";
import {
  getApprovedScholarsApi,
  getApprovedScholars,
} from "../../store/slices/scholarSlice";
import { useFormik } from "formik";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { useFiltration, useSchema } from "../../hooks";
import { useTranslation } from "react-i18next";

const initialValues = {
  image: {
    file: "",
    preview: "",
  },
  title: "",
  content: "",
  elder: {
    name: "",
    id: "",
  },
  articleCategories: {
    title: "",
    id: "",
  },
  status: "",
};

const Articles = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { validationSchema } = useSchema();
  const fileRef = useRef();
  const { articles, articleCategories, loading, error } = useSelector(
    (state) => state.article
  );
  const { approvedScholars } = useSelector((state) => state.scholar);
  const [toggle, setToggle] = useState({
    add: false,
    edit: false,
    imagePreview: false,
    readMore: false,
    status: false,
    elders: false,
    articleCategories: false,
    activeColumn: false,
    toggleColumns: {
      imageElder: true,
      nameElder: true,
      image: true,
      title: true,
      content: true,
      category: true,
      status: true,
      visitCount: true,
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
    { id: 1, name: "imageElder", label: t("articles.columns.elder.image") },
    { id: 2, name: "nameElder", label: t("articles.columns.elder.name") },
    { id: 3, name: "image", label: t("articles.columns.image") },
    { id: 4, name: "title", label: t("articles.columns.title") },
    { id: 5, name: "content", label: t("articles.columns.article") },
    { id: 6, name: "category", label: t("articles.columns.category") },
    { id: 7, name: "status", label: t("status") },
    { id: 8, name: "visitCount", label: t("visits") },
    { id: 9, name: "control", label: t("action") },
  ];
  const {
    PaginationUI,
    handleSort,
    handleSearch,
    handleToggleColumns,
    results,
  } = useFiltration({
    rowData: articles,
    toggle,
    setToggle,
  });

  // Formik
  const formik = useFormik({
    initialValues,
    validationSchema: validationSchema.article,
    onSubmit: (values) => {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("content", values.content);
      formData.append("elder_id", values.elder.id);
      formData.append("articles_categories_id", values.articleCategories.id);
      formData.append(
        "status",
        values.status === "Private"
          ? "Private"
          : values.status === "Public"
          ? "Public"
          : "Private"
      );
      if (values?.id) {
        // if the article don't change anything even the image
        const article = articles.find((article) => article?.id === values?.id);
        if (
          article.title === values.title &&
          article.status === values.status &&
          article.image === values.image &&
          article.content === values.content &&
          article.elder.id === values.elder.id &&
          article.articleCategories.id === values.articleCategories.id
        ) {
          setToggle({ ...toggle, edit: !toggle.edit });
          toast.error(t("noChange"));
        } else {
          formData.append("id", values.id);
          if (values.image.file !== "") {
            formData.append("image", values.image.file);
          }
          if (values.image.file === undefined) {
            formData.append(
              "image",
              `${values?.image?.split("Articles_image")[0]}Articles_image`
            );
          }
          dispatch(updateArticleApi(formData)).then((res) => {
            dispatch(getArticlesApi());
            if (!res.error) {
              formik.handleReset();
              setToggle({ ...toggle, edit: !toggle.edit });
              toast.success(t("toast.article.updatedSuccess"));
            } else {
              toast.error(t("toast.article.updatedError"));
            }
          });
        }
      } else {
        formData.append("image", values.image.file);
        dispatch(addArticleApi(formData)).then((res) => {
          dispatch(getArticlesApi());
          if (!res.error) {
            formik.handleReset();
            setToggle({
              ...toggle,
              add: !toggle.add,
            });
            toast.success(t("toast.article.addedSuccess"));
          } else {
            toast.error(t("toast.article.addedError"));
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

  // handle Input Using Formik
  const handleInput = (e) => {
    formik.handleChange(e);
  };

  // Handle Edit article
  const handleEdit = (article) => {
    formik.setValues({
      ...article,
      id: article?.id,
      image: article?.image,
      title: article?.title,
      content: article?.content,
      elder: {
        name: article?.elder?.name,
        id: article?.elder?.id,
      },
      articleCategories: {
        title: article?.Category?.title,
        id: article?.Category?.id,
      },
      status: article?.status,
    });
  };

  // Delete article
  const handleDelete = (article) => {
    Swal.fire({
      title: t("titleDeleteAlert") + article?.title + "?",
      text: t("textDeleteAlert"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#0d1d34",
      confirmButtonText: t("confirmButtonText"),
      cancelButtonText: t("cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteArticleApi(article?.id)).then((res) => {
          if (!res.error) {
            dispatch(deleteArticle(article?.id));
            Swal.fire({
              title: `${t("titleDeletedSuccess")} ${article?.title}`,
              text: `${t("titleDeletedSuccess")} ${article?.title} ${t(
                "textDeletedSuccess"
              )}`,
              icon: "success",
              confirmButtonColor: "#0d1d34",
              confirmButtonText: t("doneDeletedSuccess"),
            }).then(() => toast.success(t("toast.article.deletedSuccess")));
          } else {
            toast.error(t("toast.article.deletedError"));
          }
        });
      }
    });
  };

  // get data from api
  useEffect(() => {
    try {
      dispatch(getArticlesApi()).then((res) => {
        if (!res.error) {
          dispatch(getArticles(res.payload));
        }
      });
      dispatch(getArticlesCategoriesApi()).then((res) => {
        if (!res.error && res.payload.length > 0) {
          dispatch(getArticlesCategories(res.payload));
        }
      });
      dispatch(getApprovedScholarsApi()).then((res) => {
        if (!res.error && res.payload.length > 0) {
          dispatch(getApprovedScholars(res.payload));
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
          {t("articles.addTitle")}
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
              {toggle.toggleColumns.imageElder && (
                <th className="table-th" onClick={() => handleSort(columns[0])}>
                  {t("articles.columns.elder.image")}
                  {toggle.sortColumn === columns[0].name ? (
                    toggle.sortOrder === "asc" ? (
                      <TiArrowSortedUp />
                    ) : (
                      <TiArrowSortedDown />
                    )
                  ) : null}
                </th>
              )}
              {toggle.toggleColumns.nameElder && (
                <th className="table-th" onClick={() => handleSort(columns[1])}>
                  {t("articles.columns.elder.name")}
                  {toggle.sortColumn === columns[1].name ? (
                    toggle.sortOrder === "asc" ? (
                      <TiArrowSortedUp />
                    ) : (
                      <TiArrowSortedDown />
                    )
                  ) : null}
                </th>
              )}
              {toggle.toggleColumns.image && (
                <th className="table-th" onClick={() => handleSort(columns[2])}>
                  {t("articles.columns.image")}
                  {toggle.sortColumn === columns[2].name ? (
                    toggle.sortOrder === "asc" ? (
                      <TiArrowSortedUp />
                    ) : (
                      <TiArrowSortedDown />
                    )
                  ) : null}
                </th>
              )}
              {toggle.toggleColumns.title && (
                <th className="table-th" onClick={() => handleSort(columns[3])}>
                  {t("articles.columns.title")}
                  {toggle.sortColumn === columns[3].name ? (
                    toggle.sortOrder === "asc" ? (
                      <TiArrowSortedUp />
                    ) : (
                      <TiArrowSortedDown />
                    )
                  ) : null}
                </th>
              )}
              {toggle.toggleColumns.content && (
                <th className="table-th" onClick={() => handleSort(columns[4])}>
                  {t("articles.columns.article")}
                  {toggle.sortColumn === columns[4].name ? (
                    toggle.sortOrder === "asc" ? (
                      <TiArrowSortedUp />
                    ) : (
                      <TiArrowSortedDown />
                    )
                  ) : null}
                </th>
              )}
              {toggle.toggleColumns.category && (
                <th className="table-th" onClick={() => handleSort(columns[5])}>
                  {t("articles.columns.category")}
                  {toggle.sortColumn === columns[5].name ? (
                    toggle.sortOrder === "asc" ? (
                      <TiArrowSortedUp />
                    ) : (
                      <TiArrowSortedDown />
                    )
                  ) : null}
                </th>
              )}
              {toggle.toggleColumns.status && (
                <th className="table-th" onClick={() => handleSort(columns[6])}>
                  {t("status")}
                  {toggle.sortColumn === columns[6].name ? (
                    toggle.sortOrder === "asc" ? (
                      <TiArrowSortedUp />
                    ) : (
                      <TiArrowSortedDown />
                    )
                  ) : null}
                </th>
              )}
              {toggle.toggleColumns.visitCount && (
                <th className="table-th" onClick={() => handleSort(columns[7])}>
                  {t("visits")}
                  {toggle.sortColumn === columns[7].name ? (
                    toggle.sortOrder === "asc" ? (
                      <TiArrowSortedUp />
                    ) : (
                      <TiArrowSortedDown />
                    )
                  ) : null}
                </th>
              )}
              {toggle.toggleColumns.control && (
                <th className="table-th" onClick={() => handleSort(columns[8])}>
                  {t("action")}
                  {toggle.sortColumn === columns[8].name ? (
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
                <td className="table-td" colSpan="9">
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
                <td className="table-td" colSpan="9">
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
                <td className="table-td" colSpan="9">
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
                <td className="table-td" colSpan="9">
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
                  {toggle.toggleColumns.imageElder && (
                    <td className="table-td">
                      <img
                        src={result?.elder.image}
                        alt={result?.elder.name || "avatar"}
                        className="table-avatar"
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "cover",
                        }}
                      />
                    </td>
                  )}
                  {toggle.toggleColumns.nameElder && (
                    <td className="table-td title">{result?.elder.name}</td>
                  )}
                  {toggle.toggleColumns.image && (
                    <td className="table-td">
                      <img
                        src={result?.image}
                        alt={result?.title || "avatar"}
                        className="table-avatar"
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "cover",
                        }}
                      />
                    </td>
                  )}
                  {toggle.toggleColumns.title && (
                    <td className="table-td title">{result?.title}</td>
                  )}
                  {toggle.toggleColumns.content && (
                    <td className="table-td article">
                      {result?.content?.length >= 50
                        ? result?.content?.slice(0, 50) + "..."
                        : result?.content}
                    </td>
                  )}
                  {toggle.toggleColumns.category && (
                    <td className="table-td title">{result?.Category.title}</td>
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
                          : result?.status === "Public"
                          ? t("private")
                          : t("private")}
                      </span>
                    </td>
                  )}
                  {toggle.toggleColumns.visitCount && (
                    <td className="table-td">{result?.visit_count}</td>
                  )}
                  {toggle.toggleColumns.control && (
                    <td className="table-td">
                      <span className="table-btn-container">
                        <IoMdEye
                          onClick={() => {
                            setToggle({
                              ...toggle,
                              readMore: !toggle.readMore,
                            });
                            handleEdit(result);
                          }}
                        />
                        <FaEdit
                          className="edit-btn"
                          onClick={() => {
                            handleEdit(result);
                            setToggle({ ...toggle, edit: !toggle.edit });
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
      {/* Add Article */}
      <Modal
        isOpen={toggle.add}
        toggle={() => {
          formik.handleReset();
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
            formik.handleReset();
            setToggle({
              ...toggle,
              add: !toggle.add,
            });
          }}
        >
          {t("articles.addTitle")}
          <IoMdClose
            onClick={() => {
              formik.handleReset();
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
              <Col lg={7} className="mb-3">
                <div
                  className="form-group-container d-flex flex-column align-items-end mb-3"
                  style={{ marginTop: "-4px" }}
                >
                  <label htmlFor="title" className="form-label">
                    {t("articles.columns.title")}
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    id="title"
                    placeholder={t("articles.columns.title")}
                    name="title"
                    value={formik.values.title}
                    onChange={handleInput}
                  />
                  {formik.errors.title && formik.touched.title ? (
                    <span className="error">{formik.errors.title}</span>
                  ) : null}
                </div>
                <div className="form-group-container d-flex flex-column align-items-end mb-3">
                  <label htmlFor="articleCategories" className="form-label">
                    {t("articles.columns.category")}
                  </label>
                  <div
                    className={`dropdown form-input ${
                      toggle.articleCategories ? "active" : ""
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setToggle({
                          ...toggle,
                          articleCategories: !toggle.articleCategories,
                        });
                      }}
                      className="dropdown-btn dropdown-btn-audio-category d-flex justify-content-between align-items-center"
                    >
                      {formik.values.articleCategories?.title
                        ? formik.values.articleCategories?.title
                        : t("chooseCategory")}
                      <TiArrowSortedUp
                        className={`dropdown-icon ${
                          toggle.articleCategories ? "active" : ""
                        }`}
                      />
                    </button>
                    <div
                      className={`dropdown-content ${
                        toggle.articleCategories ? "active" : ""
                      }`}
                    >
                      {articleCategories?.map((category) => (
                        <button
                          type="button"
                          key={category?.id}
                          className={`item ${
                            formik.values.articleCategories?.id === category?.id
                              ? "active"
                              : ""
                          }`}
                          value={category?.id}
                          name="articleCategories"
                          onClick={() => {
                            setToggle({
                              ...toggle,
                              articleCategories: !toggle.articleCategories,
                            });
                            formik.setFieldValue("articleCategories", {
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
                  {formik.errors.articleCategories?.title &&
                  formik.touched.articleCategories?.title ? (
                    <span className="error">
                      {formik.errors.articleCategories?.title}
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
                  <label htmlFor="elder" className="form-label">
                    {t("elder")}
                  </label>
                  <div
                    className={`dropdown form-input ${
                      toggle.elders ? "active" : ""
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setToggle({
                          ...toggle,
                          elders: !toggle.elders,
                        });
                      }}
                      className="dropdown-btn dropdown-btn-elder d-flex justify-content-between align-items-center"
                    >
                      {formik.values.elder?.name
                        ? formik.values.elder?.name
                        : t("chooseElder")}
                      <TiArrowSortedUp
                        className={`dropdown-icon ${
                          toggle.elders ? "active" : ""
                        }`}
                      />
                    </button>
                    <div
                      className={`dropdown-content ${
                        toggle.elders ? "active" : ""
                      }`}
                    >
                      {approvedScholars?.map((scholar) => (
                        <button
                          type="button"
                          key={scholar.id}
                          className={`item ${
                            formik.values.elder.id === scholar.id
                              ? "active"
                              : ""
                          }`}
                          value={scholar.id}
                          name="elder"
                          onClick={() => {
                            setToggle({
                              ...toggle,
                              elders: !toggle.elders,
                            });
                            formik.setFieldValue("elder", {
                              name: scholar.name,
                              id: scholar.id,
                            });
                          }}
                        >
                          {scholar.name}
                        </button>
                      ))}
                    </div>
                  </div>
                  {formik.errors.elder?.name && formik.touched.elder?.name ? (
                    <span className="error">{formik.errors.elder?.name}</span>
                  ) : null}
                </div>
                <div className="form-group-container d-flex flex-column align-items-end mt-3">
                  <label htmlFor="content" className="form-label">
                    {t("articles.columns.article")}
                  </label>
                  <textarea
                    className="form-input"
                    id="content"
                    placeholder={t("articles.columns.article")}
                    name="content"
                    value={formik.values.content}
                    onChange={handleInput}
                  ></textarea>
                  {formik.errors.content && formik.touched.content ? (
                    <span className="error">{formik.errors.content}</span>
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
      {/* Edit Article */}
      <Modal
        isOpen={toggle.edit}
        toggle={() => {
          setToggle({ ...toggle, edit: !toggle.edit });
          formik.handleReset();
        }}
        centered={true}
        keyboard={true}
        size={"md"}
        contentClassName="modal-add-scholar"
      >
        <ModalHeader
          toggle={() => {
            setToggle({ ...toggle, edit: !toggle.edit });
            formik.handleReset();
          }}
        >
          {t("articles.editTitle")}
          <IoMdClose
            onClick={() => {
              setToggle({ ...toggle, edit: !toggle.edit });
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
                    htmlFor={
                      formik.values.image?.file
                        ? ""
                        : formik.values.image?.file === undefined
                        ? ""
                        : "image"
                    }
                    className="form-label d-flex justify-content-center align-items-center"
                  >
                    <img
                      src={
                        formik.values.image?.file
                          ? formik.values.image?.preview
                          : formik.values.image?.file === undefined
                          ? formik.values.image
                          : anonymous
                      }
                      alt="avatar"
                      className="image-preview"
                      onClick={() =>
                        formik.values.image?.file
                          ? setToggle({
                              ...toggle,
                              imagePreview: !toggle.imagePreview,
                            })
                          : formik.values.image?.file === undefined
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
                            formik.values.image?.file
                              ? formik.values.image?.preview
                              : formik.values.image?.file === undefined
                              ? formik.values.image
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
              <Col lg={7} className="mb-3">
                <div
                  className="form-group-container d-flex flex-column align-items-end mb-3"
                  style={{ marginTop: "-4px" }}
                >
                  <label htmlFor="title" className="form-label">
                    {t("articles.columns.title")}
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    id="title"
                    placeholder={t("articles.columns.title")}
                    name="title"
                    value={formik.values.title}
                    onChange={handleInput}
                  />
                  {formik.errors.title && formik.touched.title ? (
                    <span className="error">{formik.errors.title}</span>
                  ) : null}
                </div>
                <div className="form-group-container d-flex flex-column align-items-end mb-3">
                  <label htmlFor="articleCategories" className="form-label">
                    {t("articles.columns.category")}
                  </label>
                  <div
                    className={`dropdown form-input ${
                      toggle.articleCategories ? "active" : ""
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setToggle({
                          ...toggle,
                          articleCategories: !toggle.articleCategories,
                        });
                      }}
                      className="dropdown-btn dropdown-btn-audio-category d-flex justify-content-between align-items-center"
                    >
                      {formik.values.articleCategories?.title
                        ? formik.values.articleCategories?.title
                        : t("chooseCategory")}
                      <TiArrowSortedUp
                        className={`dropdown-icon ${
                          toggle.articleCategories ? "active" : ""
                        }`}
                      />
                    </button>
                    <div
                      className={`dropdown-content ${
                        toggle.articleCategories ? "active" : ""
                      }`}
                    >
                      {articleCategories?.map((category) => (
                        <button
                          type="button"
                          key={category?.id}
                          className={`item ${
                            formik.values.articleCategories?.id === category?.id
                              ? "active"
                              : ""
                          }`}
                          value={category?.id}
                          name="articleCategories"
                          onClick={() => {
                            setToggle({
                              ...toggle,
                              articleCategories: !toggle.articleCategories,
                            });
                            formik.setFieldValue("articleCategories", {
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
                  {formik.errors.articleCategories?.title &&
                  formik.touched.articleCategories?.title ? (
                    <span className="error">
                      {formik.errors.articleCategories?.title}
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
                <div className="form-group-container d-flex flex-column justify-content-center align-items-end mb-3">
                  <label htmlFor="elder" className="form-label">
                    {t("elder")}
                  </label>
                  <div
                    className={`dropdown form-input ${
                      toggle.elders ? "active" : ""
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setToggle({
                          ...toggle,
                          elders: !toggle.elders,
                        });
                      }}
                      className="dropdown-btn dropdown-btn-elder d-flex justify-content-between align-items-center"
                    >
                      {formik.values.elder?.name
                        ? formik.values.elder?.name
                        : t("chooseElder")}
                      <TiArrowSortedUp
                        className={`dropdown-icon ${
                          toggle.elders ? "active" : ""
                        }`}
                      />
                    </button>
                    <div
                      className={`dropdown-content ${
                        toggle.elders ? "active" : ""
                      }`}
                    >
                      {approvedScholars?.map((elder) => (
                        <button
                          type="button"
                          key={elder.id}
                          className={`item ${
                            formik.values.elder.id === elder.id ? "active" : ""
                          }`}
                          value={elder.id}
                          name="elder"
                          onClick={() => {
                            setToggle({
                              ...toggle,
                              elders: !toggle.elders,
                            });
                            formik.setFieldValue("elder", {
                              name: elder.name,
                              id: elder.id,
                            });
                          }}
                        >
                          {elder.name}
                        </button>
                      ))}
                    </div>
                  </div>
                  {formik.errors.elder?.name && formik.touched.elder?.name ? (
                    <span className="error">{formik.errors.elder?.name}</span>
                  ) : null}
                </div>
                <div className="form-group-container d-flex flex-column align-items-end">
                  <label htmlFor="content" className="form-label">
                    {t("articles.columns.article")}
                  </label>
                  <textarea
                    className="form-input"
                    id="content"
                    placeholder={t("articles.columns.article")}
                    name="content"
                    value={formik.values.content}
                    onChange={handleInput}
                  ></textarea>
                  {formik.errors.content && formik.touched.content ? (
                    <span className="error">{formik.errors.content}</span>
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
      {/* Read More */}
      <Modal
        isOpen={toggle.readMore}
        toggle={() =>
          setToggle({
            ...toggle,
            readMore: !toggle.readMore,
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
              readMore: !toggle.readMore,
            })
          }
        >
          {formik.values?.title}
          <IoMdClose
            onClick={() =>
              setToggle({
                ...toggle,
                readMore: !toggle.readMore,
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
            <div className="content text-end">{formik.values?.content}</div>
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

export default Articles;
