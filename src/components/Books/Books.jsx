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
import { FaBookReader, FaEdit, FaFileUpload } from "react-icons/fa";
import { ImUpload } from "react-icons/im";
import { IoMdClose } from "react-icons/io";
import anonymous from "../../assets/images/anonymous.png";
import {
  getBooksApi,
  getBooks,
  getBooksCategoriesApi,
  getBooksCategories,
  addBookApi,
  updateBookApi,
  deleteBookApi,
  deleteBook,
} from "../../store/slices/bookSlice";
import { useFormik } from "formik";
import Swal from "sweetalert2";
import { pdfjs } from "react-pdf";
import useFiltration from "../../hooks/useFiltration";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import useSchema from "../../hooks/useSchema";

const initialValues = {
  title: "",
  image: {
    file: "",
    preview: "",
  },
  book: {
    file: "",
    preview: "",
  },
  status: "",
  bookCategory: {
    title: "",
    id: "",
  },
};

const Books = () => {
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    `pdfjs-dist/build/pdf.worker.min.mjs`,
    import.meta.url
  );
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { validationSchema } = useSchema();
  const fileRef = useRef();
  const { books, bookCategories, loading, error } = useSelector(
    (state) => state.book
  );
  const [toggle, setToggle] = useState({
    add: false,
    edit: false,
    imagePreview: false,
    readMore: false,
    status: false,
    elders: false,
    bookCategories: false,
    bookCategory: false,
    pdf: null,
    pages: 0,
    activeColumn: false,
    books,
    toggleColumns: {
      // imageElder: true,
      // nameElder: true,
      image: true,
      title: true,
      book: true,
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
    searchResults,
  } = useFiltration({
    rowData: books,
    toggle,
    setToggle,
  });
  // Columns
  const columns = [
    // { id: 1, name: "imageElder", label: t("books.columns.elder.image") },
    // { id: 2, name: "nameElder", label: t("books.columns.elder.name") },
    { id: 3, name: "image", label: t("books.columns.book.image") },
    { id: 4, name: "title", label: t("books.columns.book.title") },
    { id: 5, name: "book", label: t("books.columns.book.book") },
    { id: 6, name: "status", label: t("status") },
    { id: 7, name: "control", label: t("action") },
  ];

  // Formik
  const formik = useFormik({
    initialValues,
    validationSchema: validationSchema.book,
    onSubmit: (values) => {
      const formData = new FormData();
      formData.append("name", values.title);
      formData.append("file", toggle.pdf.file);
      formData.append("image", values.image?.file);
      formData.append("categories_id", values.bookCategory?.id);
      formData.append("status", values.status);
      // if (values.image.file !== "") {
      //   formData.append("image", values.image.file);
      // }
      // if (toggle.pdf.file !== "") {
      //   formData.append("file", toggle.pdf.file);
      // }
      if (values.isEditing) {
        // Update Book
        dispatch(updateBookApi(formData)).then((res) => {
          if (!res.error) {
            dispatch(getBooksApi());
            setToggle({
              ...toggle,
              edit: !toggle.edit,
            });
            formik.handleReset();
            toast.success(t("toast.book.addedSuccess"));
          } else {
            toast.error(t("toast.book.addedError"));
          }
        });
      } else {
        // Add Book
        dispatch(addBookApi(formData)).then((res) => {
          if (!res.error) {
            dispatch(getBooksApi());
            setToggle({
              ...toggle,
              add: !toggle.add,
            });
            formik.handleReset();
            toast.success(t("toast.book.addedSuccess"));
          } else {
            toast.error(t("toast.book.addedError"));
          }
        });
      }
    },
  });

  // Handle PDF Change
  const handlePDFChange = (e) => {
    try {
      const file = e.target.files[0];
      if (file) {
        setToggle({
          ...toggle,
          pdf: {
            file: file,
            preview: URL.createObjectURL(file),
          },
        });
      }
      // // Get Number Of Pages From PDF
      // const getNumberOfPages = (pdfUrl, callback) => {
      //   // Fetch the PDF file
      //   fetch(pdfUrl)
      //     .then((response) => response.arrayBuffer())
      //     .then((data) => {
      //       // Load the PDF data using PDF.js
      //       // eslint-disable-next-line no-undef
      //       pdfjsLib.getDocument(data).promise.then((pdfDoc) => {
      //         // Get the number of pages
      //         const numPages = pdfDoc.numPages;
      //         // Call the callback function with the number of pages
      //         callback(numPages);
      //       });
      //     })
      //     .catch((error) => {
      //       console.error("Error loading PDF:", error);
      //     });
      // };
      // if (file) {
      //   getNumberOfPages(URL.createObjectURL(file), (pages) => {
      //     setToggle({
      //       ...toggle,
      //       pages: pages,
      //     });
      //   });
      // }
    } catch (error) {
      console.log(error);
    }
  };

  // Handle Image Change
  const handleImageChange = (e) => {
    try {
      const file = e.currentTarget.files[0];
      if (file) {
        formik.setFieldValue("image", {
          file: file,
          preview: URL.createObjectURL(file),
        });
      }
    } catch (error) {
      console.log(error);
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

  // handle Edit
  const handleEdit = (book) => {
    formik.setValues(book);
    formik.setFieldValue("title", book?.name);
    formik.setFieldValue("status", book?.status);
    formik.setFieldValue("bookCategory", {
      title: book?.category?.title,
      id: book?.category?.id,
    });
    formik.setFieldValue("image", {
      file: "",
      preview: book?.image,
    });
    formik.setFieldValue("book", {
      file: "",
      preview: book?.file,
    });
    setToggle({
      ...toggle,
      edit: !toggle.edit,
    });
  };

  // Delete Book
  const handleDelete = (book) => {
    Swal.fire({
      title: t("titleDeleteAlert") + book?.title + "?",
      text: t("textDeleteAlert"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#0d1d34",
      confirmButtonText: t("confirmButtonText"),
      cancelButtonText: t("cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteBookApi(book?.id)).then((res) => {
          if (!res.error) {
            dispatch(deleteBook(book?.id));
            Swal.fire({
              title: `${t("titleDeletedSuccess")} ${book?.title}`,
              text: `${t("titleDeletedSuccess")} ${book?.title} ${t(
                "textDeletedSuccess"
              )}`,
              icon: "success",
              confirmButtonColor: "#0d1d34",
              confirmButtonText: t("doneDeletedSuccess"),
            }).then(() => toast.success(t("toast.book.deletedSuccess")));
          } else {
            toast.error(t("toast.book.deletedError"));
          }
        });
      }
    });
  };

  // get data from api
  useEffect(() => {
    try {
      dispatch(getBooksApi()).then((res) => {
        if (!res.error && res.payload.length > 0) {
          dispatch(getBooks(res.payload));
        }
      });
      dispatch(getBooksCategoriesApi()).then((res) => {
        if (!res.error && res.payload.length > 0) {
          dispatch(getBooksCategories(res.payload));
        }
      });
    } catch (error) {
      console.log(error);
    }
  }, [dispatch]);

  return (
    <div className="book-container scholar-container mt-4 m-3">
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
          {t("books.addTitle")}
        </button>
      </div>
      <div className="book scholar">
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
              {/*{toggle.toggleColumns.imageElder && (
                <th className="table-th" onClick={() => handleSort(columns[0])}>
                  {t("books.columns.elder.image")}
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
                  {t("books.columns.elder.name")}
                  {toggle.sortColumn === columns[1].name ? (
                    toggle.sortOrder === "asc" ? (
                      <TiArrowSortedUp />
                    ) : (
                      <TiArrowSortedDown />
                    )
                  ) : null}
                </th>
              )}*/}
              {toggle.toggleColumns.image && (
                <th className="table-th" onClick={() => handleSort(columns[0])}>
                  {t("books.columns.book.image")}
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
                  {t("books.columns.book.title")}
                  {toggle.sortColumn === columns[1].name ? (
                    toggle.sortOrder === "asc" ? (
                      <TiArrowSortedUp />
                    ) : (
                      <TiArrowSortedDown />
                    )
                  ) : null}
                </th>
              )}
              {toggle.toggleColumns.book && (
                <th className="table-th" onClick={() => handleSort(columns[2])}>
                  {t("books.columns.book.book")}
                  {toggle.sortColumn === columns[2].name ? (
                    toggle.sortOrder === "asc" ? (
                      <TiArrowSortedUp />
                    ) : (
                      <TiArrowSortedDown />
                    )
                  ) : null}
                </th>
              )}
              {toggle.toggleColumns.status && (
                <th className="table-th" onClick={() => handleSort(columns[3])}>
                  {t("status")}
                  {toggle.sortColumn === columns[3].name ? (
                    toggle.sortOrder === "asc" ? (
                      <TiArrowSortedUp />
                    ) : (
                      <TiArrowSortedDown />
                    )
                  ) : null}
                </th>
              )}
              {toggle.toggleColumns.control && (
                <th className="table-th" onClick={() => handleSort(columns[4])}>
                  {t("action")}
                  {toggle.sortColumn === columns[4].name ? (
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
                <td className="table-td" colSpan="5">
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
                <td className="table-td" colSpan="5">
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
                <td className="table-td" colSpan="5">
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
                <td className="table-td" colSpan="5">
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
                  {/*{toggle.toggleColumns.imageElder && (
                    <td className="table-td">
                      <img
                        src={result?.elder?.image}
                        alt={result?.elder || "avatar"}
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
                    <td className="table-td name">{result?.elder?.name}</td>
                  )}*/}
                  {toggle.toggleColumns.image && (
                    <td className="table-td">
                      <img
                        src={result?.image}
                        alt={result?.image?.name || "avatar"}
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
                    <td className="table-td">{result?.name}</td>
                  )}
                  {toggle.toggleColumns.book && (
                    <td className="table-td">
                      <a
                        href={result?.Book}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          cursor: "pointer",
                          color: "blue !important",
                        }}
                      >
                        عرض الكتاب
                        <FaBookReader className="me-2" />
                      </a>
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
                  {toggle.toggleColumns.control && (
                    <td className="table-td">
                      <span className="table-btn-container">
                        <FaEdit
                          className="edit-btn"
                          onClick={() => handleEdit(result)}
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
      {/* Add Book */}
      <Modal
        isOpen={toggle.add}
        toggle={() => {
          setToggle({
            ...toggle,
            add: !toggle.add,
          });
        }}
        centered={true}
        keyboard={true}
        size={"md"}
        contentClassName="modal-add-book modal-add-scholar"
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
          {t("books.addTitle")}
          <IoMdClose
            onClick={() => {
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
                lg={12}
                className="d-flex flex-column justify-content-center align-items-center"
              >
                <div className="image-preview-container d-flex justify-content-center align-items-center">
                  <label
                    htmlFor={formik.values.image?.preview ? "" : "image"}
                    className="form-label d-flex justify-content-center align-items-center"
                  >
                    <img
                      src={
                        formik.values?.image && formik.values.image?.preview
                          ? formik.values.image?.preview
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
                        formik.values?.image && formik.values.image?.preview
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
                            formik.values?.image &&
                            formik.values?.image?.preview
                              ? formik.values?.image?.preview
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
                    <ImUpload /> {t("chooseImageBook")}
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
              <Col
                lg={12}
                className="d-flex flex-column justify-content-center align-items-center mt-4"
              >
                <div className="form-group-container d-flex flex-column align-items-end mb-3 w-100">
                  <label
                    htmlFor={
                      formik.values?.book?.file !== "" &&
                      formik.values?.book?.preview !== ""
                        ? ""
                        : "book"
                    }
                    className="form-label mt-4"
                  >
                    <iframe
                      src={toggle?.pdf?.preview}
                      title={toggle?.pdf?.file?.name}
                      width="100%"
                      height={toggle.pdf?.preview ? "500px" : "0"}
                    />
                  </label>
                </div>
                <div className="form-group-container d-flex justify-content-lg-start justify-content-center flex-row-reverse">
                  <label htmlFor="book" className="form-label">
                    <FaFileUpload /> {t("chooseBook")}
                  </label>
                  <input
                    type="file"
                    accept="application/pdf"
                    className="form-input form-img-input"
                    name="book"
                    id="book"
                    onChange={handlePDFChange}
                  />
                </div>
                {formik.errors.book && formik.touched.book ? (
                  <span className="error">{formik.errors.book}</span>
                ) : null}
              </Col>
              <Col lg={12} className="mb-5">
                <div className="form-group-container d-flex flex-column align-items-end mb-3">
                  <label htmlFor="title" className="form-label">
                    {t("books.columns.book.title")}
                  </label>
                  <input
                    type="text"
                    className="form-input w-100"
                    id="title"
                    placeholder={t("books.columns.book.title")}
                    name="title"
                    value={formik.values.title}
                    onChange={handleInput}
                  />
                  {formik.errors.title && formik.touched.title ? (
                    <span className="error">{formik.errors.title}</span>
                  ) : null}
                </div>
                <div className="form-group-container d-flex flex-column align-items-end mb-3">
                  <label htmlFor="bookCategory" className="form-label">
                    {t("chooseCategory")}
                  </label>
                  <div
                    className={`dropdown form-input w-100 ${
                      toggle.bookCategory ? "active" : ""
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setToggle({
                          ...toggle,
                          bookCategory: !toggle.bookCategory,
                        });
                      }}
                      className="dropdown-btn dropdown-btn-book-category d-flex justify-content-between align-items-center"
                    >
                      {formik.values.bookCategory?.title
                        ? formik.values.bookCategory?.title
                        : t("chooseCategory")}
                      <TiArrowSortedUp
                        className={`dropdown-icon ${
                          toggle.bookCategory ? "active" : ""
                        }`}
                      />
                    </button>
                    <div
                      className={`dropdown-content ${
                        toggle.bookCategory ? "active" : ""
                      }`}
                    >
                      {bookCategories?.map((category) => (
                        <button
                          type="button"
                          key={category?.id}
                          className={`item ${
                            formik.values.bookCategory?.id === category?.id
                              ? "active"
                              : ""
                          }`}
                          value={category?.id}
                          name="bookCategory"
                          onClick={() => {
                            setToggle({
                              ...toggle,
                              bookCategory: !toggle.bookCategory,
                            });
                            formik.setFieldValue("bookCategory", {
                              title: category.title,
                              id: category?.id,
                            });
                          }}
                        >
                          {category.title}
                        </button>
                      ))}
                    </div>
                  </div>
                  {formik.errors.bookCategory?.title &&
                  formik.touched.bookCategory?.title ? (
                    <span className="error">
                      {formik.errors.bookCategory?.title}
                    </span>
                  ) : null}
                </div>
                <div className="form-group-container d-flex flex-column justify-content-center align-items-end mb-3">
                  <label htmlFor="status" className="form-label">
                    {t("status")}
                  </label>
                  <div
                    className={`dropdown form-input w-100 ${
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
                            status: false,
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
                            status: false,
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
                {/* <div className="form-group-container d-flex flex-column justify-content-center align-items-end">
                  <label htmlFor="elder" className="form-label">
                    {t("books.columns.elder.name")}
                  </label>
                  <div
                    className={`dropdown form-input w-100 ${
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
                          key={scholar?.id}
                          className={`item ${
                            formik.values.elder?.id === scholar?.id
                              ? "active"
                              : ""
                          }`}
                          value={scholar?.id}
                          name="elder"
                          onClick={() => {
                            setToggle({
                              ...toggle,
                              elders: !toggle.elders,
                            });
                            formik.setFieldValue("elder", {
                              name: scholar?.name,
                              id: scholar?.id,
                            });
                          }}
                        >
                          {scholar?.name}
                        </button>
                      ))}
                    </div>
                  </div>
                  {formik.errors.elder?.name && formik.touched.elder?.name ? (
                    <span className="error">{formik.errors.elder?.name}</span>
                  ) : null}
                </div> */}
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
      {/* Edit Book */}
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
        contentClassName="modal-add-book modal-add-scholar"
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
          {t("books.editTitle")}
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
                lg={12}
                className="d-flex flex-column justify-content-center align-items-center"
              >
                <div className="image-preview-container d-flex justify-content-center align-items-center">
                  <label
                    htmlFor={formik.values.image?.preview ? "" : "image"}
                    className="form-label d-flex justify-content-center align-items-center"
                  >
                    <img
                      src={
                        formik.values?.image && formik.values.image?.preview
                          ? formik.values.image?.preview
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
                        formik.values?.image && formik.values.image?.preview
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
                            formik.values?.image &&
                            formik.values?.image?.preview
                              ? formik.values?.image?.preview
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
                    <ImUpload /> {t("chooseImageBook")}
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
              <Col
                lg={12}
                className="d-flex flex-column justify-content-center align-items-center mt-4"
              >
                <div className="form-group-container d-flex flex-column align-items-end mb-3 w-100">
                  <label
                    htmlFor={
                      formik.values?.book?.file !== "" &&
                      formik.values?.book?.preview !== ""
                        ? ""
                        : "book"
                    }
                    className="form-label mt-4"
                  >
                    <iframe
                      src={formik.values?.Book}
                      title={formik.values?.name}
                      width="100%"
                      height="500px"
                    />
                  </label>
                </div>
                <div className="form-group-container d-flex justify-content-lg-start justify-content-center flex-row-reverse">
                  <label htmlFor="book" className="form-label">
                    <FaFileUpload /> {t("chooseBook")}
                  </label>
                  <input
                    type="file"
                    accept="application/pdf"
                    className="form-input form-img-input"
                    id="book"
                    onChange={handlePDFChange}
                  />
                </div>
                {formik.errors.book && formik.touched.book ? (
                  <span className="error">{formik.errors.book}</span>
                ) : null}
              </Col>
              <Col lg={12} className="mb-5">
                <div className="form-group-container d-flex flex-column align-items-end mb-3">
                  <label htmlFor="title" className="form-label">
                    {t("books.columns.book.title")}
                  </label>
                  <input
                    type="text"
                    className="form-input w-100"
                    id="title"
                    placeholder={t("books.columns.book.title")}
                    name="title"
                    value={formik.values?.title}
                    onChange={handleInput}
                  />
                  {formik.errors?.title && formik.touched?.title ? (
                    <span className="error">{formik.errors?.title}</span>
                  ) : null}
                </div>
                <div className="form-group-container d-flex flex-column align-items-end mb-3">
                  <label htmlFor="bookCategory" className="form-label">
                    {t("chooseCategory")}
                  </label>
                  <div
                    className={`dropdown form-input w-100 ${
                      toggle.bookCategory ? "active" : ""
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        setToggle({
                          ...toggle,
                          bookCategory: !toggle.bookCategory,
                        });
                      }}
                      className="dropdown-btn dropdown-btn-book-category d-flex justify-content-between align-items-center"
                    >
                      {formik.values.bookCategory?.title
                        ? formik.values.bookCategory?.title
                        : t("chooseCategory")}
                      <TiArrowSortedUp
                        className={`dropdown-icon ${
                          toggle.bookCategory ? "active" : ""
                        }`}
                      />
                    </button>
                    <div
                      className={`dropdown-content ${
                        toggle.bookCategory ? "active" : ""
                      }`}
                    >
                      {bookCategories?.map((category) => (
                        <button
                          type="button"
                          key={category?.id}
                          className={`item ${
                            formik.values.bookCategory?.id === category?.id
                              ? "active"
                              : ""
                          }`}
                          value={category?.id}
                          name="bookCategory"
                          onClick={() => {
                            setToggle({
                              ...toggle,
                              bookCategory: !toggle.bookCategory,
                            });
                            formik.setFieldValue("bookCategory", {
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
                  {formik.errors.bookCategory?.title &&
                  formik.touched.bookCategory?.title ? (
                    <span className="error">
                      {formik.errors.bookCategory?.title}
                    </span>
                  ) : null}
                </div>
                <div className="form-group-container d-flex flex-column justify-content-center align-items-end mb-3">
                  <label htmlFor="status" className="form-label">
                    {t("status")}
                  </label>
                  <div
                    className={`dropdown form-input w-100 ${
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
                      {formik.values.status === "Private" ||
                      formik.values.status === "private"
                        ? t("private")
                        : formik.values.status === "Public" ||
                          formik.values.status === "public"
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
                          formik.values.status === "Private" ||
                          formik.values.status === "private"
                            ? "active"
                            : ""
                        }`}
                        value="Private"
                        name="status"
                        onClick={() => {
                          setToggle({
                            ...toggle,
                            status: false,
                          });
                          formik.setFieldValue("status", "Private");
                        }}
                      >
                        {t("private")}
                      </button>
                      <button
                        type="button"
                        className={`item ${
                          formik.values.status === "Public" ||
                          formik.values.status === "public"
                            ? "active"
                            : ""
                        }`}
                        value="Public"
                        name="status"
                        onClick={() => {
                          setToggle({
                            ...toggle,
                            status: false,
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
                {/* <div className="form-group-container d-flex flex-column justify-content-center align-items-end">
                  <label htmlFor="elder" className="form-label">
                    {t("books.columns.elder.name")}
                  </label>
                  <div
                    className={`dropdown form-input w-100 ${
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
                          key={scholar?.id}
                          className={`item ${
                            formik.values.elder?.name === scholar?.name
                              ? "active"
                              : ""
                          }`}
                          value={scholar?.id}
                          name="elder"
                          onClick={() => {
                            setToggle({
                              ...toggle,
                              elders: !toggle.elders,
                            });
                            formik.setFieldValue("elder", {
                              name: scholar?.name,
                              id: scholar?.id,
                            });
                          }}
                        >
                          {scholar?.name}
                        </button>
                      ))}
                    </div>
                  </div>
                  {formik.errors.elder && formik.touched.elder ? (
                    <span className="error">{formik.errors.elder}</span>
                  ) : null}
                </div> */}
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
      {/* Preview Book */}
      {/*<Modal
        isOpen={toggle.readMore}
        toggle={() =>
          setToggle({
            ...toggle,
            readMore: !toggle.readMore,
          })
        }
        centered={true}
        keyboard={true}
        size={"lg"}
        contentClassName="modal-read-more"
      >
        <ModalHeader
          toggle={() =>
            setToggle({
              ...toggle,
              readMore: !toggle.readMore,
            })
          }
          className="d-flex justify-content-between align-items-center"
        >
          {formik.values?.name}
        </ModalHeader>
        <ModalBody>
          <iframe
            src={formik.values?.Book}
            title={formik.values?.name}
            width="100%"
            height="500px"
          />
        </ModalBody>
      </Modal>*/}
      {/* Pagination */}
      {searchResults?.length > 0 && error === null && loading === false && (
        <PaginationUI />
      )}
    </div>
  );
};
export default Books;
