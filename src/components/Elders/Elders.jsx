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
import { TiArrowSortedUp, TiArrowSortedDown } from "react-icons/ti";
import { FaPen } from "react-icons/fa";
import { ImUpload } from "react-icons/im";
import { IoMdClose, IoMdEye } from "react-icons/io";

import anonymous from "../../assets/images/anonymous.png";

import {
  deleteScholarApi,
  getScholarsApi,
  addScholarApi,
  updateScholarApi,
} from "../../store/slices/scholarSlice";

import { useFormik } from "formik";

import Swal from "sweetalert2";

import { toast } from "react-toastify";

import { useFiltration, useSchema } from "../../hooks";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
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
  is_active: "",
};

const Elders = () => {
  const { t } = useTranslation();
  const role = Cookies.get("_role");
  const getEldersCookies = Cookies.get("GetElder");
  const addEldersCookies = Cookies.get("addElder");
  const editEldersCookies = Cookies.get("editElder");
  const deleteEldersCookies = Cookies.get("deleteElder");
  const getAudiosCookies = Cookies.get("GetAudio");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { validationSchema } = useSchema();
  const fileRef = useRef();
  const { scholars, loading, error } = useSelector((state) => state.scholar);
  const [toggle, setToggle] = useState({
    add: false,
    edit: false,
    imagePreview: false,
    status: false,
    is_active: false,
    searchTerm: "",
    activeColumn: false,
    activeRows: false,
    rowsPerPage: 5,
    currentPage: 1,
    sortColumn: "",
    sortOrder: "asc",
    elder: scholars,
    toggleColumns: {
      id: true,
      image: true,
      name: true,
      email: true,
      phone: true,
      visits: true,
      favorites: true,
      downloads: true,
      shares: true,
      status: true,
      activation: true,
      control: true,
    },
  });

  // Formik
  const formik = useFormik({
    initialValues,
    validationSchema: validationSchema.elder,
    onSubmit: (values) => {
      if (
        role === "admin" ||
        (addEldersCookies === "1" && getEldersCookies === "1") ||
        (editEldersCookies === "1" && getEldersCookies === "1")
      ) {
        // if email and phone is already exist with another scholar if just i change them to new values
        if (scholars.length > 0) {
          const emailExist = scholars.find(
            (scholar) => scholar.email === formik.values.email
          );
          const phoneExist = scholars.find(
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
        formData.append("name", formik.values.name);
        formData.append("email", formik.values.email);
        formData.append("phone", formik.values.phone);
        formData.append("is_active", formik.values.is_active);
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
            toast.error(t("noChange"));
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
                toast.success(t("toast.elder.updatedSuccess"));
              } else {
                toast.error(t("toast.elder.updatedError"));
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
              toast.success(t("toast.elder.addedSuccess"));
            } else {
              toast.error(t("toast.elder.addedError"));
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

  // handle Input Using Formik
  const handleInput = (e) => {
    formik.handleChange(e);
  };

  // Handle Edit Scholar
  const handleEdit = (scholar) => {
    formik.setValues({
      ...scholar,
      status: scholar.status === t("approve") ? "Approve" : "Pending",
      is_active: scholar.is_active === t("active") ? 1 : 0,
    });
  };

  // Delete Scholar
  const handleDelete = (elder) => {
    if (role === "admin" || deleteEldersCookies === "1") {
      Swal.fire({
        title: t("titleDeleteAlert") + elder?.name + "?",
        text: t("textDeleteAlert"),
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#0d1d34",
        confirmButtonText: t("confirmButtonText"),
        cancelButtonText: t("cancel"),
      }).then((result) => {
        if (result.isConfirmed) {
          dispatch(deleteScholarApi(elder?.id)).then((res) => {
            if (!res.error) {
              if (toggle.currentPage > 1 && searchResultsElders.length === 1) {
                setToggle({
                  ...toggle,
                  currentPage: toggle.currentPage - 1,
                });
              }
              dispatch(getScholarsApi());
              Swal.fire({
                title: `${t("titleDeletedSuccess")} ${elder?.name}`,
                text: `${t("titleDeletedSuccess")} ${elder?.name} ${t(
                  "textDeletedSuccess"
                )}`,
                icon: "success",
                confirmButtonColor: "#0d1d34",
                confirmButtonText: t("doneDeletedSuccess"),
              }).then(() => toast.success(t("toast.elder.deletedSuccess")));
            } else {
              toast.error(t("toast.elder.deletedError"));
            }
          });
        }
      });
    }
  };

  // Data
  const data = scholars?.map((item) => {
    return {
      ...item,
      status: item?.status === "Approve" ? t("approve") : t("pending"),
      is_active: item?.is_active === 1 ? t("active") : t("inactive"),
    };
  });

  // Filtration, Sorting, Pagination
  // Columns
  const columns = [
    { id: 0, name: "id", label: t("index") },
    { id: 1, name: "image", label: t("elders.columns.image") },
    { id: 2, name: "name", label: t("elders.columns.name") },
    { id: 3, name: "email", label: t("elders.columns.email") },
    { id: 4, name: "phone", label: t("elders.columns.phone") },
    { id: 5, name: "visits", label: t("audiosCount") },
    { id: 6, name: "favorites", label: t("favorites") },
    { id: 7, name: "downloads", label: t("downloads") },
    { id: 8, name: "shares", label: t("shares") },
    { id: 9, name: "status", label: t("status") },
    { id: 10, name: "activation", label: t("activation") },
    { id: 11, name: "control", label: t("action") },
  ];
  const {
    PaginationUI,
    handleSort,
    handleSearch,
    handleToggleColumns,
    searchResultsElders,
  } = useFiltration({
    rowData: data,
    toggle,
    setToggle,
  });

  // get data from api
  useEffect(() => {
    try {
      if (role === "admin" || getEldersCookies === "1") {
        dispatch(getScholarsApi());
      }
      if (getEldersCookies === "0") {
        Cookies.set("addElder", 0, {
          expires: 30,
          secure: true,
          sameSite: "strict",
          path: "/",
        });
        Cookies.set("editElder", 0, {
          expires: 30,
          secure: true,
          sameSite: "strict",
          path: "/",
        });
        Cookies.set("deleteElder", 0, {
          expires: 30,
          secure: true,
          sameSite: "strict",
          path: "/",
        });
      }
    } catch (error) {
      console.log(error);
    }
  }, [dispatch, role, getEldersCookies]);

  return (
    <div className="scholar-container mt-4 m-sm-3 m-0">
      {(role === "admin" ||
        (addEldersCookies === "1" && getEldersCookies === "1")) && (
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
            {t("elders.addTitle")}
          </button>
        </div>
      )}
      <div className="scholar">
        <div className="table-header">
          {/* Search */}
          <div
            className="search-container form-group-container form-input"
            style={{
              width: "35%",
            }}
          >
            <input
              type="text"
              className="form-input"
              placeholder={t("searchElder")}
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
                  {t("elders.columns.image")}
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
                  {t("elders.columns.name")}
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
                  {t("elders.columns.email")}
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
                  {t("elders.columns.phone")}
                  {toggle.sortColumn === columns[4].name ? (
                    toggle.sortOrder === "asc" ? (
                      <TiArrowSortedUp />
                    ) : (
                      <TiArrowSortedDown />
                    )
                  ) : null}
                </th>
              )}
              {toggle.toggleColumns.visits && (
                <th className="table-th" onClick={() => handleSort(columns[5])}>
                  {t("audiosCount")}
                  {toggle.sortColumn === columns[5].name ? (
                    toggle.sortOrder === "asc" ? (
                      <TiArrowSortedUp />
                    ) : (
                      <TiArrowSortedDown />
                    )
                  ) : null}
                </th>
              )}
              {toggle.toggleColumns.favorites && (
                <th className="table-th" onClick={() => handleSort(columns[6])}>
                  {t("favorites")}
                  {toggle.sortColumn === columns[6].name ? (
                    toggle.sortOrder === "asc" ? (
                      <TiArrowSortedUp />
                    ) : (
                      <TiArrowSortedDown />
                    )
                  ) : null}
                </th>
              )}
              {toggle.toggleColumns.downloads && (
                <th className="table-th" onClick={() => handleSort(columns[7])}>
                  {t("downloads")}
                  {toggle.sortColumn === columns[7].name ? (
                    toggle.sortOrder === "asc" ? (
                      <TiArrowSortedUp />
                    ) : (
                      <TiArrowSortedDown />
                    )
                  ) : null}
                </th>
              )}
              {toggle.toggleColumns.shares && (
                <th className="table-th" onClick={() => handleSort(columns[8])}>
                  {t("shares")}
                  {toggle.sortColumn === columns[8].name ? (
                    toggle.sortOrder === "asc" ? (
                      <TiArrowSortedUp />
                    ) : (
                      <TiArrowSortedDown />
                    )
                  ) : null}
                </th>
              )}
              {toggle.toggleColumns.status && (
                <th className="table-th" onClick={() => handleSort(columns[9])}>
                  {t("status")}
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
              {(role === "admin" || getAudiosCookies === "1") &&
                toggle.toggleColumns.control && (
                  <th
                    className="table-th"
                    onClick={() => handleSort(columns[11])}
                  >
                    {t("action")}
                    {toggle.sortColumn === columns[11].name ? (
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
                <td
                  className="table-td"
                  colSpan={
                    role === "admin" || getAudiosCookies === "1" ? 12 : 11
                  }
                >
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
                <td
                  className="table-td"
                  colSpan={
                    role === "admin" || getAudiosCookies === "1" ? 12 : 11
                  }
                >
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
          {searchResultsElders?.length === 0 && error === null && !loading && (
            <tbody>
              <tr className="no-data-container">
                <td
                  className="table-td"
                  colSpan={
                    role === "admin" || getAudiosCookies === "1" ? 12 : 11
                  }
                >
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
                <td
                  className="table-td"
                  colSpan={
                    role === "admin" || getAudiosCookies === "1" ? 12 : 11
                  }
                >
                  <p className="no-data no-columns mb-0">{t("noColumns")}</p>
                </td>
              </tr>
            </tbody>
          )}
          {/* Data */}
          {searchResultsElders?.length > 0 &&
            error === null &&
            loading === false && (
              <tbody>
                {searchResultsElders?.map((result, idx) => (
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
                    {toggle.toggleColumns.name && (
                      <td className="table-td name">
                        <Link to={`/dr-omar/elders/${result?.id}`}>
                          {result?.name}
                        </Link>
                      </td>
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
                        <a
                          className="text-white"
                          href={`tel:${result?.phone}`}
                          dir="ltr"
                        >
                          {result?.phone}
                        </a>
                      </td>
                    )}
                    {toggle.toggleColumns.visits && (
                      <td className="table-td">{result?.audios_count}</td>
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
                              result?.status === t("approve") ? "green" : "red",
                            cursor:
                              role === "admin" ||
                              (editEldersCookies === "1" &&
                                getEldersCookies === "1")
                                ? "pointer"
                                : "default",
                          }}
                          onClick={() => {
                            if (
                              role === "admin" ||
                              (editEldersCookies === "1" &&
                                getEldersCookies === "1")
                            ) {
                              dispatch(
                                updateScholarApi({
                                  name: result?.name,
                                  email: result?.email,
                                  phone: result?.phone,
                                  id: result?.id,
                                  status:
                                    result?.status === t("approve")
                                      ? "Pending"
                                      : "Approve",
                                  is_active:
                                    result?.is_active === t("active") ? 1 : 0,
                                })
                              ).then((res) => {
                                if (!res.error) {
                                  dispatch(getScholarsApi());
                                  toast.success(
                                    t("toast.elder.updatedSuccess")
                                  );
                                } else {
                                  toast.error(t("toast.elder.updatedError"));
                                  dispatch(getScholarsApi());
                                }
                              });
                            }
                          }}
                        >
                          {result?.status}
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
                                : "red",
                            cursor:
                              role === "admin" ||
                              (editEldersCookies === "1" &&
                                getEldersCookies === "1")
                                ? "pointer"
                                : "default",
                          }}
                          onClick={() => {
                            if (
                              role === "admin" ||
                              (editEldersCookies === "1" &&
                                getEldersCookies === "1")
                            ) {
                              dispatch(
                                updateScholarApi({
                                  name: result?.name,
                                  email: result?.email,
                                  phone: result?.phone,
                                  id: result.id,
                                  status:
                                    result.status === t("approve")
                                      ? "Approve"
                                      : "Pending",
                                  is_active:
                                    result.is_active === t("active") ? 0 : 1,
                                })
                              ).then((res) => {
                                if (!res.error) {
                                  dispatch(getScholarsApi());
                                  toast.success(
                                    t("toast.elder.updatedSuccess")
                                  );
                                } else {
                                  toast.error(t("toast.elder.updatedError"));
                                  dispatch(getScholarsApi());
                                }
                              });
                            }
                          }}
                        >
                          {result?.is_active}
                        </span>
                      </td>
                    )}
                    {toggle.toggleColumns.control && (
                      <td className="table-td">
                        <span className="table-btn-container">
                          {(role === "admin" || getAudiosCookies === "1") && (
                            <IoMdEye
                              className="edit-btn"
                              onClick={() => {
                                navigate(`/dr-omar/elders/${result?.id}`);
                              }}
                            />
                          )}
                          {(role === "admin" || editEldersCookies === "1") && (
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
                          )}
                          {(role === "admin" ||
                            deleteEldersCookies === "1") && (
                            <MdDeleteOutline
                              className="delete-btn"
                              onClick={() => handleDelete(result)}
                            />
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
      {searchResultsElders?.length > 0 &&
        error === null &&
        loading === false && <PaginationUI />}
      {(role === "admin" ||
        (getEldersCookies === "1" && addEldersCookies === "1")) && (
        <>
          {/* Add Elder */}
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
              {t("elders.addTitle")}
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
                    <div
                      className="form-group-container d-flex flex-column align-items-end mb-3"
                      style={{ marginTop: "-4px" }}
                    >
                      <label htmlFor="name" className="form-label">
                        {t("elders.columns.name")}
                      </label>
                      <input
                        type="text"
                        className="form-input"
                        id="name"
                        placeholder={t("elders.columns.name")}
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
                        {t("elders.columns.email")}
                      </label>
                      <input
                        type="text"
                        className="form-input"
                        id="email"
                        placeholder={t("elders.columns.email")}
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
                        {t("elders.columns.phone")}
                      </label>
                      <input
                        type="text"
                        className="form-input"
                        id="test"
                        placeholder={t("elders.columns.phone")}
                        name="phone"
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
                            ? t("pending")
                            : formik.values.status === "Approve"
                            ? t("approve")
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
                            {t("pending")}
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
                            {t("approve")}
                          </button>
                        </div>
                      </div>
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
        </>
      )}
      {(role === "admin" ||
        (getEldersCookies === "1" && editEldersCookies === "1")) && (
        <>
          {/* Edit Elder */}
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
              {t("elders.editTitle")}
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
                        {t("elders.columns.name")}
                      </label>
                      <input
                        type="text"
                        className="form-input"
                        id="name"
                        placeholder={t("elders.columns.name")}
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
                        {t("elders.columns.email")}
                      </label>
                      <input
                        type="text"
                        className="form-input"
                        id="email"
                        placeholder={t("elders.columns.email")}
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
                        {t("elders.columns.phone")}
                      </label>
                      <input
                        type="text"
                        className="form-input"
                        id="phone"
                        placeholder={t("elders.columns.phone")}
                        name="phone"
                        value={formik.values?.phone}
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
                            ? t("pending")
                            : formik.values?.status === "Approve"
                            ? t("approve")
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
                            {t("pending")}
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
                            {t("approve")}
                          </button>
                        </div>
                      </div>
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

export default Elders;
