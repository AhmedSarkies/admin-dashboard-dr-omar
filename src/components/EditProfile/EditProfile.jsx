import React, { useState } from "react";
import { useFormik } from "formik";
import { ImUpload } from "react-icons/im";
import { IoMdClose } from "react-icons/io";
import {
  Col,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Row,
} from "reactstrap";
import { object, string } from "yup";

import anonymous from "../../assets/images/anonymous.png";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const EditProfile = () => {
  const { t } = useTranslation();
  const [toggle, setToggle] = useState({});
  const navigate = useNavigate();

  const editProfileFormik = useFormik({
    initialValues: {
      name: "احمد",
      email: "admin@gmail.com",
      phone: "01012349575",
      image: "",
    },
    validationSchema: object().shape({
      name: string().required("يجب ادخال الاسم"),
      email: string()
        .email("يجب ادخال البريد الالكتروني بشكل صحيح")
        .required("يجب ادخال البريد الالكتروني"),
      phone: string()
        .min(11, "يجب ادخال رقم الهاتف بشكل صحيح")
        .required("يجب ادخال رقم الهاتف"),
    }),
    onSubmit: (values) => {
      editProfileFormik.setValues(values);
      setToggle({
        ...toggle,
        editProfile: !toggle.editProfile,
      });
    },
  });

  const handleInputChange = (e) => {
    editProfileFormik.handleChange(e);
  };

  // Handle Image Change
  const handleImageChange = (e) => {
    try {
      const file = e.currentTarget.files[0];
      if (file) {
        editProfileFormik.setFieldValue("image", {
          file: file,
          preview: URL.createObjectURL(file),
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="profile-container">
      <Row className="justify-content-center">
        <Col>
          <div className="profile">
            <form
              className="d-flex justify-content-center align-items-center flex-column gap-3 w-100"
              onSubmit={editProfileFormik.handleSubmit}
            >
              <Col
                lg={5}
                className="d-flex flex-column justify-content-center align-items-center"
              >
                <div className="image-preview-container d-flex justify-content-center align-items-center">
                  <label
                    htmlFor={
                      editProfileFormik.values.image.preview ? "" : "image"
                    }
                    className="form-label d-flex justify-content-center align-items-center"
                  >
                    <img
                      src={
                        editProfileFormik.values.image &&
                        editProfileFormik.values.image.preview
                          ? editProfileFormik.values.image.preview
                          : anonymous
                      }
                      alt="avatar"
                      className="image-preview"
                      onClick={() =>
                        editProfileFormik.values.image &&
                        editProfileFormik.values.image.preview
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
                            editProfileFormik.values.image &&
                            editProfileFormik.values.image.preview
                              ? editProfileFormik.values.image.preview
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
                              editProfileFormik.setFieldValue("image", {
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
              </Col>
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  placeholder={t("profile.name")}
                  name="name"
                  value={editProfileFormik.values.name}
                  onChange={handleInputChange}
                />
                <label htmlFor="name" className="label-form">
                  {t("profile.name")}
                </label>
              </div>
              <div className="error-container">
                {editProfileFormik.touched.name &&
                editProfileFormik.errors.name ? (
                  <span className="error">{editProfileFormik.errors.name}</span>
                ) : null}
              </div>
              <div className="form-group">
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  placeholder={t("profile.email")}
                  name="email"
                  value={editProfileFormik.values.email}
                  onChange={handleInputChange}
                />
                <label htmlFor="email" className="label-form">
                  {t("profile.email")}
                </label>
              </div>
              <div className="error-container">
                {editProfileFormik.touched.email &&
                editProfileFormik.errors.email ? (
                  <span className="error">
                    {editProfileFormik.errors.email}
                  </span>
                ) : null}
              </div>
              <div className="form-group">
                <input
                  type="text"
                  className="form-control"
                  id="phone"
                  placeholder={t("profile.phone")}
                  name="phone"
                  value={editProfileFormik.values.phone}
                  onChange={handleInputChange}
                />
                <label htmlFor="phone" className="label-form">
                  {t("profile.phone")}
                </label>
              </div>
              <div className="error-container">
                {editProfileFormik.touched.phone &&
                editProfileFormik.errors.phone ? (
                  <span className="error">
                    {editProfileFormik.errors.phone}
                  </span>
                ) : null}
              </div>
              <div className="form-group d-flex justify-content-end gap-2">
                <button
                  className="change-password-btn"
                  onClick={() => navigate("/dr-omar/profile")}
                >
                  {t("cancel")}
                </button>
                <button type="submit" className="add-btn">
                  {t("update")}
                </button>
              </div>
            </form>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default EditProfile;
