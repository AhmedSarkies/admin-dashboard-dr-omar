import React, { useState, useEffect } from "react";

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
import { FaEdit, FaFileUpload } from "react-icons/fa";
import { ImUpload } from "react-icons/im";

import anonymous from "../../assets/images/anonymous.png";
import { useFormik } from "formik";
import { IoMdClose } from "react-icons/io";
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";
import { mixed, object, string } from "yup";

import {
  getAudiosApi,
  getAudios,
  getAudiosCategoriesApi,
  getAudiosCategories,
  addAudioApi,
  updateAudioApi,
  deleteAudioApi,
} from "../../store/slices/audioSlice";

import {
  getApprovedScholarsApi,
  getApprovedScholars,
} from "../../store/slices/scholarSlice";
import useFiltration from "../../hooks/useFiltration";
import Swal from "sweetalert2";

const validationSchema = object().shape({
  title: string().required("يجب اختيار عنوان الصوتية"),
  status: string(),
  image: mixed().test("fileSize", "يجب اختيار صورة", (value) => {
    if (value.file) {
      return value.file.size <= 2097152;
    }
    if (typeof value === "string") {
      return true;
    }
  }),
  audio: mixed().test("fileSize", "يجب اختيار صوتية", (value) => {
    if (value.file) {
      return value.file.size > 0;
    }
    if (typeof value === "string") {
      return true;
    }
  }),
  elder: object().shape({
    name: string().required("يجب اختيار العالم"),
  }),
  audioCategory: object().shape({
    title: string().required("يجب اختيار تصنيف"),
  }),
});

const initialValues = {
  title: "",
  image: {
    file: "",
    preview: "",
  },
  audio: {
    file: "",
    preview: "",
  },
  status: "",
  elder: {
    name: "",
    id: "",
  },
  audioCategory: {
    title: "",
    id: "",
  },
};

