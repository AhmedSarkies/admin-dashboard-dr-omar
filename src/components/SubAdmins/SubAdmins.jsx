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
  // subAdmins: "",
  // addSubAdmins: "",
  // editSubAdmins: "",
  // deleteSubAdmins: "",
  // users: "",
  // editUser: "",
  // deleteUser: "",
  // elders: "",
  // addElders: "",
  // editElders: "",
  // deleteElders: "",
  // audios: "",
  // addAudios: "",
  // editAudios: "",
  // deleteAudios: "",
  // articles: "",
  // addArticles: "",
  // editArticles: "",
  // deleteArticles: "",
  // books: "",
  // addBooks: "",
  // editBooks: "",
  // deleteBooks: "",
  // images: "",
  // addImages: "",
  // editImages: "",
  // deleteImages: "",
  // notifications: "",
  // addNotifications: "",
  // deleteNotifications: "",
  // messages: "",
  // settings: "",
  // editSettings: "",
  // codeContent: "",
  // addCodeContent: "",
  // editCodeContent: "",
  // sendCodeContent: "",
  // introductionPages: "",
  // addIntroductionPages: "",
  // editIntroductionPages: "",
  // deleteIntroductionPages: "",
  // termsAndConditions: "",
  // addTermsAndConditions: "",
  // editTermsAndConditions: "",
  // deleteTermsAndConditions: "",
  // mainCategoriesBooks: "",
  // addMainCategoriesBooks: "",
  // editMainCategoriesBooks: "",
  // deleteMainCategoriesBooks: "",
  // subCategoriesBooks: "",
  // addSubCategoriesBooks: "",
  // editSubCategoriesBooks: "",
  // deleteSubCategoriesBooks: "",
  // subSubCategoriesBooks: "",
  // addSubSubCategoriesBooks: "",
  // editSubSubCategoriesBooks: "",
  // deleteSubSubCategoriesBooks: "",
  // categoriesAudio: "",
  // addCategoriesAudio: "",
  // editCategoriesAudio: "",
  // deleteCategoriesAudio: "",
  // categoriesImage: "",
  // addCategoriesImage: "",
  // editCategoriesImage: "",
  // deleteCategoriesImage: "",
  // categoriesArticle: "",
  // addCategoriesArticle: "",
  // editCategoriesArticle: "",
  // deleteCategoriesArticle: "",
};

