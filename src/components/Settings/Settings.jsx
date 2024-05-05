import React, { useEffect, useRef, useState } from "react";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  getSettings,
  addSetting,
  updateSetting,
} from "../../store/slices/settingsSlice";
import {
  Col,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
  Spinner,
} from "reactstrap";
import { IoMdClose } from "react-icons/io";
import anonymous from "../../assets/images/anonymous.png";
// import { useSchema } from "../../hooks";
import { ImUpload } from "react-icons/im";
import { toast } from "react-toastify";
import Cookies from "js-cookie";

const contactFields = [
  {
    name: "facebook",
  },
  {
    name: "whatsapp",
  },
  {
    name: "messenger",
  },
  {
    name: "instagram",
  },
  // {
  //   name: "twitter",
  // },
  // {
  //   name: "snapchat",
  // },
  // {
  //   name: "linkedin",
  // },
  // {
  //   name: "youtube",
  // },
  // {
  //   name: "tikTok",
  // },
  // {
  //   name: "telegram",
  // },
  // {
  //   name: "phone",
  // },
  // {
  //   name: "email",
  // },
  // {
  //   name: "address",
  // },
  // {
  //   name: "map",
  // },
];

const appFields = [
  {
    name: "playStore",
  },
  {
    name: "appStore",
  },
];

