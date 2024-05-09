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
  getPermissions,
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
  subAdmins: "",
  addSubAdmins: "",
  editSubAdmins: "",
  deleteSubAdmins: "",
  users: "",
  editUser: "",
  deleteUser: "",
  elders: "",
  addElders: "",
  editElders: "",
  deleteElders: "",
  audios: "",
  addAudios: "",
  editAudios: "",
  deleteAudios: "",
  articles: "",
  addArticles: "",
  editArticles: "",
  deleteArticles: "",
  books: "",
  addBooks: "",
  editBooks: "",
  deleteBooks: "",
  images: "",
  addImages: "",
  editImages: "",
  deleteImages: "",
  notifications: "",
  addNotifications: "",
  deleteNotifications: "",
  messages: "",
  settings: "",
  editSettings: "",
  codeContent: "",
  addCodeContent: "",
  editCodeContent: "",
  sendCodeContent: "",
  introductionPages: "",
  addIntroductionPages: "",
  editIntroductionPages: "",
  deleteIntroductionPages: "",
  termsAndConditions: "",
  addTermsAndConditions: "",
  editTermsAndConditions: "",
  deleteTermsAndConditions: "",
  mainCategoriesBooks: "",
  addMainCategoriesBooks: "",
  editMainCategoriesBooks: "",
  deleteMainCategoriesBooks: "",
  subCategoriesBooks: "",
  addSubCategoriesBooks: "",
  editSubCategoriesBooks: "",
  deleteSubCategoriesBooks: "",
  subSubCategoriesBooks: "",
  addSubSubCategoriesBooks: "",
  editSubSubCategoriesBooks: "",
  deleteSubSubCategoriesBooks: "",
  categoriesAudio: "",
  addCategoriesAudio: "",
  editCategoriesAudio: "",
  deleteCategoriesAudio: "",
  categoriesImage: "",
  addCategoriesImage: "",
  editCategoriesImage: "",
  deleteCategoriesImage: "",
  categoriesArticle: "",
  addCategoriesArticle: "",
  editCategoriesArticle: "",
  deleteCategoriesArticle: "",
};

