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

import {
  MdAdd,
  MdDeleteOutline,
  MdOutlineUnfoldMoreDouble,
} from "react-icons/md";
import {
  TiArrowLeft,
  TiArrowRight,
  TiArrowSortedDown,
  TiArrowSortedUp,
} from "react-icons/ti";
import { FaEdit } from "react-icons/fa";
import { ImUpload } from "react-icons/im";
import { IoMdClose } from "react-icons/io";

import anonymous from "../../assets/images/anonymous.png";

import {
  deleteArticleApi,
  getArticles,
  getArticlesApi,
  addArticleApi,
  updateArticleApi,
  getArticlesCategoriesApi,
  getArticlesCategories,
} from "../../store/slices/articleSlice";
import {
  getApprovedScholarsApi,
  getApprovedScholars,
} from "../../store/slices/scholarSlice";

import { useFormik } from "formik";

import { mixed, object, string } from "yup";

import Swal from "sweetalert2";

import { toast } from "react-toastify";
import useFiltration from "../../hooks/useFiltration";

const validationSchema = object().shape({
  title: string().required("يجب ادخال عنوان المقال"),
  status: string(),
  // Validation for image file must be uploaded with the form or just string
  image: mixed().test("fileSize", "يجب اختيار صورة", (value) => {
    if (value.file) {
      return value.file.size <= 2097152;
    }
    if (typeof value === "string") {
      return true;
    }
  }),
  content: string(),
  elder: object().shape({
    name: string().required("يجب ادخال اسم العالم"),
  }),
  articleCategories: object().shape({
    title: string().required("يجب ادخال تصنيف المقال"),
  }),
});
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
  status: "الحالة",
};

