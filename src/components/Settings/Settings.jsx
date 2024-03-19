import React, { useRef, useState } from "react";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Col, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { IoMdClose } from "react-icons/io";
import anonymous from "../../assets/images/anonymous.png";
import { useSchema } from "../../hooks";
import { ImUpload } from "react-icons/im";

const Settings = () => {
  const { t } = useTranslation();
  const { validationSchema } = useSchema();
  const { loading } = useSelector((state) => state.settings);
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
    },
    validationSchema: validationSchema.image,
    onSubmit: (values) => {
      console.log(values);
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

  return (
    <div className="scholar-container mt-4 m-3">
      <div className="table-header justify-content-end">
        <h3
          className="title"
          style={{
            color: "var(--main-color)",
          }}
        >
          {t("settings.settingsApp.logo")}
        </h3>
      </div>
      <form className="w-100" onSubmit={formik.handleSubmit}>
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
                      (formik.values?.image && formik.values?.image?.preview) ||
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
        <Col md="12">
          <div className="form-group-container d-flex justify-content-center gap-3 mt-3">
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
      </form>
    </div>
  );
};

export default Settings;