const SubAdmins = () => {
  const { t } = useTranslation();
  const role = Cookies.get("_role");
  const getSubAdminsCookies = Cookies.get("GetAdmin");
  const addSubAdminsCookies = Cookies.get("addAdmin");
  const editSubAdminsCookies = Cookies.get("editAdmin");
  const deleteSubAdminsCookies = Cookies.get("deleteAdmin");
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

  // Data
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
      if (
        role === "admin" ||
        (addSubAdminsCookies === "1" && getSubAdminsCookies === "1") ||
        (editSubAdminsCookies === "1" && getSubAdminsCookies === "1")
      ) {
        const formData = {
          name: values.name,
          email: values.email,
          phone: values.phone,
          active: values.status === "active" ? 1 : 0,
          password: values.password,
          powers: values.powers,
        };
        if (values.powers === "supAdmin") {
          formData.permissions = [
            values.addSubAdmins === true && 15,
            values.editSubAdmins === true && 16,
            values.deleteSubAdmins === true && 17,
            values.subAdmins === true && 18,
            values.editUser === true && 1,
            values.deleteUser === true && 2,
            values.users === true && 2,
            values.addElders === true && 11,
            values.editElders === true && 12,
            values.deleteElders === true && 13,
            values.elders === true && 14,
            values.addAudios === true && 4,
            values.editAudios === true && 5,
            values.deleteAudios === true && 6,
            values.audios === true && 7,
            values.articles === true && 31,
            values.addArticles === true && 32,
            values.editArticles === true && 33,
            values.deleteArticles === true && 34,
            values.books === true && 51,
            values.addBooks === true && 52,
            values.editBooks === true && 53,
            values.deleteBooks === true && 54,
            values.images === true && 23,
            values.addImages === true && 24,
            values.editImages === true && 25,
            values.deleteImages === true && 26,
            values.notifications === true && 67,
            values.addNotifications === true && 68,
            // values.editNotifications === true && 69,
            values.deleteNotifications === true && 70,
            values.messages === true && 35,
            // values.addMessages === true && 36,
            // values.editMessages === true && 37,
            // values.deleteMessages === true && 38,
            values.settings === true && 59,
            // values.addSettings === true && 60,
            values.editSettings === true && 61,
            values.deleteSettings === true && 62,
            values.codeContent === true && 10,
            values.addCodeContent === true && 8,
            values.editCodeContent === true && 9,
            // values.sendCodeContent === true && 0,
            values.introductionPages === true && 63,
            values.addIntroductionPages === true && 64,
            values.editIntroductionPages === true && 65,
            values.deleteIntroductionPages === true && 66,
            values.termsAndConditions === true && 55,
            values.addTermsAndConditions === true && 56,
            values.editTermsAndConditions === true && 57,
            values.deleteTermsAndConditions === true && 58,
            values.mainCategoriesBooks === true && 39,
            values.addMainCategoriesBooks === true && 40,
            values.editMainCategoriesBooks === true && 41,
            values.deleteMainCategoriesBooks === true && 42,
            values.subCategoriesBooks === true && 47,
            values.addSubCategoriesBooks === true && 48,
            values.editSubCategoriesBooks === true && 49,
            values.deleteSubCategoriesBooks === true && 50,
            values.subSubCategoriesBooks === true && 43,
            values.addSubSubCategoriesBooks === true && 44,
            values.editSubSubCategoriesBooks === true && 45,
            values.deleteSubSubCategoriesBooks === true && 46,
            values.categoriesAudio === true && 71,
            values.addCategoriesAudio === true && 72,
            values.editCategoriesAudio === true && 73,
            values.deleteCategoriesAudio === true && 74,
            values.categoriesImage === true && 19,
            values.addCategoriesImage === true && 20,
            values.editCategoriesImage === true && 21,
            values.deleteCategoriesImage === true && 22,
            values.categoriesArticle === true && 27,
            values.addCategoriesArticle === true && 28,
            values.editCategoriesArticle === true && 29,
            values.deleteCategoriesArticle === true && 30,
          ];
          formData.permissions = formData.permissions.filter((permission) => {
            return permission !== false;
          });
        }
        if (values.image.file !== "") {
          formData.image = values.image.file;
        }
        if (values.id) {
          formData.id = values.id;
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
    if (role === "admin" || deleteSubAdminsCookies === "1") {
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
      image: {
        file: "",
        preview: subAdmin?.image,
      },
    });
    subAdmin?.permissions?.map(({ id }) => {
      if (id === 15) {
        formik.setFieldValue("addSubAdmins", true);
      }
      if (id === 16) {
        formik.setFieldValue("editSubAdmins", true);
      }
      if (id === 17) {
        formik.setFieldValue("deleteSubAdmins", true);
      }
      if (id === 18) {
        formik.setFieldValue("subAdmins", true);
      }
      if (id === 1) {
        formik.setFieldValue("editUser", true);
      }
      if (id === 2) {
        formik.setFieldValue("deleteUser", true);
      }
      if (id === 11) {
        formik.setFieldValue("addElders", true);
      }
      if (id === 12) {
        formik.setFieldValue("editElders", true);
      }
      if (id === 13) {
        formik.setFieldValue("deleteElders", true);
      }
      if (id === 14) {
        formik.setFieldValue("elders", true);
      }
      if (id === 4) {
        formik.setFieldValue("addAudios", true);
      }
      if (id === 5) {
        formik.setFieldValue("editAudios", true);
      }
      if (id === 6) {
        formik.setFieldValue("deleteAudios", true);
      }
      if (id === 7) {
        formik.setFieldValue("audios", true);
      }
      if (id === 31) {
        formik.setFieldValue("articles", true);
      }
      if (id === 32) {
        formik.setFieldValue("addArticles", true);
      }
      if (id === 33) {
        formik.setFieldValue("editArticles", true);
      }
      if (id === 34) {
        formik.setFieldValue("deleteArticles", true);
      }
      if (id === 51) {
        formik.setFieldValue("books", true);
      }
      if (id === 52) {
        formik.setFieldValue("addBooks", true);
      }
      if (id === 53) {
        formik.setFieldValue("editBooks", true);
      }
      if (id === 54) {
        formik.setFieldValue("deleteBooks", true);
      }
      if (id === 23) {
        formik.setFieldValue("images", true);
      }
      if (id === 24) {
        formik.setFieldValue("addImages", true);
      }
      if (id === 25) {
        formik.setFieldValue("editImages", true);
      }
      if (id === 26) {
        formik.setFieldValue("deleteImages", true);
      }
      if (id === 67) {
        formik.setFieldValue("notifications", true);
      }
      if (id === 68) {
        formik.setFieldValue("addNotifications", true);
      }
      if (id === 70) {
        formik.setFieldValue("deleteNotifications", true);
      }
      if (id === 35) {
        formik.setFieldValue("messages", true);
      }
      if (id === 59) {
        formik.setFieldValue("settings", true);
      }
      if (id === 61) {
        formik.setFieldValue("editSettings", true);
      }
      if (id === 10) {
        formik.setFieldValue("codeContent", true);
      }
      if (id === 8) {
        formik.setFieldValue("addCodeContent", true);
      }
      if (id === 9) {
        formik.setFieldValue("editCodeContent", true);
      }
      if (id === 63) {
        formik.setFieldValue("introductionPages", true);
      }
      if (id === 64) {
        formik.setFieldValue("addIntroductionPages", true);
      }
      if (id === 65) {
        formik.setFieldValue("editIntroductionPages", true);
      }
      if (id === 66) {
        formik.setFieldValue("deleteIntroductionPages", true);
      }
      if (id === 55) {
        formik.setFieldValue("termsAndConditions", true);
      }
      if (id === 56) {
        formik.setFieldValue("addTermsAndConditions", true);
      }
      if (id === 57) {
        formik.setFieldValue("editTermsAndConditions", true);
      }
      if (id === 58) {
        formik.setFieldValue("deleteTermsAndConditions", true);
      }
      if (id === 39) {
        formik.setFieldValue("mainCategoriesBooks", true);
      }
      if (id === 40) {
        formik.setFieldValue("addMainCategoriesBooks", true);
      }
      if (id === 41) {
        formik.setFieldValue("editMainCategoriesBooks", true);
      }
      if (id === 42) {
        formik.setFieldValue("deleteMainCategoriesBooks", true);
      }
      if (id === 47) {
        formik.setFieldValue("subCategoriesBooks", true);
      }
      if (id === 48) {
        formik.setFieldValue("addSubCategoriesBooks", true);
      }
      if (id === 49) {
        formik.setFieldValue("editSubCategoriesBooks", true);
      }
      if (id === 50) {
        formik.setFieldValue("deleteSubCategoriesBooks", true);
      }
      if (id === 43) {
        formik.setFieldValue("subSubCategoriesBooks", true);
      }
      if (id === 44) {
        formik.setFieldValue("addSubSubCategoriesBooks", true);
      }
      if (id === 45) {
        formik.setFieldValue("editSubSubCategoriesBooks", true);
      }
      if (id === 46) {
        formik.setFieldValue("deleteSubSubCategoriesBooks", true);
      }
      if (id === 71) {
        formik.setFieldValue("categoriesAudio", true);
      }
      if (id === 72) {
        formik.setFieldValue("addCategoriesAudio", true);
      }
      if (id === 73) {
        formik.setFieldValue("editCategoriesAudio", true);
      }
      if (id === 74) {
        formik.setFieldValue("deleteCategoriesAudio", true);
      }
      if (id === 19) {
        formik.setFieldValue("categoriesImage", true);
      }
      if (id === 20) {
        formik.setFieldValue("addCategoriesImage", true);
      }
      if (id === 21) {
        formik.setFieldValue("editCategoriesImage", true);
      }
      if (id === 22) {
        formik.setFieldValue("deleteCategoriesImage", true);
      }
      if (id === 27) {
        formik.setFieldValue("categoriesArticle", true);
      }
      if (id === 28) {
        formik.setFieldValue("addCategoriesArticle", true);
      }
      if (id === 29) {
        formik.setFieldValue("editCategoriesArticle", true);
      }
      if (id === 30) {
        formik.setFieldValue("deleteCategoriesArticle", true);
      }
      return null;
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
      if (role === "admin" || getSubAdminsCookies === "1") {
        dispatch(getSubAdmins());
        dispatch(getPermissions());
      }
      if (getSubAdminsCookies === "0") {
        Cookies.set("addAdmin", 0, {
          expires: 30,
          secure: true,
          sameSite: "strict",
          path: "/",
        });
        Cookies.set("editAdmin", 0, {
          expires: 30,
          secure: true,
          sameSite: "strict",
          path: "/",
        });
        Cookies.set("deleteAdmin", 0, {
          expires: 30,
          secure: true,
          sameSite: "strict",
          path: "/",
        });
      }
    } catch (error) {
      console.log(error);
    }
  }, [dispatch, role, getSubAdminsCookies]);


  useEffect(() => {
    if (formik.values.powers === "admin") {
      formik.setValues({
        ...formik.values,
        subAdmins: false,
        notifications: false,
        messages: false,
        settings: false,
        codeContent: false,
        introductionPages: false,
        termsAndConditions: false,
        mainCategoriesBooks: false,
        subCategoriesBooks: false,
        subSubCategoriesBooks: false,
        categoriesAudio: false,
        categoriesImage: false,
        categoriesArticle: false,
        users: false,
        elders: false,
        audios: false,
        articles: false,
        books: false,
        images: false,
      });
    }
    if (formik.values.settings === false) {
      formik.setFieldValue("editSettings", false);
    }
    if (formik.values.notifications === false) {
      formik.setFieldValue("addNotifications", false);
      formik.setFieldValue("deleteNotifications", false);
    }
    if (formik.values.introductionPages === false) {
      formik.setFieldValue("addIntroductionPages", false);
      formik.setFieldValue("editIntroductionPages", false);
      formik.setFieldValue("deleteIntroductionPages", false);
    }
    if (formik.values.termsAndConditions === false) {
      formik.setFieldValue("addTermsAndConditions", false);
      formik.setFieldValue("editTermsAndConditions", false);
      formik.setFieldValue("deleteTermsAndConditions", false);
    }
    if (formik.values.mainCategoriesBooks === false) {
      formik.setFieldValue("addMainCategoriesBooks", false);
      formik.setFieldValue("editMainCategoriesBooks", false);
      formik.setFieldValue("deleteMainCategoriesBooks", false);
      formik.setFieldValue("subCategoriesBooks", false);
      formik.setFieldValue("subSubCategoriesBooks", false);
      formik.setFieldValue("books", false);
    }
    if (formik.values.subCategoriesBooks === false) {
      formik.setFieldValue("addSubCategoriesBooks", false);
      formik.setFieldValue("editSubCategoriesBooks", false);
      formik.setFieldValue("deleteSubCategoriesBooks", false);
      formik.setFieldValue("subSubCategoriesBooks", false);
      formik.setFieldValue("books", false);
    }
    if (formik.values.subSubCategoriesBooks === false) {
      formik.setFieldValue("addSubSubCategoriesBooks", false);
      formik.setFieldValue("editSubSubCategoriesBooks", false);
      formik.setFieldValue("deleteSubSubCategoriesBooks", false);
      formik.setFieldValue("books", false);
    }
    if (formik.values.categoriesAudio === false) {
      formik.setFieldValue("addCategoriesAudio", false);
      formik.setFieldValue("editCategoriesAudio", false);
      formik.setFieldValue("deleteCategoriesAudio", false);
      formik.setFieldValue("audios", false);
    }
    if (formik.values.categoriesImage === false) {
      formik.setFieldValue("addCategoriesImage", false);
      formik.setFieldValue("editCategoriesImage", false);
      formik.setFieldValue("deleteCategoriesImage", false);
      formik.setFieldValue("images", false);
    }
    if (formik.values.categoriesArticle === false) {
      formik.setFieldValue("addCategoriesArticle", false);
      formik.setFieldValue("editCategoriesArticle", false);
      formik.setFieldValue("deleteCategoriesArticle", false);
      formik.setFieldValue("articles", false);
    }
    if (formik.values.users === false) {
      formik.setFieldValue("editUser", false);
      formik.setFieldValue("deleteUser", false);
      formik.setFieldValue("codeContent", false);
      formik.setFieldValue("notifications", false);
    }
    if (formik.values.codeContent === false) {
      formik.setFieldValue("addCodeContent", false);
      formik.setFieldValue("editCodeContent", false);
      formik.setFieldValue("sendCodeContent", false);
    }
    if (formik.values.elders === false) {
      formik.setFieldValue("addElders", false);
      formik.setFieldValue("editElders", false);
      formik.setFieldValue("deleteElders", false);
      formik.setFieldValue("categoriesAudio", false);
      formik.setFieldValue("audios", false);
    }
    if (formik.values.audios === false) {
      formik.setFieldValue("addAudios", false);
      formik.setFieldValue("editAudios", false);
      formik.setFieldValue("deleteAudios", false);
    }
    if (formik.values.articles === false) {
      formik.setFieldValue("addArticles", false);
      formik.setFieldValue("editArticles", false);
      formik.setFieldValue("deleteArticles", false);
    }
    if (formik.values.books === false) {
      formik.setFieldValue("addBooks", false);
      formik.setFieldValue("editBooks", false);
      formik.setFieldValue("deleteBooks", false);
    }
    if (formik.values.images === false) {
      formik.setFieldValue("addImages", false);
      formik.setFieldValue("editImages", false);
      formik.setFieldValue("deleteImages", false);
    }
    if (formik.values.subAdmins === false) {
      formik.setFieldValue("addSubAdmins", false);
      formik.setFieldValue("editSubAdmins", false);
      formik.setFieldValue("deleteSubAdmins", false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    formik.values.powers,
    formik.values.settings,
    formik.values.notifications,
    formik.values.codeContent,
    formik.values.introductionPages,
    formik.values.termsAndConditions,
    formik.values.mainCategoriesBooks,
    formik.values.subCategoriesBooks,
    formik.values.subSubCategoriesBooks,
    formik.values.categoriesAudio,
    formik.values.categoriesImage,
    formik.values.categoriesArticle,
    formik.values.users,
    formik.values.elders,
    formik.values.audios,
    formik.values.articles,
    formik.values.books,
    formik.values.images,
    formik.values.subAdmins,
  ]);

  return (
    <div className="scholar-container mt-4 m-sm-3 m-0">
      {(role === "admin" ||
        (addSubAdminsCookies === "1" && getSubAdminsCookies === "1")) && (
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
                          dir="ltr"
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
                          cursor:
                            role === "admin" ||
                            (editSubAdminsCookies === "1" &&
                              getSubAdminsCookies === "1")
                              ? "pointer"
                              : "default",
                        }}
                        onClick={() => {
                          if (
                            role === "admin" ||
                            (editSubAdminsCookies === "1" &&
                              getSubAdminsCookies === "1")
                          ) {
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
                          cursor:
                            role === "admin" ||
                            (editSubAdminsCookies === "1" &&
                              getSubAdminsCookies === "1")
                              ? "pointer"
                              : "default",
                        }}
                        onClick={() => {
                          if (
                            role === "admin" ||
                            (editSubAdminsCookies === "1" &&
                              getSubAdminsCookies === "1")
                          ) {
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
                            handleEdit(result);
                            setToggle({
                              ...toggle,
                              read: true,
                            });
                          }}
                        />
                        {(role === "admin" ||
                          deleteSubAdminsCookies === "1") && (
                          <MdDeleteOutline
                            className="delete-btn"
                            onClick={() => handleDelete(result)}
                          />
                        )}
                        {(role === "admin" || editSubAdminsCookies === "1") && (
                          <MdEdit
                            className="edit-btn"
                            onClick={() => {
                              handleEdit(result);
                              setToggle({
                                ...toggle,
                                add: !toggle.add,
                                edit: true,
                              });
                            }}
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
      {searchResults?.length > 0 && error === null && loading === false && (
        <PaginationUI />
      )}
      {/* Add & Edit Sub Admin */}
      {(role === "admin" ||
        (getSubAdminsCookies === "1" && editSubAdminsCookies === "1") ||
        (addSubAdminsCookies === "1" && getSubAdminsCookies === "1")) && (
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
                              formik.values.status === "inactive"
                                ? "active"
                                : ""
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
                              formik.values.powers === "supAdmin"
                                ? "active"
                                : ""
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
              {formik.values.powers === "supAdmin" && (
                <Row className="d-flex flex-row-reverse justify-content-start align-items-start p-3 pt-2">
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
                            checked={formik.values.settings}
                            onChange={handleInput}
                          />
                        </div>
                      </Col>
                      {formik.values.settings && (
                        <Col xs={12}>
                          <div className="form-group d-flex justify-content-end gap-sm-3 gap-2">
                            <label
                              htmlFor="editSettings"
                              className="form-label"
                            >
                              {t("subAdmin.powers.edit")}
                            </label>
                            <input
                              type="checkbox"
                              className="prayer-time-input"
                              id="editSettings"
                              name="editSettings"
                              value={formik.values.editSettings}
                              checked={formik.values.editSettings}
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
                            checked={formik.values.messages}
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
                            checked={formik.values.subAdmins}
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
                                checked={formik.values.addSubAdmins}
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
                                checked={formik.values.editSubAdmins}
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
                                checked={formik.values.deleteSubAdmins}
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
                      <Col
                        xs={formik.values.users ? 6 : 12}
                        className="p-0 m-0"
                      >
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
                            checked={formik.values.users}
                            onChange={handleInput}
                          />
                        </div>
                      </Col>
                      {formik.values.users && (
                        <>
                          <Col xs={6} className="p-0 m-0">
                            <div className="form-group d-flex justify-content-end gap-sm-3 gap-2">
                              <label htmlFor="editUser" className="form-label">
                                {t("subAdmin.powers.edit")}
                              </label>
                              <input
                                type="checkbox"
                                className="prayer-time-input"
                                id="editUser"
                                name="editUser"
                                value={formik.values.editUser}
                                checked={formik.values.editUser}
                                onChange={handleInput}
                              />
                            </div>
                          </Col>
                          <Col xs={6} className="p-0 m-0">
                            <div className="form-group d-flex justify-content-end gap-sm-3 gap-2">
                              <label
                                htmlFor="deleteUser"
                                className="form-label"
                              >
                                {t("subAdmin.powers.delete")}
                              </label>
                              <input
                                type="checkbox"
                                className="prayer-time-input"
                                id="deleteUser"
                                name="deleteUser"
                                value={formik.values.deleteUser}
                                checked={formik.values.deleteUser}
                                onChange={handleInput}
                              />
                            </div>
                          </Col>
                          <Col
                            sm={12}
                            className="d-flex justify-content-center align-items-end flex-column"
                          >
                            <label
                              htmlFor="codeContentTitle"
                              className="form-label"
                            >
                              {t("subAdmin.powers.codeContent")}
                            </label>
                            <Row className="d-flex flex-row-reverse justify-content-start align-items-center pt-2">
                              <Col
                                xs={formik.values.codeContent ? 6 : 12}
                                className="p-0 m-0"
                              >
                                <div className="form-group d-flex justify-content-end gap-sm-3 gap-2">
                                  <label
                                    htmlFor="codeContent"
                                    className="form-label"
                                  >
                                    {t("subAdmin.powers.show")}
                                  </label>
                                  <input
                                    type="checkbox"
                                    className="prayer-time-input"
                                    id="codeContent"
                                    name="codeContent"
                                    value={formik.values.codeContent}
                                    checked={formik.values.codeContent}
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
                                        checked={formik.values.addCodeContent}
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
                                        checked={formik.values.editCodeContent}
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
                                        checked={formik.values.sendCodeContent}
                                        onChange={handleInput}
                                      />
                                    </div>
                                  </Col>
                                </>
                              )}
                            </Row>
                          </Col>
                          <Col
                            sm={12}
                            className="d-flex justify-content-center align-items-end flex-column"
                          >
                            <label
                              htmlFor="notificationsTitle"
                              className="form-label"
                            >
                              {t("subAdmin.powers.notifications")}
                            </label>
                            <Row className="d-flex flex-row-reverse justify-content-start align-items-center pt-2">
                              <Col
                                xs={formik.values.notifications ? 6 : 12}
                                className="p-0 m-0"
                              >
                                <div className="form-group d-flex justify-content-end gap-sm-3 gap-2">
                                  <label
                                    htmlFor="notifications"
                                    className="form-label"
                                  >
                                    {t("subAdmin.powers.show")}
                                  </label>
                                  <input
                                    type="checkbox"
                                    className="prayer-time-input"
                                    id="notifications"
                                    name="notifications"
                                    value={formik.values.notifications}
                                    checked={formik.values.notifications}
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
                                        checked={formik.values.addNotifications}
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
                                        value={
                                          formik.values.deleteNotifications
                                        }
                                        checked={
                                          formik.values.deleteNotifications
                                        }
                                        onChange={handleInput}
                                      />
                                    </div>
                                  </Col>
                                </>
                              )}
                            </Row>
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
                      <Col
                        xs={formik.values.elders ? 6 : 12}
                        className="p-0 m-0"
                      >
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
                            checked={formik.values.elders}
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
                                checked={formik.values.addElders}
                                onChange={handleInput}
                              />
                            </div>
                          </Col>
                          <Col xs={6} className="p-0 m-0">
                            <div className="form-group d-flex justify-content-end gap-sm-3 gap-2">
                              <label
                                htmlFor="editElders"
                                className="form-label"
                              >
                                {t("subAdmin.powers.edit")}
                              </label>
                              <input
                                type="checkbox"
                                className="prayer-time-input"
                                id="editElders"
                                name="editElders"
                                value={formik.values.editElders}
                                checked={formik.values.editElders}
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
                                checked={formik.values.deleteElders}
                                onChange={handleInput}
                              />
                            </div>
                          </Col>
                          <Col
                            sm={12}
                            className="d-flex justify-content-center align-items-end flex-column"
                          >
                            <label
                              htmlFor="categoriesAudioTitle"
                              className="form-label"
                            >
                              {t("subAdmin.powers.categoriesAudio")}
                            </label>
                            <Row className="d-flex flex-row-reverse justify-content-start align-items-center pt-2">
                              <Col
                                xs={formik.values.categoriesAudio ? 6 : 12}
                                className="p-0 m-0"
                              >
                                <div className="form-group d-flex justify-content-end gap-sm-3 gap-2">
                                  <label
                                    htmlFor="categoriesAudio"
                                    className="form-label"
                                  >
                                    {t("subAdmin.powers.show")}
                                  </label>
                                  <input
                                    type="checkbox"
                                    className="prayer-time-input"
                                    id="categoriesAudio"
                                    name="categoriesAudio"
                                    value={formik.values.categoriesAudio}
                                    checked={formik.values.categoriesAudio}
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
                                        checked={
                                          formik.values.addCategoriesAudio
                                        }
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
                                        value={
                                          formik.values.editCategoriesAudio
                                        }
                                        checked={
                                          formik.values.editCategoriesAudio
                                        }
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
                                        value={
                                          formik.values.deleteCategoriesAudio
                                        }
                                        checked={
                                          formik.values.deleteCategoriesAudio
                                        }
                                        onChange={handleInput}
                                      />
                                    </div>
                                  </Col>
                                  <Col
                                    sm={12}
                                    className="d-flex justify-content-center align-items-end flex-column"
                                  >
                                    <label
                                      htmlFor="AudiosTitle"
                                      className="form-label"
                                    >
                                      {t("subAdmin.powers.audios")}
                                    </label>
                                    <Row className="d-flex flex-row-reverse justify-content-start align-items-center pt-2">
                                      <Col
                                        xs={formik.values.audios ? 6 : 12}
                                        className="p-0 m-0"
                                      >
                                        <div className="form-group d-flex justify-content-end gap-sm-3 gap-2">
                                          <label
                                            htmlFor="audios"
                                            className="form-label"
                                          >
                                            {t("subAdmin.powers.show")}
                                          </label>
                                          <input
                                            type="checkbox"
                                            className="prayer-time-input"
                                            id="audios"
                                            name="audios"
                                            value={formik.values.audios}
                                            checked={formik.values.audios}
                                            onChange={handleInput}
                                          />
                                        </div>
                                      </Col>
                                      {formik.values.audios && (
                                        <>
                                          <Col xs={6} className="p-0 m-0">
                                            <div className="form-group d-flex justify-content-end gap-sm-3 gap-2">
                                              <label
                                                htmlFor="addAudios"
                                                className="form-label"
                                              >
                                                {t("subAdmin.powers.add")}
                                              </label>
                                              <input
                                                type="checkbox"
                                                className="prayer-time-input"
                                                id="addAudios"
                                                name="addAudios"
                                                value={formik.values.addAudios}
                                                checked={
                                                  formik.values.addAudios
                                                }
                                                onChange={handleInput}
                                              />
                                            </div>
                                          </Col>
                                          <Col xs={6} className="p-0 m-0">
                                            <div className="form-group d-flex justify-content-end gap-sm-3 gap-2">
                                              <label
                                                htmlFor="editAudios"
                                                className="form-label"
                                              >
                                                {t("subAdmin.powers.edit")}
                                              </label>
                                              <input
                                                type="checkbox"
                                                className="prayer-time-input"
                                                id="editAudios"
                                                name="editAudios"
                                                value={formik.values.editAudios}
                                                checked={
                                                  formik.values.editAudios
                                                }
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
                                                value={
                                                  formik.values.deleteAudios
                                                }
                                                checked={
                                                  formik.values.deleteAudios
                                                }
                                                onChange={handleInput}
                                              />
                                            </div>
                                          </Col>
                                        </>
                                      )}
                                    </Row>
                                  </Col>
                                </>
                              )}
                            </Row>
                          </Col>
                        </>
                      )}
                    </Row>
                  </Col>
                  <hr className="d-sm-none d-block" />
                  <hr className="d-sm-none d-block" />
                  <Col
                    sm={6}
                    className="d-flex justify-content-center align-items-end flex-column"
                  >
                    <label
                      htmlFor="categoriesImageTitle"
                      className="form-label"
                    >
                      {t("subAdmin.powers.categoriesImage")}
                    </label>
                    <Row className="d-flex flex-row-reverse justify-content-start align-items-center p-3 pt-2">
                      <Col
                        xs={formik.values.categoriesImage ? 6 : 12}
                        className="p-0 m-0"
                      >
                        <div className="form-group d-flex justify-content-end gap-sm-3 gap-2">
                          <label
                            htmlFor="categoriesImage"
                            className="form-label"
                          >
                            {t("subAdmin.powers.show")}
                          </label>
                          <input
                            type="checkbox"
                            className="prayer-time-input"
                            id="categoriesImage"
                            name="categoriesImage"
                            value={formik.values.categoriesImage}
                            checked={formik.values.categoriesImage}
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
                                checked={formik.values.addCategoriesImage}
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
                                checked={formik.values.editCategoriesImage}
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
                                checked={formik.values.deleteCategoriesImage}
                                onChange={handleInput}
                              />
                            </div>
                          </Col>
                          <Col
                            sm={12}
                            className="d-flex justify-content-center align-items-end flex-column"
                          >
                            <label htmlFor="imagesTitle" className="form-label">
                              {t("subAdmin.powers.images")}
                            </label>
                            <Row className="d-flex flex-row-reverse justify-content-start align-items-center pt-2">
                              <Col
                                xs={formik.values.images ? 6 : 12}
                                className="p-0 m-0"
                              >
                                <div className="form-group d-flex justify-content-end gap-sm-3 gap-2">
                                  <label
                                    htmlFor="images"
                                    className="form-label"
                                  >
                                    {t("subAdmin.powers.show")}
                                  </label>
                                  <input
                                    type="checkbox"
                                    className="prayer-time-input"
                                    id="images"
                                    name="images"
                                    value={formik.values.images}
                                    checked={formik.values.images}
                                    onChange={handleInput}
                                  />
                                </div>
                              </Col>
                              {formik.values.images && (
                                <>
                                  <Col xs={6} className="p-0 m-0">
                                    <div className="form-group d-flex justify-content-end gap-sm-3 gap-2">
                                      <label
                                        htmlFor="addImages"
                                        className="form-label"
                                      >
                                        {t("subAdmin.powers.add")}
                                      </label>
                                      <input
                                        type="checkbox"
                                        className="prayer-time-input"
                                        id="addImages"
                                        name="addImages"
                                        value={formik.values.addImages}
                                        checked={formik.values.addImages}
                                        onChange={handleInput}
                                      />
                                    </div>
                                  </Col>
                                  <Col xs={6} className="p-0 m-0">
                                    <div className="form-group d-flex justify-content-end gap-sm-3 gap-2">
                                      <label
                                        htmlFor="editImages"
                                        className="form-label"
                                      >
                                        {t("subAdmin.powers.edit")}
                                      </label>
                                      <input
                                        type="checkbox"
                                        className="prayer-time-input"
                                        id="editImages"
                                        name="editImages"
                                        value={formik.values.editImages}
                                        checked={formik.values.editImages}
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
                                        checked={formik.values.deleteImages}
                                        onChange={handleInput}
                                      />
                                    </div>
                                  </Col>
                                </>
                              )}
                            </Row>
                          </Col>
                        </>
                      )}
                    </Row>
                  </Col>
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
                            checked={formik.values.categoriesArticle}
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
                                checked={formik.values.addCategoriesArticle}
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
                                checked={formik.values.editCategoriesArticle}
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
                                checked={formik.values.deleteCategoriesArticle}
                                onChange={handleInput}
                              />
                            </div>
                          </Col>
                          <Col
                            sm={12}
                            className="d-flex justify-content-center align-items-end flex-column"
                          >
                            <label
                              htmlFor="articlesTitle"
                              className="form-label"
                            >
                              {t("subAdmin.powers.articles")}
                            </label>
                            <Row className="d-flex flex-row-reverse justify-content-start align-items-center pt-2">
                              <Col
                                xs={formik.values.articles ? 6 : 12}
                                className="p-0 m-0"
                              >
                                <div className="form-group d-flex justify-content-end gap-sm-3 gap-2">
                                  <label
                                    htmlFor="articles"
                                    className="form-label"
                                  >
                                    {t("subAdmin.powers.show")}
                                  </label>
                                  <input
                                    type="checkbox"
                                    className="prayer-time-input"
                                    id="articles"
                                    name="articles"
                                    value={formik.values.articles}
                                    checked={formik.values.articles}
                                    onChange={handleInput}
                                  />
                                </div>
                              </Col>
                              {formik.values.articles && (
                                <>
                                  <Col xs={6} className="p-0 m-0">
                                    <div className="form-group d-flex justify-content-end gap-sm-3 gap-2">
                                      <label
                                        htmlFor="addArticles"
                                        className="form-label"
                                      >
                                        {t("subAdmin.powers.add")}
                                      </label>
                                      <input
                                        type="checkbox"
                                        className="prayer-time-input"
                                        id="addArticles"
                                        name="addArticles"
                                        value={formik.values.addArticles}
                                        checked={formik.values.addArticles}
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
                                        checked={formik.values.editArticles}
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
                                        checked={formik.values.deleteArticles}
                                        onChange={handleInput}
                                      />
                                    </div>
                                  </Col>
                                </>
                              )}
                            </Row>
                          </Col>
                        </>
                      )}
                    </Row>
                  </Col>
                  <hr className="d-sm-none d-block" />
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
                            checked={formik.values.mainCategoriesBooks}
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
                                checked={formik.values.addMainCategoriesBooks}
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
                                checked={formik.values.editMainCategoriesBooks}
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
                                checked={
                                  formik.values.deleteMainCategoriesBooks
                                }
                                onChange={handleInput}
                              />
                            </div>
                          </Col>
                          <Col
                            sm={12}
                            className="d-flex justify-content-center align-items-end flex-column"
                          >
                            <label
                              htmlFor="subCategoriesBooksTitle"
                              className="form-label"
                            >
                              {t("subAdmin.powers.subCategoriesBooks")}
                            </label>
                            <Row className="d-flex flex-row-reverse justify-content-start align-items-center pt-2">
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
                                    checked={formik.values.subCategoriesBooks}
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
                                        value={
                                          formik.values.addSubCategoriesBooks
                                        }
                                        checked={
                                          formik.values.addSubCategoriesBooks
                                        }
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
                                        value={
                                          formik.values.editSubCategoriesBooks
                                        }
                                        checked={
                                          formik.values.editSubCategoriesBooks
                                        }
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
                                        value={
                                          formik.values.deleteSubCategoriesBooks
                                        }
                                        checked={
                                          formik.values.deleteSubCategoriesBooks
                                        }
                                        onChange={handleInput}
                                      />
                                    </div>
                                  </Col>
                                  <Col
                                    sm={12}
                                    className="d-flex justify-content-center align-items-end flex-column"
                                  >
                                    <label
                                      htmlFor="subSubCategoriesBooksTitle"
                                      className="form-label"
                                    >
                                      {t(
                                        "subAdmin.powers.subSubCategoriesBooks"
                                      )}
                                    </label>
                                    <Row className="d-flex flex-row-reverse justify-content-start align-items-center pt-2">
                                      <Col
                                        xs={
                                          formik.values.subSubCategoriesBooks
                                            ? 6
                                            : 12
                                        }
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
                                            value={
                                              formik.values
                                                .subSubCategoriesBooks
                                            }
                                            checked={
                                              formik.values
                                                .subSubCategoriesBooks
                                            }
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
                                                value={
                                                  formik.values
                                                    .addSubSubCategoriesBooks
                                                }
                                                checked={
                                                  formik.values
                                                    .addSubSubCategoriesBooks
                                                }
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
                                                value={
                                                  formik.values
                                                    .editSubSubCategoriesBooks
                                                }
                                                checked={
                                                  formik.values
                                                    .editSubSubCategoriesBooks
                                                }
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
                                                value={
                                                  formik.values
                                                    .deleteSubSubCategoriesBooks
                                                }
                                                checked={
                                                  formik.values
                                                    .deleteSubSubCategoriesBooks
                                                }
                                                onChange={handleInput}
                                              />
                                            </div>
                                          </Col>
                                          <Col
                                            sm={12}
                                            className="d-flex justify-content-center align-items-end flex-column"
                                          >
                                            <label
                                              htmlFor="booksTitle"
                                              className="form-label"
                                            >
                                              {t("subAdmin.powers.books")}
                                            </label>
                                            <Row className="d-flex flex-row-reverse justify-content-start align-items-center pt-2">
                                              <Col
                                                xs={
                                                  formik.values.books ? 6 : 12
                                                }
                                                className="p-0 m-0"
                                              >
                                                <div className="form-group d-flex justify-content-end gap-sm-3 gap-2">
                                                  <label
                                                    htmlFor="books"
                                                    className="form-label"
                                                  >
                                                    {t("subAdmin.powers.show")}
                                                  </label>
                                                  <input
                                                    type="checkbox"
                                                    className="prayer-time-input"
                                                    id="books"
                                                    name="books"
                                                    value={formik.values.books}
                                                    checked={
                                                      formik.values.books
                                                    }
                                                    onChange={handleInput}
                                                  />
                                                </div>
                                              </Col>
                                              {formik.values.books && (
                                                <>
                                                  <Col
                                                    xs={6}
                                                    className="p-0 m-0"
                                                  >
                                                    <div className="form-group d-flex justify-content-end gap-sm-3 gap-2">
                                                      <label
                                                        htmlFor="addBooks"
                                                        className="form-label"
                                                      >
                                                        {t(
                                                          "subAdmin.powers.add"
                                                        )}
                                                      </label>
                                                      <input
                                                        type="checkbox"
                                                        className="prayer-time-input"
                                                        id="addBooks"
                                                        name="addBooks"
                                                        value={
                                                          formik.values.addBooks
                                                        }
                                                        checked={
                                                          formik.values.addBooks
                                                        }
                                                        onChange={handleInput}
                                                      />
                                                    </div>
                                                  </Col>
                                                  <Col
                                                    xs={6}
                                                    className="p-0 m-0"
                                                  >
                                                    <div className="form-group d-flex justify-content-end gap-sm-3 gap-2">
                                                      <label
                                                        htmlFor="editBooks"
                                                        className="form-label"
                                                      >
                                                        {t(
                                                          "subAdmin.powers.edit"
                                                        )}
                                                      </label>
                                                      <input
                                                        type="checkbox"
                                                        className="prayer-time-input"
                                                        id="editBooks"
                                                        name="editBooks"
                                                        value={
                                                          formik.values
                                                            .editBooks
                                                        }
                                                        checked={
                                                          formik.values
                                                            .editBooks
                                                        }
                                                        onChange={handleInput}
                                                      />
                                                    </div>
                                                  </Col>
                                                  <Col
                                                    xs={6}
                                                    className="p-0 m-0"
                                                  >
                                                    <div className="form-group d-flex justify-content-end gap-sm-3 gap-2">
                                                      <label
                                                        htmlFor="deleteBooks"
                                                        className="form-label"
                                                      >
                                                        {t(
                                                          "subAdmin.powers.delete"
                                                        )}
                                                      </label>
                                                      <input
                                                        type="checkbox"
                                                        className="prayer-time-input"
                                                        id="deleteBooks"
                                                        name="deleteBooks"
                                                        value={
                                                          formik.values
                                                            .deleteBooks
                                                        }
                                                        checked={
                                                          formik.values
                                                            .deleteBooks
                                                        }
                                                        onChange={handleInput}
                                                      />
                                                    </div>
                                                  </Col>
                                                </>
                                              )}
                                            </Row>
                                          </Col>
                                        </>
                                      )}
                                    </Row>
                                  </Col>
                                </>
                              )}
                            </Row>
                          </Col>
                        </>
                      )}
                    </Row>
                  </Col>
                  <hr className="d-none d-sm-block" />
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
                            checked={formik.values.introductionPages}
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
                                checked={formik.values.addIntroductionPages}
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
                                checked={formik.values.editIntroductionPages}
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
                                checked={formik.values.deleteIntroductionPages}
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
                            checked={formik.values.termsAndConditions}
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
                                checked={formik.values.addTermsAndConditions}
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
                                checked={formik.values.editTermsAndConditions}
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
                                checked={formik.values.deleteTermsAndConditions}
                                onChange={handleInput}
                              />
                            </div>
                          </Col>
                        </>
                      )}
                    </Row>
                  </Col>
                </Row>
              )}
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
      )}
      {/* Read Sub Admin */}
      <Modal
        isOpen={toggle.read}
        toggle={() => {
          formik.handleReset();
          setToggle({
            ...toggle,
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
              powers: false,
              status: false,
              edit: false,
              read: false,
            });
          }}
        >
          {formik.values.name}
          <IoMdClose
            onClick={() => {
              formik.handleReset();
              setToggle({
                ...toggle,
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
                      value={
                        formik.values.status === "inactive"
                          ? t("inactive")
                          : t("active")
                      }
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
                      value={
                        formik.values.powers === "admin"
                          ? t("admin")
                          : t("supAdmin")
                      }
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
            {formik.values.powers === "supAdmin" && (
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
                          checked={formik.values.settings}
                          onChange={handleInput}
                          disabled
                          style={{
                            cursor: "not-allowed",
                            pointerEvents: "none",
                          }}
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
                            checked={formik.values.editSettings}
                            onChange={handleInput}
                            disabled
                            style={{
                              cursor: "not-allowed",
                              pointerEvents: "none",
                            }}
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
                          checked={formik.values.messages}
                          onChange={handleInput}
                          disabled
                          style={{
                            cursor: "not-allowed",
                            pointerEvents: "none",
                          }}
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
                          checked={formik.values.subAdmins}
                          onChange={handleInput}
                          disabled
                          style={{
                            cursor: "not-allowed",
                            pointerEvents: "none",
                          }}
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
                              checked={formik.values.addSubAdmins}
                              onChange={handleInput}
                              disabled
                              style={{
                                cursor: "not-allowed",
                                pointerEvents: "none",
                              }}
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
                              checked={formik.values.editSubAdmins}
                              onChange={handleInput}
                              disabled
                              style={{
                                cursor: "not-allowed",
                                pointerEvents: "none",
                              }}
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
                              checked={formik.values.deleteSubAdmins}
                              onChange={handleInput}
                              disabled
                              style={{
                                cursor: "not-allowed",
                                pointerEvents: "none",
                              }}
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
                          checked={formik.values.users}
                          onChange={handleInput}
                          disabled
                          style={{
                            cursor: "not-allowed",
                            pointerEvents: "none",
                          }}
                        />
                      </div>
                    </Col>
                    {formik.values.users && (
                      <>
                        <Col xs={6} className="p-0 m-0">
                          <div className="form-group d-flex justify-content-end gap-sm-3 gap-2">
                            <label htmlFor="editUser" className="form-label">
                              {t("subAdmin.powers.edit")}
                            </label>
                            <input
                              type="checkbox"
                              className="prayer-time-input"
                              id="editUser"
                              name="editUser"
                              value={formik.values.editUser}
                              checked={formik.values.editUser}
                              onChange={handleInput}
                              disabled
                              style={{
                                cursor: "not-allowed",
                                pointerEvents: "none",
                              }}
                            />
                          </div>
                        </Col>
                        <Col xs={6} className="p-0 m-0">
                          <div className="form-group d-flex justify-content-end gap-sm-3 gap-2">
                            <label htmlFor="deleteUser" className="form-label">
                              {t("subAdmin.powers.delete")}
                            </label>
                            <input
                              type="checkbox"
                              className="prayer-time-input"
                              id="deleteUser"
                              name="deleteUser"
                              value={formik.values.deleteUser}
                              checked={formik.values.deleteUser}
                              onChange={handleInput}
                              disabled
                              style={{
                                cursor: "not-allowed",
                                pointerEvents: "none",
                              }}
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
                          checked={formik.values.elders}
                          onChange={handleInput}
                          disabled
                          style={{
                            cursor: "not-allowed",
                            pointerEvents: "none",
                          }}
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
                              checked={formik.values.addElders}
                              onChange={handleInput}
                              disabled
                              style={{
                                cursor: "not-allowed",
                                pointerEvents: "none",
                              }}
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
                              checked={formik.values.editElders}
                              onChange={handleInput}
                              disabled
                              style={{
                                cursor: "not-allowed",
                                pointerEvents: "none",
                              }}
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
                              checked={formik.values.deleteElders}
                              onChange={handleInput}
                              disabled
                              style={{
                                cursor: "not-allowed",
                                pointerEvents: "none",
                              }}
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
                          id="audios"
                          name="audios"
                          value={formik.values.audios}
                          checked={formik.values.audios}
                          onChange={handleInput}
                          disabled
                          style={{
                            cursor: "not-allowed",
                            pointerEvents: "none",
                          }}
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
                              checked={formik.values.addAudios}
                              onChange={handleInput}
                              disabled
                              style={{
                                cursor: "not-allowed",
                                pointerEvents: "none",
                              }}
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
                              checked={formik.values.editAudios}
                              onChange={handleInput}
                              disabled
                              style={{
                                cursor: "not-allowed",
                                pointerEvents: "none",
                              }}
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
                              checked={formik.values.deleteAudios}
                              onChange={handleInput}
                              disabled
                              style={{
                                cursor: "not-allowed",
                                pointerEvents: "none",
                              }}
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
                          checked={formik.values.books}
                          onChange={handleInput}
                          disabled
                          style={{
                            cursor: "not-allowed",
                            pointerEvents: "none",
                          }}
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
                              checked={formik.values.addBooks}
                              onChange={handleInput}
                              disabled
                              style={{
                                cursor: "not-allowed",
                                pointerEvents: "none",
                              }}
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
                              checked={formik.values.editBooks}
                              onChange={handleInput}
                              disabled
                              style={{
                                cursor: "not-allowed",
                                pointerEvents: "none",
                              }}
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
                              checked={formik.values.deleteBooks}
                              onChange={handleInput}
                              disabled
                              style={{
                                cursor: "not-allowed",
                                pointerEvents: "none",
                              }}
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
                          checked={formik.values.images}
                          onChange={handleInput}
                          disabled
                          style={{
                            cursor: "not-allowed",
                            pointerEvents: "none",
                          }}
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
                              checked={formik.values.addImages}
                              onChange={handleInput}
                              disabled
                              style={{
                                cursor: "not-allowed",
                                pointerEvents: "none",
                              }}
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
                              checked={formik.values.editImages}
                              onChange={handleInput}
                              disabled
                              style={{
                                cursor: "not-allowed",
                                pointerEvents: "none",
                              }}
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
                              checked={formik.values.deleteImages}
                              onChange={handleInput}
                              disabled
                              style={{
                                cursor: "not-allowed",
                                pointerEvents: "none",
                              }}
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
                          checked={formik.values.articles}
                          onChange={handleInput}
                          disabled
                          style={{
                            cursor: "not-allowed",
                            pointerEvents: "none",
                          }}
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
                              checked={formik.values.addArticles}
                              onChange={handleInput}
                              disabled
                              style={{
                                cursor: "not-allowed",
                                pointerEvents: "none",
                              }}
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
                              checked={formik.values.editArticles}
                              onChange={handleInput}
                              disabled
                              style={{
                                cursor: "not-allowed",
                                pointerEvents: "none",
                              }}
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
                              checked={formik.values.deleteArticles}
                              onChange={handleInput}
                              disabled
                              style={{
                                cursor: "not-allowed",
                                pointerEvents: "none",
                              }}
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
                          checked={formik.values.notifications}
                          onChange={handleInput}
                          disabled
                          style={{
                            cursor: "not-allowed",
                            pointerEvents: "none",
                          }}
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
                              checked={formik.values.addNotifications}
                              onChange={handleInput}
                              disabled
                              style={{
                                cursor: "not-allowed",
                                pointerEvents: "none",
                              }}
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
                              checked={formik.values.deleteNotifications}
                              onChange={handleInput}
                              disabled
                              style={{
                                cursor: "not-allowed",
                                pointerEvents: "none",
                              }}
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
                          checked={formik.values.codeContent}
                          onChange={handleInput}
                          disabled
                          style={{
                            cursor: "not-allowed",
                            pointerEvents: "none",
                          }}
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
                              checked={formik.values.addCodeContent}
                              onChange={handleInput}
                              disabled
                              style={{
                                cursor: "not-allowed",
                                pointerEvents: "none",
                              }}
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
                              checked={formik.values.editCodeContent}
                              onChange={handleInput}
                              disabled
                              style={{
                                cursor: "not-allowed",
                                pointerEvents: "none",
                              }}
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
                              checked={formik.values.sendCodeContent}
                              onChange={handleInput}
                              disabled
                              style={{
                                cursor: "not-allowed",
                                pointerEvents: "none",
                              }}
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
                          checked={formik.values.introductionPages}
                          onChange={handleInput}
                          disabled
                          style={{
                            cursor: "not-allowed",
                            pointerEvents: "none",
                          }}
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
                              checked={formik.values.addIntroductionPages}
                              onChange={handleInput}
                              disabled
                              style={{
                                cursor: "not-allowed",
                                pointerEvents: "none",
                              }}
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
                              checked={formik.values.editIntroductionPages}
                              onChange={handleInput}
                              disabled
                              style={{
                                cursor: "not-allowed",
                                pointerEvents: "none",
                              }}
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
                              checked={formik.values.deleteIntroductionPages}
                              onChange={handleInput}
                              disabled
                              style={{
                                cursor: "not-allowed",
                                pointerEvents: "none",
                              }}
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
                          checked={formik.values.termsAndConditions}
                          onChange={handleInput}
                          disabled
                          style={{
                            cursor: "not-allowed",
                            pointerEvents: "none",
                          }}
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
                              checked={formik.values.addTermsAndConditions}
                              onChange={handleInput}
                              disabled
                              style={{
                                cursor: "not-allowed",
                                pointerEvents: "none",
                              }}
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
                              checked={formik.values.editTermsAndConditions}
                              onChange={handleInput}
                              disabled
                              style={{
                                cursor: "not-allowed",
                                pointerEvents: "none",
                              }}
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
                              checked={formik.values.deleteTermsAndConditions}
                              onChange={handleInput}
                              disabled
                              style={{
                                cursor: "not-allowed",
                                pointerEvents: "none",
                              }}
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
                          checked={formik.values.mainCategoriesBooks}
                          onChange={handleInput}
                          disabled
                          style={{
                            cursor: "not-allowed",
                            pointerEvents: "none",
                          }}
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
                              checked={formik.values.addMainCategoriesBooks}
                              onChange={handleInput}
                              disabled
                              style={{
                                cursor: "not-allowed",
                                pointerEvents: "none",
                              }}
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
                              checked={formik.values.editMainCategoriesBooks}
                              onChange={handleInput}
                              disabled
                              style={{
                                cursor: "not-allowed",
                                pointerEvents: "none",
                              }}
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
                              checked={formik.values.deleteMainCategoriesBooks}
                              onChange={handleInput}
                              disabled
                              style={{
                                cursor: "not-allowed",
                                pointerEvents: "none",
                              }}
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
                          checked={formik.values.subCategoriesBooks}
                          onChange={handleInput}
                          disabled
                          style={{
                            cursor: "not-allowed",
                            pointerEvents: "none",
                          }}
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
                              checked={formik.values.addSubCategoriesBooks}
                              onChange={handleInput}
                              disabled
                              style={{
                                cursor: "not-allowed",
                                pointerEvents: "none",
                              }}
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
                              checked={formik.values.editSubCategoriesBooks}
                              onChange={handleInput}
                              disabled
                              style={{
                                cursor: "not-allowed",
                                pointerEvents: "none",
                              }}
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
                              checked={formik.values.deleteSubCategoriesBooks}
                              onChange={handleInput}
                              disabled
                              style={{
                                cursor: "not-allowed",
                                pointerEvents: "none",
                              }}
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
                          checked={formik.values.subSubCategoriesBooks}
                          onChange={handleInput}
                          disabled
                          style={{
                            cursor: "not-allowed",
                            pointerEvents: "none",
                          }}
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
                              checked={formik.values.addSubSubCategoriesBooks}
                              onChange={handleInput}
                              disabled
                              style={{
                                cursor: "not-allowed",
                                pointerEvents: "none",
                              }}
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
                              checked={formik.values.editSubSubCategoriesBooks}
                              onChange={handleInput}
                              disabled
                              style={{
                                cursor: "not-allowed",
                                pointerEvents: "none",
                              }}
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
                              checked={
                                formik.values.deleteSubSubCategoriesBooks
                              }
                              onChange={handleInput}
                              disabled
                              style={{
                                cursor: "not-allowed",
                                pointerEvents: "none",
                              }}
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
                          checked={formik.values.categoriesAudio}
                          onChange={handleInput}
                          disabled
                          style={{
                            cursor: "not-allowed",
                            pointerEvents: "none",
                          }}
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
                              checked={formik.values.addCategoriesAudio}
                              onChange={handleInput}
                              disabled
                              style={{
                                cursor: "not-allowed",
                                pointerEvents: "none",
                              }}
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
                              checked={formik.values.editCategoriesAudio}
                              onChange={handleInput}
                              disabled
                              style={{
                                cursor: "not-allowed",
                                pointerEvents: "none",
                              }}
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
                              checked={formik.values.deleteCategoriesAudio}
                              onChange={handleInput}
                              disabled
                              style={{
                                cursor: "not-allowed",
                                pointerEvents: "none",
                              }}
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
                          checked={formik.values.categoriesImage}
                          onChange={handleInput}
                          disabled
                          style={{
                            cursor: "not-allowed",
                            pointerEvents: "none",
                          }}
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
                              checked={formik.values.addCategoriesImage}
                              onChange={handleInput}
                              disabled
                              style={{
                                cursor: "not-allowed",
                                pointerEvents: "none",
                              }}
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
                              checked={formik.values.editCategoriesImage}
                              onChange={handleInput}
                              disabled
                              style={{
                                cursor: "not-allowed",
                                pointerEvents: "none",
                              }}
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
                              checked={formik.values.deleteCategoriesImage}
                              onChange={handleInput}
                              disabled
                              style={{
                                cursor: "not-allowed",
                                pointerEvents: "none",
                              }}
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
                          checked={formik.values.categoriesArticle}
                          onChange={handleInput}
                          disabled
                          style={{
                            cursor: "not-allowed",
                            pointerEvents: "none",
                          }}
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
                              checked={formik.values.addCategoriesArticle}
                              onChange={handleInput}
                              disabled
                              style={{
                                cursor: "not-allowed",
                                pointerEvents: "none",
                              }}
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
                              checked={formik.values.editCategoriesArticle}
                              onChange={handleInput}
                              disabled
                              style={{
                                cursor: "not-allowed",
                                pointerEvents: "none",
                              }}
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
                              checked={formik.values.deleteCategoriesArticle}
                              onChange={handleInput}
                              disabled
                              style={{
                                cursor: "not-allowed",
                                pointerEvents: "none",
                              }}
                            />
                          </div>
                        </Col>
                      </>
                    )}
                  </Row>
                </Col>
              </Row>
            )}
            <Row className="d-flex justify-content-center align-items-center p-3 pt-0">
              <Col lg={12}>
                <div className="form-group-container d-flex flex-row-reverse justify-content-lg-start justify-content-center gap-3">
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => {
                      setToggle({
                        ...toggle,
                        powers: false,
                        status: false,
                        edit: false,
                        read: false,
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