const Settings = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  // const { validationSchema } = useSchema();
  const { settings, loading } = useSelector((state) => state.settings);
  const fileRef = useRef();
  const role = Cookies.get("_role");
  const getSettingsCookies = Cookies.get("GetSettings");
  const editSettingsCookies = Cookies.get("editSettings");
  const fileBackgroundRef = useRef();
  const fileLogoRef = useRef();
  const [toggle, setToggle] = useState({
    add: false,
    imagePreview: false,
    backgroundPreview: false,
    logoPreview: false,
  });
  const formik = useFormik({
    initialValues: {
      image: {
        file: "",
        preview: "",
      },
      background: {
        file: "",
        preview: "",
      },
      logo: {
        file: "",
        preview: "",
      },
      prayer_timings: false,
      code_phone: false,
      code_email: false,
      facebook: "",
      whatsapp: "",
      messenger: "",
      instagram: "",
      playStore: "",
      appStore: "",
    },
    // validationSchema: validationSchema.settings,
    onSubmit: (values) => {
      if (
        role === "admin" ||
        (editSettingsCookies === "1" && getSettingsCookies === "1")
      ) {
        const data = new FormData();
        data.append("prayer_timings", values.prayer_timings === true ? 1 : 0);
        data.append("code_phone", values.code_phone === true ? 1 : 0);
        data.append("code_email", values.code_email === true ? 1 : 0);
        data.append("facebook", values.facebook);
        data.append("whatsapp", values.whatsapp);
        data.append("messenger", values.messenger);
        data.append("instagram", values.instagram);
        data.append("play_store", values.playStore);
        data.append("app_store", values.appStore);
        data.append("id", 2);
        if (values.image.file) {
          data.append("image", values.image.file);
        }
        if (values.background.file) {
          data.append("background", values.background.file);
        }
        if (values.logo.file) {
          data.append("logo", values.logo.file);
        }
        if (settings) {
          dispatch(updateSetting(data)).then((res) => {
            if (!res.error) {
              dispatch(getSettings());
              toast.success(t("toast.settingsApp.success"));
            } else {
              dispatch(getSettings());
              toast.error(t("toast.settingsApp.error"));
            }
          });
        } else {
          dispatch(
            addSetting({
              image: values.image.file,
              prayer_timings: values.prayer_timings === true ? 1 : 0,
              code_phone: values.code_phone === true ? 1 : 0,
              code_email: values.code_email === true ? 1 : 0,
              facebook: values.facebook,
              whatsapp: values.whatsapp,
              messenger: values.messenger,
              instagram: values.instagram,
              play_store: values.playStore,
              app_store: values.appStore,
              id: settings.id,
            })
          );
        }
      }
    },
  });

  // Handle Image Change
  const handleImageChange = (e) => {
    try {
      const file = fileRef?.current?.files[0];
      formik.setValues({
        ...formik.values,
        image: {
          file: file,
          preview: URL.createObjectURL(file),
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  // Handle Background Change
  const handleBackgroundChange = (e) => {
    try {
      const file = fileBackgroundRef.current.files[0];
      formik.setValues({
        ...formik.values,
        background: {
          file: file,
          preview: URL.createObjectURL(file),
        },
      });
    } catch (error) {
      console.log(error);
    }
  };

  // Handle Logo Change
  const handleLogoChange = (e) => {
    try {
      const file = fileLogoRef.current.files[0];
      formik.setValues({
        ...formik.values,
        logo: {
          file: file,
          preview: URL.createObjectURL(file),
        },
      });
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

  // Handle Delete Background
  const handleDeleteBackground = () => {
    fileBackgroundRef.current.value = "";
    fileBackgroundRef.current.files = null;
    formik.setValues({
      ...formik.values,
      background: {
        file: fileBackgroundRef.current.files[0],
        preview: "",
      },
    });
    setToggle({
      ...toggle,
      backgroundPreview: false,
    });
  };

  // Handle Delete Logo
  const handleDeleteLogo = () => {
    fileLogoRef.current.value = "";
    fileLogoRef.current.files = null;
    formik.setValues({
      ...formik.values,
      logo: {
        file: fileLogoRef.current.files[0],
        preview: "",
      },
    });
    setToggle({
      ...toggle,
      logoPreview: false,
    });
  };

  const handleInputChange = (e) => {
    formik.handleChange(e);
  };

  // Get Settings
  useEffect(() => {
    if (getSettingsCookies === "1" || role === "admin") {
      dispatch(getSettings());
    }
    if (getSettingsCookies === "0") {
      Cookies.set("editSettings", 0, {
        expires: 30,
        secure: true,
        sameSite: "strict",
        path: "/",
      });
    }
  }, [dispatch, getSettingsCookies, role]);

  // Set Settings
  useEffect(() => {
    if (settings) {
      formik.setValues({
        image: {
          file: "",
          preview: settings?.image,
        },
        background: {
          file: "",
          preview: settings?.background,
        },
        logo: {
          file: "",
          preview: settings?.logo,
        },
        prayer_timings: settings?.prayer_timings === "true" ? true : false,
        code_phone: settings?.code_phone ? true : false,
        code_email: settings?.code_email ? true : false,
        facebook: settings?.facebook,
        whatsapp: settings?.whatsapp,
        messenger: settings?.messenger,
        instagram: settings?.instagram,
        playStore: settings?.play_store,
        appStore: settings?.app_store,
      });
    }
    /* eslint-disable react-hooks/exhaustive-deps */
  }, [settings]);

  return (
    <div
      className={`scholar-container mt-4 mb-5 m-3${
        loading
          ? " pt-5 pb-5 d-flex justify-content-center align-items-center"
          : ""
      }`}
    >
      {loading ? (
        <Spinner color="primary" style={{ width: "3rem", height: "3rem" }} />
      ) : (
        <form className="w-100" onSubmit={formik.handleSubmit}>
          {/* Logo */}
          <div className="table-header justify-content-end">
            <h3
              className="title"
              style={{
                color: "var(--main-color)",
                marginBottom: "0 !important",
              }}
            >
              {t("settings.settingsApp.logo")}
            </h3>
          </div>
          <Row>
            <Col
              md={12}
              className="d-flex flex-column justify-content-center align-items-center"
            >
              <div className="image-preview-container d-flex justify-content-center align-items-center">
                <label
                  htmlFor={formik.values?.logo?.preview ? "" : "logo"}
                  className="form-label d-flex justify-content-center align-items-center"
                >
                  <img
                    src={
                      formik.values?.logo && formik.values?.logo?.preview
                        ? formik.values?.logo?.preview
                        : anonymous
                    }
                    alt="avatar"
                    className="image-preview"
                    onClick={() =>
                      formik.values?.logo && formik.values?.logo?.preview
                        ? setToggle({
                            ...toggle,
                            logoPreview: !toggle.logoPreview,
                          })
                        : ""
                    }
                  />
                  <Modal
                    isOpen={toggle.logoPreview}
                    toggle={() =>
                      setToggle({
                        ...toggle,
                        logoPreview: !toggle.logoPreview,
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
                          logoPreview: !toggle.logoPreview,
                        })
                      }
                    >
                      <IoMdClose
                        onClick={() =>
                          setToggle({
                            ...toggle,
                            logoPreview: !toggle.logoPreview,
                          })
                        }
                      />
                    </ModalHeader>
                    <ModalBody className="d-flex flex-wrap justify-content-center align-items-center">
                      <img
                        src={
                          (formik.values?.logo &&
                            formik.values?.logo?.preview) ||
                          toggle.logo?.preview
                            ? formik.values?.logo?.preview
                            : anonymous
                        }
                        alt="avatar"
                        className="image-preview"
                      />
                    </ModalBody>
                    {role === "admin" && (
                      <ModalFooter className="p-md-4 p-2">
                        <div className="form-group-container d-flex justify-content-center align-items-center">
                          <button
                            className="delete-btn cancel-btn"
                            onClick={handleDeleteLogo}
                          >
                            {t("delete")}
                          </button>
                        </div>
                      </ModalFooter>
                    )}
                  </Modal>
                </label>
              </div>
              {(role === "admin" ||
                (editSettingsCookies === "1" &&
                  getSettingsCookies === "1")) && (
                <div className="form-group-container d-flex justify-content-lg-start justify-content-center flex-row-reverse">
                  <label htmlFor="logo" className="form-label">
                    <ImUpload /> {t("chooseImageLogo")}
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    className="form-input form-img-input"
                    id="logo"
                    name="logo"
                    ref={fileLogoRef}
                    onChange={handleLogoChange}
                  />
                </div>
              )}
              {formik.errors.logo && formik.touched.logo ? (
                <span className="error text-center">{formik.errors.logo}</span>
              ) : null}
            </Col>
          </Row>
          <hr
            style={{
              margin: "3rem 0.75rem 0 0.75rem",
            }}
          />
          {/* Elder */}
          <div className="table-header justify-content-end">
            <h3
              className="title"
              style={{
                color: "var(--main-color)",
                marginBottom: "0 !important",
              }}
            >
              {t("settings.settingsApp.elder")}
            </h3>
          </div>
          <Row>
            <Col
              md={12}
              className="d-flex flex-column justify-content-center align-items-center"
            >
              <div className="image-preview-container d-flex justify-content-center align-items-center">
                <label
                  htmlFor={formik.values?.image?.preview ? "" : "image"}
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
                    onClick={() =>
                      formik.values?.image && formik.values?.image?.preview
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
                          (formik.values?.image &&
                            formik.values?.image?.preview) ||
                          toggle.image?.preview
                            ? formik.values?.image?.preview
                            : anonymous
                        }
                        alt="avatar"
                        className="image-preview"
                      />
                    </ModalBody>
                    {(role === "admin" ||
                      (editSettingsCookies === "1" &&
                        getSettingsCookies === "1")) && (
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
              {(role === "admin" ||
                (editSettingsCookies === "1" &&
                  getSettingsCookies === "1")) && (
                <div className="form-group-container d-flex justify-content-lg-start justify-content-center flex-row-reverse">
                  <label htmlFor="image" className="form-label">
                    <ImUpload /> {t("chooseImageElder")}
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
                <span className="error text-center">{formik.errors.image}</span>
              ) : null}
            </Col>
          </Row>
          <hr
            style={{
              margin: "3rem 0.75rem 0 0.75rem",
            }}
          />
          {/* Background */}
          <div className="table-header justify-content-end">
            <h3
              className="title"
              style={{
                color: "var(--main-color)",
                marginBottom: "0 !important",
              }}
            >
              {t("settings.settingsApp.background")}
            </h3>
          </div>
          <Row>
            <Col
              md={12}
              className="d-flex flex-column justify-content-center align-items-center"
            >
              <div
                className="image-preview-container d-flex justify-content-center align-items-center"
                style={{
                  width: "100%",
                  height: "100%",
                }}
              >
                <label
                  htmlFor={
                    formik.values?.background?.preview ? "" : "background"
                  }
                  className="form-label d-flex justify-content-center align-items-center"
                  style={{
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <img
                    src={
                      formik.values?.background &&
                      formik.values?.background?.preview
                        ? formik.values?.background?.preview
                        : anonymous
                    }
                    alt="avatar"
                    className="image-preview"
                    onClick={() =>
                      formik.values?.background &&
                      formik.values?.background?.preview
                        ? setToggle({
                            ...toggle,
                            backgroundPreview: !toggle.backgroundPreview,
                          })
                        : ""
                    }
                    style={{
                      width: "90%",
                      height: "150px",
                      borderRadius: "0.5rem",
                    }}
                  />
                  <Modal
                    isOpen={toggle.backgroundPreview}
                    toggle={() =>
                      setToggle({
                        ...toggle,
                        backgroundPreview: !toggle.backgroundPreview,
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
                          backgroundPreview: !toggle.backgroundPreview,
                        })
                      }
                    >
                      <IoMdClose
                        onClick={() =>
                          setToggle({
                            ...toggle,
                            backgroundPreview: !toggle.backgroundPreview,
                          })
                        }
                      />
                    </ModalHeader>
                    <ModalBody className="d-flex flex-wrap justify-content-center align-items-center">
                      <img
                        src={
                          (formik.values?.background &&
                            formik.values?.background?.preview) ||
                          toggle.background?.preview
                            ? formik.values?.background?.preview
                            : anonymous
                        }
                        alt="avatar"
                        className="image-preview"
                      />
                    </ModalBody>
                    {(role === "admin" ||
                      (editSettingsCookies === "1" &&
                        getSettingsCookies === "1")) && (
                      <ModalFooter className="p-md-4 p-2">
                        <div className="form-group-container d-flex justify-content-center align-items-center">
                          <button
                            className="delete-btn cancel-btn"
                            onClick={handleDeleteBackground}
                          >
                            {t("delete")}
                          </button>
                        </div>
                      </ModalFooter>
                    )}
                  </Modal>
                </label>
              </div>
              {(role === "admin" ||
                (editSettingsCookies === "1" &&
                  getSettingsCookies === "1")) && (
                <div className="form-group-container d-flex justify-content-lg-start justify-content-center flex-row-reverse">
                  <label htmlFor="background" className="form-label">
                    <ImUpload /> {t("chooseBackground")}
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    className="form-input form-img-input"
                    id="background"
                    ref={fileBackgroundRef}
                    onChange={handleBackgroundChange}
                  />
                </div>
              )}
              {formik.errors.background && formik.touched.background ? (
                <span className="error text-center">
                  {formik.errors.background}
                </span>
              ) : null}
            </Col>
          </Row>
          <hr
            style={{
              margin: "3rem 0.75rem 0 0.75rem",
            }}
          />
          {/* Time Prayer */}
          <div className="table-header justify-content-end mt-4">
            <h3
              className="title"
              style={{
                color: "var(--main-color)",
                marginBottom: "0 !important",
              }}
            >
              {t("settings.settingsApp.prayer.time")}
            </h3>
          </div>
          <Row>
            <Col sm={12}>
              <div className="form-group d-flex justify-content-end mb-4">
                <label htmlFor="prayer_timings" className="form-label">
                  {t("settings.settingsApp.prayer.time")}
                </label>
                <input
                  type="checkbox"
                  className="prayer-time-input me-3 ms-3"
                  id="prayer_timings"
                  name="prayer_timings"
                  disabled={
                    role === "admin" ||
                    (editSettingsCookies === "1" && getSettingsCookies === "1")
                      ? false
                      : true
                  }
                  value={formik.values.prayer_timings}
                  checked={formik.values.prayer_timings}
                  onChange={handleInputChange}
                  style={{
                    cursor:
                      role !== "admin" ||
                      (editSettingsCookies === "0" &&
                        getSettingsCookies === "0")
                        ? "not-allowed"
                        : "pointer",
                  }}
                />
              </div>
            </Col>
          </Row>
          <hr
            style={{
              margin: "3rem 0.75rem 0 0.75rem",
            }}
          />
          {/* Activation */}
          <div className="table-header justify-content-end mt-4">
            <h3
              className="title"
              style={{
                color: "var(--main-color)",
                marginBottom: "0 !important",
              }}
            >
              {t("settings.settingsApp.activationCode")}
            </h3>
          </div>
          <Row>
            <Col sm={6}>
              <div className="form-group d-flex justify-content-end mb-4">
                <label htmlFor="code_phone" className="form-label">
                  {t("settings.settingsApp.code.phone")}
                </label>
                <input
                  type="checkbox"
                  className="prayer-time-input me-3 ms-3"
                  id="code_phone"
                  name="code_phone"
                  disabled={
                    role === "admin" ||
                    (editSettingsCookies === "1" && getSettingsCookies === "1")
                      ? false
                      : true
                  }
                  value={formik.values.code_phone}
                  checked={formik.values.code_phone}
                  onChange={handleInputChange}
                  style={{
                    cursor:
                      role !== "admin" ||
                      (editSettingsCookies === "0" &&
                        getSettingsCookies === "0")
                        ? "not-allowed"
                        : "pointer",
                  }}
                />
              </div>
            </Col>
            <Col sm={6}>
              <div className="form-group d-flex justify-content-end mb-4">
                <label htmlFor="code_email" className="form-label">
                  {t("settings.settingsApp.code.email")}
                </label>
                <input
                  type="checkbox"
                  className="prayer-time-input me-3 ms-3"
                  id="code_email"
                  name="code_email"
                  disabled={
                    role === "admin" ||
                    (editSettingsCookies === "1" && getSettingsCookies === "1")
                      ? false
                      : true
                  }
                  value={formik.values.code_email}
                  checked={formik.values.code_email}
                  onChange={handleInputChange}
                  style={{
                    cursor:
                      role !== "admin" ||
                      (editSettingsCookies === "0" &&
                        getSettingsCookies === "0")
                        ? "not-allowed"
                        : "pointer",
                  }}
                />
              </div>
            </Col>
          </Row>
          <hr
            style={{
              margin: "3rem 0.75rem 0 0.75rem",
            }}
          />
          <div className="table-header justify-content-end mt-4">
            <h3
              className="title"
              style={{
                color: "var(--main-color)",
                marginBottom: "0",
              }}
            >
              {t("settings.links.contact.title")}
            </h3>
          </div>
          <Row className="flex-row-reverse justify-content-between g-3">
            {contactFields.map((field, index) => (
              <Col md="6" key={index}>
                <div className="form-group">
                  <input
                    type="url"
                    className="form-control"
                    id={field.name}
                    name={field.name}
                    value={formik.values[field.name]}
                    disabled={
                      role === "admin" ||
                      (editSettingsCookies === "1" &&
                        getSettingsCookies === "1")
                        ? false
                        : true
                    }
                    placeholder={t(
                      `settings.links.contact.columns.${field.name}`
                    )}
                    onChange={handleInputChange}
                  />
                  <label htmlFor={field.name} className="label-form">
                    {t(`settings.links.contact.columns.${field.name}`)}
                  </label>
                </div>
                {formik.errors.url && formik.touched.url ? (
                  <span className="error text-center">{formik.errors.url}</span>
                ) : null}
              </Col>
            ))}
          </Row>
          <hr
            style={{
              margin: "3rem 0.75rem 0 0.75rem",
            }}
          />
          <div className="table-header justify-content-end mt-4">
            <h3
              className="title"
              style={{
                color: "var(--main-color)",
                marginBottom: "0 !important",
              }}
            >
              {t("settings.links.appLink.title")}
            </h3>
          </div>
          <Row
            className={`flex-row-reverse justify-content-between g-3 ${
              role !== "admin" ||
              (editSettingsCookies === "0" && getSettingsCookies === "0")
                ? "mb-5"
                : ""
            }`}
          >
            {appFields.map((field, index) => (
              <Col md="6" key={index}>
                <div className="form-group">
                  <input
                    type="url"
                    className="form-control"
                    id={field.name}
                    name={field.name}
                    value={formik.values[field.name]}
                    disabled={
                      role === "admin" ||
                      (editSettingsCookies === "1" &&
                        getSettingsCookies === "1")
                        ? false
                        : true
                    }
                    placeholder={t(
                      `settings.links.appLink.columns.${field.name}`
                    )}
                    onChange={handleInputChange}
                  />
                  <label htmlFor={field.name} className="label-form">
                    {t(`settings.links.appLink.columns.${field.name}`)}
                  </label>
                </div>
                {formik.errors.url && formik.touched.url ? (
                  <span className="error text-center">{formik.errors.url}</span>
                ) : null}
              </Col>
            ))}
          </Row>
          {(role === "admin" ||
            (editSettingsCookies === "1" && getSettingsCookies === "1")) && (
            <Row>
              <Col md="12">
                <div className="form-group-container d-flex justify-content-center mt-5 mb-3">
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
                </div>
              </Col>
            </Row>
          )}
        </form>
      )}
    </div>
  );
};

export default Settings;
