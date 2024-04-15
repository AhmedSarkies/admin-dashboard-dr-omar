import React, { useEffect, useState } from "react";
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
  Spinner,
} from "reactstrap";
import { object, string } from "yup";

import anonymous from "../../assets/images/anonymous.png";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getSubAdmins, updateSubAdmin } from "../../store/slices/subAdminSlice";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

const EditProfile = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const dispatch = useDispatch();
  const { subAdmins, loading } = useSelector((state) => state.subAdmin);
  const [toggle, setToggle] = useState({});
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      image: {
        file: "",
        preview: "",
      },
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
      if (values.image.file === "") {
        dispatch(
          updateSubAdmin({
            id: parseInt(id),
            name: values.name,
            email: values.email,
            phone: values.phone,
            active: Cookies.get("_active"),
            powers: Cookies.get("_role"),
          })
        ).then((res) => {
          if (res.meta.requestStatus === "fulfilled") {
            formik.resetForm();
            toast.success(t("toast.profile.updatedSuccess"));
            navigate("/dr-omar/profile");
          } else {
            toast.error(t("toast.profile.updatedError"));
          }
        });
      } else {
        dispatch(
          updateSubAdmin({
            id: parseInt(id),
            active: Cookies.get("_active"),
            powers: Cookies.get("_role"),
            image: values.image.file,
            name: values.name,
            email: values.email,
            phone: values.phone,
          })
        ).then((res) => {
          if (res.meta.requestStatus === "fulfilled") {
            formik.resetForm();
            toast.success(t("toast.profile.updatedSuccess"));
            navigate("/dr-omar/profile");
          } else {
            toast.error(t("toast.profile.updatedError"));
          }
        });
      }
    },
  });

  const handleInputChange = (e) => {
    formik.handleChange(e);
  };

  // Handle Image Change
  const handleImageChange = (e) => {
    try {
      const file = e.currentTarget.files[0];
      if (file) {
        formik.setFieldValue("image", {
          file: file,
          preview: URL.createObjectURL(file),
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    try {
      dispatch(getSubAdmins());
    } catch (error) {
      console.log(error);
    }
  }, [dispatch]);

  useEffect(() => {
    if (id === undefined) return;
    if (subAdmins.length === 0) return;
    // Get Data By ID Using Filter Method
    if (id) {
      const data = subAdmins.filter((subAdmin) => subAdmin.id === parseInt(id));
      formik.setValues({
        name: data[0].name,
        email: data[0].email,
        phone: data[0].phone,
        image: {
          file: "",
          preview: data[0].image,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subAdmins]);

  return (
    <div className="profile-container">
      {loading ? (
        <div className="no-data mb-0 text-center mt-5">
          <Spinner
            color="primary"
            style={{
              height: "3rem",
              width: "3rem",
            }}
          >
            Loading...
          </Spinner>
        </div>
      ) : (
        <Row className="justify-content-center">
          <Col>
            <div className="profile">
              <form
                className="d-flex justify-content-center align-items-center flex-column gap-3 w-100"
                onSubmit={formik.handleSubmit}
              >
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
                    value={formik.values.name}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="name" className="label-form">
                    {t("profile.name")}
                  </label>
                </div>
                <div className="error-container">
                  {formik.touched.name && formik.errors.name ? (
                    <span className="error">{formik.errors.name}</span>
                  ) : null}
                </div>
                <div className="form-group">
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    placeholder={t("profile.email")}
                    name="email"
                    value={formik.values.email}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="email" className="label-form">
                    {t("profile.email")}
                  </label>
                </div>
                <div className="error-container">
                  {formik.touched.email && formik.errors.email ? (
                    <span className="error">{formik.errors.email}</span>
                  ) : null}
                </div>
                <div className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    id="phone"
                    placeholder={t("profile.phone")}
                    name="phone"
                    value={formik.values.phone}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="phone" className="label-form">
                    {t("profile.phone")}
                  </label>
                </div>
                <div className="error-container">
                  {formik.touched.phone && formik.errors.phone ? (
                    <span className="error">{formik.errors.phone}</span>
                  ) : null}
                </div>
                <div className="form-group d-flex justify-content-end gap-2">
                  <button
                    type="button"
                    className="change-password-btn"
                    onClick={() => navigate("/dr-omar/profile")}
                  >
                    {t("cancel")}
                  </button>
                  <button type="submit" className="add-btn">
                    {loading ? (
                      <Spinner
                        color="primary"
                        style={{
                          height: "1rem",
                          width: "1rem",
                        }}
                      >
                        Loading...
                      </Spinner>
                    ) : (
                      t("update")
                    )}
                  </button>
                </div>
              </form>
            </div>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default EditProfile;
