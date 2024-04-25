import React, { useEffect, useRef, useState } from "react";
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
import { MdAdd, MdDeleteOutline, MdEdit } from "react-icons/md";
import { TiArrowSortedUp, TiArrowSortedDown } from "react-icons/ti";
import { IoMdClose, IoMdEye } from "react-icons/io";
import {
  getSubAdmins,
  addSubAdmin,
  deleteSubAdmin,
  updateSubAdmin,
} from "../../store/slices/subAdminSlice";
import { useFormik } from "formik";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useFiltration, useSchema } from "../../hooks";
import { ImUpload } from "react-icons/im";
import anonymous from "../../assets/images/anonymous.png";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import Cookies from "js-cookie";

const initialValues = {
  image: {
    file: "",
    preview: "",
  },
  name: "",
  email: "",
  phone: "",
  status: "",
  password: "",
  confirmPassword: "",
  powers: "",
};

const SubAdmins = ({ dashboard }) => {
  const { t } = useTranslation();
  const role = Cookies.get("_role");
  const dispatch = useDispatch();
  const { validationSchema } = useSchema();
  const fileRef = useRef();
  const { subAdmins, loading, error } = useSelector((state) => state.subAdmin);
  const [toggle, setToggle] = useState({
    showHidePassword: false,
    showHideConfirmedPassword: false,
    add: false,
    imagePreview: false,
    read: false,
    status: false,
    powers: false,
    searchTerm: "",
    activeColumn: false,
    activeRows: false,
    rowsPerPage: 5,
    currentPage: 1,
    sortColumn: "",
    sortOrder: "asc",
    toggleColumns: {
      id: true,
      image: true,
      name: true,
      email: true,
      phone: true,
      powers: true,
      status: true,
      control: true,
    },
  });

  const data = subAdmins?.map((subAdmin) => ({
    ...subAdmin,
    powers: subAdmin.powers === "admin" ? t("admin") : t("supAdmin"),
    active: subAdmin.active === 1 ? t("active") : t("inactive"),
  }));

  // Formik
  const formik = useFormik({
    initialValues,
    validationSchema: toggle.edit
      ? validationSchema.subAdminsEdit
      : validationSchema.subAdmins,
    onSubmit: (values) => {
      if (role === "admin") {
        // if email and phone is already exist with another subAdmin if just i change them to new values
        if (subAdmins.length > 0) {
          const emailExist = subAdmins.find(
            (subAdmin) => subAdmin.email === formik.values.email
          );
          if (emailExist && emailExist.id !== formik.values.id) {
            toast.error(t("emailExisted"));
            return;
          }
        }
        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("email", values.email);
        formData.append("phone", values.phone);
        formData.append("active", values.status === "active" ? 1 : 0);
        formData.append("password", values.password);
        formData.append("powers", values.powers);
        if (values.image.file !== "") {
          formData.append("image", values.image.file);
        }
        if (values.id) {
          formData.append("id", values.id);
          dispatch(updateSubAdmin(formData)).then((res) => {
            dispatch(getSubAdmins());
            if (!res.error) {
              toast.success(t("toast.subAdmin.updatedSuccess"));
              formik.handleReset();
              setToggle({
                ...toggle,
                add: !toggle.add,
              });
            } else {
              toast.error(t("toast.subAdmin.updatedError"));
            }
          });
        } else {
          dispatch(addSubAdmin(formData)).then((res) => {
            dispatch(getSubAdmins());
            if (!res.error) {
              toast.success(t("toast.subAdmin.addedSuccess"));
              formik.handleReset();
              setToggle({
                ...toggle,
                add: !toggle.add,
              });
            } else {
              toast.error(t("toast.subAdmin.addedError"));
            }
          });
        }
      }
    },
  });

  // handle Input Using Formik
  const handleInput = (e) => {
    formik.handleChange(e);
  };

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

  // Delete Sub Admin
  const handleDelete = (subAdmin) => {
    if (role === "admin") {
      Swal.fire({
        title: `هل انت متأكد من حذف ${subAdmin?.name}؟`,
        text: "لن تتمكن من التراجع عن هذا الاجراء!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#0d1d34",
        confirmButtonText: "نعم, احذفه!",
        cancelButtonText: "الغاء",
      }).then((result) => {
        if (result.isConfirmed) {
          dispatch(deleteSubAdmin(subAdmin.id)).then((res) => {
            if (!res.error) {
              dispatch(getSubAdmins());
              Swal.fire({
                title: `تم حذف ${subAdmin?.name}`,
                text: `تم حذف ${subAdmin?.name} بنجاح`,
                icon: "success",
                confirmButtonColor: "#0d1d34",
              }).then(() => toast.success(t("toast.subAdmin.deletedSuccess")));
            } else {
              toast.error(t("toast.subAdmin.deletedError"));
            }
          });
        }
      });
    }
  };

  // Handle Edit
  const handleEdit = (subAdmin) => {
    formik.setValues({
      id: subAdmin?.id,
      name: subAdmin?.name,
      email: subAdmin?.email,
      password: subAdmin?.password,
      phone: subAdmin?.phone,
      powers: subAdmin?.powers === t("admin") ? "admin" : "supAdmin",
      status: subAdmin?.active === t("active") ? "active" : "inactive",
      image: {
        file: "",
        preview: subAdmin?.image,
      },
    });
    setToggle({
      ...toggle,
      add: !toggle.add,
      edit: true,
    });
  };

  // Filtration, Sorting, Pagination
  // Columns
  const columns = [
    { id: 0, name: "id", label: t("index") },
    { id: 1, name: "image", label: t("subAdmin.columns.image") },
    { id: 2, name: "name", label: t("subAdmin.columns.name") },
    { id: 3, name: "email", label: t("subAdmin.columns.email") },
    { id: 4, name: "phone", label: t("subAdmin.columns.phone") },
    { id: 5, name: "powers", label: t("powers") },
    { id: 6, name: "status", label: t("status") },
    { id: 7, name: "control", label: t("action") },
  ];
  const {
    PaginationUI,
    handleSort,
    handleSearch,
    handleToggleColumns,
    searchResults,
  } = useFiltration({
    rowData: data,
    toggle,
    setToggle,
  });

  // get data from api
  useEffect(() => {
    try {
      dispatch(getSubAdmins());
    } catch (error) {
      console.log(error);
    }
  }, [dispatch]);

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
            {t("subAdmin.addTitle")}
          </button>
          {dashboard && <h2>{t("subAdmin.title")}</h2>}
        </div>
      )}
      <div className="scholar">
        <div className="table-header">
          {/* Search */}
          <div
            className="search-container form-group-container form-input"
            style={{
              width: "40%",
            }}
          >
            <input
              type="text"
              className="form-input"
              placeholder={t("searchSubAdmin")}
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
                <th className="table-th">{t("index")}</th>
              )}
              {toggle.toggleColumns.image && (
                <th className="table-th" onClick={() => handleSort(columns[1])}>
                  {t("subAdmin.columns.image")}
                  {toggle.sortColumn === columns[1].name ? (
                    toggle.sortOrder === "asc" ? (
                      <TiArrowSortedUp />
                    ) : (
                      <TiArrowSortedDown />
                    )
                  ) : null}
                </th>
              )}
              {toggle.toggleColumns.name && (
                <th className="table-th" onClick={() => handleSort(columns[2])}>
                  {t("subAdmin.columns.name")}
                  {toggle.sortColumn === columns[2].name ? (
                    toggle.sortOrder === "asc" ? (
                      <TiArrowSortedUp />
                    ) : (
                      <TiArrowSortedDown />
                    )
                  ) : null}
                </th>
              )}
              {toggle.toggleColumns.email && (
                <th className="table-th" onClick={() => handleSort(columns[3])}>
                  {t("subAdmin.columns.email")}
                  {toggle.sortColumn === columns[3].name ? (
                    toggle.sortOrder === "asc" ? (
                      <TiArrowSortedUp />
                    ) : (
                      <TiArrowSortedDown />
                    )
                  ) : null}
                </th>
              )}
              {toggle.toggleColumns.phone && (
                <th className="table-th" onClick={() => handleSort(columns[4])}>
                  {t("subAdmin.columns.phone")}
                  {toggle.sortColumn === columns[4].name ? (
                    toggle.sortOrder === "asc" ? (
                      <TiArrowSortedUp />
                    ) : (
                      <TiArrowSortedDown />
                    )
                  ) : null}
                </th>
              )}
              {toggle.toggleColumns.powers && (
                <th className="table-th" onClick={() => handleSort(columns[5])}>
                  {t("powers")}
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
              {toggle.toggleColumns.control && (
                <th className="table-th">{t("action")}</th>
              )}
            </tr>
          </thead>
          {/* Error */}
          {error !== null && loading === false && (
            <tbody>
              <tr className="no-data-container">
                <td className="table-td" colSpan="8">
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
                <td className="table-td" colSpan="8">
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
          {searchResults?.length === 0 && error === null && !loading && (
            <tbody>
              <tr className="no-data-container">
                <td className="table-td" colSpan="8">
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
                <td className="table-td" colSpan="8">
                  <p className="no-data no-columns mb-0">{t("noColumns")}</p>
                </td>
              </tr>
            </tbody>
          )}
          {/* Data */}
          {searchResults?.length > 0 && error === null && loading === false && (
            <tbody>
              {searchResults?.map((result, idx) => (
                <tr key={result?.id + new Date().getDate()}>
                  {toggle.toggleColumns?.id && (
                    <td className="table-td">{idx + 1}#</td>
                  )}
                  {toggle.toggleColumns.image && (
                    <td className="table-td">
                      <img
                        src={result?.image}
                        alt={result?.name}
                        className="table-img"
                        width="50"
                        height="50"
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
                      {result?.phone ? (
                        <a
                          className="text-white"
                          href={`mailto:${result?.phone}`}
                        >
                          {result?.phone}
                        </a>
                      ) : (
                        <span className="text-danger">{t("noPhone")}</span>
                      )}
                    </td>
                  )}
                  {toggle.toggleColumns.powers && (
                    <td className="table-td">
                      <span
                        className={`status ${
                          result?.powers === t("admin") ? "active" : "inactive"
                        }`}
                        style={{
                          cursor: role === "admin" ? "pointer" : "default",
                        }}
                        onClick={() => {
                          if (role === "admin") {
                            const data = {
                              id: result.id,
                              name: result.name,
                              email: result.email,
                              phone: result.phone,
                              active: result.active === t("active") ? 1 : 0,
                              powers:
                                result.powers === t("admin")
                                  ? "supAdmin"
                                  : "admin",
                            };
                            dispatch(updateSubAdmin(data)).then((res) => {
                              dispatch(getSubAdmins());
                              if (!res.error) {
                                toast.success(
                                  t("toast.subAdmin.updatedSuccess")
                                );
                              } else {
                                dispatch(getSubAdmins());
                                toast.error(t("toast.subAdmin.updatedError"));
                              }
                            });
                          }
                        }}
                      >
                        {result?.powers}
                      </span>
                    </td>
                  )}
                  {toggle.toggleColumns.status && (
                    <td className="table-td">
                      <span
                        className={`status ${
                          result?.active === t("active") ? "active" : "inactive"
                        }`}
                        style={{
                          cursor: role === "admin" ? "pointer" : "default",
                        }}
                        onClick={() => {
                          if (role === "admin") {
                            const data = {
                              id: result.id,
                              name: result.name,
                              email: result.email,
                              phone: result.phone,
                              active: result.active === t("active") ? 0 : 1,
                              powers:
                                result.powers === t("admin")
                                  ? "admin"
                                  : "supAdmin",
                            };
                            dispatch(updateSubAdmin(data)).then((res) => {
                              dispatch(getSubAdmins());
                              if (!res.error) {
                                toast.success(
                                  t("toast.subAdmin.updatedSuccess")
                                );
                              } else {
                                dispatch(getSubAdmins());
                                toast.error(t("toast.subAdmin.updatedError"));
                              }
                            });
                          }
                        }}
                      >
                        {result?.active}
                      </span>
                    </td>
                  )}
                  {toggle.toggleColumns.control && (
                    <td className="table-td">
                      <span className="table-btn-container">
                        <IoMdEye
                          className="view-btn"
                          onClick={() => {
                            formik.setValues({
                              id: result?.id,
                              name: result?.name,
                              email: result?.email,
                              password: result?.password,
                              phone: result?.phone,
                              powers: result?.powers,
                              status: result?.active,
                              image: {
                                file: "",
                                preview: result?.image,
                              },
                            });
                            setToggle({
                              ...toggle,
                              add: !toggle.add,
                              read: true,
                            });
                          }}
                        />
                        {role === "admin" && (
                          <>
                            <MdDeleteOutline
                              className="delete-btn"
                              onClick={() => handleDelete(result)}
                            />
                            <MdEdit
                              className="edit-btn"
                              onClick={() => handleEdit(result)}
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
      {/* Pagination */}
      {searchResults?.length > 0 && error === null && loading === false && (
        <PaginationUI />
      )}
      {/* Add & Edit & Read Sub Admin */}
      <Modal
        isOpen={toggle.add}
        toggle={() => {
          formik.handleReset();
          setToggle({
            ...toggle,
            add: !toggle.add,
            powers: false,
            status: false,
            edit: false,
            read: false,
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
              powers: false,
              status: false,
              edit: false,
              read: false,
            });
          }}
        >
          {toggle.edit
            ? t("subAdmin.editTitle")
            : toggle.read
            ? formik.values.name
            : t("subAdmin.addTitle")}
          <IoMdClose
            onClick={() => {
              formik.handleReset();
              setToggle({
                ...toggle,
                add: !toggle.add,
                powers: false,
                status: false,
                edit: false,
                read: false,
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
                      {!toggle.read && (
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
                      )}
                    </Modal>
                  </label>
                </div>
                {!toggle.read && (
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
                )}
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
                    {t("subAdmin.columns.name")}
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    id="name"
                    placeholder={t("subAdmin.columns.name")}
                    name="name"
                    disabled={toggle.read}
                    value={formik.values.name}
                    onChange={handleInput}
                  />
                  {formik.errors.name && formik.touched.name ? (
                    <span className="error">{formik.errors.name}</span>
                  ) : null}
                </div>
                <div className="form-group-container d-flex flex-column align-items-end mb-3">
                  <label htmlFor="email" className="form-label">
                    {t("subAdmin.columns.email")}
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    id="email"
                    placeholder={t("subAdmin.columns.email")}
                    name="email"
                    disabled={toggle.read}
                    value={formik.values.email}
                    onChange={handleInput}
                  />
                  {formik.errors.email && formik.touched.email ? (
                    <span className="error">{formik.errors.email}</span>
                  ) : null}
                </div>
                <div className="form-group-container d-flex flex-column align-items-end mb-3">
                  <label htmlFor="phone" className="form-label">
                    {t("subAdmin.columns.phone")}
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    id="phone"
                    placeholder={t("subAdmin.columns.phone")}
                    name="phone"
                    disabled={toggle.read}
                    value={formik.values.phone}
                    onChange={handleInput}
                  />
                  {formik.errors.phone && formik.touched.phone ? (
                    <span className="error">{formik.errors.phone}</span>
                  ) : null}
                </div>
                <div className="form-group-container d-flex flex-column justify-content-center align-items-end mb-3">
                  <label htmlFor="status" className="form-label">
                    {t("status")}
                  </label>
                  {toggle.read ? (
                    <input
                      type="text"
                      className="form-input"
                      id="status"
                      placeholder={t("subAdmin.columns.status")}
                      name="status"
                      disabled={toggle.read}
                      value={formik.values.status}
                    />
                  ) : (
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
                        {formik.values.status === "inactive"
                          ? t("inactive")
                          : formik.values.status === "active"
                          ? t("active")
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
                            formik.values.status === "inactive" ? "active" : ""
                          }`}
                          value="inactive"
                          name="status"
                          onClick={(e) => {
                            setToggle({
                              ...toggle,
                              status: !toggle.status,
                            });
                            formik.setFieldValue("status", "inactive");
                          }}
                        >
                          {t("inactive")}
                        </button>
                        <button
                          type="button"
                          className={`item ${
                            formik.values.status === "active" ? "active" : ""
                          }`}
                          value="active"
                          name="status"
                          onClick={(e) => {
                            setToggle({
                              ...toggle,
                              status: !toggle.status,
                            });
                            formik.setFieldValue("status", "active");
                          }}
                        >
                          {t("active")}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
                <div className="form-group-container d-flex flex-column justify-content-center align-items-end mb-3">
                  <label htmlFor="powers" className="form-label">
                    {t("powers")}
                  </label>
                  {toggle.read ? (
                    <input
                      type="text"
                      className="form-input"
                      id="powers"
                      placeholder={t("subAdmin.columns.powers")}
                      name="powers"
                      disabled={toggle.read}
                      value={formik.values.powers}
                    />
                  ) : (
                    <div className="dropdown form-input">
                      <button
                        type="button"
                        onClick={() => {
                          setToggle({
                            ...toggle,
                            powers: !toggle.powers,
                          });
                        }}
                        className="dropdown-btn d-flex justify-content-between align-items-center"
                      >
                        {formik.values.powers === "admin"
                          ? t("admin")
                          : formik.values.powers === "supAdmin"
                          ? t("supAdmin")
                          : t("powers")}
                        <TiArrowSortedUp
                          className={`dropdown-icon ${
                            toggle.powers ? "active" : ""
                          }`}
                        />
                      </button>
                      <div
                        className={`dropdown-content ${
                          toggle.powers ? "active" : ""
                        }`}
                      >
                        <button
                          type="button"
                          className={`item ${
                            formik.values.powers === "admin" ? "active" : ""
                          }`}
                          value="admin"
                          name="powers"
                          onClick={(e) => {
                            setToggle({
                              ...toggle,
                              powers: !toggle.powers,
                            });
                            formik.setFieldValue("powers", "admin");
                          }}
                        >
                          {t("admin")}
                        </button>
                        <button
                          type="button"
                          className={`item ${
                            formik.values.powers === "supAdmin" ? "active" : ""
                          }`}
                          value="supAdmin"
                          name="powers"
                          onClick={(e) => {
                            setToggle({
                              ...toggle,
                              powers: !toggle.powers,
                            });
                            formik.setFieldValue("powers", "supAdmin");
                          }}
                        >
                          {t("supAdmin")}
                        </button>
                      </div>
                    </div>
                  )}
                  {formik.errors.powers && formik.touched.powers ? (
                    <span className="error">{formik.errors.powers}</span>
                  ) : null}
                </div>
                {!toggle.read && (
                  <>
                    <div className="form-group-container password d-flex flex-column align-items-end mb-3">
                      <label htmlFor="password" className="form-label">
                        {t("auth.login.password")}
                      </label>
                      <input
                        type={`${
                          toggle.showHidePassword ? "text" : "password"
                        }`}
                        className="form-input"
                        id="password"
                        placeholder="********"
                        name="password"
                        value={formik.values.password}
                        onChange={handleInput}
                      />
                      <span className="show-hide-password">
                        {toggle.showHidePassword ? (
                          <FaRegEye
                            onClick={() =>
                              setToggle({
                                ...toggle,
                                showHidePassword: !toggle.showHidePassword,
                              })
                            }
                          />
                        ) : (
                          <FaRegEyeSlash
                            onClick={() =>
                              setToggle({
                                ...toggle,
                                showHidePassword: !toggle.showHidePassword,
                              })
                            }
                          />
                        )}
                      </span>
                      {formik.errors.password && formik.touched.password ? (
                        <span className="error">{formik.errors.password}</span>
                      ) : null}
                    </div>
                    <div className="form-group-container password d-flex flex-column align-items-end mb-3">
                      <label htmlFor="confirmPassword" className="form-label">
                        {t("auth.login.confirmPassword")}
                      </label>
                      <input
                        type={`${
                          toggle.showHideConfirmedPassword ? "text" : "password"
                        }`}
                        className="form-input"
                        id="confirmPassword"
                        placeholder="********"
                        name="confirmPassword"
                        value={formik.values.confirmPassword}
                        onChange={handleInput}
                      />
                      {formik.errors.confirmPassword &&
                      formik.touched.confirmPassword ? (
                        <span className="error">
                          {formik.errors.confirmPassword}
                        </span>
                      ) : null}
                      <span className="show-hide-password">
                        {toggle.showHideConfirmedPassword ? (
                          <FaRegEye
                            onClick={() =>
                              setToggle({
                                ...toggle,
                                showHideConfirmedPassword:
                                  !toggle.showHideConfirmedPassword,
                              })
                            }
                          />
                        ) : (
                          <FaRegEyeSlash
                            onClick={() =>
                              setToggle({
                                ...toggle,
                                showHideConfirmedPassword:
                                  !toggle.showHideConfirmedPassword,
                              })
                            }
                          />
                        )}
                      </span>
                    </div>
                  </>
                )}
              </Col>
              <Col lg={12}>
                <div className="form-group-container d-flex flex-row-reverse justify-content-lg-start justify-content-center gap-3">
                  {!toggle.read && (
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
                      ) : toggle.edit ? (
                        t("edit")
                      ) : (
                        t("add")
                      )}
                    </button>
                  )}
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => {
                      setToggle({
                        ...toggle,
                        add: !toggle.add,
                        powers: false,
                        status: false,
                        edit: false,
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
    </div>
  );
};

export default SubAdmins;
