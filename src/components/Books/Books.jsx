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
import { FaEdit, FaFileUpload } from "react-icons/fa";
import { ImUpload } from "react-icons/im";
import { IoMdClose, IoMdEye } from "react-icons/io";
import anonymous from "../../assets/images/anonymous.png";
import {
  getBooksApi,
  addBookApi,
  updateBookApi,
  deleteBookApi,
  getBooksSubSubCategoriesApi,
  getBooksCategoriesApi,
  getBooksSubCategoriesApi,
} from "../../store/slices/bookSlice";
import { useFormik } from "formik";
import Swal from "sweetalert2";
import { pdfjs } from "react-pdf";
import useFiltration from "../../hooks/useFiltration";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import useSchema from "../../hooks/useSchema";
import Cookies from "js-cookie";

const initialValues = {
  title: "",
  number_pages: "",
  image: {
    file: "",
    preview: "",
  },
  book: {
    file: "",
    preview: "",
  },
  status: "",
  is_active: "",
  bookCategory: {
    title: "",
    id: "",
  },
  bookMainCategory: {
    title: "",
    id: "",
  },
  bookSubCategory: {
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
  const role = Cookies.get("_role");
  const {
    books,
    bookCategories,
    bookSubCategories,
    bookSubSubCategories,
    loading,
    error,
  } = useSelector((state) => state.book);
  const [toggle, setToggle] = useState({
    add: false,
    edit: false,
    imagePreview: false,
    readMore: false,
    status: false,
    is_active: false,
    elders: false,
    bookSubCategories: false,
    bookCategory: false,
    pdf: null,
    pages: 0,
    activeColumn: false,
    searchTerm: "",
    books,
    toggleColumns: {
      id: true,
      // imageElder: true,
      // nameElder: true,
      image: true,
      title: true,
      category: true,
      subCategory: true,
      subSubCategory: true,
      // book: true,
      pages: true,
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

  // convert categories array to object and return all data
  const allDataWithCategoriesObj = books?.map((book) => {
    return {
      ...book,
      categories: book?.Sup_Sup_categories[0],
      sub_categories: {
        id: 1,
        title: "Sub Category",
      },
      main_categories: {
        id: 1,
        title: "Main Category",
      },
      // sub_categories: book?.Sup_Main_categories[0],
      // main_categories: book?.Main_categories[0],
      status: book?.status === "public" ? t("public") : t("private"),
      is_active: book?.is_active === 1 ? t("active") : t("inactive"),
      number_pages: book?.number_pages === null ? 0 : book?.number_pages,
    };
  });

  // Filtration, Sorting, Pagination
  const {
    PaginationUI,
    handleSort,
    handleSearch,
    handleToggleColumns,
    searchResultsBookSCategoryAndTitle,
  } = useFiltration({
    rowData: allDataWithCategoriesObj,
    toggle,
    setToggle,
  });

  // Columns
  const columns = [
    { id: 0, name: "id", label: t("index") },
    { id: 1, name: "image", label: t("books.columns.book.image") },
    { id: 2, name: "title", label: t("books.columns.book.title") },
    { id: 3, name: "category", label: t("books.columns.book.category") },
    { id: 4, name: "subCategory", label: t("books.columns.book.subCategory") },
    {
      id: 5,
      name: "subSubCategory",
      label: t("books.columns.book.subSubCategory"),
    },
    { id: 6, name: "pages", label: t("pages") },
    { id: 7, name: "visits", label: t("visits") },
    { id: 8, name: "favorites", label: t("favorites") },
    { id: 9, name: "downloads", label: t("downloads") },
    { id: 10, name: "shares", label: t("shares") },
    { id: 11, name: "status", label: t("content") },
    { id: 12, name: "activation", label: t("activation") },
    { id: 13, name: "control", label: t("action") },
  ];

  const onSubmit = (values) => {
    console.log(values);
    // if (role === "admin") {
    //   if (!values.id) {
    //     // Add Book
    //     dispatch(
    //       addBookApi({
    //         name: values.title,
    //         number_pages: values.number_pages,
    //         file: values.book.file,
    //         image: values.image.file,
    //         sub_categories_id: values.bookCategory.id,
    //         status: values.status === "private" ? "Private" : "Public",
    //         is_active: values.is_active,
    //       })
    //     ).then((res) => {
    //       if (!res.error) {
    //         dispatch(getBooksApi());
    //         setToggle({
    //           ...toggle,
    //           add: !toggle.add,
    //           edit: false,
    //           is_active: false,
    //           status: false,
    //         });
    //         formik.handleReset();
    //         toast.success(t("toast.book.addedSuccess"));
    //       } else {
    //         toast.error(t("toast.book.addedError"));
    //         dispatch(getBooksApi());
    //       }
    //     });
    //   }
    //   // Edit Book
    //   else {
    //     const formDate = new FormData();
    //     formDate.append("id", values.id);
    //     formDate.append("name", values.title);
    //     formDate.append("number_pages", values.number_pages);
    //     formDate.append("sub_categories_id", values.bookCategory.id);
    //     formDate.append(
    //       "status",
    //       values.status === "private" ? "Private" : "Public"
    //     );
    //     formDate.append("is_active", values.is_active);
    //     if (values.image.file) {
    //       formDate.append("image", values.image.file);
    //     }
    //     if (values.book.file) {
    //       formDate.append("file", values.book.file);
    //     }
    //     dispatch(updateBookApi(formDate)).then((res) => {
    //       if (!res.error) {
    //         dispatch(getBooksApi());
    //         setToggle({
    //           ...toggle,
    //           edit: !toggle.edit,
    //           add: !toggle.add,
    //           is_active: false,
    //           status: false,
    //         });
    //         formik.handleReset();
    //         toast.success(t("toast.book.updatedSuccess"));
    //       } else {
    //         toast.error(t("toast.book.updatedError"));
    //         dispatch(getBooksApi());
    //       }
    //     });
    //   }
    // }
  };

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
        formik.setFieldValue("book", {
          file: file,
          preview: URL.createObjectURL(file),
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Get Number Of Pages From PDF
  // const getNumberOfPages = (file) => {
  //   const reader = new FileReader();
  //   reader.onload = () => {
  //     const typedarray = new Uint8Array(reader.result);
  //     // eslint-disable-next-line no-undef
  //     const task = pdfjsLib.getDocument(typedarray);
  //     task.promise.then((pdf) => {
  //       setToggle({
  //         ...toggle,
  //         pages: pdf.numPages,
  //       });
  //       formik.setFieldValue("number_pages", pdf.numPages);
  //       console.log(pdf);
  //     });
  //   };
  //   reader.readAsArrayBuffer(file);
  // };

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

  // handle Edit
  const handleEdit = (book) => {
    formik.setValues(book);
    formik.setFieldValue("title", book?.name);
    formik.setFieldValue(
      "status",
      book?.status === t("public") ? "public" : "private"
    );
    formik.setFieldValue("number_pages", book?.number_pages);
    formik.setFieldValue("is_active", book?.is_active === t("active") ? 1 : 0);
    formik.setFieldValue("bookCategory", {
      title: book?.categories?.title,
      id: book?.category?.id,
    });
    formik.setFieldValue("image", {
      file: "",
      preview: book?.image,
    });
    formik.setFieldValue("book", book?.Book);
    setToggle({
      ...toggle,
      edit: true,
      add: true,
      is_active: false,
      status: false,
    });
  };

  // Delete Book
  const handleDelete = (book) => {
    if (role === "admin") {
      Swal.fire({
        title: t("titleDeleteAlert") + book?.name + "?",
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
              dispatch(getBooksApi());
              if (
                toggle.currentPage > 1 &&
                searchResultsBookSCategoryAndTitle.length === 1
              ) {
                setToggle({
                  ...toggle,
                  currentPage: toggle.currentPage - 1,
                });
              }
              Swal.fire({
                title: `${t("titleDeletedSuccess")} ${book?.name}`,
                text: `${t("titleDeletedSuccess")} ${book?.name} ${t(
                  "textDeletedSuccess"
                )}`,
                icon: "success",
                confirmButtonColor: "#0d1d34",
                confirmButtonText: t("doneDeletedSuccess"),
              }).then(() => toast.success(t("toast.book.deletedSuccess")));
            } else {
              toast.error(t("toast.book.deletedError"));
              dispatch(getBooksApi());
            }
          });
        }
      });
    }
  };

  // get data from api
  useEffect(() => {
    try {
      dispatch(getBooksApi());
      if (role === "admin") {
        dispatch(getBooksCategoriesApi());
        dispatch(getBooksSubCategoriesApi());
        dispatch(getBooksSubSubCategoriesApi());
      }
    } catch (error) {
      console.log(error);
    }
  }, [dispatch, role]);

  // Formik
  const formik = useFormik({
    initialValues,
    // validationSchema: validationSchema.book,
    onSubmit,
  });

  return (
    <div className="book-container scholar-container mt-4 m-sm-3 m-0">
      {role === "admin" && (
        <div className="table-header">
          <button
            className="add-btn"
            onClick={() =>
              setToggle({
                ...toggle,
                add: !toggle.add,
                is_active: false,
                status: false,
                pdf: null,
              })
            }
          >
            <MdAdd />
            {t("books.addTitle")}
          </button>
        </div>
      )}
      <div className="book scholar">
        <div className="table-header">
          {/* Search */}
          <div
            className="search-container form-group-container form-input"
            style={{
              width: "50%",
            }}
          >
            <input
              type="text"
              className="form-input"
              placeholder={t("searchBook")}
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
              {toggle.toggleColumns?.id && (
                <th className="table-th">{t("index")}</th>
              )}
              {toggle.toggleColumns.image && (
                <th className="table-th" onClick={() => handleSort(columns[1])}>
                  {t("books.columns.book.image")}
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
                  {t("books.columns.book.title")}
                  {toggle.sortColumn === columns[2].name ? (
                    toggle.sortOrder === "asc" ? (
                      <TiArrowSortedUp />
                    ) : (
                      <TiArrowSortedDown />
                    )
                  ) : null}
                </th>
              )}
              {toggle.toggleColumns.category && (
                <th className="table-th" onClick={() => handleSort(columns[3])}>
                  {t("books.columns.book.category")}
                  {toggle.sortColumn === columns[3].name ? (
                    toggle.sortOrder === "asc" ? (
                      <TiArrowSortedUp />
                    ) : (
                      <TiArrowSortedDown />
                    )
                  ) : null}
                </th>
              )}
              {toggle.toggleColumns.subCategory && (
                <th className="table-th" onClick={() => handleSort(columns[4])}>
                  {t("books.columns.book.subCategory")}
                  {toggle.sortColumn === columns[4].name ? (
                    toggle.sortOrder === "asc" ? (
                      <TiArrowSortedUp />
                    ) : (
                      <TiArrowSortedDown />
                    )
                  ) : null}
                </th>
              )}
              {toggle.toggleColumns.subSubCategory && (
                <th className="table-th" onClick={() => handleSort(columns[5])}>
                  {t("books.columns.book.subSubCategory")}
                  {toggle.sortColumn === columns[5].name ? (
                    toggle.sortOrder === "asc" ? (
                      <TiArrowSortedUp />
                    ) : (
                      <TiArrowSortedDown />
                    )
                  ) : null}
                </th>
              )}
              {toggle.toggleColumns.pages && (
                <th className="table-th" onClick={() => handleSort(columns[6])}>
                  {t("pages")}
                  {toggle.sortColumn === columns[6].name ? (
                    toggle.sortOrder === "asc" ? (
                      <TiArrowSortedUp />
                    ) : (
                      <TiArrowSortedDown />
                    )
                  ) : null}
                </th>
              )}
              {toggle.toggleColumns.visits && (
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
              {toggle.toggleColumns.downloads && (
                <th className="table-th" onClick={() => handleSort(columns[9])}>
                  {t("downloads")}
                  {toggle.sortColumn === columns[9].name ? (
                    toggle.sortOrder === "asc" ? (
                      <TiArrowSortedUp />
                    ) : (
                      <TiArrowSortedDown />
                    )
                  ) : null}
                </th>
              )}
              {toggle.toggleColumns.shares && (
                <th
                  className="table-th"
                  onClick={() => handleSort(columns[10])}
                >
                  {t("shares")}
                  {toggle.sortColumn === columns[10].name ? (
                    toggle.sortOrder === "asc" ? (
                      <TiArrowSortedUp />
                    ) : (
                      <TiArrowSortedDown />
                    )
                  ) : null}
                </th>
              )}
              {toggle.toggleColumns.status && (
                <th
                  className="table-th"
                  onClick={() => handleSort(columns[11])}
                >
                  {t("content")}
                  {toggle.sortColumn === columns[11].name ? (
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
                  onClick={() => handleSort(columns[12])}
                >
                  {t("activation")}
                  {toggle.sortColumn === columns[12].name ? (
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
                <td className="table-td" colSpan="13">
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
          {searchResultsBookSCategoryAndTitle?.length === 0 &&
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
          {searchResultsBookSCategoryAndTitle?.length > 0 &&
            error === null &&
            loading === false && (
              <tbody>
                {searchResultsBookSCategoryAndTitle?.map((result, idx) => (
                  <tr key={result?.id + new Date().getDate()}>
                    {toggle.toggleColumns?.id && (
                      <td className="table-td">{idx + 1}#</td>
                    )}
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
                    {toggle.toggleColumns.category && (
                      <td className="table-td">{result?.categories?.title}</td>
                    )}
                    {toggle.toggleColumns.subCategory && (
                      <td className="table-td">
                        {result?.sub_categories?.title}
                      </td>
                    )}
                    {toggle.toggleColumns.subSubCategory && (
                      <td className="table-td">
                        {result?.main_categories?.title}
                      </td>
                    )}
                    {toggle.toggleColumns.pages && (
                      <td className="table-td">{result?.number_pages}</td>
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
                              const data = {
                                id: result.id,
                                name: result.name,
                                pages: result.number_pages,
                                status:
                                  result?.status === t("public")
                                    ? "Private"
                                    : "Public",
                                categories_id: result.categories.id,
                                is_active:
                                  result.is_active === t("active") ? 1 : 0,
                              };
                              dispatch(updateBookApi(data)).then((res) => {
                                if (!res.error) {
                                  dispatch(getBooksApi());
                                  toast.success(t("toast.book.updatedSuccess"));
                                } else {
                                  dispatch(getBooksApi());
                                  toast.error(t("toast.book.updatedError"));
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
                              const data = {
                                id: result.id,
                                name: result.name,
                                pages: result.number_pages,
                                status:
                                  result?.status === t("public")
                                    ? "Public"
                                    : "Private",
                                categories_id: result.categories.id,
                                is_active:
                                  result.is_active === t("active") ? 0 : 1,
                              };
                              dispatch(updateBookApi(data)).then((res) => {
                                if (!res.error) {
                                  dispatch(getBooksApi());
                                  toast.success(t("toast.book.updatedSuccess"));
                                } else {
                                  dispatch(getBooksApi());
                                  toast.error(t("toast.book.updatedError"));
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
                    {toggle.toggleColumns.control && (
                      <td className="table-td">
                        <span className="table-btn-container">
                          <a
                            href={result?.Book}
                            target="_blank"
                            rel="noreferrer"
                            style={{
                              cursor: "pointer",
                              color: "blue !important",
                            }}
                          >
                            <IoMdEye className="view-btn" />
                          </a>
                          {role === "admin" && (
                            <>
                              <FaEdit
                                className="edit-btn"
                                onClick={() => handleEdit(result)}
                              />
                              <MdDeleteOutline
                                className="delete-btn"
                                onClick={() => handleDelete(result)}
                              />
                            </>
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
      {/* Add/Edit Book */}
      {role === "admin" && (
        <Modal
          isOpen={toggle.add}
          toggle={() => {
            setToggle({
              ...toggle,
              add: !toggle.add,
              edit: false,
              is_active: false,
              status: false,
              pdf: null,
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
                add: !toggle.add,
                edit: false,
                is_active: false,
                status: false,
                pdf: null,
              });
              formik.handleReset();
            }}
          >
            {toggle.edit && formik.values.id
              ? t("books.editTitle")
              : t("books.addTitle")}
            <IoMdClose
              onClick={() => {
                setToggle({
                  ...toggle,
                  add: !toggle.add,
                  edit: false,
                  is_active: false,
                  status: false,
                  pdf: null,
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
                          formik.values?.image && formik.values?.image?.preview
                            ? formik.values?.image?.preview
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
                      {formik.values.id ? (
                        <iframe
                          src={formik.values.book}
                          title={formik.values.title}
                          width="100%"
                          height={"500px"}
                        />
                      ) : (
                        <iframe
                          src={toggle?.pdf?.preview}
                          title={toggle?.pdf?.file?.name}
                          width="100%"
                          height={toggle.pdf?.preview ? "500px" : "0"}
                        />
                      )}
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
                    <label htmlFor="number_pages" className="form-label">
                      {t("books.columns.book.number_pages")}
                    </label>
                    <input
                      type="text"
                      className="form-input w-100"
                      id="number_pages"
                      placeholder={t("books.columns.book.number_pages")}
                      name="number_pages"
                      value={formik.values.number_pages}
                      onChange={handleInput}
                    />
                    {formik.errors.number_pages &&
                    formik.touched.number_pages ? (
                      <span className="error">
                        {formik.errors.number_pages}
                      </span>
                    ) : null}
                  </div>
                  <div className="form-group-container d-flex flex-column align-items-end mb-3">
                    <label htmlFor="bookMainCategory" className="form-label">
                      {t("chooseBookMainCategory")}
                    </label>
                    <div
                      className={`dropdown form-input w-100 ${
                        toggle.bookMainCategory ? "active" : ""
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setToggle({
                            ...toggle,
                            bookMainCategory: !toggle.bookMainCategory,
                          });
                        }}
                        className="dropdown-btn dropdown-btn-book-category d-flex justify-content-between align-items-center"
                      >
                        {formik.values.bookMainCategory?.title
                          ? formik.values.bookMainCategory?.title
                          : t("chooseCategory")}
                        <TiArrowSortedUp
                          className={`dropdown-icon ${
                            toggle.bookMainCategory ? "active" : ""
                          }`}
                        />
                      </button>
                      <div
                        className={`dropdown-content ${
                          toggle.bookMainCategory ? "active" : ""
                        }`}
                      >
                        {bookCategories?.map((category) => (
                          <button
                            type="button"
                            key={category?.id}
                            className={`item ${
                              formik.values.bookMainCategory?.id ===
                              category?.id
                                ? "active"
                                : ""
                            }`}
                            value={category?.id}
                            name="bookMainCategory"
                            onClick={() => {
                              setToggle({
                                ...toggle,
                                bookMainCategory: !toggle.bookMainCategory,
                              });
                              formik.setFieldValue("bookMainCategory", {
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
                    {formik.errors.bookMainCategory?.title &&
                    formik.touched.bookMainCategory?.title ? (
                      <span className="error">
                        {formik.errors.bookMainCategory?.title}
                      </span>
                    ) : null}
                  </div>
                  {formik.values.bookMainCategory.id ? (
                    <div className="form-group-container d-flex flex-column align-items-end mb-3">
                      <label htmlFor="bookSubCategory" className="form-label">
                        {t("chooseBookSubCategory")}
                      </label>
                      <div
                        className={`dropdown form-input w-100 ${
                          toggle.bookSubCategory ? "active" : ""
                        }`}
                      >
                        <button
                          type="button"
                          onClick={() => {
                            setToggle({
                              ...toggle,
                              bookSubCategory: !toggle.bookSubCategory,
                            });
                          }}
                          className="dropdown-btn dropdown-btn-book-category d-flex justify-content-between align-items-center"
                        >
                          {formik.values.bookSubCategory?.title
                            ? formik.values.bookSubCategory?.title
                            : t("chooseCategory")}
                          <TiArrowSortedUp
                            className={`dropdown-icon ${
                              toggle.bookSubCategory ? "active" : ""
                            }`}
                          />
                        </button>
                        <div
                          className={`dropdown-content ${
                            toggle.bookSubCategory ? "active" : ""
                          }`}
                        >
                          {bookSubCategories?.map((category) => (
                            <button
                              type="button"
                              key={category?.id}
                              className={`item ${
                                formik.values.bookSubCategory?.id ===
                                category?.id
                                  ? "active"
                                  : ""
                              }`}
                              value={category?.id}
                              name="bookSubCategory"
                              onClick={() => {
                                setToggle({
                                  ...toggle,
                                  bookSubCategory: !toggle.bookSubCategory,
                                });
                                formik.setFieldValue("bookSubCategory", {
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
                      {formik.errors.bookSubCategory?.title &&
                      formik.touched.bookSubCategory?.title ? (
                        <span className="error">
                          {formik.errors.bookSubCategory?.title}
                        </span>
                      ) : null}
                    </div>
                  ) : null}
                  {formik.values.bookSubCategory.id ? (
                    <div className="form-group-container d-flex flex-column align-items-end mb-3">
                      <label htmlFor="bookCategory" className="form-label">
                        {t("chooseBookSubSubCategory")}
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
                          {bookSubSubCategories?.map((category) => (
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
                  ) : null}
                  <div className="form-group-container d-flex flex-column justify-content-center align-items-end mb-3">
                    <label htmlFor="status" className="form-label">
                      {t("content")}
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
                        {formik.values.status === "private"
                          ? t("private")
                          : formik.values.status === "public"
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
                            formik.values.status === "private" ? "active" : ""
                          }`}
                          value="private"
                          name="status"
                          onClick={() => {
                            setToggle({
                              ...toggle,
                              status: false,
                            });
                            formik.setFieldValue("status", "private");
                          }}
                        >
                          {t("private")}
                        </button>
                        <button
                          type="button"
                          className={`item ${
                            formik.values.status === "public" ? "active" : ""
                          }`}
                          value="public"
                          name="status"
                          onClick={() => {
                            setToggle({
                              ...toggle,
                              status: false,
                            });
                            formik.setFieldValue("status", "public");
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
                    <label htmlFor="is_active" className="form-label">
                      {t("activation")}
                    </label>
                    <div
                      className={`dropdown form-input w-100 ${
                        toggle.is_active ? "active" : ""
                      }`}
                    >
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
                            formik.values.is_active === 1 ? "active" : ""
                          }`}
                          value="active"
                          name="is_active"
                          onClick={() => {
                            setToggle({
                              ...toggle,
                              is_active: false,
                            });
                            formik.setFieldValue("is_active", 1);
                          }}
                        >
                          {t("active")}
                        </button>
                        <button
                          type="button"
                          className={`item ${
                            formik.values.is_active === 0 ? "active" : ""
                          }`}
                          value="inactive"
                          name="is_active"
                          onClick={() => {
                            setToggle({
                              ...toggle,
                              is_active: false,
                            });
                            formik.setFieldValue("is_active", 0);
                          }}
                        >
                          {t("inactive")}
                        </button>
                      </div>
                    </div>
                    {formik.errors.is_active && formik.touched.is_active ? (
                      <span className="error">{formik.errors.is_active}</span>
                    ) : null}
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
                      ) : toggle.edit && formik.values.id ? (
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
                          edit: false,
                          is_active: false,
                          status: false,
                          pdf: null,
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
      )}
      {/* Pagination */}
      {searchResultsBookSCategoryAndTitle?.length > 0 &&
        error === null &&
        loading === false && <PaginationUI />}
    </div>
  );
};
export default Books;
