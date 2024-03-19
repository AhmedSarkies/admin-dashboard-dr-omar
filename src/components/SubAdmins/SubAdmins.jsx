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
  deleteSubAdminApi,
  getSubAdmins,
  getSubAdminsApi,
  addSubAdminApi,
} from "../../store/slices/subAdminSlice";
import { useFormik } from "formik";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";
import { useFiltration, useSchema } from "../../hooks";

const initialValues = {
  image: {
    file: "",
    preview: "",
  },
  name: "",
  email: "",
  phone: "",
  status: "",
};

const SubAdmins = ({ dashboard }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { validationSchema } = useSchema();
  const { subAdmins, loading, error } = useSelector((state) => state.subAdmin);
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
    validationSchema: validationSchema.subAdmins,
    onSubmit: (values) => {
      // if email and phone is already exist with another scholar if just i change them to new values
      if (subAdmins.length > 0) {
        const emailExist = subAdmins.find(
          (scholar) => scholar.email === formik.values.email
        );
        const phoneExist = subAdmins.find(
          (scholar) => scholar.phone === formik.values.phone
        );
        if (emailExist && emailExist.id !== formik.values.id) {
          toast.error(t("emailExisted"));
          return;
        }
        if (phoneExist && phoneExist.id !== formik.values.id) {
          toast.error(t("phoneExisted"));
          return;
        }
      }
      const formData = new FormData();
      // formData.append("name", formik.values.name);
      // formData.append("email", formik.values.email);
      // formData.append("phone", formik.values.phone);
      // formData.append("password", formik.values.password);
      // formData.append(
      //   "status",
      //   formik.values.status === "Inactive"
      //     ? "Inactive"
      //     : formik.values.status === "Active"
      //     ? "Active"
      //     : "Inactive"
      // );
      // if (values.id) {
      //   // if the scholar don't change anything even the image
      //   const scholar = subAdmins.find((scholar) => scholar.id === values.id);
      //   if (
      //     scholar.name === values.name &&
      //     scholar.email === values.email &&
      //     scholar.phone === values.phone &&
      //     scholar.status === values.status &&
      //     scholar.image === values.image
      //   ) {
      //     setToggle({
      //       ...toggle,
      //       edit: !toggle.edit,
      //     });
      //     toast.error(t("noChange"));
      //     return;
      //   } else {
      //     formData.append("id", values.id);
      //     if (values.image.file !== undefined) {
      //       formData.append("image", values.image.file);
      //     }
      //     dispatch(updateSubAdminApi(formData)).then((res) => {
      //       dispatch(getSubAdminsApi());
      //       if (!res.error) {
      //         formik.handleReset();
      //         setToggle({
      //           ...toggle,
      //           edit: !toggle.edit,
      //         });
      //         toast.success(t("toast.subAdmin.editSuccess"));
      //       } else {
      //         toast.error(t("toast.subAdmin.editError"));
      //       }
      //     });
      //   }
      // } else {
      //   formData.append("image", formik.values.image.file);
      //   dispatch(addSubAdminApi(formData)).then((res) => {
      //     dispatch(getSubAdminsApi());
      //     if (!res.error) {
      //       toast.success(t("toast.subAdmin.addSuccess"));
      //       formik.handleReset();
      //       setToggle({
      //         ...toggle,
      //         add: !toggle.add,
      //       });
      //     } else {
      //       toast.error(t("toast.subAdmin.addError"));
      //     }
      //   });
      // }
      formData.append("name", formik.values.name);
      formData.append("email", formik.values.email);
      formData.append("password", formik.values.password);
      dispatch(addSubAdminApi(formData)).then((res) => {
        dispatch(getSubAdminsApi());
        if (!res.error) {
          toast.success(t("toast.subAdmin.addSuccess"));
          formik.handleReset();
          setToggle({
            ...toggle,
            add: !toggle.add,
          });
        } else {
          toast.error(t("toast.subAdmin.addError"));
        }
      });
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

  // Delete Sub Admin
  const handleDelete = (subAdmin) => {
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
        dispatch(deleteSubAdminApi(subAdmin.id)).then((res) => {
          if (!res.error) {
            dispatch(getSubAdminsApi());
            Swal.fire({
              title: `تم حذف ${subAdmin?.name}`,
              text: `تم حذف ${subAdmin?.name} بنجاح`,
              icon: "success",
              confirmButtonColor: "#0d1d34",
            }).then(() => toast.success(t("toast.subAdmin.deleteSuccess")));
          } else {
            toast.error(t("toast.subAdmin.deleteError"));
          }
        });
      }
    });
  };

  // Filtration, Sorting, Pagination
  // Columns
  const columns = [
    { id: 1, name: "image", label: t("subAdmin.columns.image") },
    { id: 2, name: "name", label: t("subAdmin.columns.name") },
    { id: 3, name: "email", label: t("subAdmin.columns.email") },
    { id: 4, name: "phone", label: t("subAdmin.columns.phone") },
    { id: 5, name: "status", label: t("status") },
    { id: 6, name: "control", label: t("action") },
  ];
  const {
    PaginationUI,
    handleSort,
    handleSearch,
    handleToggleColumns,
    results,
  } = useFiltration({
    rowData: subAdmins,
    toggle,
    setToggle,
  });

  // get data from api
  useEffect(() => {
    try {
      dispatch(getSubAdminsApi()).then((res) => {
        if (!res.error) {
          dispatch(getSubAdmins(res.payload));
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
          {t("subAdmin.addTitle")}
        </button>
        {dashboard && <h2>{t("subAdmin.title")}</h2>}
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
                  {t("subAdmin.columns.image")}
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
                  {t("subAdmin.columns.name")}
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
                  {t("subAdmin.columns.email")}
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
                  {t("subAdmin.columns.phone")}
                  {toggle.sortColumn === columns[3].name ? (
                    toggle.sortOrder === "asc" ? (
                      <TiArrowSortedUp />
                    ) : (
                      <TiArrowSortedDown />
                    )
                  ) : null}
                </th>
              )}
              {toggle.toggleColumns.status.title && (
                <th className="table-th" onClick={() => handleSort(columns[4])}>
                  {t("subAdmin.columns.status")}
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
                  {t("action")}
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
                            result?.status === "Active"
                              ? "green"
                              : result?.status === "Inactive"
                              ? "red"
                              : "red",
                        }}
                      >
                        {result?.status === "Active"
                          ? t("subAdmin.columns.active")
                          : result?.status === "Inactive"
                          ? t("subAdmin.columns.inactive")
                          : t("subAdmin.columns.inactive")}
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
            </tbody>
          )}
        </table>
      </div>
      {/* Pagination */}
      {results.length > 0 && error === null && loading === false && (
        <PaginationUI />
      )}
      {/* Edit Sub Admin */}
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
        >
          {t("subAdmin.editTitle")}
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
                        formik.values?.image && formik.values?.image.file === ""
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
                    {t("subAdmin.columns.name")}
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    id="name"
                    placeholder={t("subAdmin.columns.name")}
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
                    {t("subAdmin.columns.email")}
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    id="email"
                    placeholder={t("subAdmin.columns.email")}
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
                    {t("subAdmin.columns.phone")}
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    id="phone"
                    placeholder={t("subAdmin.columns.phone")}
                    name="phone"
                    value={formik.values?.phone}
                    onChange={handleInput}
                  />
                  {formik.errors.phone && formik.touched.phone ? (
                    <span className="error">{formik.errors.phone}</span>
                  ) : null}
                </div>
                <div className="form-group-container d-flex flex-column align-items-end mb-3">
                  <label htmlFor="password" className="form-label">
                    {t("subAdmin.columns.password")}
                  </label>
                  <input
                    type="password"
                    className="form-input"
                    id="password"
                    placeholder="********"
                    name="password"
                    value={formik.values?.password}
                    onChange={handleInput}
                  />
                  {formik.errors.password && formik.touched.password ? (
                    <span className="error">{formik.errors.password}</span>
                  ) : null}
                </div>
                <div className="form-group-container d-flex flex-column justify-content-center align-items-end">
                  <label htmlFor="status" className="form-label">
                    {t("status")}
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
                      {formik.values?.status === "Inactive"
                        ? t("subAdmin.columns.inactive")
                        : formik.values?.status === "Active"
                        ? t("subAdmin.columns.active")
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
                          formik.values?.status === "Inactive" ? "active" : ""
                        }`}
                        value="Inactive"
                        name="status"
                        onClick={() => {
                          setToggle({
                            ...toggle,
                            status: !toggle.status,
                          });
                          formik.setFieldValue("status", "Inactive");
                        }}
                      >
                        {t("subAdmin.columns.inactive")}
                      </button>
                      <button
                        type="button"
                        className={`item ${
                          formik.values?.status === "Active" ? "active" : ""
                        }`}
                        value="Active"
                        name="status"
                        onClick={() => {
                          setToggle({
                            ...toggle,
                            status: !toggle.status,
                          });
                          formik.setFieldValue("status", "Active");
                        }}
                      >
                        {t("subAdmin.columns.active")}
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
      {/* Add Sub Admin */}
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
          {t("subAdmin.addTitle")}
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
                  <label htmlFor="name" className="form-label">
                    {t("subAdmin.columns.name")}
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    id="name"
                    placeholder={t("subAdmin.columns.name")}
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
                    {t("subAdmin.columns.email")}
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    id="email"
                    placeholder={t("subAdmin.columns.email")}
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
                    {t("subAdmin.columns.phone")}
                  </label>
                  <input
                    type="text"
                    className="form-input"
                    id="test"
                    placeholder={t("subAdmin.columns.phone")}
                    name="phone"
                    value={formik.values.phone}
                    onChange={handleInput}
                  />
                  {formik.errors.phone && formik.touched.phone ? (
                    <span className="error">{formik.errors.phone}</span>
                  ) : null}
                </div>
                <div className="form-group-container d-flex flex-column align-items-end mb-3">
                  <label htmlFor="password" className="form-label">
                    {t("auth.login.password")}
                  </label>
                  <input
                    type="password"
                    className="form-input"
                    id="password"
                    placeholder="********"
                    name="password"
                    value={formik.values?.password}
                    onChange={handleInput}
                  />
                  {formik.errors.password && formik.touched.password ? (
                    <span className="error">{formik.errors.password}</span>
                  ) : null}
                </div>
                <div className="form-group-container d-flex flex-column justify-content-center align-items-end">
                  <label htmlFor="status" className="form-label">
                    {t("status")}
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
                      {formik.values.status === "Inactive"
                        ? t("inactive")
                        : formik.values.status === "Active"
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
                          formik.values.status === "Inactive" ? "active" : ""
                        }`}
                        value="Inactive"
                        name="status"
                        onClick={(e) => {
                          setToggle({
                            ...toggle,
                            status: !toggle.status,
                          });
                          formik.setFieldValue("status", "Inactive");
                        }}
                      >
                        {t("inactive")}
                      </button>
                      <button
                        type="button"
                        className={`item ${
                          formik.values.status === "Active" ? "active" : ""
                        }`}
                        value="Active"
                        name="status"
                        onClick={(e) => {
                          setToggle({
                            ...toggle,
                            status: !toggle.status,
                          });
                          formik.setFieldValue("status", "Active");
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
    </div>
  );
};

export default SubAdmins;
