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

import { MdAdd, MdDeleteOutline, MdRemoveRedEye } from "react-icons/md";
import { TiArrowSortedUp, TiArrowSortedDown } from "react-icons/ti";
import { FaPen } from "react-icons/fa";
import { ImUpload } from "react-icons/im";
import { IoMdClose } from "react-icons/io";

import anonymous from "../../assets/images/anonymous.png";

import {
  deleteScholarApi,
  getScholars,
  getScholarsApi,
  addScholarApi,
  updateScholarApi,
} from "../../store/slices/scholarSlice";

import { useFormik } from "formik";

import { mixed, object, string } from "yup";

import Swal from "sweetalert2";

import { toast } from "react-toastify";

import "./elder.css";
import useFiltration from "../../hooks/useFiltration";

const validationSchema = object().shape({
  name: string().required("يجب ادخال اسم العالم"),
  email: string()
    .email("Invalid email")
    .required("يجب ادخال البريد الالكتروني"),
  phone: string().required("يجب ادخال رقم الهاتف"),
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
});

const initialValues = {
  image: {
    file: "",
    preview: "",
  },
  name: "",
  email: "",
  phone: "",
  status: "الحالة",
};

const Elder = ({ dashboard }) => {
  const dispatch = useDispatch();
  const { scholars, loading, error } = useSelector((state) => state.scholar);
  const [toggle, setToggle] = useState({
    add: false,
    edit: false,
    imagePreview: false,
    status: false,
    searchTerm: "",
    activeColumn: false,
    activeRows: false,
    rowsPerPage: 5,
    currentPage: 1,
    sortColumn: "",
    sortOrder: "asc",
    toggleColumns: {
      image: true,
      name: true,
      email: true,
      phone: true,
      status: true,
      control: true,
    },
  });

  // Formik
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      // if email and phone is already exist with another scholar if just i change them to new values
      if (scholars.length > 0) {
        const emailExist = scholars.find(
          (scholar) => scholar.email === formik.values.email
        );
        const phoneExist = scholars.find(
          (scholar) => scholar.phone === formik.values.phone
        );
        if (emailExist && emailExist.id !== formik.values.id) {
          toast.error("البريد الالكتروني موجود مسبقا");
          return;
        }
        if (phoneExist && phoneExist.id !== formik.values.id) {
          toast.error("رقم الهاتف موجود مسبقا");
          return;
        }
      }
      const formData = new FormData();
      formData.append("name", formik.values.name);
      formData.append("email", formik.values.email);
      formData.append("phone", formik.values.phone);
      formData.append(
        "status",
        formik.values.status === "Pending"
          ? "Pending"
          : formik.values.status === "Approve"
          ? "Approve"
          : "Pending"
      );
      if (values.id) {
        // if the scholar don't change anything even the image
        const scholar = scholars.find((scholar) => scholar.id === values.id);
        if (
          scholar.name === values.name &&
          scholar.email === values.email &&
          scholar.phone === values.phone &&
          scholar.status === values.status &&
          scholar.image === values.image
        ) {
          setToggle({
            ...toggle,
            edit: !toggle.edit,
          });
          toast.error("لم تقم بتغيير اي شيء");
          return;
        } else {
          formData.append("id", values.id);
          if (values.image.file !== undefined) {
            formData.append("image", values.image.file);
          }
          dispatch(updateScholarApi(formData)).then((res) => {
            dispatch(getScholarsApi());
            if (!res.error) {
              formik.handleReset();
              setToggle({
                ...toggle,
                edit: !toggle.edit,
              });
            }
          });
        }
      } else {
        formData.append("image", formik.values.image.file);
        dispatch(addScholarApi(formData)).then((res) => {
          dispatch(getScholarsApi());
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

  // Handle Edit Scholar
  const handleEdit = (scholar) => {
    formik.setValues(scholar);
  };

  // Delete Scholar
  const handleDelete = (scholar) => {
    Swal.fire({
      title: `هل انت متأكد من حذف ${scholar?.name}؟`,
      text: "لن تتمكن من التراجع عن هذا الاجراء!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#0d1d34",
      confirmButtonText: "نعم, احذفه!",
      cancelButtonText: "الغاء",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteScholarApi(scholar.id)).then((res) => {
          if (!res.error) {
            dispatch(getScholarsApi());
            Swal.fire({
              title: `تم حذف ${scholar?.name}`,
              text: `تم حذف ${scholar?.name} بنجاح`,
              icon: "success",
            });
          }
        });
      }
    });
  };

  // Filtration, Sorting, Pagination
  // Columns
  const columns = [
    { id: 1, name: "image", label: "الصورة" },
    { id: 2, name: "name", label: "العالم" },
    { id: 3, name: "email", label: "البريد الالكتروني" },
    { id: 4, name: "phone", label: "الهاتف" },
    { id: 5, name: "status", label: "الحالة" },
    { id: 6, name: "control", label: "الإجراءات" },
  ];
  const {
    PaginationUI,
    handleSort,
    handleSearch,
    handleToggleColumns,
    results,
  } = useFiltration({
    rowData: scholars,
    toggle,
    setToggle,
  });

  // get data from api
  useEffect(() => {
    try {
      dispatch(getScholarsApi()).then((res) => {
        if (!res.error) {
          dispatch(getScholars(res.payload));
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
          إضافة عالم
        </button>
        {/* Add Scholar */}
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
            إضافة عالم
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
                <Col lg={7} className="mb-5">
                  <div
                    className="form-group-container d-flex flex-column align-items-end mb-3"
                    style={{ marginTop: "-4px" }}
                  >
                    <label htmlFor="name" className="form-label">
                      اسم العالم
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      id="name"
                      placeholder="اسم العالم"
                      name="name"
                      value={formik.values.name}
                      onChange={handleInput}
                    />
                    {formik.errors.name && formik.touched.name ? (
                      <span className="error">{formik.errors.name}</span>
                    ) : null}
                  </div>
                  <div className="form-group-container d-flex flex-column align-items-end mb-3">
                    <label htmlFor="email" className="form-label">
                      البريد الالكتروني
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      id="email"
                      placeholder="البريد الالكتروني"
                      name="email"
                      value={formik.values.email}
                      onChange={handleInput}
                    />
                    {formik.errors.email && formik.touched.email ? (
                      <span className="error">{formik.errors.email}</span>
                    ) : null}
                  </div>
                  <div className="form-group-container d-flex flex-column align-items-end mb-3">
                    <label htmlFor="phone" className="form-label">
                      رقم الهاتف
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      id="test"
                      placeholder="رقم الهاتف"
                      name="phone"
                      value={formik.values.phone}
                      onChange={handleInput}
                    />
                    {formik.errors.phone && formik.touched.phone ? (
                      <span className="error">{formik.errors.phone}</span>
                    ) : null}
                  </div>
                  <div className="form-group-container d-flex flex-column justify-content-center align-items-end">
                    <label htmlFor="status" className="form-label">
                      الحالة
                    </label>
                    <div className="dropdown form-input">
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
                        {formik.values.status === "Pending"
                          ? "قيد الانتظار"
                          : formik.values.status === "Approve"
                          ? "مفعل"
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
                            formik.values.status === "Pending" ? "active" : ""
                          }`}
                          value="Pending"
                          name="status"
                          onClick={(e) => {
                            setToggle({
                              ...toggle,
                              status: !toggle.status,
                            });
                            formik.setFieldValue("status", "Pending");
                          }}
                        >
                          قيد الانتظار
                        </button>
                        <button
                          type="button"
                          className={`item ${
                            formik.values.status === "Approve" ? "active" : ""
                          }`}
                          value="Approve"
                          name="status"
                          onClick={(e) => {
                            setToggle({
                              ...toggle,
                              status: !toggle.status,
                            });
                            formik.setFieldValue("status", "Approve");
                          }}
                        >
                          مفعل
                        </button>
                      </div>
                    </div>
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
        {dashboard && <h2>العلماء</h2>}
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
              {toggle.toggleColumns.name && (
                <th className="table-th" onClick={() => handleSort(columns[1])}>
                  العالم
                  {toggle.sortColumn === columns[1].name ? (
                    toggle.sortOrder === "asc" ? (
                      <TiArrowSortedUp />
                    ) : (
                      <TiArrowSortedDown />
                    )
                  ) : null}
                </th>
              )}
              {toggle.toggleColumns.email && (
                <th className="table-th" onClick={() => handleSort(columns[2])}>
                  البريد الالكتروني
                  {toggle.sortColumn === columns[2].name ? (
                    toggle.sortOrder === "asc" ? (
                      <TiArrowSortedUp />
                    ) : (
                      <TiArrowSortedDown />
                    )
                  ) : null}
                </th>
              )}
              {toggle.toggleColumns.phone && (
                <th className="table-th" onClick={() => handleSort(columns[3])}>
                  الهاتف
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
                      style={{
                        height: "3rem",
                        width: "3rem",
                        color: "var(--main-color)",
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
          {results.length === 0 && error === null && !loading && (
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
          {results.length > 0 && error === null && loading === false && (
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
                  {toggle.toggleColumns.name && (
                    <td className="table-td name">{result?.name}</td>
                  )}
                  {toggle.toggleColumns.email && (
                    <td className="table-td">
                      <a
                        className="text-white"
                        href={`mailto:${result?.email}`}
                      >
                        {result?.email}
                      </a>
                    </td>
                  )}
                  {toggle.toggleColumns.phone && (
                    <td className="table-td">
                      <a className="text-white" href={`tel:${result?.phone}`}>
                        {result?.phone}
                      </a>
                    </td>
                  )}
                  {toggle.toggleColumns.status && (
                    <td className="table-td">
                      <span
                        className="table-status badge"
                        style={{
                          backgroundColor:
                            result?.status === "Approve"
                              ? "green"
                              : result?.status === "Pending"
                              ? "red"
                              : "red",
                        }}
                      >
                        {result?.status === "Approve"
                          ? "مفعل"
                          : result?.status === "Pending"
                          ? "قيد الانتظار"
                          : "قيد الانتظار"}
                      </span>
                    </td>
                  )}
                  {toggle.toggleColumns.control && (
                    <td className="table-td">
                      <span className="table-btn-container">
                        <MdRemoveRedEye />
                        <FaPen
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
              {/* Edit Scholar */}
              <Modal
                isOpen={toggle.edit}
                toggle={() => {
                  formik.handleReset();
                  setToggle({
                    ...toggle,
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
                      edit: !toggle.edit,
                    });
                  }}
                  dir="rtl"
                >
                  تعديل {formik.values?.name}
                  <IoMdClose
                    onClick={() => {
                      formik.handleReset();
                      setToggle({
                        ...toggle,
                        edit: !toggle.edit,
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
                            htmlFor={
                              formik.values?.image
                                ? formik.values?.image.file === ""
                                  ? "image"
                                  : ""
                                : "image"
                            }
                            className="form-label d-flex justify-content-center align-items-center"
                          >
                            <img
                              src={
                                formik.values?.image.file === undefined
                                  ? formik.values?.image
                                  : formik.values?.image.file === ""
                                  ? anonymous
                                  : formik.values?.image.preview
                              }
                              alt="avatar"
                              className="image-preview"
                              onClick={() =>
                                formik.values?.image &&
                                formik.values?.image.file === ""
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
                                    formik.values?.image.file
                                      ? formik.values?.image.preview
                                      : formik.values?.image
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
                        {formik.values?.image?.file ? (
                          formik.errors.image && formik.touched.image ? (
                            <span className="error">{formik.errors.image}</span>
                          ) : (
                            formik.values.image.file === undefined &&
                            formik.values?.image.includes("https")
                          )
                        ) : null}
                      </Col>
                      <Col lg={7} className="mb-5">
                        <div
                          className="form-group-container d-flex flex-column align-items-end mb-3"
                          style={{ marginTop: "-4px" }}
                        >
                          <label htmlFor="name" className="form-label">
                            اسم العالم
                          </label>
                          <input
                            type="text"
                            className="form-input"
                            id="name"
                            placeholder="اسم العالم"
                            name="name"
                            value={formik.values?.name}
                            onChange={handleInput}
                          />
                          {formik.errors.name && formik.touched.name ? (
                            <span className="error">{formik.errors.name}</span>
                          ) : null}
                        </div>
                        <div className="form-group-container d-flex flex-column align-items-end mb-3">
                          <label htmlFor="email" className="form-label">
                            البريد الالكتروني
                          </label>
                          <input
                            type="text"
                            className="form-input"
                            id="email"
                            placeholder="البريد الالكتروني"
                            name="email"
                            value={formik.values?.email}
                            onChange={handleInput}
                          />
                          {formik.errors.email && formik.touched.email ? (
                            <span className="error">{formik.errors.email}</span>
                          ) : null}
                        </div>
                        <div className="form-group-container d-flex flex-column align-items-end mb-3">
                          <label htmlFor="phone" className="form-label">
                            رقم الهاتف
                          </label>
                          <input
                            type="text"
                            className="form-input"
                            id="phone"
                            placeholder="رقم الهاتف"
                            name="phone"
                            value={formik.values?.phone}
                            onChange={handleInput}
                          />
                          {formik.errors.phone && formik.touched.phone ? (
                            <span className="error">{formik.errors.phone}</span>
                          ) : null}
                        </div>
                        <div className="form-group-container d-flex flex-column justify-content-center align-items-end">
                          <label htmlFor="status" className="form-label">
                            الحالة
                          </label>
                          <div className="dropdown form-input">
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
                              {formik.values?.status === "Pending"
                                ? "قيد الانتظار"
                                : formik.values?.status === "Approve"
                                ? "مفعل"
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
                                  formik.values?.status === "Pending"
                                    ? "active"
                                    : ""
                                }`}
                                value="Pending"
                                name="status"
                                onClick={() => {
                                  setToggle({
                                    ...toggle,
                                    status: !toggle.status,
                                  });
                                  formik.setFieldValue("status", "Pending");
                                }}
                              >
                                قيد الانتظار
                              </button>
                              <button
                                type="button"
                                className={`item ${
                                  formik.values?.status === "Approve"
                                    ? "active"
                                    : ""
                                }`}
                                value="Approve"
                                name="status"
                                onClick={() => {
                                  setToggle({
                                    ...toggle,
                                    status: !toggle.status,
                                  });
                                  formik.setFieldValue("status", "Approve");
                                }}
                              >
                                مفعل
                              </button>
                            </div>
                          </div>
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

export default Elder;