const Articles = () => {
  const dispatch = useDispatch();
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
      image: true,
      title: true,
      content: true,
      readMore: true,
      status: true,
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
    { id: 1, name: "image", label: "الصورة" },
    { id: 2, name: "title", label: "العنوان" },
    { id: 3, name: "content", label: "المقال" },
    { id: 4, name: "readMore", label: "قراءة المزيد" },
    { id: 5, name: "status", label: "الحالة" },
    { id: 6, name: "control", label: "الإجراءات" },
  ];
  const {
    PaginationUI,
    handleSort,
    handleSearch,
    handleToggleColumns,
    results,
    rowData,
  } = useFiltration({
    rowData: articles,
    toggle,
    setToggle,
  });

  // Formik
  const formik = useFormik({
    initialValues,
    validationSchema,
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
          toast.error("لم تقم بتغيير اي شيء");
          return;
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
        title: article?.articleCategories?.title,
        id: article?.articleCategories?.id,
      },
      status: article?.status,
    });
  };

  // Delete article
  const handleDelete = (article) => {
    Swal.fire({
      title: `هل انت متأكد من حذف ${article?.title}؟`,
      text: "لن تتمكن من التراجع عن هذا الاجراء!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#0d1d34",
      confirmButtonText: "نعم, احذفه!",
      cancelButtonText: "الغاء",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteArticleApi(article?.id)).then((res) => {
          if (!res.error) {
            dispatch(getArticlesApi());
            Swal.fire({
              title: `تم حذف ${article?.title}`,
              text: `تم حذف ${article?.title} بنجاح`,
              icon: "success",
              confirmButtonColor: "#0d1d34",
            });
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
          إضافة مقال
        </button>
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
            dir="rtl"
          >
            إضافة مقال جديد
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
                              حذف
                            </button>
                          </div>
                        </ModalFooter>
                      </Modal>
                    </label>
                  </div>
                  <div className="form-group-container d-flex justify-content-lg-start justify-content-center flex-row-reverse">
                    <label htmlFor="image" className="form-label">
                      <ImUpload /> اختر صورة
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
                <Col lg={7} className="mb-3">
                  <div
                    className="form-group-container d-flex flex-column align-items-end mb-3"
                    style={{ marginTop: "-4px" }}
                  >
                    <label htmlFor="title" className="form-label">
                      عنوان المقال
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      id="title"
                      placeholder="عنوان المقال"
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
                      التصنيف
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
                          : "اختر التصنيف"}
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
                  <div className="form-group-container d-flex flex-column justify-content-center align-items-end mb-3">
                    <label htmlFor="status" className="form-label">
                      الحالة
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
                          ? "خاص"
                          : formik.values.status === "Public"
                          ? "عام"
                          : "الحالة"}
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
                          خاص
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
                          عام
                        </button>
                      </div>
                    </div>
                    {formik.errors.status && formik.touched.status ? (
                      <span className="error">{formik.errors.status}</span>
                    ) : null}
                  </div>
                  <div className="form-group-container d-flex flex-column justify-content-center align-items-end">
                    <label htmlFor="elder" className="form-label">
                      العالم
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
                          : "اختر العالم"}
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
                </Col>
                <Col lg={12} className="mb-3">
                  <div className="form-group-container d-flex flex-column align-items-end gap-3">
                    <label htmlFor="content" className="form-label">
                      المحتوى
                    </label>
                    <textarea
                      className="form-input"
                      id="content"
                      placeholder="...اكتب مقالك هنا"
                      name="content"
                      value={formik.values.content}
                      onChange={handleInput}
                    ></textarea>
                  </div>
                  {formik.errors.content && formik.touched.content ? (
                    <span className="error">{formik.errors.content}</span>
                  ) : null}
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
                        "إضافة"
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
                      الغاء
                    </button>
                  </div>
                </Col>
              </Row>
            </form>
          </ModalBody>
        </Modal>
      </div>
      <div className="scholar">
        <div className="table-header">
          {/* Search */}
          <div className="search-container form-group-container form-input">
            <input
              type="text"
              className="form-input"
              placeholder="بحث"
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
              <span>الاعمدة</span>
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
                  الصورة
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
                  العنوان
                  {toggle.sortColumn === columns[1].name ? (
                    toggle.sortOrder === "asc" ? (
                      <TiArrowSortedUp />
                    ) : (
                      <TiArrowSortedDown />
                    )
                  ) : null}
                </th>
              )}
              {toggle.toggleColumns.content && (
                <th className="table-th" onClick={() => handleSort(columns[2])}>
                  المقال
                  {toggle.sortColumn === columns[2].name ? (
                    toggle.sortOrder === "asc" ? (
                      <TiArrowSortedUp />
                    ) : (
                      <TiArrowSortedDown />
                    )
                  ) : null}
                </th>
              )}
              {toggle.toggleColumns.readMore && (
                <th className="table-th" onClick={() => handleSort(columns[3])}>
                  قراءة المزيد
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
                  الحالة
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
                <th className="table-th" onClick={() => handleSort(columns[5])}>
                  الإجراءات
                  {toggle.sortColumn === columns[5].name ? (
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
                <td className="table-td" colSpan="6">
                  <p className="no-data mb-0">
                    {error === "Network Error"
                      ? "حدث خطأ في الشبكة"
                      : error === "Request failed with status code 404"
                      ? "لا يوجد بيانات"
                      : error === "Request failed with status code 500"
                      ? "حدث خطأ في الخادم"
                      : "حدث خطأ ما"}
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
          {rowData.length === 0 && error === null && !loading && (
            <tbody>
              <tr className="no-data-container">
                <td className="table-td" colSpan="6">
                  <p className="no-data mb-0">لا يوجد بيانات</p>
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
                  <p className="no-data no-columns mb-0">لا يوجد اعمدة</p>
                </td>
              </tr>
            </tbody>
          )}
          {/* Data */}
          {rowData.length > 0 && error === null && loading === false && (
            <tbody>
              {rowData?.map((result) => (
                <tr key={result?.id + new Date().getDate()}>
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
                  {toggle.toggleColumns.status && (
                    <td className="table-td">
                      <span
                        className="table-status badge"
                        style={{
                          backgroundColor:
                            result?.status === "public"
                              ? "green"
                              : result?.status === "private"
                              ? "red"
                              : "red",
                        }}
                      >
                        {result?.status === "public"
                          ? "عام"
                          : result?.status === "private"
                          ? "خاص"
                          : "خاص"}
                      </span>
                    </td>
                  )}
                  {toggle.toggleColumns.readMore && (
                    <td className="table-td read-more">
                      <MdOutlineUnfoldMoreDouble
                        onClick={() => {
                          setToggle({
                            ...toggle,
                            readMore: !toggle.readMore,
                          });
                          handleEdit(result);
                        }}
                      />
                    </td>
                  )}
                  {toggle.toggleColumns.control && (
                    <td className="table-td">
                      <span className="table-btn-container">
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
                  dir="rtl"
                >
                  تعديل {formik.values?.title}
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
                                    حذف
                                  </button>
                                </div>
                              </ModalFooter>
                            </Modal>
                          </label>
                        </div>
                        <div className="form-group-container d-flex justify-content-lg-start justify-content-center flex-row-reverse">
                          <label htmlFor="image" className="form-label">
                            <ImUpload /> اختر صورة
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
                      <Col lg={7} className="mb-3">
                        <div
                          className="form-group-container d-flex flex-column align-items-end mb-3"
                          style={{ marginTop: "-4px" }}
                        >
                          <label htmlFor="title" className="form-label">
                            عنوان المقال
                          </label>
                          <input
                            type="text"
                            className="form-input"
                            id="title"
                            placeholder="عنوان المقال"
                            name="title"
                            value={formik.values.title}
                            onChange={handleInput}
                          />
                          {formik.errors.title && formik.touched.title ? (
                            <span className="error">{formik.errors.title}</span>
                          ) : null}
                        </div>
                        <div className="form-group-container d-flex flex-column align-items-end mb-3">
                          <label
                            htmlFor="articleCategories"
                            className="form-label"
                          >
                            التصنيف
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
                                : "اختر التصنيف"}
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
                                      articleCategories:
                                        !toggle.articleCategories,
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
                            الحالة
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
                                ? "خاص"
                                : formik.values.status === "Public"
                                ? "عام"
                                : "الحالة"}
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
                                  formik.values.status === "Private"
                                    ? "active"
                                    : ""
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
                                خاص
                              </button>
                              <button
                                type="button"
                                className={`item ${
                                  formik.values.status === "Public"
                                    ? "active"
                                    : ""
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
                                عام
                              </button>
                            </div>
                          </div>
                          {formik.errors.status && formik.touched.status ? (
                            <span className="error">
                              {formik.errors.status}
                            </span>
                          ) : null}
                        </div>
                        <div className="form-group-container d-flex flex-column justify-content-center align-items-end">
                          <label htmlFor="elder" className="form-label">
                            العالم
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
                                : "اختر العالم"}
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
                                    formik.values.elder.id === elder.id
                                      ? "active"
                                      : ""
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
                          {formik.errors.elder?.name &&
                          formik.touched.elder?.name ? (
                            <span className="error">
                              {formik.errors.elder?.name}
                            </span>
                          ) : null}
                        </div>
                      </Col>
                      <Col lg={12} className="mb-3">
                        <div className="form-group-container d-flex flex-column align-items-end gap-3">
                          <label htmlFor="content" className="form-label">
                            المحتوى
                          </label>
                          <textarea
                            className="form-input"
                            id="content"
                            placeholder="...اكتب مقالك هنا"
                            name="content"
                            value={formik.values.content}
                            onChange={handleInput}
                          ></textarea>
                        </div>
                        {formik.errors.content && formik.touched.content ? (
                          <span className="error">{formik.errors.content}</span>
                        ) : null}
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
                              "حفظ"
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
                            الغاء
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
                  dir="rtl"
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
                      src={formik.values?.image?.preview}
                      alt={formik.values?.title || "avatar"}
                      className="read-more-image mb-3"
                      style={{
                        maxWidth: "700px",
                        maxHeight: "400px",
                        objectFit: "cover",
                      }}
                    />
                    <div className="content text-end">
                      {formik.values?.content}
                    </div>
                  </div>
                </ModalBody>
              </Modal>
            </tbody>
          )}
        </table>
      </div>
      {/* Pagination */}
      {results.length > 0 && error === null && loading === false && (
        <PaginationUI />
      )}
    </div>
  );
};

export default Articles;