const Audios = () => {
  const dispatch = useDispatch();
  const { audios, audioCategories, loading, error } = useSelector(
    (state) => state.audio
  );
  const { approvedScholars } = useSelector((state) => state.scholar);
  const [toggle, setToggle] = useState({
    add: false,
    edit: false,
    imagePreview: false,
    readMore: false,
    status: false,
    elders: false,
    audioCategories: false,
    duration: "00:00",
    activeColumn: false,
    toggleColumns: {
      imageElder: true,
      nameElder: true,
      image: true,
      title: true,
      audio: true,
      status: true,
      control: true,
    },
    sortColumn: "",
    sortOrder: "asc",
    rowsPerPage: 5,
    currentPage: 1,
  });

  // Filtration, Sorting, Pagination
  const {
    PaginationUI,
    handleSort,
    handleSearch,
    handleToggleColumns,
    results,
  } = useFiltration({
    rowData: audios,
    toggle,
    setToggle,
  });

  // Columns
  const columns = [
    { id: 1, name: "imageElder", label: "صوؤة العالم" },
    { id: 2, name: "nameElder", label: "اسم العالم" },
    { id: 3, name: "image", label: "صورة الصوتية" },
    { id: 4, name: "title", label: "عنوان الصوتية" },
    { id: 5, name: "audio", label: "الصوتية" },
    { id: 6, name: "status", label: "الحالة" },
    { id: 7, name: "control", label: "الإجراءات" },
  ];

  // const [keyword, setKeyword] = useState([]);
  // // Handle Add Keyword
  // const handleAddKeyword = (e) => {
  //   if (e.key === "Enter" && e.target.value !== "") {
  //     e.preventDefault();
  //     const newKeyword = e.target.value.replace(/\s+/g, " ");
  //     setKeyword(newKeyword);
  //     setEditKeyword(newKeyword);
  //     e.target.value = "";
  //     if (newKeyword !== "" && !keyword.includes(newKeyword)) {
  //       setKeyword([
  //         ...keyword,
  //         {
  //           id: keyword.length + Date.now(),
  //           keyword: newKeyword,
  //         },
  //       ]);
  //       setEditKeyword([
  //         ...keyword,
  //         {
  //           id: keyword.length + Date.now(),
  //           keyword: newKeyword,
  //         },
  //       ]);
  //     }
  //   }
  // };

  // // Handle Remove Keyword
  // const handleRemoveKeyword = (id) => {
  //   setKeyword(keyword.filter((item) => item.id !== id));
  // };

  // Formik
  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("status", values.status);
      formData.append("audio", values.audio.file);
      formData.append("elder_id", values.elder.id);
      formData.append("Audio_category", values.audioCategory.id);
      if (values.image.file !== "") {
        formData.append("image", values.image.file);
      }
      if (values.audio.file !== "") {
        formData.append("audio", values.audio.file);
      }
      if (values.isEditing) {
        // Update Audio
        dispatch(updateAudioApi(formData)).then((res) => {
          if (!res.error) {
            dispatch(getAudiosApi());
            setToggle({
              ...toggle,
              edit: !toggle.edit,
            });
            formik.handleReset();
          }
        });
      } else {
        // Add Audio
        dispatch(addAudioApi(formData)).then((res) => {
          if (!res.error) {
            dispatch(getAudiosApi());
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

  const handleDurationAudio = (e) => {
    e.preventDefault();
    try {
      const file = e.target.files[0];
      if (file) {
        formik.setFieldValue("audio", {
          file: file,
          preview: URL.createObjectURL(file),
        });
        // Use the Web Audio API to get audio file duration
        const audioContext = new (window.AudioContext ||
          window.webkitAudioContext)();
        const fileReader = new FileReader();
        fileReader.onload = function (e) {
          const arrayBuffer = e.target.result;
          audioContext.decodeAudioData(arrayBuffer, function (buffer) {
            const durationInSeconds = buffer.duration;
            // Convert seconds to minutes oh hours using date-time library
            const hours = Math.floor(durationInSeconds / 3600);
            const minutes = Math.floor((durationInSeconds - hours * 3600) / 60);
            const seconds = Math.floor(
              durationInSeconds - hours * 3600 - minutes * 60
            );
            setToggle({
              ...toggle,
              duration: `
              ${hours < 10 ? `0${hours}` : hours}:${
                minutes < 10 ? `0${minutes}` : minutes
              }:${seconds < 10 ? `0${seconds}` : seconds}`,
            });
          });
        };
      }
    } catch (error) {
      console.log(error);
    }
  };

  // handle Input Using Formik
  const handleInput = (e) => {
    formik.handleChange(e);
  };

  // handle Edit
  const handleEdit = (audio) => {
    formik.handleReset();
    formik.setValues({
      ...audio,
      elder: {
        name: audio.elder?.name,
      },
      audioCategory: {
        title: audio.audioCategory?.title,
      },
      isEditing: true,
    });
    setToggle({
      ...toggle,
      edit: !toggle.edit,
    });
  };

  // Delete Audio
  const handleDelete = (audio) => {
    Swal.fire({
      title: `هل انت متأكد من حذف ${audio?.title}؟`,
      text: "لن تتمكن من التراجع عن هذا الاجراء!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#0d1d34",
      confirmButtonText: "نعم, احذفه!",
      cancelButtonText: "الغاء",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteAudioApi(audio.id)).then((res) => {
          if (!res.error) {
            dispatch(getAudiosApi());
          }
        });
        Swal.fire({
          title: `تم حذف ${audio?.title}`,
          text: `تم حذف ${audio?.title} بنجاح`,
          icon: "success",
          confirmButtonColor: "#0d1d34",
        });
      }
    });
  };

  // get data from api

  useEffect(() => {
    try {
      dispatch(getAudiosApi()).then((res) => {
        if (!res.error) {
          dispatch(getAudios(res.payload));
        }
      });
      dispatch(getAudiosCategoriesApi()).then((res) => {
        if (!res.error && res.payload.length > 0) {
          dispatch(getAudiosCategories(res.payload));
        }
      });
      dispatch(getApprovedScholarsApi()).then((res) => {
        if (!res.error && res.payload.length > 0) {
          dispatch(getApprovedScholars(res.payload));
        }
      });
    } catch (error) {
      console.log(error);
    }
  }, [dispatch]);

  return (
    <div className="audio-container scholar-container mt-4 m-3">
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
          إضافة صوتية
        </button>
        {/* Add Audio */}
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
          contentClassName="modal-add-audio modal-add-scholar"
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
            إضافة صوتية جديدة
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
                  <Col
                    lg={12}
                    className="d-flex flex-column justify-content-center align-items-center"
                  >
                    <div className="image-preview-container d-flex justify-content-center align-items-center">
                      <label
                        htmlFor={formik.values.image?.preview ? "" : "image"}
                        className="form-label d-flex justify-content-center align-items-center"
                      >
                        <img
                          src={
                            formik.values?.image && formik.values.image?.preview
                              ? formik.values.image?.preview
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
                            formik.values?.image && formik.values.image?.preview
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
                                formik.values?.image &&
                                formik.values?.image?.preview
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
                        <ImUpload /> اختر صورة الصوتية
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
                      <span className="error text-center">
                        {formik.errors.image}
                      </span>
                    ) : null}
                  </Col>
                  <Col
                    lg={12}
                    className="d-flex flex-column justify-content-center align-items-center mt-4"
                  >
                    <div className="form-group-container d-flex flex-column align-items-end mb-3">
                      <label
                        htmlFor={
                          formik.values.audio?.file !== "" &&
                          formik.values.audio?.preview !== ""
                            ? ""
                            : "audio"
                        }
                        className="form-label mt-4"
                      >
                        <audio controls src={formik.values.audio?.preview} />
                      </label>
                    </div>
                    <div className="form-group-container d-flex justify-content-lg-start justify-content-center flex-row-reverse">
                      <label htmlFor="audio" className="form-label">
                        <FaFileUpload /> اختر الصوتية
                      </label>
                      <input
                        type="file"
                        accept="audio/*"
                        className="form-input form-img-input"
                        id="audio"
                        onChange={handleDurationAudio}
                      />
                    </div>
                    {formik.errors.audio && formik.touched.audio ? (
                      <span className="error">{formik.errors.audio}</span>
                    ) : null}
                  </Col>
                </Col>
                <Col lg={7} className="mb-5">
                  <div className="form-group-container d-flex flex-column align-items-end mb-3">
                    <label htmlFor="title" className="form-label">
                      عنوان الصوتية
                    </label>
                    <input
                      type="text"
                      className="form-input"
                      id="title"
                      placeholder="عنوان الصوتية"
                      name="title"
                      value={formik.values.title}
                      onChange={handleInput}
                    />
                    {formik.errors.title && formik.touched.title ? (
                      <span className="error">{formik.errors.title}</span>
                    ) : null}
                  </div>
                  <div className="form-group-container d-flex flex-column align-items-end mb-3">
                    <label htmlFor="audioCategory" className="form-label">
                      التصنيف
                    </label>
                    <div
                      className={`dropdown form-input ${
                        toggle.audioCategory ? "active" : ""
                      }`}
                    >
                      <div
                        onClick={() => {
                          setToggle({
                            ...toggle,
                            audioCategory: !toggle.audioCategory,
                          });
                        }}
                        className="dropdown-btn dropdown-btn-audio-category d-flex justify-content-between align-items-center"
                      >
                        {formik.values.audioCategory?.title
                          ? formik.values.audioCategory?.title
                          : "اختر التصنيف"}
                        <TiArrowSortedUp
                          className={`dropdown-icon ${
                            toggle.audioCategory ? "active" : ""
                          }`}
                        />
                      </div>
                      <div
                        className={`dropdown-content ${
                          toggle.audioCategory ? "active" : ""
                        }`}
                      >
                        {audioCategories?.map((category) => (
                          <div
                            key={category?.id}
                            className={`item ${
                              formik.values.audioCategory?.id === category?.id
                                ? "active"
                                : ""
                            }`}
                            value={category?.id}
                            name="audioCategory"
                            onClick={() => {
                              setToggle({
                                ...toggle,
                                audioCategory: !toggle.audioCategory,
                              });
                              formik.setFieldValue("audioCategory", {
                                title: category.title,
                                id: category?.id,
                              });
                            }}
                          >
                            {category.title}
                          </div>
                        ))}
                      </div>
                    </div>
                    {formik.errors.audioCategory?.title &&
                    formik.touched.audioCategory?.title ? (
                      <span className="error">
                        {formik.errors.audioCategory?.title}
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
                              status: false,
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
                              status: false,
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
                  <div className="form-group-container d-flex flex-column justify-content-center align-items-end">
                    <label htmlFor="elder" className="form-label">
                      العالم
                    </label>
                    <div
                      className={`dropdown form-input ${
                        toggle.elders ? "active" : ""
                      }`}
                    >
                      <div
                        onClick={() => {
                          setToggle({
                            ...toggle,
                            elders: !toggle.elders,
                          });
                        }}
                        className="dropdown-btn dropdown-btn-elder d-flex justify-content-between align-items-center"
                      >
                        {formik.values.elder?.name
                          ? formik.values.elder?.name
                          : "اختر عالم"}
                        <TiArrowSortedUp
                          className={`dropdown-icon ${
                            toggle.elders ? "active" : ""
                          }`}
                        />
                      </div>
                      <div
                        className={`dropdown-content ${
                          toggle.elders ? "active" : ""
                        }`}
                      >
                        {approvedScholars?.map((scholar) => (
                          <div
                            key={scholar?.id}
                            className={`item ${
                              formik.values.elder?.id === scholar?.id
                                ? "active"
                                : ""
                            }`}
                            value={scholar?.id}
                            name="elder"
                            onClick={() => {
                              setToggle({
                                ...toggle,
                                elders: !toggle.elders,
                              });
                              formik.setFieldValue("elder", {
                                name: scholar?.name,
                                id: scholar?.id,
                              });
                            }}
                          >
                            {scholar?.name}
                          </div>
                        ))}
                      </div>
                    </div>
                    {formik.errors.elder?.name && formik.touched.elder?.name ? (
                      <span className="error">{formik.errors.elder?.name}</span>
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
      <div className="audio scholar">
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
              {toggle.toggleColumns.imageElder && (
                <th className="table-th" onClick={() => handleSort(columns[0])}>
                  صورة العالم
                  {toggle.sortColumn === columns[0].name ? (
                    toggle.sortOrder === "asc" ? (
                      <TiArrowSortedUp />
                    ) : (
                      <TiArrowSortedDown />
                    )
                  ) : null}
                </th>
              )}
              {toggle.toggleColumns.nameElder && (
                <th className="table-th" onClick={() => handleSort(columns[1])}>
                  اسم العالم
                  {toggle.sortColumn === columns[1].name ? (
                    toggle.sortOrder === "asc" ? (
                      <TiArrowSortedUp />
                    ) : (
                      <TiArrowSortedDown />
                    )
                  ) : null}
                </th>
              )}
              {toggle.toggleColumns.image && (
                <th className="table-th" onClick={() => handleSort(columns[2])}>
                  صورة الصوتية
                  {toggle.sortColumn === columns[2].name ? (
                    toggle.sortOrder === "asc" ? (
                      <TiArrowSortedUp />
                    ) : (
                      <TiArrowSortedDown />
                    )
                  ) : null}
                </th>
              )}
              {toggle.toggleColumns.title && (
                <th className="table-th" onClick={() => handleSort(columns[3])}>
                  عنوان الصوتية
                  {toggle.sortColumn === columns[3].name ? (
                    toggle.sortOrder === "asc" ? (
                      <TiArrowSortedUp />
                    ) : (
                      <TiArrowSortedDown />
                    )
                  ) : null}
                </th>
              )}
              {toggle.toggleColumns.audio && (
                <th className="table-th" onClick={() => handleSort(columns[4])}>
                  الصوتية
                  {toggle.sortColumn === columns[4].name ? (
                    toggle.sortOrder === "asc" ? (
                      <TiArrowSortedUp />
                    ) : (
                      <TiArrowSortedDown />
                    )
                  ) : null}
                </th>
              )}
              {toggle.toggleColumns.status && (
                <th className="table-th" onClick={() => handleSort(columns[5])}>
                  الحالة
                  {toggle.sortColumn === columns[5].name ? (
                    toggle.sortOrder === "asc" ? (
                      <TiArrowSortedUp />
                    ) : (
                      <TiArrowSortedDown />
                    )
                  ) : null}
                </th>
              )}
              {toggle.toggleColumns.control && (
                <th className="table-th" onClick={() => handleSort(columns[6])}>
                  الإجراءات
                  {toggle.sortColumn === columns[6].name ? (
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
                <td className="table-td" colSpan="7">
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
                <td className="table-td" colSpan="7">
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
                <td className="table-td" colSpan="7">
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
                  {toggle.toggleColumns.imageElder && (
                    <td className="table-td">
                      <img
                        src={result?.elder?.image}
                        alt={result?.elder || "avatar"}
                        className="table-avatar"
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "cover",
                        }}
                      />
                    </td>
                  )}
                  {toggle.toggleColumns.nameElder && (
                    <td className="table-td name">{result?.elder?.name}</td>
                  )}
                  {toggle.toggleColumns.image && (
                    <td className="table-td">
                      <img
                        src={result?.image}
                        alt={result?.image?.name || "avatar"}
                        className="table-avatar"
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "cover",
                        }}
                      />
                    </td>
                  )}
                  {toggle.toggleColumns.title && (
                    <td className="table-td">{result?.title}</td>
                  )}
                  {toggle.toggleColumns.audio && (
                    <td className="table-td">
                      <audio
                        controls
                        src={result?.audio}
                        style={{ width: "250px" }}
                      />
                    </td>
                  )}
                  {toggle.toggleColumns.status && (
                    <td className="table-td">
                      <span
                        className="table-status badge"
                        style={{
                          backgroundColor:
                            result?.status === "public"
                              ? "green"
                              : result?.status === "private"
                              ? "red"
                              : "red",
                        }}
                      >
                        {result?.status === "public"
                          ? "عام"
                          : result?.status === "private"
                          ? "خاص"
                          : "خاص"}
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
              {/* Edit audio */}
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
                contentClassName="modal-add-scholar modal-add-scholar"
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
                              <ImUpload /> اختر صورة الصوتية
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
                            <span className="error text-center">
                              {formik.errors.image}
                            </span>
                          ) : null}
                        </Col>
                        <Col
                          lg={12}
                          className="d-flex flex-column justify-content-center align-items-center mt-4"
                        >
                          <div className="form-group-container d-flex flex-column align-items-end mb-3">
                            <label
                              htmlFor={
                                formik.values.audio?.file !== "" &&
                                formik.values.audio?.preview !== ""
                                  ? ""
                                  : "audio"
                              }
                              className="form-label mt-4"
                            >
                              <audio
                                controls
                                src={
                                  formik.values.audio?.preview
                                    ? formik.values.audio?.preview
                                    : formik.values.audio
                                }
                              />
                            </label>
                          </div>
                          <div className="form-group-container d-flex justify-content-lg-start justify-content-center flex-row-reverse">
                            <label htmlFor="audio" className="form-label">
                              <FaFileUpload /> اختر الصوتية
                            </label>
                            <input
                              type="file"
                              accept="audio/*"
                              className="form-input form-img-input"
                              id="audio"
                              onChange={handleDurationAudio}
                            />
                          </div>
                          {formik.errors.audio && formik.touched.audio ? (
                            <span className="error">{formik.errors.audio}</span>
                          ) : null}
                        </Col>
                      </Col>
                      <Col lg={7} className="mb-5">
                        <div className="form-group-container d-flex flex-column align-items-end mb-3">
                          <label htmlFor="title" className="form-label">
                            عنوان الصوتية
                          </label>
                          <input
                            type="text"
                            className="form-input"
                            id="title"
                            placeholder="عنوان الصوتية"
                            name="title"
                            value={formik.values?.title}
                            onChange={handleInput}
                          />
                          {formik.errors?.title && formik.touched?.title ? (
                            <span className="error">
                              {formik.errors?.title}
                            </span>
                          ) : null}
                        </div>
                        <div className="form-group-container d-flex flex-column align-items-end mb-3">
                          <label htmlFor="audioCategory" className="form-label">
                            التصنيف
                          </label>
                          <div
                            className={`dropdown form-input ${
                              toggle.audioCategory ? "active" : ""
                            }`}
                          >
                            <button
                              type="button"
                              onClick={() => {
                                setToggle({
                                  ...toggle,
                                  audioCategory: !toggle.audioCategory,
                                });
                              }}
                              className="dropdown-btn dropdown-btn-audio-category d-flex justify-content-between align-items-center"
                            >
                              {formik.values.audioCategory?.title
                                ? formik.values.audioCategory?.title
                                : "اختر التصنيف"}
                              <TiArrowSortedUp
                                className={`dropdown-icon ${
                                  toggle.audioCategory ? "active" : ""
                                }`}
                              />
                            </button>
                            <div
                              className={`dropdown-content ${
                                toggle.audioCategory ? "active" : ""
                              }`}
                            >
                              {audioCategories?.map((category) => (
                                <button
                                  type="button"
                                  key={category?.id}
                                  className={`item ${
                                    formik.values.audioCategory?.id ===
                                    category?.id
                                      ? "active"
                                      : ""
                                  }`}
                                  value={category?.id}
                                  name="audioCategory"
                                  onClick={() => {
                                    setToggle({
                                      ...toggle,
                                      audioCategory: !toggle.audioCategory,
                                    });
                                    formik.setFieldValue("audioCategory", {
                                      title: category?.title,
                                      id: category?.id,
                                    });
                                  }}
                                >
                                  {category?.title}
                                </button>
                              ))}
                            </div>
                          </div>
                          {formik.errors.audioCategory?.title &&
                          formik.touched.audioCategory?.title ? (
                            <span className="error">
                              {formik.errors.audioCategory?.title}
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
                              {formik.values.status === "Private" ||
                              formik.values.status === "private"
                                ? "خاص"
                                : formik.values.status === "Public" ||
                                  formik.values.status === "public"
                                ? "عام"
                                : "الحالة"}
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
                                  formik.values.status === "Private" ||
                                  formik.values.status === "private"
                                    ? "active"
                                    : ""
                                }`}
                                value="Private"
                                name="status"
                                onClick={() => {
                                  setToggle({
                                    ...toggle,
                                    status: false,
                                  });
                                  formik.setFieldValue("status", "Private");
                                }}
                              >
                                خاص
                              </button>
                              <button
                                type="button"
                                className={`item ${
                                  formik.values.status === "Public" ||
                                  formik.values.status === "public"
                                    ? "active"
                                    : ""
                                }`}
                                value="Public"
                                name="status"
                                onClick={() => {
                                  setToggle({
                                    ...toggle,
                                    status: false,
                                  });
                                  formik.setFieldValue("status", "Public");
                                }}
                              >
                                عام
                              </button>
                            </div>
                          </div>
                          {formik.errors.status && formik.touched.status ? (
                            <span className="error">
                              {formik.errors.status}
                            </span>
                          ) : null}
                        </div>
                        <div className="form-group-container d-flex flex-column justify-content-center align-items-end">
                          <label htmlFor="elder" className="form-label">
                            العالم
                          </label>
                          <div
                            className={`dropdown form-input ${
                              toggle.elders ? "active" : ""
                            }`}
                          >
                            <button
                              type="button"
                              onClick={() => {
                                setToggle({
                                  ...toggle,
                                  elders: !toggle.elders,
                                });
                              }}
                              className="dropdown-btn dropdown-btn-elder d-flex justify-content-between align-items-center"
                            >
                              {formik.values.elder?.name
                                ? formik.values.elder?.name
                                : "اختر العالم"}
                              <TiArrowSortedUp
                                className={`dropdown-icon ${
                                  toggle.elders ? "active" : ""
                                }`}
                              />
                            </button>
                            <div
                              className={`dropdown-content ${
                                toggle.elders ? "active" : ""
                              }`}
                            >
                              {approvedScholars?.map((scholar) => (
                                <button
                                  type="button"
                                  key={scholar?.id}
                                  className={`item ${
                                    formik.values.elder?.name === scholar?.name
                                      ? "active"
                                      : ""
                                  }`}
                                  value={scholar?.id}
                                  name="elder"
                                  onClick={() => {
                                    setToggle({
                                      ...toggle,
                                      elders: !toggle.elders,
                                    });
                                    formik.setFieldValue("elder", {
                                      name: scholar?.name,
                                      id: scholar?.id,
                                    });
                                  }}
                                >
                                  {scholar?.name}
                                </button>
                              ))}
                            </div>
                          </div>
                          {formik.errors.elder && formik.touched.elder ? (
                            <span className="error">{formik.errors.elder}</span>
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

  // return (
  //   <section className="audios-container">
  //     {/* Add Audio */}
  //     <Overlay>
  //       <div className="overlay-header mb-4">
  //         <h3 className="overlay-title text-center">اضافة صوتية</h3>
  //       </div>
  //       <form className="overlay-form" onSubmit={handleSubmit}>
  //         <Row className="justify-content-center">
  //           <Col
  //             lg={4}
  //             className="d-flex justify-content-center align-items-center"
  //           >
  //             <div className="image-preview-container d-flex justify-content-center align-items-center">
  //               <label
  //                 htmlFor="image"
  //                 className="form-label d-flex justify-content-center align-items-center"
  //               >
  //                 <img
  //                   src={image && imagePreview ? imagePreview : anonymous}
  //                   alt="avatar"
  //                   className="image-preview"
  //                 />
  //               </label>
  //             </div>
  //           </Col>
  //           <Col lg={4} className="mt-3">
  //             <div className="form-group-container d-flex justify-content-lg-start justify-content-center flex-row-reverse mb-3">
  //               <label htmlFor="image" className="form-label">
  //                 <ImUpload /> {image ? image.name : "اختر صورة"}
  //               </label>
  //               <input
  //                 type="file"
  //                 accept="image/*"
  //                 className="form-input form-img-input"
  //                 id="image"
  //                 onChange={handleImageChange}
  //               />
  //             </div>
  //             <div className="form-group-container d-flex flex-column align-items-end mb-3">
  //               <input
  //                 type="file"
  //                 name="audio"
  //                 accept="audio/*"
  //                 className="form-input"
  //                 id="upload-audio"
  //                 onChange={handleDurationAudio}
  //               />
  //               {/* Duration Audio */}
  //               {loading ? (
  //                 <span className="text-primary">جاري تحميل الصوتية</span>
  //               ) : (
  //                 <label
  //                   htmlFor="upload-audio"
  //                   className="form-label d-block mt-2"
  //                   dir="rtl"
  //                 >
  //                   <FaFileUpload />
  //                   {audio ? audio.name.split(".")[0] : "اختر ملف"}
  //                   {audio && (
  //                     <Fragment>
  //                       <br />
  //                       <span>المدة: {duration}</span>
  //                       <br />
  //                       <audio controls className="mt-2">
  //                         <source src={audioPreview} type="audio/ogg" />
  //                       </audio>
  //                     </Fragment>
  //                   )}
  //                 </label>
  //               )}
  //             </div>
  //             <div
  //               className="form-group-container d-flex flex-column align-items-end mb-3"
  //               style={{ marginTop: "-4px" }}
  //             >
  //               <label htmlFor="name" className="form-label">
  //                 اسم الصوتية
  //               </label>
  //               <input
  //                 type="text"
  //                 className="form-input"
  //                 id="name"
  //                 placeholder="اسم الصوتية"
  //                 required
  //                 value={name}
  //                 onChange={(e) => setName(e.target.value)}
  //               />
  //             </div>
  //             <div className="form-group-container d-flex flex-column align-items-end mb-3">
  //               <label htmlFor="nameAuthor" className="form-label">
  //                 العالم
  //               </label>
  //               <Select
  //                 className="basic-single"
  //                 classNamePrefix="select"
  //                 defaultValue={nameAuthorOptions[0]}
  //                 name="status"
  //                 options={nameAuthorOptions}
  //                 onChange={(e) => setNameAuthor(e.value)}
  //                 isClearable={false}
  //                 isRtl={true}
  //                 isSearchable={false}
  //                 id="nameAuthor"
  //               />
  //             </div>
  //           </Col>
  //           <Col lg={4}>
  //             <div className="form-group-container d-flex flex-column align-items-end mb-3">
  //               <label htmlFor="status" className="form-label">
  //                 الحالة
  //               </label>
  //               <Select
  //                 className="basic-single"
  //                 classNamePrefix="select"
  //                 defaultValue={statusOptions[0]}
  //                 name="status"
  //                 options={statusOptions}
  //                 onChange={(e) => setStatus(e.value)}
  //                 isClearable={false}
  //                 isRtl={true}
  //                 isSearchable={false}
  //                 id="status"
  //               />
  //             </div>
  //             <div className="form-group-container d-flex flex-column align-items-end mb-3">
  //               <label htmlFor="categories" className="form-label">
  //                 التصنيفات
  //               </label>
  //               <Select
  //                 className="basic-single"
  //                 classNamePrefix="select"
  //                 defaultValue={categoriesOptions[0]}
  //                 name="categories"
  //                 options={categoriesOptions}
  //                 onChange={(e) => setCategories(e.value)}
  //                 isClearable={false}
  //                 isRtl={true}
  //                 isSearchable={false}
  //                 id="categories"
  //               />
  //             </div>
  //             <div className="form-group-container form-group-container-keywords d-flex flex-column align-items-end mb-3">
  //               <label htmlFor="keywords" className="form-label">
  //                 الكلمات المفتاحية
  //               </label>
  //               <label
  //                 htmlFor="keywords"
  //                 className="form-label form-keywords-label p-3"
  //               >
  //                 <ul className="d-flex flex-row-reverse justify-content-start align-items-center flex-wrap w-100 p-0 mb-1">
  //                   {keyword?.map((item) => (
  //                     <li
  //                       className="list-unstyled badge flex-wrap"
  //                       key={item.id}
  //                       onClick={() => handleRemoveKeyword(item.id)}
  //                     >
  //                       {item.keyword}
  //                     </li>
  //                   ))}
  //                   <li className="list-unstyled badge flex-wrap">
  //                     <input
  //                       type="text"
  //                       name="keywords"
  //                       id="keywords"
  //                       className="form-input form-keywords-input w-100"
  //                       onKeyDown={handleAddKeyword}
  //                       placeholder="اضف كلمة مفتاحية"
  //                     />
  //                   </li>
  //                 </ul>
  //               </label>
  //             </div>
  //           </Col>
  //           <Col lg={12}>
  //             <div className="form-group-container d-flex flex-row-reverse align-items-center justify-content-lg-start justify-content-center gap-3 mb-3 mt-3">
  //               <button type="submit" className="add-btn">
  //                 اضافة
  //               </button>
  //               <button
  //                 type="button"
  //                 className="cancel-btn"
  //                 onClick={() => {
  //
  //                   dispatch(toggleOverlay());
  //                 }}
  //               >
  //                 الغاء
  //               </button>
  //             </div>
  //           </Col>
  //         </Row>
  //       </form>
  //     </Overlay>
  //     {/* Edit Book */}
  //     <EditOverlay>
  //       <div className="overlay-header mb-4">
  //         <h3 className="overlay-title text-center">تعديل كتاب</h3>
  //       </div>
  //       <form
  //         className={`overlay-form overlay-edit ${edit ? "edit" : ""}`}
  //         onSubmit={handleEditSubmit}
  //         ref={formRef}
  //       >
  //         <Row className="justify-content-center">
  //           <Col
  //             lg={4}
  //             className="d-flex justify-content-center align-items-center"
  //           >
  //             <div className="image-preview-container d-flex justify-content-center align-items-center">
  //               <label
  //                 htmlFor="editImage"
  //                 className="form-label d-flex justify-content-center align-items-center"
  //               >
  //                 <img
  //                   src={image && imagePreview ? editImagePreview : anonymous}
  //                   alt="avatar"
  //                   className="image-preview"
  //                 />
  //               </label>
  //             </div>
  //           </Col>
  //           <Col lg={4} className="mt-3">
  //             <div className="form-group-container d-flex justify-content-lg-start justify-content-center flex-row-reverse mb-3">
  //               <label htmlFor="editImage" className="form-label">
  //                 <ImUpload /> {image ? editImage.name : "اختر صورة"}
  //               </label>
  //               <input
  //                 type="file"
  //                 accept="image/*"
  //                 className="form-input form-img-input"
  //                 id="editImage"
  //                 onChange={handleImageChange}
  //                 disabled
  //               />
  //             </div>
  //             <div className="form-group-container d-flex flex-column align-items-end mb-3">
  //               <input
  //                 type="file"
  //                 name="audio"
  //                 accept="audio/*"
  //                 className="form-input"
  //                 id="upload-audio"
  //                 onChange={handleDurationAudio}
  //                 disabled
  //               />
  //               {/* Duration Audio */}
  //               <label
  //                 htmlFor="upload-audio"
  //                 className="form-label d-block mt-2"
  //                 dir="rtl"
  //               >
  //                 <FaFileUpload />
  //                 {audio ? editAudio.name.split(".")[0] : "اختر ملف"}
  //                 {audio && (
  //                   <Fragment>
  //                     <br />
  //                     <span>المدة: {duration}</span>
  //                     <br />
  //                     <audio controls className="mt-2">
  //                       <source src={editAudioPreview} type="audio/ogg" />
  //                     </audio>
  //                   </Fragment>
  //                 )}
  //               </label>
  //             </div>
  //             <div
  //               className="form-group-container d-flex flex-column align-items-end mb-3"
  //               style={{ marginTop: "-4px" }}
  //             >
  //               <label htmlFor="editName" className="form-label">
  //                 اسم الصوتية
  //               </label>
  //               <p
  //                 className="form-input form-input-edit w-100 mb-0"
  //                 onDoubleClick={editHandlerDoubleClick}
  //               >
  //                 اسم الصوتية
  //               </p>
  //               <input
  //                 type="text"
  //                 className="form-input form-input-edit w-100"
  //                 id="editName"
  //                 placeholder="اسم الصوتية"
  //                 required
  //                 value={editName}
  //                 onChange={(e) => setEditName(e.target.value)}
  //                 disabled
  //               />
  //             </div>
  //             <div className="form-group-container d-flex flex-column align-items-end mb-3">
  //               <label htmlFor="editNameAuthor" className="form-label">
  //                 العالم
  //               </label>
  //               <p
  //                 className="form-input form-input-edit w-100 mb-0"
  //                 onDoubleClick={editHandlerDoubleClick}
  //               >
  //                 العالم
  //               </p>
  //               <Select
  //                 className="basic-single"
  //                 classNamePrefix="select"
  //                 defaultValue={nameAuthorOptions[0]}
  //                 name="editNameAuthor"
  //                 options={nameAuthorOptions}
  //                 onChange={(e) => setEditNameAuthor(e.value)}
  //                 isClearable={false}
  //                 isRtl={true}
  //                 isSearchable={false}
  //                 id="editNameAuthor"
  //                 disabled
  //               />
  //             </div>
  //           </Col>
  //           <Col lg={4}>
  //             <div className="form-group-container d-flex flex-column align-items-end mb-3">
  //               <label htmlFor="status" className="form-label">
  //                 الحالة
  //               </label>
  //               <p
  //                 className="form-input form-input-edit w-100 mb-0"
  //                 onDoubleClick={editHandlerDoubleClick}
  //               >
  //                 الحالة
  //               </p>
  //               <Select
  //                 className="basic-single"
  //                 classNamePrefix="select"
  //                 defaultValue={statusOptions[0]}
  //                 name="status"
  //                 options={statusOptions}
  //                 onChange={(e) => setEditStatus(e.value)}
  //                 isClearable={false}
  //                 isRtl={true}
  //                 isSearchable={false}
  //                 id="status"
  //               />
  //             </div>
  //             <div className="form-group-container d-flex flex-column align-items-end mb-3">
  //               <label htmlFor="editCategories" className="form-label">
  //                 التصنيفات
  //               </label>
  //               <p
  //                 className="form-input form-input-edit w-100 mb-0"
  //                 onDoubleClick={editHandlerDoubleClick}
  //               >
  //                 التصنيفات
  //               </p>
  //               <Select
  //                 className="basic-single"
  //                 classNamePrefix="select"
  //                 defaultValue={categoriesOptions[0]}
  //                 name="editCategories"
  //                 options={categoriesOptions}
  //                 onChange={(e) => setEditCategories(e.value)}
  //                 isClearable={false}
  //                 isRtl={true}
  //                 isSearchable={false}
  //                 id="editCategories"
  //                 disabled
  //               />
  //             </div>
  //             <div className="form-group-container form-group-container-keywords d-flex flex-column align-items-end mb-3">
  //               <label htmlFor="editKeywords" className="form-label">
  //                 الكلمات المفتاحية
  //               </label>
  //               <p
  //                 className="form-input form-input-edit w-100 mb-0 mt-0"
  //                 onDoubleClick={editHandlerDoubleClick}
  //               >
  //                 الكلمات المفتاحية
  //               </p>
  //               <label
  //                 htmlFor="editKeywords"
  //                 className="form-label form-keywords-label mb-0"
  //                 id="keywords-label-edit"
  //                 style={{
  //                   display: "none",
  //                 }}
  //               >
  //                 <ul className="d-flex flex-row-reverse justify-content-start align-items-center flex-wrap w-100 p-0 mb-1">
  //                   {keyword?.map((item) => (
  //                     <li
  //                       className="list-unstyled badge flex-wrap"
  //                       key={item.id}
  //                       onClick={() => handleRemoveKeyword(item.id)}
  //                     >
  //                       {item.keyword}
  //                     </li>
  //                   ))}
  //                   <li className="list-unstyled flex-wrap pt-1 pb-1">
  //                     <input
  //                       type="text"
  //                       name="keywords"
  //                       id="editKeywords"
  //                       className="form-input form-keywords-input"
  //                       onKeyDown={handleAddKeyword}
  //                       placeholder="اضف كلمة مفتاحية"
  //                       disabled={edit}
  //                     />
  //                   </li>
  //                 </ul>
  //               </label>
  //             </div>
  //           </Col>
  //           <Col lg={12}>
  //             <div className="form-group-container d-flex flex-row-reverse align-items-center justify-content-lg-start justify-content-center gap-3 mb-3 mt-3">
  //               <button type="submit" className="add-btn">
  //                 حفظ
  //               </button>
  //               <button
  //                 type="button"
  //                 className="edit-btn"
  //                 onClick={() => {
  //                   editHandlerBtn();
  //                   setEdit(false);
  //                 }}
  //                 style={{ display: edit ? "block" : "none" }}
  //               >
  //                 تعديل
  //               </button>
  //               <button
  //                 type="button"
  //                 className="cancel-btn"
  //                 onClick={() => {
  //
  //                   editCancelHandler();
  //                   setEdit(true);
  //                   if (formRef.current.classList.contains("edit")) {
  //                     dispatch(toggleEditOverlay());
  //                   }
  //                 }}
  //               >
  //                 الغاء
  //               </button>
  //             </div>
  //           </Col>
  //         </Row>
  //       </form>
  //     </EditOverlay>
  //     <Table Icon={MdAdd} title="الصوتيات">
  //       <thead>
  //         <tr>
  //           <th className="table-th">الصورة</th>
  //           <th className="table-th">اسم الصوتية</th>
  //           <th className="table-th">اسم العالم</th>
  //           <th className="table-th">التصنيف</th>
  //           <th className="table-th">المدة</th>
  //           <th className="table-th">المفضلة</th>
  //           <th className="table-th">المشاركة</th>
  //           <th className="table-th">الحالة</th>
  //           <th className="table-th">الافعال</th>
  //         </tr>
  //       </thead>
  //       <tbody>
  //         {
  //           // audios ?
  //           // audios.map((article) => (
  //           <tr key={1}>
  //             <td className="table-td">
  //               <img
  //                 src="https://i.pravatar.cc/150?img=0"
  //                 alt="avatar"
  //                 className="table-avatar"
  //               />
  //             </td>
  //             <td className="table-td name">اسم</td>
  //             <td className="table-td name">اسم</td>
  //             <td className="table-td name">اسم</td>
  //             <td className="table-td">0</td>
  //             <td className="table-td">0</td>
  //             <td className="table-td">0</td>
  //             <td className="table-td">
  //               <span
  //                 className="table-status badge"
  //                 style={{
  //                   backgroundColor: "عام" ? "green" : "red",
  //                 }}
  //               >
  //                 عام
  //               </span>
  //             </td>
  //             <td className="table-td">
  //               <span className="table-btn-container">
  //                 <FaEdit onClick={() => dispatch(toggleEditOverlay())} />
  //                 <MdDeleteOutline />
  //               </span>
  //             </td>
  //           </tr>
  //           // ))
  //           // : <h3 className="no-data">لا يوجد بيانات</h3>
  //         }
  //       </tbody>
  //     </Table>
  //   </section>
  // );
};

export default Audios;
