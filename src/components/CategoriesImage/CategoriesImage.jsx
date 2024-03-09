import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { Col, Modal, ModalBody, ModalHeader, Row, Spinner } from "reactstrap";

import { MdAdd, MdDeleteOutline } from "react-icons/md";
import { FaEdit } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";

import {
  getPicturesCategoriesApi,
  addPictureCategoryApi,
  updatePictureCategoryApi,
  deletePictureCategoryApi,
  getPicturesCategories,
  addPictureCategory,
  updatePictureCategory,
  deletePictureCategory,
} from "../../store/slices/pictureSlice";

import { useFormik } from "formik";

import { object, string } from "yup";

import Swal from "sweetalert2";
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";
import useFiltration from "../../hooks/useFiltration";

const CategoriesImages = () => {
  const dispatch = useDispatch();
  const { pictureCategories, loading, error } = useSelector(
    (state) => state.picture
  );
  const [toggle, setToggle] = useState({
    add: false,
    edit: false,
    activeColumn: false,
    toggleColumns: {
      title: true,
      control: true,
    },
    sortColumn: "",
    sortOrder: "asc",
    rowsPerPage: 5,
    currentPage: 1,
  });

  // Filtration, Sorting, Pagination
  // Columns
  const columns = [
    { id: 0, name: "title", label: "التصنيف" },
    { id: 1, name: "control", label: "التحكم" },
  ];
  const {
    PaginationUI,
    handleSort,
    handleSearch,
    handleToggleColumns,
    results,
    rowData,
  } = useFiltration({
    rowData: pictureCategories,
    toggle,
    setToggle,
  });

  // Formik
  const formik = useFormik({
    initialValues: {
      title: "",
    },
    validationSchema: object().shape({
      title: string().required("يجب ادخال عنوان التصنيف"),
    }),
    onSubmit: (values) => {
      if (values.isEditing) {
        dispatch(
          updatePictureCategoryApi({ id: values.id, title: values.title })
        ).then((res) => {
          if (!res.error) {
            dispatch(updatePictureCategory(res.meta.arg));
            setToggle({
              ...toggle,
              edit: !toggle.edit,
            });
            formik.handleReset();
          }
        });
      } else {
        dispatch(addPictureCategoryApi(values)).then((res) => {
          if (!res.error) {
            dispatch(addPictureCategory(res.meta.arg));
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

  // Handle Edit Picture Category
  const handleEdit = (pictureCategory) => {
    formik.setValues({ ...pictureCategory, isEditing: true });
    setToggle({
      ...toggle,
      edit: !toggle.edit,
    });
  };

  // Delete Picture Category
  const handleDelete = (pictureCategory) => {
    Swal.fire({
      title: `هل انت متأكد من حذف ${pictureCategory?.title}؟`,
      text: "لن تتمكن من التراجع عن هذا الاجراء!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#0d1d34",
      confirmButtonText: "نعم, احذفه!",
      cancelButtonText: "الغاء",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deletePictureCategoryApi(pictureCategory?.id)).then((res) => {
          if (!res.error) {
            dispatch(deletePictureCategory(pictureCategory?.id));
            Swal.fire({
              title: `تم حذف ${pictureCategory?.title}`,
              text: `تم حذف ${pictureCategory?.title} بنجاح`,
              icon: "success",
              confirmButtonColor: "#0d1d34",
            });
          }
        });
      }
    });
  };

  // get data from api
  useEffect(() => {
    try {
      dispatch(getPicturesCategoriesApi()).then((res) => {
        if (!res.error) {
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
          إضافة تصنيف
        </button>
        {/* Add Picture Category */}
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
            إضافة تصنيف جديدة
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
                <Col lg={12} className="mb-5">
                  <div
                    className="form-group-container d-flex flex-column align-items-end mb-3"
                    style={{ marginTop: "-4px" }}
                  >
                    <label htmlFor="title" className="form-label">
                      عنوان التصنيف
                    </label>
                    <input
                      type="text"
                      className="form-input w-100"
                      id="title"
                      placeholder="عنوان التصنيف"
                      name="title"
                      value={formik.values.title}
                      onChange={formik.handleChange}
                    />
                    {formik.errors.title && formik.touched.title ? (
                      <span className="error">{formik.errors.title}</span>
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
              {toggle.toggleColumns.title && (
                <th className="table-th" onClick={() => handleSort(columns[0])}>
                  التصنيف
                  {toggle.sortColumn === columns[0].name ? (
                    toggle.sortOrder === "asc" ? (
                      <TiArrowSortedUp />
                    ) : (
                      <TiArrowSortedDown />
                    )
                  ) : null}
                </th>
              )}
              {toggle.toggleColumns.control && (
                <th className="table-th" onClick={() => handleSort(columns[1])}>
                  التحكم
                  {toggle.sortColumn === columns[1].name ? (
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
                <td className="table-td" colSpan="2">
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
          {rowData?.length === 0 && error === null && !loading && (
            <tbody>
              <tr className="no-data-container">
                <td className="table-td" colSpan="2">
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
                <td className="table-td" colSpan="2">
                  <p className="no-data no-columns mb-0">لا يوجد اعمدة</p>
                </td>
              </tr>
            </tbody>
          )}
          {/* Data */}
          {rowData?.length > 0 && error === null && loading === false && (
            <tbody>
              {rowData?.map((result) => (
                <tr key={result?.id + new Date().getDate()}>
                  {toggle.toggleColumns?.title && (
                    <td className="table-td name">{result?.title}</td>
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
              {/* Edit Picture Category */}
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
                      <Col lg={12} className="mb-5">
                        <div
                          className="form-group-container d-flex flex-column align-items-end mb-3"
                          style={{ marginTop: "-4px" }}
                        >
                          <label htmlFor="title" className="form-label">
                            عنوان التصنيف
                          </label>
                          <input
                            type="text"
                            className="form-input w-100"
                            id="title"
                            placeholder="عنوان التصنيف"
                            name="title"
                            value={formik.values?.title}
                            onChange={formik.handleChange}
                          />
                          {formik.errors.title && formik.touched.title ? (
                            <span className="error">{formik.errors.title}</span>
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
      {rowData.length > 0 && error === null && loading === false && (
        <PaginationUI />
      )}
    </div>
  );
};

export default CategoriesImages;
