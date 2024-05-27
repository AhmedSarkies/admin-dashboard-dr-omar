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
import { FaEdit, FaRegCalendar, FaUser } from "react-icons/fa";
import { ImUpload } from "react-icons/im";
import { IoMdClose, IoMdEye } from "react-icons/io";
import anonymous from "../../assets/images/anonymous.png";
import {
  deleteArticleApi,
  getArticlesApi,
  addArticleApi,
  updateArticleApi,
  getArticlesCategoriesApi,
} from "../../store/slices/articleSlice";
import { useFormik } from "formik";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { useFiltration, useSchema } from "../../hooks";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";
import ReactQuill from "react-quill";

const initialValues = {
  image: {
    file: "",
    preview: "",
  },
  title: "",
  content: "",
  writer: "",
  articleCategories: {
    title: "",
    id: "",
  },
  status: "",
  is_active: "",
  showWriter: "",
};

const Articles = () => {
  const { t } = useTranslation();
  const module = {
    toolbar: [
      [{ header: "1" }, { header: "2" }, { font: [] }],
      [{ size: ["small", false, "large", "huge"] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image", "video"],
      ["clean"],
      ["code-block"],
      [
        {
          list: "bullet",
        },
        {
          list: "ordered",
        },
        {
          list: "check",
        },
        {
          align: ["", "center", "right", "justify"],
        },
      ],
      [
        {
          color: [],
        },
        {
          background: [],
        },
      ],
    ],
  };
  const role = Cookies.get("_role");
  const getArticlesCookies = Cookies.get("GetArticles");
  const addArticlesCookies = Cookies.get("addArticles");
  const editArticlesCookies = Cookies.get("editArticles");
  const deleteArticlesCookies = Cookies.get("deleteArticles");
  const dispatch = useDispatch();
  const { validationSchema } = useSchema();
  const fileRef = useRef();
  const { articles, articleCategories, loading, error } = useSelector(
    (state) => state.article
  );
  const [toggle, setToggle] = useState({
    add: false,
    edit: false,
    searchTerm: "",
    imagePreview: false,
    readMore: false,
    status: false,
    is_active: false,
    article: {},
    showWriter: false,
    elders: false,
    articleCategories: false,
    activeColumn: false,
    toggleColumns: {
      id: true,
      writer: true,
      image: true,
      title: true,
      content: true,
      category: true,
      status: true,
      visitCount: true,
      favorites: true,
      shares: true,
      activation: true,
      showWriter: true,
      control: true,
    },
    sortColumn: "",
    sortOrder: "asc",
    rowsPerPage: 5,
    currentPage: 1,
  });

  const data = articles?.map((article) => {
    return {
      ...article,
      is_active: article?.is_active === 1 ? t("active") : t("inactive"),
      status: article?.status === "Public" ? t("public") : t("private"),
      showWriter: article?.showWriter === 1 ? t("show") : t("hide"),
    };
  });

  // Filtration, Sorting, Pagination
  // Columns
  const columns = [
    { id: 0, name: "id", label: t("index") },
    { id: 1, name: "writer", label: t("articles.columns.writer") },
    { id: 2, name: "image", label: t("articles.columns.image") },
    { id: 3, name: "title", label: t("articles.columns.title") },
    { id: 4, name: "content", label: t("articles.columns.article") },
    { id: 5, name: "category", label: t("articles.columns.category") },
    { id: 6, name: "status", label: t("content") },
    { id: 7, name: "visitCount", label: t("visits") },
    { id: 8, name: "favorites", label: t("favorites") },
    { id: 9, name: "shares", label: t("shares") },
    { id: 10, name: "activation", label: t("activation") },
    { id: 11, name: "showWriter", label: t("showWriter") },
    { id: 12, name: "control", label: t("action") },
  ];
  const {
    PaginationUI,
    handleSort,
    handleSearch,
    handleToggleColumns,
    searchResultsArticleSCategoryAndTitleAndAuthor,
  } = useFiltration({
    rowData: data,
    toggle,
    setToggle,
  });

  // Formik
  const formik = useFormik({
    initialValues,
    validationSchema: validationSchema.article,
    onSubmit: (values) => {
      if (
        role === "admin" ||
        (addArticlesCookies === "1" && getArticlesCookies === "1") ||
        (editArticlesCookies === "1" && getArticlesCookies === "1")
      ) {
        const formData = new FormData();
        formData.append("title", values.title);
        formData.append("content", values.content);
        formData.append("writer", values.writer);
        formData.append("is_active", values.is_active);
        formData.append("showWriter", values.showWriter);
        formData.append("articles_categories_id", values.articleCategories.id);
        formData.append("status", values.status);
        if (values?.id) {
          // if the article don't change anything even the image
          const article = articles.find(
            (article) => article?.id === values?.id
          );
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
                setToggle({
                  ...toggle,
                  edit: !toggle.edit,
                  add: !toggle.add,
                });
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
        file: "",
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
      image: {
        file: "",
        preview: article?.image,
      },
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
      writer: article.writer,
      articles_categories_id: article.Category.id,
      status: article?.status === t("public") ? "Public" : "Private",
      is_active: article?.is_active === t("active") ? 1 : 0,
      showWriter: article?.showWriter === t("show") ? 1 : 0,
    });
    setToggle({
      ...toggle,
      edit: !toggle.edit,
      add: !toggle.add,
    });
  };

  // Delete article
  const handleDelete = (article) => {
    if (role === "admin" || deleteArticlesCookies === "1") {
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
              dispatch(getArticlesApi());
              if (
                toggle.currentPage > 1 &&
                searchResultsArticleSCategoryAndTitleAndAuthor.length === 1
              ) {
                setToggle({
                  ...toggle,
                  currentPage: toggle.currentPage - 1,
                });
              }
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
              dispatch(getArticlesApi());
              toast.error(t("toast.article.deletedError"));
            }
          });
        }
      });
    }
  };

  // get data from api
  useEffect(() => {
    try {
      if (role === "admin" || getArticlesCookies === "1") {
        dispatch(getArticlesApi());
      }
      if (
        role === "admin" ||
        addArticlesCookies === "1" ||
        editArticlesCookies === "1"
      ) {
        dispatch(getArticlesCategoriesApi());
      }
      if (getArticlesCookies === "0") {
        Cookies.set("addArticle", 0, {
          expires: 30,
          secure: true,
          sameSite: "strict",
          path: "/",
        });
        Cookies.set("editArticle", 0, {
          expires: 30,
          secure: true,
          sameSite: "strict",
          path: "/",
        });
        Cookies.set("deleteArticle", 0, {
          expires: 30,
          secure: true,
          sameSite: "strict",
          path: "/",
        });
      }
    } catch (error) {
      console.log(error);
    }
  }, [
    dispatch,
    role,
    getArticlesCookies,
    addArticlesCookies,
    editArticlesCookies,
  ]);

  return (
    <div className="scholar-container mt-4 m-sm-3 m-0">
      {(role === "admin" ||
        (addArticlesCookies === "1" && getArticlesCookies === "1")) && (
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
            {t("articles.addTitle")}
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
              placeholder={t("searchArticle")}
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
              {toggle.toggleColumns.id && (
                <th className="table-th" onClick={() => handleSort(columns[0])}>
                  {t("index")}
                </th>
              )}
              {toggle.toggleColumns.image && (
                <th className="table-th" onClick={() => handleSort(columns[1])}>
                  {t("articles.columns.image")}
                  {toggle.sortColumn === columns[1].name ? (
                    toggle.sortOrder === "asc" ? (
                      <TiArrowSortedUp />
                    ) : (
                      <TiArrowSortedDown />
                    )
                  ) : null}
                </th>
              )}
              {toggle.toggleColumns.title && (
                <th className="table-th" onClick={() => handleSort(columns[2])}>
                  {t("articles.columns.title")}
                  {toggle.sortColumn === columns[2].name ? (
                    toggle.sortOrder === "asc" ? (
                      <TiArrowSortedUp />
                    ) : (
                      <TiArrowSortedDown />
                    )
                  ) : null}
                </th>
              )}
              {toggle.toggleColumns.writer && (
                <th className="table-th" onClick={() => handleSort(columns[3])}>
                  {t("articles.columns.writer")}
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
                  {t("content")}
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
              {toggle.toggleColumns.favorites && (
                <th className="table-th" onClick={() => handleSort(columns[8])}>
                  {t("favorites")}
                  {toggle.sortColumn === columns[8].name ? (
                    toggle.sortOrder === "asc" ? (
                      <TiArrowSortedUp />
                    ) : (
                      <TiArrowSortedDown />
                    )
                  ) : null}
                </th>
              )}
              {toggle.toggleColumns.shares && (
                <th className="table-th" onClick={() => handleSort(columns[9])}>
                  {t("shares")}
                  {toggle.sortColumn === columns[9].name ? (
                    toggle.sortOrder === "asc" ? (
                      <TiArrowSortedUp />
                    ) : (
                      <TiArrowSortedDown />
                    )
                  ) : null}
                </th>
              )}
              {toggle.toggleColumns.activation && (
                <th
                  className="table-th"
                  onClick={() => handleSort(columns[10])}
                >
                  {t("activation")}
                  {toggle.sortColumn === columns[10].name ? (
                    toggle.sortOrder === "asc" ? (
                      <TiArrowSortedUp />
                    ) : (
                      <TiArrowSortedDown />
                    )
                  ) : null}
                </th>
              )}
              {toggle.toggleColumns.showWriter && (
                <th
                  className="table-th"
                  onClick={() => handleSort(columns[11])}
                >
                  {t("showWriter")}
                  {toggle.sortColumn === columns[11].name ? (
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
                  onClick={() => handleSort(columns[12])}
                >
                  {t("action")}
                  {toggle.sortColumn === columns[12].name ? (
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
                <td className="table-td" colSpan="13">
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
                <td className="table-td" colSpan="13">
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
          {searchResultsArticleSCategoryAndTitleAndAuthor.length === 0 &&
            error === null &&
            !loading && (
              <tbody>
                <tr className="no-data-container">
                  <td className="table-td" colSpan="13">
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
                <td className="table-td" colSpan="13">
                  <p className="no-data no-columns mb-0">{t("noColumns")}</p>
                </td>
              </tr>
            </tbody>
          )}
          {/* Data */}
          {searchResultsArticleSCategoryAndTitleAndAuthor?.length > 0 &&
            error === null &&
            loading === false && (
              <tbody>
                {searchResultsArticleSCategoryAndTitleAndAuthor?.map(
                  (result, idx) => (
                    <tr key={result?.id + new Date().getDate()}>
                      {toggle.toggleColumns?.id && (
                        <td className="table-td">{idx + 1}#</td>
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
                      {toggle.toggleColumns.writer && (
                        <td className="table-td title">{result?.writer}</td>
                      )}
                      {toggle.toggleColumns.content && (
                        <td className="table-td article">
                          {result?.content?.length >= 50
                            ? result?.content?.slice(0, 50) + "..."
                            : result?.content}
                        </td>
                      )}
                      {toggle.toggleColumns.category && (
                        <td className="table-td title">
                          {result?.Category.title}
                        </td>
                      )}
                      {toggle.toggleColumns.status && (
                        <td className="table-td">
                          <span
                            className="table-status badge"
                            style={{
                              backgroundColor:
                                result?.status === t("public")
                                  ? "green"
                                  : "red",
                              cursor:
                                role === "admin" ||
                                (editArticlesCookies === "1" &&
                                  getArticlesCookies === "1")
                                  ? "pointer"
                                  : "default",
                            }}
                            onClick={() => {
                              if (
                                role === "admin" ||
                                (editArticlesCookies === "1" &&
                                  getArticlesCookies === "1")
                              ) {
                                const data = {
                                  id: result.id,
                                  title: result.title,
                                  content: result.content,
                                  writer: result.writer,
                                  articles_categories_id: result.Category.id,
                                  status:
                                    result?.status === t("public")
                                      ? "Private"
                                      : "Public",
                                  is_active:
                                    result?.is_active === t("active") ? 1 : 0,
                                  showWriter:
                                    result?.showWriter === t("show") ? 1 : 0,
                                };
                                dispatch(updateArticleApi(data)).then((res) => {
                                  if (!res.error) {
                                    dispatch(getArticlesApi());
                                    toast.success(
                                      t("toast.article.updatedSuccess")
                                    );
                                  } else {
                                    dispatch(getArticlesApi());
                                    toast.error(
                                      t("toast.article.updatedError")
                                    );
                                  }
                                });
                              }
                            }}
                          >
                            {result?.status}
                          </span>
                        </td>
                      )}
                      {toggle.toggleColumns.visitCount && (
                        <td className="table-td">{result?.visit_count}</td>
                      )}
                      {toggle.toggleColumns.favorites && (
                        <td className="table-td">{result?.favorites_count}</td>
                      )}
                      {toggle.toggleColumns.shares && (
                        <td className="table-td">{result?.shares_count}</td>
                      )}
                      {toggle.toggleColumns.activation && (
                        <td className="table-td">
                          <span
                            className="table-status badge"
                            style={{
                              backgroundColor:
                                result?.is_active === t("active")
                                  ? "green"
                                  : "red",
                              cursor:
                                role === "admin" ||
                                (editArticlesCookies === "1" &&
                                  getArticlesCookies === "1")
                                  ? "pointer"
                                  : "default",
                            }}
                            onClick={() => {
                              if (
                                role === "admin" ||
                                (editArticlesCookies === "1" &&
                                  getArticlesCookies === "1")
                              ) {
                                const data = {
                                  id: result.id,
                                  title: result.title,
                                  content: result.content,
                                  writer: result.writer,
                                  articles_categories_id: result.Category.id,
                                  status:
                                    result?.status === t("public")
                                      ? "Public"
                                      : "Private",
                                  is_active:
                                    result?.is_active === t("active") ? 0 : 1,
                                  showWriter:
                                    result?.showWriter === t("show") ? 1 : 0,
                                };
                                dispatch(updateArticleApi(data)).then((res) => {
                                  if (!res.error) {
                                    dispatch(getArticlesApi());
                                    toast.success(
                                      t("toast.article.updatedSuccess")
                                    );
                                  } else {
                                    dispatch(getArticlesApi());
                                    toast.error(
                                      t("toast.article.updatedError")
                                    );
                                  }
                                });
                              }
                            }}
                          >
                            {result?.is_active}
                          </span>
                        </td>
                      )}
                      {toggle.toggleColumns.showWriter && (
                        <td className="table-td">
                          <span
                            className="table-status badge"
                            style={{
                              backgroundColor:
                                result?.showWriter === t("show")
                                  ? "green"
                                  : "red",
                              cursor:
                                role === "admin" ||
                                (editArticlesCookies === "1" &&
                                  getArticlesCookies === "1")
                                  ? "pointer"
                                  : "default",
                            }}
                            onClick={() => {
                              if (
                                role === "admin" ||
                                (editArticlesCookies === "1" &&
                                  getArticlesCookies === "1")
                              ) {
                                const data = {
                                  id: result.id,
                                  title: result.title,
                                  content: result.content,
                                  writer: result.writer,
                                  articles_categories_id: result.Category.id,
                                  status:
                                    result?.status === t("public")
                                      ? "Public"
                                      : "Private",
                                  is_active:
                                    result?.is_active === t("active") ? 1 : 0,
                                  showWriter:
                                    result?.showWriter === t("show") ? 0 : 1,
                                };
                                dispatch(updateArticleApi(data)).then((res) => {
                                  if (!res.error) {
                                    dispatch(getArticlesApi());
                                    toast.success(
                                      t("toast.article.updatedSuccess")
                                    );
                                  } else {
                                    dispatch(getArticlesApi());
                                    toast.error(
                                      t("toast.article.updatedError")
                                    );
                                  }
                                });
                              }
                            }}
                          >
                            {result?.showWriter}
                          </span>
                        </td>
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
                                formik.setValues(result);
                              }}
                            />
                            {(role === "admin" ||
                              editArticlesCookies === "1") && (
                              <FaEdit
                                className="edit-btn"
                                onClick={() => handleEdit(result)}
                              />
                            )}
                            {(role === "admin" ||
                              deleteArticlesCookies === "1") && (
                              <MdDeleteOutline
                                className="delete-btn"
                                onClick={() => handleDelete(result)}
                              />
                            )}
                          </span>
                        </td>
                      )}
                    </tr>
                  )
                )}
              </tbody>
            )}
        </table>
      </div>
      {(role === "admin" ||
        (getArticlesCookies === "1" && editArticlesCookies === "1") ||
        (addArticlesCookies === "1" && getArticlesCookies === "1")) && (
        <>
          {/* Add/Edit Article */}
          <Modal
            isOpen={toggle.add}
            toggle={() => {
              formik.handleReset();
              setToggle({
                ...toggle,
                add: !toggle.add,
                edit: !toggle.edit,
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
                  edit: false,
                });
              }}
            >
              {formik.values.id
                ? t("articles.editTitle")
                : t("articles.addTitle")}
              <IoMdClose
                onClick={() => {
                  formik.handleReset();
                  setToggle({
                    ...toggle,
                    add: !toggle.add,
                    edit: false,
                  });
                }}
              />
            </ModalHeader>
            <ModalBody>
              <form className="overlay-form" onSubmit={formik.handleSubmit}>
                <Row className="d-flex justify-content-center align-items-center p-3 pb-0">
                  {formik.values.id ? (
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
                  ) : (
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
                  )}
                  <Col lg={7}>
                    <div
                      className="form-group-container d-flex flex-column align-items-end mb-3"
                      style={{ marginTop: "-4px" }}
                    >
                      <label htmlFor="writer" className="form-label">
                        {t("articles.columns.writer")}
                      </label>
                      <input
                        type="text"
                        className="form-input"
                        id="writer"
                        placeholder={t("articles.columns.writer")}
                        name="writer"
                        value={formik.values.writer}
                        onChange={handleInput}
                      />
                      {formik.errors.writer && formik.touched.writer ? (
                        <span className="error">{formik.errors.writer}</span>
                      ) : null}
                    </div>
                    <div className="form-group-container d-flex flex-column justify-content-center align-items-end">
                      <label htmlFor="showWriter" className="form-label">
                        {t("showWriter")}
                      </label>
                      <div className="dropdown form-input">
                        <button
                          type="button"
                          onClick={() => {
                            setToggle({
                              ...toggle,
                              showWriter: !toggle.showWriter,
                            });
                          }}
                          className="dropdown-btn d-flex justify-content-between align-items-center"
                        >
                          {formik.values.showWriter === 1
                            ? t("show")
                            : formik.values.showWriter === 0
                            ? t("hide")
                            : t("showWriter")}
                          <TiArrowSortedUp
                            className={`dropdown-icon ${
                              toggle.showWriter ? "active" : ""
                            }`}
                          />
                        </button>
                        <div
                          className={`dropdown-content ${
                            toggle.showWriter ? "active" : ""
                          }`}
                        >
                          <button
                            type="button"
                            className={`item ${
                              formik.values.showWriter === 0 ? "active" : ""
                            }`}
                            value="hide"
                            name="showWriter"
                            onClick={(e) => {
                              setToggle({
                                ...toggle,
                                showWriter: !toggle.showWriter,
                              });
                              formik.setFieldValue("showWriter", 0);
                            }}
                          >
                            {t("hide")}
                          </button>
                          <button
                            type="button"
                            className={`item ${
                              formik.values.showWriter === 1 ? "active" : ""
                            }`}
                            value="show"
                            name="showWriter"
                            onClick={(e) => {
                              setToggle({
                                ...toggle,
                                showWriter: !toggle.showWriter,
                              });
                              formik.setFieldValue("showWriter", 1);
                            }}
                          >
                            {t("show")}
                          </button>
                        </div>
                      </div>
                      {formik.errors.showWriter && formik.touched.showWriter ? (
                        <span className="error">
                          {formik.errors.showWriter}
                        </span>
                      ) : null}
                    </div>
                  </Col>
                </Row>
                <Row className="d-flex flex-row-reverse justify-content-center align-items-center p-3 pb-0">
                  <Col lg={6}>
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
                  </Col>
                  <Col lg={6}>
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
                                formik.values.articleCategories?.id ===
                                category?.id
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
                  </Col>
                  <Col lg={6}>
                    <div className="form-group-container d-flex flex-column justify-content-center align-items-end mb-3">
                      <label htmlFor="status" className="form-label">
                        {t("content")}
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
                            : t("content")}
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
                  </Col>
                  <Col lg={6}>
                    <div className="form-group-container d-flex flex-column justify-content-center align-items-end mb-3">
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
                          {formik.values?.is_active === 1
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
                      {formik.errors.is_active && formik.touched.is_active ? (
                        <span className="error">{formik.errors.is_active}</span>
                      ) : null}
                    </div>
                  </Col>
                </Row>
                <Row className="d-flex justify-content-center align-items-center p-3 pt-0 pb-0">
                  <Col lg={12}>
                    <div className="form-group-container d-flex flex-column align-items-end">
                      <label htmlFor="content" className="form-label">
                        {t("articles.columns.article")}
                      </label>
                      <ReactQuill
                        className="form-input"
                        id="content"
                        name="content"
                        placeholder={t("articles.columns.article")}
                        theme="snow"
                        value={formik.values.content}
                        onChange={handleInput}
                        style={{
                          borderBottom: 0,
                          padding: "0.375rem 0",
                        }}
                        modules={module}
                      />
                      {formik.errors.content && formik.touched.content ? (
                        <span className="error">{formik.errors.content}</span>
                      ) : null}
                    </div>
                  </Col>
                </Row>
                <Row className="d-flex justify-content-center align-items-center p-3">
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
        </>
      )}
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
          <div className="read-more-container p-3 text-center">
            <h3 className="text-end mb-3">{formik.values?.title}</h3>
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
            <div className="d-flex justify-content-between align-items-center mb-3">
              <span
                className="d-flex justify-content-start align-items-center gap-2"
                style={{
                  backgroundColor:
                    formik.values?.status === t("public")
                      ? "green"
                      : formik.values?.status === t("private")
                      ? "red"
                      : "red",
                  color: "#fff",
                  padding: "0.2rem 0.5rem",
                  borderRadius: "5px",
                }}
              >
                {formik.values?.status}
              </span>
              <span
                className="d-flex justify-content-start align-items-center gap-2"
                style={{
                  backgroundColor: "green",
                  color: "#fff",
                  padding: "0.2rem 0.5rem",
                  borderRadius: "5px",
                }}
              >
                <span className="d-flex justify-content-center align-items-center">
                  <FaUser />
                </span>
                <span>{formik.values?.writer}</span>
              </span>
            </div>
            <div className="d-flex justify-content-end align-items-center mb-3">
              <span className="d-flex justify-content-start align-items-center gap-2">
                <span className="d-flex justify-content-center align-items-center">
                  <FaRegCalendar />
                </span>
                <span>{formik.values?.created_at}</span>
              </span>
            </div>
            <div className="content text-end">{formik.values?.content}</div>
            <div className="form-group-container d-flex justify-content-center align-items-center mt-3">
              <button
                className="cancel-btn"
                onClick={() =>
                  setToggle({
                    ...toggle,
                    readMore: !toggle.readMore,
                  })
                }
              >
                {t("cancel")}
              </button>
            </div>
          </div>
        </ModalBody>
      </Modal>
      {/* Pagination */}
      {searchResultsArticleSCategoryAndTitleAndAuthor?.length > 0 &&
        error === null &&
        loading === false && <PaginationUI />}
    </div>
  );
};

export default Articles;