const SubAdmins = () => {
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
        if (subAdmins.length > 0) {
          const phoneExist = subAdmins.find(
            (subAdmin) => subAdmin.phone === formik.values.phone
          );
          if (phoneExist && phoneExist.id !== formik.values.id) {
            toast.error(t("phoneExisted"));
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
              if (toggle.currentPage > 1 && searchResults.length === 1) {
                setToggle({
                  ...toggle,
                  currentPage: toggle.currentPage - 1,
                });
              }
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
      // subAdmins: subAdmin?.subAdmins === true ? 1 : 0,
      // addSubAdmins: subAdmin?.addSubAdmins === true ? 1 : 0,
      // editSubAdmins: subAdmin?.editSubAdmins === true ? 1 : 0,
      // deleteSubAdmins: subAdmin?.deleteSubAdmins === true ? 1 : 0,
      // users: subAdmin?.users === true ? 1 : 0,
      // editUser: subAdmin?.editUser === true ? 1 : 0,
      // deleteUser: subAdmin?.deleteUser === true ? 1 : 0,
      // elders: subAdmin?.elders === true ? 1 : 0,
      // addElders: subAdmin?.addElders === true ? 1 : 0,
      // editElders: subAdmin?.editElders === true ? 1 : 0,
      // deleteElders: subAdmin?.deleteElders === true ? 1 : 0,
      // audios: subAdmin?.audios === true ? 1 : 0,
      // addAudios: subAdmin?.addAudios === true ? 1 : 0,
      // editAudios: subAdmin?.editAudios === true ? 1 : 0,
      // deleteAudios: subAdmin?.deleteAudios === true ? 1 : 0,
      // articles: subAdmin?.articles === true ? 1 : 0,
      // addArticles: subAdmin?.addArticles === true ? 1 : 0,
      // editArticles: subAdmin?.editArticles === true ? 1 : 0,
      // deleteArticles: subAdmin?.deleteArticles === true ? 1 : 0,
      // books: subAdmin?.books === true ? 1 : 0,
      // addBooks: subAdmin?.addBooks === true ? 1 : 0,
      // editBooks: subAdmin?.editBooks === true ? 1 : 0,
      // deleteBooks: subAdmin?.deleteBooks === true ? 1 : 0,
      // images: subAdmin?.images === true ? 1 : 0,
      // addImages: subAdmin?.addImages === true ? 1 : 0,
      // editImages: subAdmin?.editImages === true ? 1 : 0,
      // deleteImages: subAdmin?.deleteImages === true ? 1 : 0,
      // notifications: subAdmin?.notifications === true ? 1 : 0,
      // addNotifications: subAdmin?.addNotifications === true ? 1 : 0,
      // deleteNotifications: subAdmin?.deleteNotifications === true ? 1 : 0,
      // messages: subAdmin?.messages === true ? 1 : 0,
      // settings: subAdmin?.settings === true ? 1 : 0,
      // editSettings: subAdmin?.editSettings === true ? 1 : 0,
      // codeContent: subAdmin?.codeContent === true ? 1 : 0,
      // addCodeContent: subAdmin?.addCodeContent === true ? 1 : 0,
      // editCodeContent: subAdmin?.editCodeContent === true ? 1 : 0,
      // sendCodeContent: subAdmin?.sendCodeContent === true ? 1 : 0,
      // introductionPages: subAdmin?.introductionPages === true ? 1 : 0,
      // addIntroductionPages: subAdmin?.addIntroductionPages === true ? 1 : 0,
      // editIntroductionPages: subAdmin?.editIntroductionPages === true ? 1 : 0,
      // deleteIntroductionPages:
      //   subAdmin?.deleteIntroductionPages === true ? 1 : 0,
      // termsAndConditions: subAdmin?.termsAndConditions === true ? 1 : 0,
      // addTermsAndConditions: subAdmin?.addTermsAndConditions === true ? 1 : 0,
      // editTermsAndConditions: subAdmin?.editTermsAndConditions === true ? 1 : 0,
      // deleteTermsAndConditions:
      //   subAdmin?.deleteTermsAndConditions === true ? 1 : 0,
      // mainCategoriesBooks: subAdmin?.mainCategoriesBooks === true ? 1 : 0,
      // addMainCategoriesBooks: subAdmin?.addMainCategoriesBooks === true ? 1 : 0,
      // editMainCategoriesBooks:
      //   subAdmin?.editMainCategoriesBooks === true ? 1 : 0,
      // deleteMainCategoriesBooks:
      //   subAdmin?.deleteMainCategoriesBooks === true ? 1 : 0,
      // subCategoriesBooks: subAdmin?.subCategoriesBooks === true ? 1 : 0,
      // addSubCategoriesBooks: subAdmin?.addSubCategoriesBooks === true ? 1 : 0,
      // editSubCategoriesBooks: subAdmin?.editSubCategoriesBooks === true ? 1 : 0,
      // deleteSubCategoriesBooks:
      //   subAdmin?.deleteSubCategoriesBooks === true ? 1 : 0,
      // subSubCategoriesBooks: subAdmin?.subSubCategoriesBooks === true ? 1 : 0,
      // addSubSubCategoriesBooks:
      //   subAdmin?.addSubSubCategoriesBooks === true ? 1 : 0,
      // editSubSubCategoriesBooks:
      //   subAdmin?.editSubSubCategoriesBooks === true ? 1 : 0,
      // deleteSubSubCategoriesBooks:
      //   subAdmin?.deleteSubSubCategoriesBooks === true ? 1 : 0,
      // categoriesAudio: subAdmin?.categoriesAudio === true ? 1 : 0,
      // addCategoriesAudio: subAdmin?.addCategoriesAudio === true ? 1 : 0,
      // editCategoriesAudio: subAdmin?.editCategoriesAudio === true ? 1 : 0,
      // deleteCategoriesAudio: subAdmin?.deleteCategoriesAudio === true ? 1 : 0,
      // categoriesImage: subAdmin?.categoriesImage === true ? 1 : 0,
      // addCategoriesImage: subAdmin?.addCategoriesImage === true ? 1 : 0,
      // editCategoriesImage: subAdmin?.editCategoriesImage === true ? 1 : 0,
      // deleteCategoriesImage: subAdmin?.deleteCategoriesImage === true ? 1 : 0,
      // categoriesArticle: subAdmin?.categoriesArticle === true ? 1 : 0,
      // addCategoriesArticle: subAdmin?.addCategoriesArticle === true ? 1 : 0,
      // editCategoriesArticle: subAdmin?.editCategoriesArticle === true ? 1 : 0,
      // deleteCategoriesArticle:
      //   subAdmin?.deleteCategoriesArticle === true ? 1 : 0,
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
            <Row className="d-flex justify-content-center align-items-center p-3 pb-0">
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
            </Row>
            <Row className="d-flex justify-content-center align-items-center p-3 pb-0 pt-0">
              <Col lg={12}>
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
              </Col>
              <Col lg={12}>
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
              </Col>
              <Col lg={12}>
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
              </Col>
              <Col lg={12}>
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
              </Col>
              <Col lg={12}>
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
              </Col>
            </Row>
            {/* {formik.values.powers === "supAdmin" && (
              <Row className="d-flex flex-row-reverse justify-content-start align-items-center p-3 pt-2">
                <Col
                  xs={6}
                  className="d-flex justify-content-center align-items-end flex-column"
                >
                  <label htmlFor="settingsTitle" className="form-label">
                    {t("subAdmin.powers.settings")}
                  </label>
                  <Row className="d-flex flex-row-reverse justify-content-start align-items-center p-3 pt-2">
                    <Col xs={12}>
                      <div className="form-group d-flex justify-content-end gap-sm-3 gap-2">
                        <label htmlFor="settings" className="form-label">
                          {t("subAdmin.powers.show")}
                        </label>
                        <input
                          type="checkbox"
                          className="prayer-time-input"
                          id="settings"
                          name="settings"
                          value={formik.values.settings}
                          onChange={handleInput}
                        />
                      </div>
                    </Col>
                    {formik.values.settings && (
                      <Col xs={12}>
                        <div className="form-group d-flex justify-content-end gap-sm-3 gap-2">
                          <label htmlFor="editSettings" className="form-label">
                            {t("subAdmin.powers.edit")}
                          </label>
                          <input
                            type="checkbox"
                            className="prayer-time-input"
                            id="editSettings"
                            name="editSettings"
                            value={formik.values.editSettings}
                            onChange={handleInput}
                          />
                        </div>
                      </Col>
                    )}
                  </Row>
                </Col>
                <Col
                  xs={6}
                  className="d-flex justify-content-center align-items-end flex-column"
                >
                  <label htmlFor="messagesTitle" className="form-label">
                    {t("subAdmin.powers.messages")}
                  </label>
                  <Row className="d-flex flex-row-reverse justify-content-start align-items-center p-3 pt-2">
                    <Col xs={12} className="p-0 m-0">
                      <div className="form-group d-flex justify-content-end gap-sm-3 gap-2">
                        <label htmlFor="messages" className="form-label">
                          {t("subAdmin.powers.show")}
                        </label>
                        <input
                          type="checkbox"
                          className="prayer-time-input"
                          id="messages"
                          name="messages"
                          value={formik.values.messages}
                          onChange={handleInput}
                        />
                      </div>
                    </Col>
                  </Row>
                </Col>
                <hr className="d-block" />
                <Col
                  sm={6}
                  className="d-flex justify-content-center align-items-end flex-column"
                >
                  <label htmlFor="subAdminsTitle" className="form-label">
                    {t("subAdmin.powers.subAdmins")}
                  </label>
                  <Row className="d-flex flex-row-reverse justify-content-start align-items-center p-3 pt-2">
                    <Col
                      xs={formik.values.subAdmins ? 6 : 12}
                      className="p-0 m-0"
                    >
                      <div className="form-group d-flex justify-content-end gap-sm-3 gap-2">
                        <label htmlFor="subAdmins" className="form-label">
                          {t("subAdmin.powers.show")}
                        </label>
                        <input
                          type="checkbox"
                          className="prayer-time-input"
                          id="subAdmins"
                          name="subAdmins"
                          value={formik.values.subAdmins}
                          onChange={handleInput}
                        />
                      </div>
                    </Col>
                    {formik.values.subAdmins && (
                      <>
                        <Col xs={6} className="p-0 m-0">
                          <div className="form-group d-flex justify-content-end gap-sm-3 gap-2">
                            <label
                              htmlFor="addSubAdmins"
                              className="form-label"
                            >
                              {t("subAdmin.powers.add")}
                            </label>
                            <input
                              type="checkbox"
                              className="prayer-time-input"
                              id="addSubAdmins"
                              name="addSubAdmins"
                              value={formik.values.addSubAdmins}
                              onChange={handleInput}
                            />
                          </div>
                        </Col>
                        <Col xs={6} className="p-0 m-0">
                          <div className="form-group d-flex justify-content-end gap-sm-3 gap-2">
                            <label
                              htmlFor="editSubAdmins"
                              className="form-label"
                            >
                              {t("subAdmin.powers.edit")}
                            </label>
                            <input
                              type="checkbox"
                              className="prayer-time-input"
                              id="editSubAdmins"
                              name="editSubAdmins"
                              value={formik.values.editSubAdmins}
                              onChange={handleInput}
                            />
                          </div>
                        </Col>
                        <Col xs={6} className="p-0 m-0">
                          <div className="form-group d-flex justify-content-end gap-sm-3 gap-2">
                            <label
                              htmlFor="deleteSubAdmins"
                              className="form-label"
                            >
                              {t("subAdmin.powers.delete")}
                            </label>
                            <input
                              type="checkbox"
                              className="prayer-time-input"
                              id="deleteSubAdmins"
                              name="deleteSubAdmins"
                              value={formik.values.deleteSubAdmins}
                              onChange={handleInput}
                            />
                          </div>
                        </Col>
                      </>
                    )}
                  </Row>
                </Col>
                <hr className="d-sm-none d-block" />
                <Col
                  sm={6}
                  className="d-flex justify-content-center align-items-end flex-column"
                >
                  <label htmlFor="usersTitle" className="form-label">
                    {t("subAdmin.powers.users")}
                  </label>
                  <Row className="d-flex flex-row-reverse justify-content-start align-items-center p-3 pt-2">
                    <Col xs={formik.values.users ? 6 : 12} className="p-0 m-0">
                      <div className="form-group d-flex justify-content-end gap-sm-3 gap-2">
                        <label htmlFor="users" className="form-label">
                          {t("subAdmin.powers.show")}
                        </label>
                        <input
                          type="checkbox"
                          className="prayer-time-input"
                          id="users"
                          name="users"
                          value={formik.values.users}
                          onChange={handleInput}
                        />
                      </div>
                    </Col>
                    {formik.values.users && (
                      <>
                        <Col xs={6} className="p-0 m-0">
                          <div className="form-group d-flex justify-content-end gap-sm-3 gap-2">
                            <label htmlFor="editUsers" className="form-label">
                              {t("subAdmin.powers.edit")}
                            </label>
                            <input
                              type="checkbox"
                              className="prayer-time-input"
                              id="editUsers"
                              name="editUsers"
                              value={formik.values.editUsers}
                              onChange={handleInput}
                            />
                          </div>
                        </Col>
                        <Col xs={6} className="p-0 m-0">
                          <div className="form-group d-flex justify-content-end gap-sm-3 gap-2">
                            <label htmlFor="deleteUsers" className="form-label">
                              {t("subAdmin.powers.delete")}
                            </label>
                            <input
                              type="checkbox"
                              className="prayer-time-input"
                              id="deleteUsers"
                              name="deleteUsers"
                              value={formik.values.deleteUsers}
                              onChange={handleInput}
                            />
                          </div>
                        </Col>
                      </>
                    )}
                  </Row>
                </Col>
                <hr className="d-sm-none d-block" />
                <hr className="d-none d-sm-block" />
                <Col
                  sm={6}
                  className="d-flex justify-content-center align-items-end flex-column"
                >
                  <label htmlFor="eldersTitle" className="form-label">
                    {t("subAdmin.powers.elders")}
                  </label>
                  <Row className="d-flex flex-row-reverse justify-content-start align-items-center p-3 pt-2">
                    <Col xs={formik.values.elders ? 6 : 12} className="p-0 m-0">
                      <div className="form-group d-flex justify-content-end gap-sm-3 gap-2">
                        <label htmlFor="elders" className="form-label">
                          {t("subAdmin.powers.show")}
                        </label>
                        <input
                          type="checkbox"
                          className="prayer-time-input"
                          id="elders"
                          name="elders"
                          value={formik.values.elders}
                          onChange={handleInput}
                        />
                      </div>
                    </Col>
                    {formik.values.elders && (
                      <>
                        <Col xs={6} className="p-0 m-0">
                          <div className="form-group d-flex justify-content-end gap-sm-3 gap-2">
                            <label htmlFor="addElders" className="form-label">
                              {t("subAdmin.powers.add")}
                            </label>
                            <input
                              type="checkbox"
                              className="prayer-time-input"
                              id="addElders"
                              name="addElders"
                              value={formik.values.addElders}
                              onChange={handleInput}
                            />
                          </div>
                        </Col>
                        <Col xs={6} className="p-0 m-0">
                          <div className="form-group d-flex justify-content-end gap-sm-3 gap-2">
                            <label htmlFor="editElders" className="form-label">
                              {t("subAdmin.powers.edit")}
                            </label>
                            <input
                              type="checkbox"
                              className="prayer-time-input"
                              id="editElders"
                              name="editElders"
                              value={formik.values.editElders}
                              onChange={handleInput}
                            />
                          </div>
                        </Col>
                        <Col xs={6} className="p-0 m-0">
                          <div className="form-group d-flex justify-content-end gap-sm-3 gap-2">
                            <label
                              htmlFor="deleteElders"
                              className="form-label"
                            >
                              {t("subAdmin.powers.delete")}
                            </label>
                            <input
                              type="checkbox"
                              className="prayer-time-input"
                              id="deleteElders"
                              name="deleteElders"
                              value={formik.values.deleteElders}
                              onChange={handleInput}
                            />
                          </div>
                        </Col>
                      </>
                    )}
                  </Row>
                </Col>
                <hr className="d-sm-none d-block" />
                <Col
                  sm={6}
                  className="d-flex justify-content-center align-items-end flex-column"
                >
                  <label htmlFor="AudiosTitle" className="form-label">
                    {t("subAdmin.powers.audios")}
                  </label>
                  <Row className="d-flex flex-row-reverse justify-content-start align-items-center p-3 pt-2">
                    <Col xs={formik.values.audios ? 6 : 12} className="p-0 m-0">
                      <div className="form-group d-flex justify-content-end gap-sm-3 gap-2">
                        <label htmlFor="audios" className="form-label">
                          {t("subAdmin.powers.show")}
                        </label>
                        <input
                          type="checkbox"
                          className="prayer-time-input"
                          id="Audios"
                          name="Audios"
                          value={formik.values.Audios}
                          onChange={handleInput}
                        />
                      </div>
                    </Col>
                    {formik.values.audios && (
                      <>
                        <Col xs={6} className="p-0 m-0">
                          <div className="form-group d-flex justify-content-end gap-sm-3 gap-2">
                            <label htmlFor="addAudios" className="form-label">
                              {t("subAdmin.powers.add")}
                            </label>
                            <input
                              type="checkbox"
                              className="prayer-time-input"
                              id="addAudios"
                              name="addAudios"
                              value={formik.values.addAudios}
                              onChange={handleInput}
                            />
                          </div>
                        </Col>
                        <Col xs={6} className="p-0 m-0">
                          <div className="form-group d-flex justify-content-end gap-sm-3 gap-2">
                            <label htmlFor="editAudios" className="form-label">
                              {t("subAdmin.powers.edit")}
                            </label>
                            <input
                              type="checkbox"
                              className="prayer-time-input"
                              id="editAudios"
                              name="editAudios"
                              value={formik.values.editAudios}
                              onChange={handleInput}
                            />
                          </div>
                        </Col>
                        <Col xs={6} className="p-0 m-0">
                          <div className="form-group d-flex justify-content-end gap-sm-3 gap-2">
                            <label
                              htmlFor="deleteAudios"
                              className="form-label"
                            >
                              {t("subAdmin.powers.delete")}
                            </label>
                            <input
                              type="checkbox"
                              className="prayer-time-input"
                              id="deleteAudios"
                              name="deleteAudios"
                              value={formik.values.deleteAudios}
                              onChange={handleInput}
                            />
                          </div>
                        </Col>
                      </>
                    )}
                  </Row>
                </Col>
                <hr className="d-sm-none d-block" />
                <hr className="d-none d-sm-block" />
                <Col
                  sm={6}
                  className="d-flex justify-content-center align-items-end flex-column"
                >
                  <label htmlFor="booksTitle" className="form-label">
                    {t("subAdmin.powers.books")}
                  </label>
                  <Row className="d-flex flex-row-reverse justify-content-start align-items-center p-3 pt-2">
                    <Col xs={formik.values.books ? 6 : 12} className="p-0 m-0">
                      <div className="form-group d-flex justify-content-end gap-sm-3 gap-2">
                        <label htmlFor="books" className="form-label">
                          {t("subAdmin.powers.show")}
                        </label>
                        <input
                          type="checkbox"
                          className="prayer-time-input"
                          id="books"
                          name="books"
                          value={formik.values.books}
                          onChange={handleInput}
                        />
                      </div>
                    </Col>
                    {formik.values.books && (
                      <>
                        <Col xs={6} className="p-0 m-0">
                          <div className="form-group d-flex justify-content-end gap-sm-3 gap-2">
                            <label htmlFor="addBooks" className="form-label">
                              {t("subAdmin.powers.add")}
                            </label>
                            <input
                              type="checkbox"
                              className="prayer-time-input"
                              id="addBooks"
                              name="addBooks"
                              value={formik.values.addBooks}
                              onChange={handleInput}
                            />
                          </div>
                        </Col>
                        <Col xs={6} className="p-0 m-0">
                          <div className="form-group d-flex justify-content-end gap-sm-3 gap-2">
                            <label htmlFor="editBooks" className="form-label">
                              {t("subAdmin.powers.edit")}
                            </label>
                            <input
                              type="checkbox"
                              className="prayer-time-input"
                              id="editBooks"
                              name="editBooks"
                              value={formik.values.editBooks}
                              onChange={handleInput}
                            />
                          </div>
                        </Col>
                        <Col xs={6} className="p-0 m-0">
                          <div className="form-group d-flex justify-content-end gap-sm-3 gap-2">
                            <label htmlFor="deleteBooks" className="form-label">
                              {t("subAdmin.powers.delete")}
                            </label>
                            <input
                              type="checkbox"
                              className="prayer-time-input"
                              id="deleteBooks"
                              name="deleteBooks"
                              value={formik.values.deleteBooks}
                              onChange={handleInput}
                            />
                          </div>
                        </Col>
                      </>
                    )}
                  </Row>
                </Col>
                <hr className="d-sm-none d-block" />
                <Col
                  sm={6}
                  className="d-flex justify-content-center align-items-end flex-column"
                >
                  <label htmlFor="imagesTitle" className="form-label">
                    {t("subAdmin.powers.images")}
                  </label>
                  <Row className="d-flex flex-row-reverse justify-content-start align-items-center p-3 pt-2">
                    <Col xs={formik.values.images ? 6 : 12} className="p-0 m-0">
                      <div className="form-group d-flex justify-content-end gap-sm-3 gap-2">
                        <label htmlFor="images" className="form-label">
                          {t("subAdmin.powers.show")}
                        </label>
                        <input
                          type="checkbox"
                          className="prayer-time-input"
                          id="images"
                          name="images"
                          value={formik.values.images}
                          onChange={handleInput}
                        />
                      </div>
                    </Col>
                    {formik.values.images && (
                      <>
                        <Col xs={6} className="p-0 m-0">
                          <div className="form-group d-flex justify-content-end gap-sm-3 gap-2">
                            <label htmlFor="addImages" className="form-label">
                              {t("subAdmin.powers.add")}
                            </label>
                            <input
                              type="checkbox"
                              className="prayer-time-input"
                              id="addImages"
                              name="addImages"
                              value={formik.values.addImages}
                              onChange={handleInput}
                            />
                          </div>
                        </Col>
                        <Col xs={6} className="p-0 m-0">
                          <div className="form-group d-flex justify-content-end gap-sm-3 gap-2">
                            <label htmlFor="editImages" className="form-label">
                              {t("subAdmin.powers.edit")}
                            </label>
                            <input
                              type="checkbox"
                              className="prayer-time-input"
                              id="editImages"
                              name="editImages"
                              value={formik.values.editImages}
                              onChange={handleInput}
                            />
                          </div>
                        </Col>
                        <Col xs={6} className="p-0 m-0">
                          <div className="form-group d-flex justify-content-end gap-sm-3 gap-2">
                            <label
                              htmlFor="deleteImages"
                              className="form-label"
                            >
                              {t("subAdmin.powers.delete")}
                            </label>
                            <input
                              type="checkbox"
                              className="prayer-time-input"
                              id="deleteImages"
                              name="deleteImages"
                              value={formik.values.deleteImages}
                              onChange={handleInput}
                            />
                          </div>
                        </Col>
                      </>
                    )}
                  </Row>
                </Col>
                <hr className="d-sm-none d-block" />
                <hr className="d-none d-sm-block" />
                <Col
                  sm={6}
                  className="d-flex justify-content-center align-items-end flex-column"
                >
                  <label htmlFor="articlesTitle" className="form-label">
                    {t("subAdmin.powers.articles")}
                  </label>
                  <Row className="d-flex flex-row-reverse justify-content-start align-items-center p-3 pt-2">
                    <Col
                      xs={formik.values.articles ? 6 : 12}
                      className="p-0 m-0"
                    >
                      <div className="form-group d-flex justify-content-end gap-sm-3 gap-2">
                        <label htmlFor="articles" className="form-label">
                          {t("subAdmin.powers.show")}
                        </label>
                        <input
                          type="checkbox"
                          className="prayer-time-input"
                          id="articles"
                          name="articles"
                          value={formik.values.articles}
                          onChange={handleInput}
                        />
                      </div>
                    </Col>
                    {formik.values.articles && (
                      <>
                        <Col xs={6} className="p-0 m-0">
                          <div className="form-group d-flex justify-content-end gap-sm-3 gap-2">
                            <label htmlFor="addArticles" className="form-label">
                              {t("subAdmin.powers.add")}
                            </label>
                            <input
                              type="checkbox"
                              className="prayer-time-input"
                              id="addArticles"
                              name="addArticles"
                              value={formik.values.addArticles}
                              onChange={handleInput}
                            />
                          </div>
                        </Col>
                        <Col xs={6} className="p-0 m-0">
                          <div className="form-group d-flex justify-content-end gap-sm-3 gap-2">
                            <label
                              htmlFor="editArticles"
                              className="form-label"
                            >
                              {t("subAdmin.powers.edit")}
                            </label>
                            <input
                              type="checkbox"
                              className="prayer-time-input"
                              id="editArticles"
                              name="editArticles"
                              value={formik.values.editArticles}
                              onChange={handleInput}
                            />
                          </div>
                        </Col>
                        <Col xs={6} className="p-0 m-0">
                          <div className="form-group d-flex justify-content-end gap-sm-3 gap-2">
                            <label
                              htmlFor="deleteArticles"
                              className="form-label"
                            >
                              {t("subAdmin.powers.delete")}
                            </label>
                            <input
                              type="checkbox"
                              className="prayer-time-input"
                              id="deleteArticles"
                              name="deleteArticles"
                              value={formik.values.deleteArticles}
                              onChange={handleInput}
                            />
                          </div>
                        </Col>
                      </>
                    )}
                  </Row>
                </Col>
                <hr className="d-sm-none d-block" />
                <Col
                  sm={6}
                  className="d-flex justify-content-center align-items-end flex-column"
                >
                  <label htmlFor="notificationsTitle" className="form-label">
                    {t("subAdmin.powers.notifications")}
                  </label>
                  <Row className="d-flex flex-row-reverse justify-content-start align-items-center p-3 pt-2">
                    <Col
                      xs={formik.values.notifications ? 6 : 12}
                      className="p-0 m-0"
                    >
                      <div className="form-group d-flex justify-content-end gap-sm-3 gap-2">
                        <label htmlFor="notifications" className="form-label">
                          {t("subAdmin.powers.show")}
                        </label>
                        <input
                          type="checkbox"
                          className="prayer-time-input"
                          id="notifications"
                          name="notifications"
                          value={formik.values.notifications}
                          onChange={handleInput}
                        />
                      </div>
                    </Col>
                    {formik.values.notifications && (
                      <>
                        <Col xs={6} className="p-0 m-0">
                          <div className="form-group d-flex justify-content-end gap-sm-3 gap-2">
                            <label
                              htmlFor="addNotifications"
                              className="form-label"
                            >
                              {t("subAdmin.powers.send")}
                            </label>
                            <input
                              type="checkbox"
                              className="prayer-time-input"
                              id="addNotifications"
                              name="addNotifications"
                              value={formik.values.addNotifications}
                              onChange={handleInput}
                            />
                          </div>
                        </Col>
                        <Col xs={6} className="p-0 m-0">
                          <div className="form-group d-flex justify-content-end gap-sm-3 gap-2">
                            <label
                              htmlFor="deleteNotifications"
                              className="form-label"
                            >
                              {t("subAdmin.powers.delete")}
                            </label>
                            <input
                              type="checkbox"
                              className="prayer-time-input"
                              id="deleteNotifications"
                              name="deleteNotifications"
                              value={formik.values.deleteNotifications}
                              onChange={handleInput}
                            />
                          </div>
                        </Col>
                      </>
                    )}
                  </Row>
                </Col>
                <hr className="d-sm-none d-block" />
                <hr className="d-none d-sm-block" />
                <Col
                  sm={6}
                  className="d-flex justify-content-center align-items-end flex-column"
                >
                  <label htmlFor="codeContentTitle" className="form-label">
                    {t("subAdmin.powers.codeContent")}
                  </label>
                  <Row className="d-flex flex-row-reverse justify-content-start align-items-center p-3 pt-2">
                    <Col
                      xs={formik.values.codeContent ? 6 : 12}
                      className="p-0 m-0"
                    >
                      <div className="form-group d-flex justify-content-end gap-sm-3 gap-2">
                        <label htmlFor="codeContent" className="form-label">
                          {t("subAdmin.powers.show")}
                        </label>
                        <input
                          type="checkbox"
                          className="prayer-time-input"
                          id="codeContent"
                          name="codeContent"
                          value={formik.values.codeContent}
                          onChange={handleInput}
                        />
                      </div>
                    </Col>
                    {formik.values.codeContent && (
                      <>
                        <Col xs={6} className="p-0 m-0">
                          <div className="form-group d-flex justify-content-end gap-sm-3 gap-2">
                            <label
                              htmlFor="addCodeContent"
                              className="form-label"
                            >
                              {t("subAdmin.powers.add")}
                            </label>
                            <input
                              type="checkbox"
                              className="prayer-time-input"
                              id="addCodeContent"
                              name="addCodeContent"
                              value={formik.values.addCodeContent}
                              onChange={handleInput}
                            />
                          </div>
                        </Col>
                        <Col xs={6} className="p-0 m-0">
                          <div className="form-group d-flex justify-content-end gap-sm-3 gap-2">
                            <label
                              htmlFor="editCodeContent"
                              className="form-label"
                            >
                              {t("subAdmin.powers.edit")}
                            </label>
                            <input
                              type="checkbox"
                              className="prayer-time-input"
                              id="editCodeContent"
                              name="editCodeContent"
                              value={formik.values.editCodeContent}
                              onChange={handleInput}
                            />
                          </div>
                        </Col>
                        <Col xs={6} className="p-0 m-0">
                          <div className="form-group d-flex justify-content-end gap-sm-3 gap-2">
                            <label
                              htmlFor="sendCodeContent"
                              className="form-label"
                            >
                              {t("subAdmin.powers.send")}
                            </label>
                            <input
                              type="checkbox"
                              className="prayer-time-input"
                              id="sendCodeContent"
                              name="sendCodeContent"
                              value={formik.values.sendCodeContent}
                              onChange={handleInput}
                            />
                          </div>
                        </Col>
                      </>
                    )}
                  </Row>
                </Col>
                <hr className="d-sm-none d-block" />
                <Col
                  sm={6}
                  className="d-flex justify-content-center align-items-end flex-column"
                >
                  <label
                    htmlFor="introductionPagesTitle"
                    className="form-label"
                  >
                    {t("subAdmin.powers.introductionPages")}
                  </label>
                  <Row className="d-flex flex-row-reverse justify-content-start align-items-center p-3 pt-2">
                    <Col
                      xs={formik.values.introductionPages ? 6 : 12}
                      className="p-0 m-0"
                    >
                      <div className="form-group d-flex justify-content-end gap-sm-3 gap-2">
                        <label
                          htmlFor="introductionPages"
                          className="form-label"
                        >
                          {t("subAdmin.powers.show")}
                        </label>
                        <input
                          type="checkbox"
                          className="prayer-time-input"
                          id="introductionPages"
                          name="introductionPages"
                          value={formik.values.introductionPages}
                          onChange={handleInput}
                        />
                      </div>
                    </Col>
                    {formik.values.introductionPages && (
                      <>
                        <Col xs={6} className="p-0 m-0">
                          <div className="form-group d-flex justify-content-end gap-sm-3 gap-2">
                            <label
                              htmlFor="addIntroductionPages"
                              className="form-label"
                            >
                              {t("subAdmin.powers.add")}
                            </label>
                            <input
                              type="checkbox"
                              className="prayer-time-input"
                              id="addIntroductionPages"
                              name="addIntroductionPages"
                              value={formik.values.addIntroductionPages}
                              onChange={handleInput}
                            />
                          </div>
                        </Col>
                        <Col xs={6} className="p-0 m-0">
                          <div className="form-group d-flex justify-content-end gap-sm-3 gap-2">
                            <label
                              htmlFor="editIntroductionPages"
                              className="form-label"
                            >
                              {t("subAdmin.powers.edit")}
                            </label>
                            <input
                              type="checkbox"
                              className="prayer-time-input"
                              id="editIntroductionPages"
                              name="editIntroductionPages"
                              value={formik.values.editIntroductionPages}
                              onChange={handleInput}
                            />
                          </div>
                        </Col>
                        <Col xs={6} className="p-0 m-0">
                          <div className="form-group d-flex justify-content-end gap-sm-3 gap-2">
                            <label
                              htmlFor="deleteIntroductionPages"
                              className="form-label"
                            >
                              {t("subAdmin.powers.delete")}
                            </label>
                            <input
                              type="checkbox"
                              className="prayer-time-input"
                              id="deleteIntroductionPages"
                              name="deleteIntroductionPages"
                              value={formik.values.deleteIntroductionPages}
                              onChange={handleInput}
                            />
                          </div>
                        </Col>
                      </>
                    )}
                  </Row>
                </Col>
                <hr className="d-sm-none d-block" />
                <hr className="d-none d-sm-block" />
                <Col
                  sm={6}
                  className="d-flex justify-content-center align-items-end flex-column"
                >
                  <label
                    htmlFor="termsAndConditionsTitle"
                    className="form-label"
                  >
                    {t("subAdmin.powers.termsAndConditions")}
                  </label>
                  <Row className="d-flex flex-row-reverse justify-content-start align-items-center p-3 pt-2">
                    <Col
                      xs={formik.values.termsAndConditions ? 6 : 12}
                      className="p-0 m-0"
                    >
                      <div className="form-group d-flex justify-content-end gap-sm-3 gap-2">
                        <label
                          htmlFor="termsAndConditions"
                          className="form-label"
                        >
                          {t("subAdmin.powers.show")}
                        </label>
                        <input
                          type="checkbox"
                          className="prayer-time-input"
                          id="termsAndConditions"
                          name="termsAndConditions"
                          value={formik.values.termsAndConditions}
                          onChange={handleInput}
                        />
                      </div>
                    </Col>
                    {formik.values.termsAndConditions && (
                      <>
                        <Col xs={6} className="p-0 m-0">
                          <div className="form-group d-flex justify-content-end gap-sm-3 gap-2">
                            <label
                              htmlFor="addTermsAndConditions"
                              className="form-label"
                            >
                              {t("subAdmin.powers.add")}
                            </label>
                            <input
                              type="checkbox"
                              className="prayer-time-input"
                              id="addTermsAndConditions"
                              name="addTermsAndConditions"
                              value={formik.values.addTermsAndConditions}
                              onChange={handleInput}
                            />
                          </div>
                        </Col>
                        <Col xs={6} className="p-0 m-0">
                          <div className="form-group d-flex justify-content-end gap-sm-3 gap-2">
                            <label
                              htmlFor="editTermsAndConditions"
                              className="form-label"
                            >
                              {t("subAdmin.powers.edit")}
                            </label>
                            <input
                              type="checkbox"
                              className="prayer-time-input"
                              id="editTermsAndConditions"
                              name="editTermsAndConditions"
                              value={formik.values.editTermsAndConditions}
                              onChange={handleInput}
                            />
                          </div>
                        </Col>
                        <Col xs={6} className="p-0 m-0">
                          <div className="form-group d-flex justify-content-end gap-sm-3 gap-2">
                            <label
                              htmlFor="deleteTermsAndConditions"
                              className="form-label"
                            >
                              {t("subAdmin.powers.delete")}
                            </label>
                            <input
                              type="checkbox"
                              className="prayer-time-input"
                              id="deleteTermsAndConditions"
                              name="deleteTermsAndConditions"
                              value={formik.values.deleteTermsAndConditions}
                              onChange={handleInput}
                            />
                          </div>
                        </Col>
                      </>
                    )}
                  </Row>
                </Col>
                <hr className="d-sm-none d-block" />
                <Col
                  sm={6}
                  className="d-flex justify-content-center align-items-end flex-column"
                >
                  <label
                    htmlFor="mainCategoriesBooksTitle"
                    className="form-label"
                  >
                    {t("subAdmin.powers.mainCategoriesBooks")}
                  </label>
                  <Row className="d-flex flex-row-reverse justify-content-start align-items-center p-3 pt-2">
                    <Col
                      xs={formik.values.mainCategoriesBooks ? 6 : 12}
                      className="p-0 m-0"
                    >
                      <div className="form-group d-flex justify-content-end gap-sm-3 gap-2">
                        <label
                          htmlFor="mainCategoriesBooks"
                          className="form-label"
                        >
                          {t("subAdmin.powers.show")}
                        </label>
                        <input
                          type="checkbox"
                          className="prayer-time-input"
                          id="mainCategoriesBooks"
                          name="mainCategoriesBooks"
                          value={formik.values.mainCategoriesBooks}
                          onChange={handleInput}
                        />
                      </div>
                    </Col>
                    {formik.values.mainCategoriesBooks && (
                      <>
                        <Col xs={6} className="p-0 m-0">
                          <div className="form-group d-flex justify-content-end gap-sm-3 gap-2">
                            <label
                              htmlFor="addMainCategoriesBooks"
                              className="form-label"
                            >
                              {t("subAdmin.powers.add")}
                            </label>
                            <input
                              type="checkbox"
                              className="prayer-time-input"
                              id="addMainCategoriesBooks"
                              name="addMainCategoriesBooks"
                              value={formik.values.addMainCategoriesBooks}
                              onChange={handleInput}
                            />
                          </div>
                        </Col>
                        <Col xs={6} className="p-0 m-0">
                          <div className="form-group d-flex justify-content-end gap-sm-3 gap-2">
                            <label
                              htmlFor="editMainCategoriesBooks"
                              className="form-label"
                            >
                              {t("subAdmin.powers.edit")}
                            </label>
                            <input
                              type="checkbox"
                              className="prayer-time-input"
                              id="editMainCategoriesBooks"
                              name="editMainCategoriesBooks"
                              value={formik.values.editMainCategoriesBooks}
                              onChange={handleInput}
                            />
                          </div>
                        </Col>
                        <Col xs={6} className="p-0 m-0">
                          <div className="form-group d-flex justify-content-end gap-sm-3 gap-2">
                            <label
                              htmlFor="deleteMainCategoriesBooks"
                              className="form-label"
                            >
                              {t("subAdmin.powers.delete")}
                            </label>
                            <input
                              type="checkbox"
                              className="prayer-time-input"
                              id="deleteMainCategoriesBooks"
                              name="deleteMainCategoriesBooks"
                              value={formik.values.deleteMainCategoriesBooks}
                              onChange={handleInput}
                            />
                          </div>
                        </Col>
                      </>
                    )}
                  </Row>
                </Col>
                <hr className="d-sm-none d-block" />
                <hr className="d-none d-sm-block" />
                <Col
                  sm={6}
                  className="d-flex justify-content-center align-items-end flex-column"
                >
                  <label
                    htmlFor="subCategoriesBooksTitle"
                    className="form-label"
                  >
                    {t("subAdmin.powers.subCategoriesBooks")}
                  </label>
                  <Row className="d-flex flex-row-reverse justify-content-start align-items-center p-3 pt-2">
                    <Col
                      xs={formik.values.subCategoriesBooks ? 6 : 12}
                      className="p-0 m-0"
                    >
                      <div className="form-group d-flex justify-content-end gap-sm-3 gap-2">
                        <label
                          htmlFor="subCategoriesBooks"
                          className="form-label"
                        >
                          {t("subAdmin.powers.show")}
                        </label>
                        <input
                          type="checkbox"
                          className="prayer-time-input"
                          id="subCategoriesBooks"
                          name="subCategoriesBooks"
                          value={formik.values.subCategoriesBooks}
                          onChange={handleInput}
                        />
                      </div>
                    </Col>
                    {formik.values.subCategoriesBooks && (
                      <>
                        <Col xs={6} className="p-0 m-0">
                          <div className="form-group d-flex justify-content-end gap-sm-3 gap-2">
                            <label
                              htmlFor="addSubCategoriesBooks"
                              className="form-label"
                            >
                              {t("subAdmin.powers.add")}
                            </label>
                            <input
                              type="checkbox"
                              className="prayer-time-input"
                              id="addSubCategoriesBooks"
                              name="addSubCategoriesBooks"
                              value={formik.values.addSubCategoriesBooks}
                              onChange={handleInput}
                            />
                          </div>
                        </Col>
                        <Col xs={6} className="p-0 m-0">
                          <div className="form-group d-flex justify-content-end gap-sm-3 gap-2">
                            <label
                              htmlFor="editSubCategoriesBooks"
                              className="form-label"
                            >
                              {t("subAdmin.powers.edit")}
                            </label>
                            <input
                              type="checkbox"
                              className="prayer-time-input"
                              id="editSubCategoriesBooks"
                              name="editSubCategoriesBooks"
                              value={formik.values.editSubCategoriesBooks}
                              onChange={handleInput}
                            />
                          </div>
                        </Col>
                        <Col xs={6} className="p-0 m-0">
                          <div className="form-group d-flex justify-content-end gap-sm-3 gap-2">
                            <label
                              htmlFor="deleteSubCategoriesBooks"
                              className="form-label"
                            >
                              {t("subAdmin.powers.delete")}
                            </label>
                            <input
                              type="checkbox"
                              className="prayer-time-input"
                              id="deleteSubCategoriesBooks"
                              name="deleteSubCategoriesBooks"
                              value={formik.values.deleteSubCategoriesBooks}
                              onChange={handleInput}
                            />
                          </div>
                        </Col>
                      </>
                    )}
                  </Row>
                </Col>
                <hr className="d-sm-none d-block" />
                <Col
                  sm={6}
                  className="d-flex justify-content-center align-items-end flex-column"
                >
                  <label
                    htmlFor="subSubCategoriesBooksTitle"
                    className="form-label"
                  >
                    {t("subAdmin.powers.subSubCategoriesBooks")}
                  </label>
                  <Row className="d-flex flex-row-reverse justify-content-start align-items-center p-3 pt-2">
                    <Col
                      xs={formik.values.subSubCategoriesBooks ? 6 : 12}
                      className="p-0 m-0"
                    >
                      <div className="form-group d-flex justify-content-end gap-sm-3 gap-2">
                        <label
                          htmlFor="subSubCategoriesBooks"
                          className="form-label"
                        >
                          {t("subAdmin.powers.show")}
                        </label>
                        <input
                          type="checkbox"
                          className="prayer-time-input"
                          id="subSubCategoriesBooks"
                          name="subSubCategoriesBooks"
                          value={formik.values.subSubCategoriesBooks}
                          onChange={handleInput}
                        />
                      </div>
                    </Col>
                    {formik.values.subSubCategoriesBooks && (
                      <>
                        <Col xs={6} className="p-0 m-0">
                          <div className="form-group d-flex justify-content-end gap-sm-3 gap-2">
                            <label
                              htmlFor="addSubSubCategoriesBooks"
                              className="form-label"
                            >
                              {t("subAdmin.powers.add")}
                            </label>
                            <input
                              type="checkbox"
                              className="prayer-time-input"
                              id="addSubSubCategoriesBooks"
                              name="addSubSubCategoriesBooks"
                              value={formik.values.addSubSubCategoriesBooks}
                              onChange={handleInput}
                            />
                          </div>
                        </Col>
                        <Col xs={6} className="p-0 m-0">
                          <div className="form-group d-flex justify-content-end gap-sm-3 gap-2">
                            <label
                              htmlFor="editSubSubCategoriesBooks"
                              className="form-label"
                            >
                              {t("subAdmin.powers.edit")}
                            </label>
                            <input
                              type="checkbox"
                              className="prayer-time-input"
                              id="editSubSubCategoriesBooks"
                              name="editSubSubCategoriesBooks"
                              value={formik.values.editSubSubCategoriesBooks}
                              onChange={handleInput}
                            />
                          </div>
                        </Col>
                        <Col xs={6} className="p-0 m-0">
                          <div className="form-group d-flex justify-content-end gap-sm-3 gap-2">
                            <label
                              htmlFor="deleteSubSubCategoriesBooks"
                              className="form-label"
                            >
                              {t("subAdmin.powers.delete")}
                            </label>
                            <input
                              type="checkbox"
                              className="prayer-time-input"
                              id="deleteSubSubCategoriesBooks"
                              name="deleteSubSubCategoriesBooks"
                              value={formik.values.deleteSubSubCategoriesBooks}
                              onChange={handleInput}
                            />
                          </div>
                        </Col>
                      </>
                    )}
                  </Row>
                </Col>
                <hr className="d-sm-none d-block" />
                <hr className="d-none d-sm-block" />
                <Col
                  sm={6}
                  className="d-flex justify-content-center align-items-end flex-column"
                >
                  <label htmlFor="categoriesAudioTitle" className="form-label">
                    {t("subAdmin.powers.categoriesAudio")}
                  </label>
                  <Row className="d-flex flex-row-reverse justify-content-start align-items-center p-3 pt-2">
                    <Col
                      xs={formik.values.categoriesAudio ? 6 : 12}
                      className="p-0 m-0"
                    >
                      <div className="form-group d-flex justify-content-end gap-sm-3 gap-2">
                        <label htmlFor="categoriesAudio" className="form-label">
                          {t("subAdmin.powers.show")}
                        </label>
                        <input
                          type="checkbox"
                          className="prayer-time-input"
                          id="categoriesAudio"
                          name="categoriesAudio"
                          value={formik.values.categoriesAudio}
                          onChange={handleInput}
                        />
                      </div>
                    </Col>
                    {formik.values.categoriesAudio && (
                      <>
                        <Col xs={6} className="p-0 m-0">
                          <div className="form-group d-flex justify-content-end gap-sm-3 gap-2">
                            <label
                              htmlFor="addCategoriesAudio"
                              className="form-label"
                            >
                              {t("subAdmin.powers.add")}
                            </label>
                            <input
                              type="checkbox"
                              className="prayer-time-input"
                              id="addCategoriesAudio"
                              name="addCategoriesAudio"
                              value={formik.values.addCategoriesAudio}
                              onChange={handleInput}
                            />
                          </div>
                        </Col>
                        <Col xs={6} className="p-0 m-0">
                          <div className="form-group d-flex justify-content-end gap-sm-3 gap-2">
                            <label
                              htmlFor="editCategoriesAudio"
                              className="form-label"
                            >
                              {t("subAdmin.powers.edit")}
                            </label>
                            <input
                              type="checkbox"
                              className="prayer-time-input"
                              id="editCategoriesAudio"
                              name="editCategoriesAudio"
                              value={formik.values.editCategoriesAudio}
                              onChange={handleInput}
                            />
                          </div>
                        </Col>
                        <Col xs={6} className="p-0 m-0">
                          <div className="form-group d-flex justify-content-end gap-sm-3 gap-2">
                            <label
                              htmlFor="deleteCategoriesAudio"
                              className="form-label"
                            >
                              {t("subAdmin.powers.delete")}
                            </label>
                            <input
                              type="checkbox"
                              className="prayer-time-input"
                              id="deleteCategoriesAudio"
                              name="deleteCategoriesAudio"
                              value={formik.values.deleteCategoriesAudio}
                              onChange={handleInput}
                            />
                          </div>
                        </Col>
                      </>
                    )}
                  </Row>
                </Col>
                <hr className="d-sm-none d-block" />
                <Col
                  sm={6}
                  className="d-flex justify-content-center align-items-end flex-column"
                >
                  <label htmlFor="categoriesImageTitle" className="form-label">
                    {t("subAdmin.powers.categoriesImage")}
                  </label>
                  <Row className="d-flex flex-row-reverse justify-content-start align-items-center p-3 pt-2">
                    <Col
                      xs={formik.values.categoriesImage ? 6 : 12}
                      className="p-0 m-0"
                    >
                      <div className="form-group d-flex justify-content-end gap-sm-3 gap-2">
                        <label htmlFor="categoriesImage" className="form-label">
                          {t("subAdmin.powers.show")}
                        </label>
                        <input
                          type="checkbox"
                          className="prayer-time-input"
                          id="categoriesImage"
                          name="categoriesImage"
                          value={formik.values.categoriesImage}
                          onChange={handleInput}
                        />
                      </div>
                    </Col>
                    {formik.values.categoriesImage && (
                      <>
                        <Col xs={6} className="p-0 m-0">
                          <div className="form-group d-flex justify-content-end gap-sm-3 gap-2">
                            <label
                              htmlFor="addCategoriesImage"
                              className="form-label"
                            >
                              {t("subAdmin.powers.add")}
                            </label>
                            <input
                              type="checkbox"
                              className="prayer-time-input"
                              id="addCategoriesImage"
                              name="addCategoriesImage"
                              value={formik.values.addCategoriesImage}
                              onChange={handleInput}
                            />
                          </div>
                        </Col>
                        <Col xs={6} className="p-0 m-0">
                          <div className="form-group d-flex justify-content-end gap-sm-3 gap-2">
                            <label
                              htmlFor="editCategoriesImage"
                              className="form-label"
                            >
                              {t("subAdmin.powers.edit")}
                            </label>
                            <input
                              type="checkbox"
                              className="prayer-time-input"
                              id="editCategoriesImage"
                              name="editCategoriesImage"
                              value={formik.values.editCategoriesImage}
                              onChange={handleInput}
                            />
                          </div>
                        </Col>
                        <Col xs={6} className="p-0 m-0">
                          <div className="form-group d-flex justify-content-end gap-sm-3 gap-2">
                            <label
                              htmlFor="deleteCategoriesImage"
                              className="form-label"
                            >
                              {t("subAdmin.powers.delete")}
                            </label>
                            <input
                              type="checkbox"
                              className="prayer-time-input"
                              id="deleteCategoriesImage"
                              name="deleteCategoriesImage"
                              value={formik.values.deleteCategoriesImage}
                              onChange={handleInput}
                            />
                          </div>
                        </Col>
                      </>
                    )}
                  </Row>
                </Col>
                <hr className="d-sm-none d-block" />
                <hr className="d-none d-sm-block" />
                <Col
                  sm={6}
                  className="d-flex justify-content-center align-items-end flex-column"
                >
                  <label
                    htmlFor="categoriesArticleTitle"
                    className="form-label"
                  >
                    {t("subAdmin.powers.categoriesArticle")}
                  </label>
                  <Row className="d-flex flex-row-reverse justify-content-start align-items-center p-3 pt-2">
                    <Col
                      xs={formik.values.categoriesArticle ? 6 : 12}
                      className="p-0 m-0"
                    >
                      <div className="form-group d-flex justify-content-end gap-sm-3 gap-2">
                        <label
                          htmlFor="categoriesArticle"
                          className="form-label"
                        >
                          {t("subAdmin.powers.show")}
                        </label>
                        <input
                          type="checkbox"
                          className="prayer-time-input"
                          id="categoriesArticle"
                          name="categoriesArticle"
                          value={formik.values.categoriesArticle}
                          onChange={handleInput}
                        />
                      </div>
                    </Col>
                    {formik.values.categoriesArticle && (
                      <>
                        <Col xs={6} className="p-0 m-0">
                          <div className="form-group d-flex justify-content-end gap-sm-3 gap-2">
                            <label
                              htmlFor="addCategoriesArticle"
                              className="form-label"
                            >
                              {t("subAdmin.powers.add")}
                            </label>
                            <input
                              type="checkbox"
                              className="prayer-time-input"
                              id="addCategoriesArticle"
                              name="addCategoriesArticle"
                              value={formik.values.addCategoriesArticle}
                              onChange={handleInput}
                            />
                          </div>
                        </Col>
                        <Col xs={6} className="p-0 m-0">
                          <div className="form-group d-flex justify-content-end gap-sm-3 gap-2">
                            <label
                              htmlFor="editCategoriesArticle"
                              className="form-label"
                            >
                              {t("subAdmin.powers.edit")}
                            </label>
                            <input
                              type="checkbox"
                              className="prayer-time-input"
                              id="editCategoriesArticle"
                              name="editCategoriesArticle"
                              value={formik.values.editCategoriesArticle}
                              onChange={handleInput}
                            />
                          </div>
                        </Col>
                        <Col xs={6} className="p-0 m-0">
                          <div className="form-group d-flex justify-content-end gap-sm-3 gap-2">
                            <label
                              htmlFor="deleteCategoriesArticle"
                              className="form-label"
                            >
                              {t("subAdmin.powers.delete")}
                            </label>
                            <input
                              type="checkbox"
                              className="prayer-time-input"
                              id="deleteCategoriesArticle"
                              name="deleteCategoriesArticle"
                              value={formik.values.deleteCategoriesArticle}
                              onChange={handleInput}
                            />
                          </div>
                        </Col>
                      </>
                    )}
                  </Row>
                </Col>
              </Row>
            )} */}
            {!toggle.read && (
              <Row className="d-flex justify-content-center align-items-center p-3 pt-0">
                <div className="form-group-container password d-flex flex-column align-items-end mb-3">
                  <label htmlFor="password" className="form-label">
                    {t("auth.login.password")}
                  </label>
                  <input
                    type={`${toggle.showHidePassword ? "text" : "password"}`}
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
              </Row>
            )}
            <Row className="d-flex justify-content-center align-items-center p-3 pt-0">
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
