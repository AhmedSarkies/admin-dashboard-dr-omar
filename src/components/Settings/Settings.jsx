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
} from "reactstrap";
import { IoMdClose } from "react-icons/io";
import anonymous from "../../assets/images/anonymous.png";
// import { useSchema } from "../../hooks";
import { ImUpload } from "react-icons/im";
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
  const [toggle, setToggle] = useState({
    add: false,
    imagePreview: false,
  });
  const formik = useFormik({
    initialValues: {
      image: {
        file: "",
        preview: "",
      },
      prayer_timings: false,
      facebook: "",
      whatsapp: "",
      messenger: "",
      instagram: "",
      playStore: "",
      appStore: "",
    },
    // validationSchema: validationSchema.settings,
    onSubmit: (values) => {
      if (settings) {
        dispatch(
          updateSetting({
            image: values.image.file,
            prayer_timings: values.prayer_timings === true ? 1 : 0,
            facebook: values.facebook,
            whatsapp: values.whatsapp,
            messenger: values.messenger,
            instagram: values.instagram,
            play_store: values.playStore,
            app_store: values.appStore,
          })
        );
      } else {
        dispatch(
          addSetting({
            image: values.image.file,
            prayer_timings: values.prayer_timings === true ? 1 : 0,
            facebook: values.facebook,
            whatsapp: values.whatsapp,
            messenger: values.messenger,
            instagram: values.instagram,
            play_store: values.playStore,
            app_store: values.appStore,
          })
        );
      }
    },
  });

  // Handle Image Change
  const handleImageChange = (e) => {
    try {
      const file = fileRef.current.files[0];
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

  const handleInputChange = (e) => {
    formik.handleChange(e);
  };

  // Get Settings
  useEffect(() => {
    dispatch(getSettings());
  }, [dispatch]);

  // Set Settings
  useEffect(() => {
    if (settings) {
      formik.setValues({
        image: {
          file: settings?.image,
          preview: settings?.image,
        },
        prayer_timings: settings?.prayer_timings === 1 ? true : false,
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
    <>
      <div className="scholar-container mt-4 mb-5 m-3">
        <form className="w-100" onSubmit={formik.handleSubmit}>
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
                    <ModalFooter className="p-md-4 p-2">
                      <div className="form-group-container d-flex justify-content-center align-items-center">
                        <button
                          className="delete-btn cancel-btn"
                          onClick={handleDeleteImage}
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
                <span className="error text-center">{formik.errors.image}</span>
              ) : null}
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
                  onChange={handleInputChange}
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
                marginBottom: "0 !important",
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
          <Row className="flex-row-reverse justify-content-between g-3">
            {appFields.map((field, index) => (
              <Col md="6" key={index}>
                <div className="form-group">
                  <input
                    type="url"
                    className="form-control"
                    id={field.name}
                    name={field.name}
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
          <Row>
            <Col md="12">
              <div className="form-group-container d-flex justify-content-center mt-5 mb-3">
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
              </div>
            </Col>
          </Row>
        </form>
      </div>
    </>
  );
};

export default Settings;
