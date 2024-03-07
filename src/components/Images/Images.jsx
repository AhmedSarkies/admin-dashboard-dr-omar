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
import anonymous from "../../assets/images/anonymous.png";
import { MdAdd, MdDeleteOutline } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";

import {
  getPicturesApi,
  addPictureApi,
  updatePictureApi,
  deletePictureApi,
  getPictures,
  addPicture,
  updatePicture,
  deletePicture,
  getPicturesCategoriesApi,
  getPicturesCategories,
} from "../../store/slices/pictureSlice";

import { useFormik } from "formik";

import { mixed, object, string } from "yup";

import Swal from "sweetalert2";
import { ImUpload } from "react-icons/im";
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";
import useFiltration from "../../hooks/useFiltration";

const Images = () => {
  const dispatch = useDispatch();
  const { pictures, pictureCategories, loading, error } = useSelector(
    (state) => state.picture
  );
  const [toggle, setToggle] = useState({
    add: false,
    edit: false,
    imagePreview: false,
    status: false,
    elders: false,
    pictureCategories: false,
    activeColumn: false,
    toggleColumns: {
      image: true,
      category: true,
      status: true,
      control: true,
    },
    sortColumn: "",
    sortOrder: "asc",
  });
  const cate = pictureCategories?.map((category) => category);

  // Filtration, Sorting, Pagination
  const {
    PaginationUI,
    handleSort,
    handleSearch,
    handleToggleColumns,
    results,
  } = useFiltration({
    rowData: pictures,
    toggle,
    setToggle,
  });
  // Columns
  const columns = [
    { id: 1, name: "image", label: "الصورة" },
    { id: 2, name: "category", label: "التصنيف" },
    { id: 3, name: "status", label: "الحالة" },
    { id: 4, name: "control", label: "التحكم" },
  ];

  // Formik
  const formik = useFormik({
    initialValues: {
      image: {
        file: "",
        preview: "",
      },
      status: "",
      pictureCategory: {
        title: "",
        id: "",
      },
    },
    validationSchema: object().shape({
      image: mixed().test("fileSize", "يجب اختيار صورة", (value) => {
        if (value.file) {
          return value.file.size <= 2097152;
        }
        if (typeof value === "string") {
          return true;
        }
      }),
    }),
    status: string(),
    pictureCategory: object().shape({
      title: string().required("يجب اختيار تصنيف"),
    }),
    onSubmit: (values) => {
      console.log(values);
      const formData = new FormData();
      formData.append("status", values.status);
      formData.append("id", values.id);
      if (values.image.file !== "") {
        formData.append("image", values.image.file);
      }
      if (values.id) {
        dispatch(
          updatePictureApi({
            id: values.id,
            category_id: values.pictureCategory.id,
            image: values.image.file,
            status: values.status,
          })
        ).then((res) => {
          if (!res.error) {
            dispatch(
              updatePicture({
                id: values.id,
                category_id: values.pictureCategory.id,
                image: values.image.file,
                status: values.status,
              })
            );
            setToggle({
              ...toggle,
              edit: !toggle.edit,
            });
            formik.handleReset();
          }
        });
      } else {
        dispatch(addPictureApi(formData)).then((res) => {
          if (!res.error) {
            dispatch(
              addPicture({
                ...values,
                image_categories_id: values.pictureCategory.id,
                image: values.image.preview,
              })
            );
            setToggle({
              ...toggle,
              add: !toggle.add,
            });
            formik.handleReset();
          }
        });
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

  // Handle Edit Picture
  const handleEdit = (picture) => {
    formik.setValues({
      ...picture,
      image: picture?.image,
      status: picture?.status,
      pictureCategory: {
        title: picture?.pictureCategory?.title,
        id: picture?.pictureCategory?.id,
      },
    });
    setToggle({
      ...toggle,
      edit: !toggle.edit,
    });
  };

  // Delete Picture
  const handleDelete = (picture) => {
    Swal.fire({
      title: `هل انت متأكد من حذف ${picture?.title}؟`,
      text: "لن تتمكن من التراجع عن هذا الاجراء!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "نعم, احذفه!",
      cancelButtonText: "الغاء",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deletePictureApi(picture?.id)).then((res) => {
          if (!res.error) {
            dispatch(deletePicture(picture?.id));
            Swal.fire({
              title: `تم حذف ${picture?.title}`,
              text: `تم حذف ${picture?.title} بنجاح`,
              icon: "success",
            });
          }
        });
      }
    });
  };

  // get data from api
  useEffect(() => {
    try {
      dispatch(getPicturesApi()).then((res) => {
        if (!res.error) {
          dispatch(getPictures(res.payload));
        }
      });
      dispatch(getPicturesCategoriesApi()).then((res) => {
        if (!res.error && res.payload.length > 0) {
          dispatch(getPicturesCategories(res.payload));
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
          إضافة صورة
        </button>
        {/* Add Picture */}
        <Modal
          isOpen={toggle.add}
          toggle={() => {
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
              setToggle({
                ...toggle,
                add: !toggle.add,
              });
              formik.handleReset();
            }}
            dir="rtl"
          >
            إضافة صورة جديدة
            <IoMdClose
              onClick={() => {
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
                              حذف
                            </button>
                          </div>
                        </ModalFooter>
                      </Modal>
                    </label>
                  </div>
                  <div className="form-group-container d-flex justify-content-lg-start justify-content-center flex-row-reverse">
                    <label htmlFor="image" className="form-label">
                      <ImUpload /> اختر صورة
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
                    <span className="error">{formik.errors.image}</span>
                  ) : null}
                </Col>
                <Col lg={7} className="mb-5">
                  <div className="form-group-container d-flex flex-column align-items-end mb-3">
                    <label htmlFor="pictureCategory" className="form-label">
                      التصنيف
                    </label>
                    <div
                      className={`dropdown form-input ${
                        toggle.pictureCategories ? "active" : ""
                      }`}
                    >
                      <div
                        onClick={() => {
                          setToggle({
                            ...toggle,
                            pictureCategories: !toggle.pictureCategories,
                          });
                        }}
                        className="dropdown-btn dropdown-btn-audio-category d-flex justify-content-between align-items-center"
                      >
                        {formik.values.pictureCategory?.title
                          ? formik.values.pictureCategory?.title
                          : "اختر التصنيف"}
                        <TiArrowSortedUp
                          className={`dropdown-icon ${
                            toggle.pictureCategories ? "active" : ""
                          }`}
                        />
                      </div>
                      <div
                        className={`dropdown-content ${
                          toggle.pictureCategories ? "active" : ""
                        }`}
                      >
                        {pictureCategories?.map((category) => (
                          <div
                            key={category.id}
                            className={`item ${
                              formik.values.pictureCategory.id === category.id
                                ? "active"
                                : ""
                            }`}
                            value={category.id}
                            name="pictureCategory"
                            onClick={() => {
                              setToggle({
                                ...toggle,
                                pictureCategories: !toggle.pictureCategories,
                              });
                              formik.setFieldValue("pictureCategory", {
                                title: category.title,
                                id: category.id,
                              });
                            }}
                          >
                            {category.title}
                          </div>
                        ))}
                      </div>
                    </div>
                    {formik.errors.pictureCategory?.title &&
                    formik.touched.pictureCategory?.title ? (
                      <span className="error">
                        {formik.errors.pictureCategory?.title}
                      </span>
                    ) : null}
                  </div>
                  <div className="form-group-container d-flex flex-column justify-content-center align-items-end mb-3">
                    <label htmlFor="status" className="form-label">
                      الحالة
                    </label>
                    <div
                      className={`dropdown form-input ${
                        toggle.status ? "active" : ""
                      }`}
                    >
                      <div
                        onClick={() => {
                          setToggle({
                            ...toggle,
                            status: !toggle.status,
                          });
                        }}
                        className="dropdown-btn d-flex justify-content-between align-items-center"
                      >
                        {formik.values.status === "Private"
                          ? "خاص"
                          : formik.values.status === "Public"
                          ? "عام"
                          : "الحالة"}
                        <TiArrowSortedUp
                          className={`dropdown-icon ${
                            toggle.status ? "active" : ""
                          }`}
                        />
                      </div>
                      <div
                        className={`dropdown-content ${
                          toggle.status ? "active" : ""
                        }`}
                      >
                        <div
                          className={`item ${
                            formik.values.status === "Private" ? "active" : ""
                          }`}
                          value="Private"
                          name="status"
                          onClick={() => {
                            setToggle({
                              ...toggle,
                              status: !toggle.status,
                            });
                            formik.setFieldValue("status", "Private");
                          }}
                        >
                          خاص
                        </div>
                        <div
                          className={`item ${
                            formik.values.status === "Public" ? "active" : ""
                          }`}
                          value="Public"
                          name="status"
                          onClick={() => {
                            setToggle({
                              ...toggle,
                              status: !toggle.status,
                            });
                            formik.setFieldValue("status", "Public");
                          }}
                        >
                          عام
                        </div>
                      </div>
                    </div>
                    {formik.errors.status && formik.touched.status ? (
                      <span className="error">{formik.errors.status}</span>
                    ) : null}
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
                        "إضافة"
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
                      الغاء
                    </button>
                  </div>
                </Col>
              </Row>
            </form>
          </ModalBody>
        </Modal>
        <h2>الصور</h2>
      </div>
      <div className="scholar">
        <div className="table-header">
          {/* Search */}
          <div className="search-container form-group-container form-input">
            <input
              type="text"
              className="form-input"
              placeholder="بحث"
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
              <span>الاعمدة</span>
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
                  الصورة
                  {toggle.sortColumn === columns[0].name ? (
                    toggle.sortOrder === "asc" ? (
                      <TiArrowSortedUp />
                    ) : (
                      <TiArrowSortedDown />
                    )
                  ) : null}
                </th>
              )}
              {toggle.toggleColumns.category && (
                <th className="table-th" onClick={() => handleSort(columns[1])}>
                  التصنيف
                  {toggle.sortColumn === columns[1].name ? (
                    toggle.sortOrder === "asc" ? (
                      <TiArrowSortedUp />
                    ) : (
                      <TiArrowSortedDown />
                    )
                  ) : null}
                </th>
              )}
              {toggle.toggleColumns.status && (
                <th className="table-th" onClick={() => handleSort(columns[2])}>
                  الحالة
                  {toggle.sortColumn === columns[2].name ? (
                    toggle.sortOrder === "asc" ? (
                      <TiArrowSortedUp />
                    ) : (
                      <TiArrowSortedDown />
                    )
                  ) : null}
                </th>
              )}
              {toggle.toggleColumns.control && (
                <th className="table-th" onClick={() => handleSort(columns[3])}>
                  التحكم
                  {toggle.sortColumn === columns[3].name ? (
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
                <td className="table-td" colSpan="4">
                  <p className="no-data mb-0">
                    {error === "Network Error"
                      ? "حدث خطأ في الشبكة"
                      : error === "Request failed with status code 404"
                      ? "لا يوجد بيانات"
                      : error === "Request failed with status code 500"
                      ? "حدث خطأ في الخادم"
                      : "حدث خطأ ما"}
                  </p>
                </td>
              </tr>
            </tbody>
          )}
          {/* Loading */}
          {loading && (
            <tbody>
              <tr className="no-data-container">
                <td className="table-td" colSpan="4">
                  <div className="no-data mb-0">
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
                </td>
              </tr>
            </tbody>
          )}
          {/* No Data */}
          {results?.length === 0 && error === null && !loading && (
            <tbody>
              <tr className="no-data-container">
                <td className="table-td" colSpan="4">
                  <p className="no-data mb-0">لا يوجد بيانات</p>
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
                <td className="table-td" colSpan="5">
                  <p className="no-data no-columns mb-0">لا يوجد اعمدة</p>
                </td>
              </tr>
            </tbody>
          )}
          {/* Data */}
          {results?.length > 0 && error === null && loading === false && (
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
                  {toggle.toggleColumns.category && (
                    <td className="table-td name">
                      {cate[result?.image_categories_id - 1]?.title}
                    </td>
                  )}
                  {toggle.toggleColumns.status && (
                    <td className="table-td">
                      <span
                        className="table-status badge"
                        style={{
                          backgroundColor:
                            result?.status === "Approve"
                              ? "green"
                              : result?.status === "Pending"
                              ? "red"
                              : "red",
                        }}
                      >
                        {result?.status === "Approve"
                          ? "مفعل"
                          : result?.status === "Pending"
                          ? "قيد الانتظار"
                          : "قيد الانتظار"}
                      </span>
                    </td>
                  )}
                  {toggle.toggleColumns.control && (
                    <td className="table-td">
                      <span className="table-btn-container">
                        <FaEdit
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
              {/* Edit Picture  */}
              <Modal
                isOpen={toggle.edit}
                toggle={() => {
                  setToggle({
                    ...toggle,
                    edit: !toggle.edit,
                  });
                  formik.handleReset();
                }}
                centered={true}
                keyboard={true}
                size={"md"}
                contentClassName="modal-add-scholar"
              >
                <ModalHeader
                  toggle={() => {
                    setToggle({
                      ...toggle,
                      edit: !toggle.edit,
                    });
                    formik.handleReset();
                  }}
                  dir="rtl"
                >
                  تعديل {formik.values?.title}
                  <IoMdClose
                    onClick={() => {
                      setToggle({
                        ...toggle,
                        edit: !toggle.edit,
                      });
                      formik.handleReset();
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
                        <Col
                          lg={12}
                          className="d-flex flex-column justify-content-center align-items-center"
                        >
                          <div className="image-preview-container d-flex justify-content-center align-items-center">
                            <label
                              htmlFor={
                                formik.values.image.file === undefined
                                  ? ""
                                  : formik.values.image.file === ""
                                  ? "image"
                                  : ""
                              }
                              className="form-label d-flex justify-content-center align-items-center"
                            >
                              <img
                                src={
                                  formik.values?.image?.preview
                                    ? formik.values.image?.preview
                                    : formik.values.image?.preview === undefined
                                    ? formik.values.image
                                    : anonymous
                                }
                                alt="avatar"
                                className="image-preview"
                                style={{
                                  width: "90px",
                                  height: "90px",
                                  objectFit: "cover",
                                }}
                                onClick={() =>
                                  formik.values.image.file
                                    ? setToggle({
                                        ...toggle,
                                        imagePreview: !toggle.imagePreview,
                                      })
                                    : formik.values.image.file === ""
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
                                      formik.values?.image
                                        ? formik.values.image?.preview
                                          ? formik.values.image?.preview
                                          : formik.values.image
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
                              <ImUpload /> اختر صورة
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
                            <span className="error">{formik.errors.image}</span>
                          ) : null}
                        </Col>
                        {formik.errors.image && formik.touched.image ? (
                          <span className="error">{formik.errors.image}</span>
                        ) : null}
                      </Col>
                      <Col lg={7} className="mb-5">
                        <div className="form-group-container d-flex flex-column align-items-end mb-3">
                          <label
                            htmlFor="pictureCategory"
                            className="form-label"
                          >
                            التصنيف
                          </label>
                          <div
                            className={`dropdown form-input ${
                              toggle.pictureCategories ? "active" : ""
                            }`}
                          >
                            <div
                              onClick={() => {
                                setToggle({
                                  ...toggle,
                                  pictureCategories: !toggle.pictureCategories,
                                });
                              }}
                              className="dropdown-btn dropdown-btn-audio-category d-flex justify-content-between align-items-center"
                            >
                              {formik.values.pictureCategory?.title
                                ? formik.values.pictureCategory?.title
                                : "اختر التصنيف"}
                              <TiArrowSortedUp
                                className={`dropdown-icon ${
                                  toggle.pictureCategories ? "active" : ""
                                }`}
                              />
                            </div>
                            <div
                              className={`dropdown-content ${
                                toggle.pictureCategories ? "active" : ""
                              }`}
                            >
                              {pictureCategories?.map((category) => (
                                <div
                                  key={category.id}
                                  className={`item ${
                                    formik.values.pictureCategory.id ===
                                    category.id
                                      ? "active"
                                      : ""
                                  }`}
                                  value={category.id}
                                  name="pictureCategory"
                                  onClick={() => {
                                    setToggle({
                                      ...toggle,
                                      pictureCategories:
                                        !toggle.pictureCategories,
                                    });
                                    formik.setFieldValue("pictureCategory", {
                                      title: category.title,
                                      id: category.id,
                                    });
                                  }}
                                >
                                  {category.title}
                                </div>
                              ))}
                            </div>
                          </div>
                          {formik.errors.pictureCategory?.title &&
                          formik.touched.pictureCategory?.title ? (
                            <span className="error">
                              {formik.errors.pictureCategory?.title}
                            </span>
                          ) : null}
                        </div>
                        <div className="form-group-container d-flex flex-column justify-content-center align-items-end mb-3">
                          <label htmlFor="status" className="form-label">
                            الحالة
                          </label>
                          <div
                            className={`dropdown form-input ${
                              toggle.status ? "active" : ""
                            }`}
                          >
                            <div
                              onClick={() => {
                                setToggle({
                                  ...toggle,
                                  status: !toggle.status,
                                });
                              }}
                              className="dropdown-btn d-flex justify-content-between align-items-center"
                            >
                              {formik.values.status === "Private"
                                ? "خاص"
                                : formik.values.status === "Public"
                                ? "عام"
                                : "الحالة"}
                              <TiArrowSortedUp
                                className={`dropdown-icon ${
                                  toggle.status ? "active" : ""
                                }`}
                              />
                            </div>
                            <div
                              className={`dropdown-content ${
                                toggle.status ? "active" : ""
                              }`}
                            >
                              <div
                                className={`item ${
                                  formik.values.status === "Private"
                                    ? "active"
                                    : ""
                                }`}
                                value="Private"
                                name="status"
                                onClick={() => {
                                  setToggle({
                                    ...toggle,
                                    status: !toggle.status,
                                  });
                                  formik.setFieldValue("status", "Private");
                                }}
                              >
                                خاص
                              </div>
                              <div
                                className={`item ${
                                  formik.values.status === "Public"
                                    ? "active"
                                    : ""
                                }`}
                                value="Public"
                                name="status"
                                onClick={() => {
                                  setToggle({
                                    ...toggle,
                                    status: !toggle.status,
                                  });
                                  formik.setFieldValue("status", "Public");
                                }}
                              >
                                عام
                              </div>
                            </div>
                          </div>
                          {formik.errors.status && formik.touched.status ? (
                            <span className="error">
                              {formik.errors.status}
                            </span>
                          ) : null}
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
                              "حفظ"
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
                            الغاء
                          </button>
                        </div>
                      </Col>
                    </Row>
                  </form>
                </ModalBody>
              </Modal>
            </tbody>
          )}
        </table>
      </div>
      {/* Pagination */}
      {results.length > 0 && error === null && loading === false && (
        <PaginationUI />
      )}
    </div>
  );
};

export default Images;
