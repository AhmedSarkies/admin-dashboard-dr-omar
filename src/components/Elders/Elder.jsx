import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getScholarByIdApi } from "../../store/slices/scholarSlice";

import { IoMdClose } from "react-icons/io";

import React, { useState, useEffect, useRef } from "react";
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
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";
import {
  getAudiosCategoriesApi,
  addAudioApi,
  updateAudioApi,
  deleteAudioApi,
} from "../../store/slices/audioSlice";
import useFiltration from "../../hooks/useFiltration";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { useSchema } from "../../hooks";
import Cookies from "js-cookie";

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
  is_active: "",
  audioCategory: {
    title: "",
    id: "",
  },
};

const Elder = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const role = Cookies.get("_role");
  const getAudiosCookies = Cookies.get("GetAudio");
  const addAudiosCookies = Cookies.get("addAudio");
  const editAudiosCookies = Cookies.get("editAudio");
  const deleteAudiosCookies = Cookies.get("deleteAudio");
  const { validationSchema } = useSchema();
  const fileRef = useRef();
  const dispatch = useDispatch();
  const { audioCategories, loading: load } = useSelector(
    (state) => state.audio
  );
  const { dataById, error, loading } = useSelector((state) => state.scholar);
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
      id: true,
      image: true,
      title: true,
      audio: true,
      audios_time: true,
      category: true,
      visits: true,
      favorites: true,
      downloads: true,
      shares: true,
      activation: true,
      status: true,
      control: true,
    },
    searchTerm: "",
    sortColumn: "",
    sortOrder: "asc",
    rowsPerPage: 20,
    currentPage: 1,
  });

  const data = dataById?.Audio?.map((item) => {
    return {
      ...item,
      categories: item.categories[0],
      status: item.status === "public" ? t("public") : t("private"),
      is_active: item.is_active === 1 ? t("active") : t("inactive"),
    };
  });

  const formik = useFormik({
    initialValues,
    validationSchema: validationSchema.audioElder,
    onSubmit: (values) => {
      if (
        role === "admin" ||
        (addAudiosCookies === "1" && getAudiosCookies === "1") ||
        (editAudiosCookies === "1" && getAudiosCookies === "1")
      ) {
        // Add Audio
        if (!values.id) {
          dispatch(
            addAudioApi({
              title: values.title,
              image: values.image.file,
              audio: values.audio.file,
              audios_time: toggle.duration.trim(),
              status: values.status,
              elder_id: id,
              is_active: values.is_active,
              Audio_category: values.audioCategory.id,
            })
          ).then((res) => {
            if (!res.error) {
              formik.handleReset();
              setToggle({
                ...toggle,
                add: !toggle.add,
                elders: false,
                audioCategory: false,
                status: false,
                duration: "00:00",
              });
              dispatch(getScholarByIdApi(id));
              toast.success(t("toast.audio.addedSuccess"));
            } else {
              toast.error(t("toast.audio.addedError"));
              dispatch(getScholarByIdApi(id));
            }
          });
        } else {
          // Update Audio
          const formDate = {
            id: values.id,
            title: values.title,
            audios_time: values.audios_time,
            elder_id: id,
            status: values.status === "Public" ? "public" : "private",
            audios_categories_id: values.audioCategory.id,
            is_active: values.is_active,
            tag_name: ["tag 1", "tag 2"],
          };
          if (values.image.file) {
            formDate.image = values.image.file;
          }
          if (values.audio.file) {
            formDate.audio = values.audio.file;
            formDate.audios_time = toggle.duration.trim();
          }
          dispatch(updateAudioApi(formDate)).then((res) => {
            if (!res.error) {
              formik.handleReset();
              setToggle({
                ...toggle,
                edit: !toggle.edit,
                audioCategory: false,
                status: false,
                elders: false,
                duration: "00:00",
              });
              dispatch(getScholarByIdApi(id));
              toast.success(t("toast.audio.updatedSuccess"));
            } else {
              toast.error(t("toast.audio.updatedError"));
              dispatch(getScholarByIdApi(id));
            }
          });
        }
      }
    },
  });

  // Filtration, Sorting, Pagination
  const {
    PaginationUI,
    handleSort,
    handleSearch,
    handleToggleColumns,
    searchResultsAudioSCategoryAndTitleElder,
  } = useFiltration({
    rowData: data,
    toggle,
    setToggle,
  });

  // Columns
  const columns = [
    { id: 0, name: "id", label: t("index") },
    { id: 1, name: "image", label: t("audios.columns.audio.image") },
    { id: 2, name: "title", label: t("audios.columns.audio.title") },
    { id: 3, name: "category", label: t("audios.columns.audio.category") },
    { id: 4, name: "audio", label: t("audios.columns.audio.audio") },
    {
      id: 5,
      name: "audios_time",
      label: t("audios.columns.audio.audios_time"),
    },
    { id: 6, name: "visits", label: t("listening") },
    { id: 7, name: "favorites", label: t("favorites") },
    { id: 8, name: "downloads", label: t("downloads") },
    { id: 9, name: "shares", label: t("shares") },
    { id: 10, name: "status", label: t("content") },
    { id: 11, name: "activation", label: t("activation") },
    { id: 12, name: "control", label: t("action") },
  ];

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
        fileReader.readAsArrayBuffer(file);
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
      id: audio.id,
      title: audio.title,
      image: audio.image,
      audio: audio.audio,
      audios_time: audio.audios_time,
      status: audio.status === t("public") ? "Public" : "Private",
      is_active: audio.is_active === t("active") ? 1 : 0,
      elder: {
        name: audio.elder?.name,
        id,
      },
      audioCategory: {
        title: audio.categories?.title,
        id: audio.categories?.id,
      },
      tag_name: ["tag 1", "tag 2"],
    });
    setToggle({
      ...toggle,
      edit: !toggle.edit,
    });
  };

  // Delete Audio
  const handleDelete = (audio) => {
    if (role === "admin" || deleteAudiosCookies === "1") {
      Swal.fire({
        title: t("titleDeleteAlert") + audio?.title + "?",
        text: t("textDeleteAlert"),
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#0d1d34",
        confirmButtonText: t("confirmButtonText"),
        cancelButtonText: t("cancel"),
      }).then((result) => {
        if (result.isConfirmed) {
          dispatch(deleteAudioApi(audio?.id)).then((res) => {
            if (!res.error) {
              if (
                toggle.currentPage > 1 &&
                searchResultsAudioSCategoryAndTitleElder.length === 1
              ) {
                setToggle({
                  ...toggle,
                  currentPage: toggle.currentPage - 1,
                });
              }
              dispatch(getScholarByIdApi(id));
              Swal.fire({
                title: `${t("titleDeletedSuccess")} ${audio?.title}`,
                text: `${t("titleDeletedSuccess")} ${audio?.title} ${t(
                  "textDeletedSuccess"
                )}`,
                icon: "success",
                confirmButtonColor: "#0d1d34",
                confirmButtonText: t("doneDeletedSuccess"),
              }).then(() => toast.success(t("toast.audio.deletedSuccess")));
            } else {
              dispatch(getScholarByIdApi(id));
              toast.error(t("toast.audio.deletedError"));
            }
          });
        }
      });
    }
  };

  useEffect(() => {
    try {
      if (role === "admin" || getAudiosCookies === "1") {
        dispatch(getScholarByIdApi(id));
      }
      if (
        role === "admin" ||
        addAudiosCookies === "1" ||
        editAudiosCookies === "1"
      ) {
        dispatch(getAudiosCategoriesApi());
      }
      if (
        role !== "admin" &&
        addAudiosCookies === "0" &&
        editAudiosCookies === "0" &&
        deleteAudiosCookies === "0"
      ) {
        setToggle({
          ...toggle,
          toggleColumns: {
            ...toggle.toggleColumns,
            control: false,
          },
        });
      }
      if (getAudiosCookies === "0") {
        Cookies.set("addAudio", 0, {
          expires: 30,
          secure: true,
          sameSite: "strict",
          path: "/",
        });
        Cookies.set("editAudio", 0, {
          expires: 30,
          secure: true,
          sameSite: "strict",
          path: "/",
        });
        Cookies.set("deleteAudio", 0, {
          expires: 30,
          secure: true,
          sameSite: "strict",
          path: "/",
        });
      }
    } catch (error) {
      console.log(error);
    }
    // eslint-disable-next-line
  }, [
    dispatch,
    id,
    role,
    getAudiosCookies,
    addAudiosCookies,
    editAudiosCookies,
    deleteAudiosCookies,
  ]);

  return (
    <div className="audio-container scholar-container mt-4 m-sm-3 m-0">
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
            {t("audios.addTitle")}
          </button>
        </div>
      )}
      <div className="audio scholar">
        {!loading && (
          <div className="table-header justify-content-end mb-3">
            <h2>{dataById?.name}</h2>
          </div>
        )}
        <div className="table-header">
          {/* Search */}
          <div
            className="search-container form-group-container form-input"
            style={{
              width: "30%",
            }}
          >
            <input
              type="text"
              className="form-input"
              placeholder={t("searchAudioElder")}
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
              {columns
                .filter((column) =>
                  role === "admin" ? column : column.name !== "control"
                )
                .map((column) => (
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
                  {t("audios.columns.audio.image")}
                  {toggle.sortColumn === columns[1].name ? (
                    toggle.sortOrder === "asc" ? (
                      <TiArrowSortedUp />
                    ) : (
                      <TiArrowSortedDown />
                    )
                  ) : null}
                </th>
              )}
              {toggle.toggleColumns.title && (
                <th className="table-th" onClick={() => handleSort(columns[2])}>
                  {t("audios.columns.audio.title")}
                  {toggle.sortColumn === columns[2].name ? (
                    toggle.sortOrder === "asc" ? (
                      <TiArrowSortedUp />
                    ) : (
                      <TiArrowSortedDown />
                    )
                  ) : null}
                </th>
              )}
              {toggle.toggleColumns.category && (
                <th className="table-th" onClick={() => handleSort(columns[3])}>
                  {t("audios.columns.audio.category")}
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
                  {t("audios.columns.audio.audio")}
                  {toggle.sortColumn === columns[4].name ? (
                    toggle.sortOrder === "asc" ? (
                      <TiArrowSortedUp />
                    ) : (
                      <TiArrowSortedDown />
                    )
                  ) : null}
                </th>
              )}
              {toggle.toggleColumns.audios_time && (
                <th className="table-th" onClick={() => handleSort(columns[5])}>
                  {t("audios.columns.audio.audios_time")}
                  {toggle.sortColumn === columns[5].name ? (
                    toggle.sortOrder === "asc" ? (
                      <TiArrowSortedUp />
                    ) : (
                      <TiArrowSortedDown />
                    )
                  ) : null}
                </th>
              )}
              {toggle.toggleColumns.visits && (
                <th className="table-th" onClick={() => handleSort(columns[6])}>
                  {t("listening")}
                  {toggle.sortColumn === columns[6].name ? (
                    toggle.sortOrder === "asc" ? (
                      <TiArrowSortedUp />
                    ) : (
                      <TiArrowSortedDown />
                    )
                  ) : null}
                </th>
              )}
              {toggle.toggleColumns.favorites && (
                <th className="table-th" onClick={() => handleSort(columns[7])}>
                  {t("favorites")}
                  {toggle.sortColumn === columns[7].name ? (
                    toggle.sortOrder === "asc" ? (
                      <TiArrowSortedUp />
                    ) : (
                      <TiArrowSortedDown />
                    )
                  ) : null}
                </th>
              )}
              {toggle.toggleColumns.downloads && (
                <th className="table-th" onClick={() => handleSort(columns[8])}>
                  {t("downloads")}
                  {toggle.sortColumn === columns[8].name ? (
                    toggle.sortOrder === "asc" ? (
                      <TiArrowSortedUp />
                    ) : (
                      <TiArrowSortedDown />
                    )
                  ) : null}
                </th>
              )}
              {toggle.toggleColumns.shares && (
                <th className="table-th" onClick={() => handleSort(columns[9])}>
                  {t("shares")}
                  {toggle.sortColumn === columns[9].name ? (
                    toggle.sortOrder === "asc" ? (
                      <TiArrowSortedUp />
                    ) : (
                      <TiArrowSortedDown />
                    )
                  ) : null}
                </th>
              )}
              {toggle.toggleColumns.status && (
                <th
                  className="table-th"
                  onClick={() => handleSort(columns[10])}
                >
                  {t("content")}
                  {toggle.sortColumn === columns[10].name ? (
                    toggle.sortOrder === "asc" ? (
                      <TiArrowSortedUp />
                    ) : (
                      <TiArrowSortedDown />
                    )
                  ) : null}
                </th>
              )}
              {toggle.toggleColumns.activation && (
                <th
                  className="table-th"
                  onClick={() => handleSort(columns[11])}
                >
                  {t("activation")}
                  {toggle.sortColumn === columns[11].name ? (
                    toggle.sortOrder === "asc" ? (
                      <TiArrowSortedUp />
                    ) : (
                      <TiArrowSortedDown />
                    )
                  ) : null}
                </th>
              )}
              {(role === "admin" ||
                (deleteAudiosCookies === "1" && getAudiosCookies === "1") ||
                role === "admin" ||
                (editAudiosCookies === "1" && getAudiosCookies === "1")) &&
                toggle.toggleColumns.control && (
                  <th className="table-th">{t("action")}</th>
                )}
            </tr>
          </thead>
          {/* Error */}
          {error !== null && loading === false && (
            <tbody>
              <tr className="no-data-container">
                <td
                  className="table-td"
                  colSpan={
                    editAudiosCookies === "0" && deleteAudiosCookies === "0"
                      ? 12
                      : 13
                  }
                >
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
                <td
                  className="table-td"
                  colSpan={
                    editAudiosCookies === "0" && deleteAudiosCookies === "0"
                      ? 12
                      : 13
                  }
                >
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
          {searchResultsAudioSCategoryAndTitleElder?.length === 0 &&
            error === null &&
            !loading && (
              <tbody>
                <tr className="no-data-container">
                  <td
                    className="table-td"
                    colSpan={
                      editAudiosCookies === "0" && deleteAudiosCookies === "0"
                        ? 12
                        : 13
                    }
                  >
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
                <td
                  className="table-td"
                  colSpan={
                    editAudiosCookies === "0" && deleteAudiosCookies === "0"
                      ? 12
                      : 13
                  }
                >
                  <p className="no-data no-columns mb-0">{t("noColumns")}</p>
                </td>
              </tr>
            </tbody>
          )}
          {/* Data */}
          {searchResultsAudioSCategoryAndTitleElder?.length > 0 &&
            error === null &&
            loading === false && (
              <tbody>
                {searchResultsAudioSCategoryAndTitleElder?.map(
                  (result, idx) => (
                    <tr key={result?.id + new Date().getDate()}>
                      {toggle.toggleColumns.id && (
                        <td className="table-td">{idx + 1}#</td>
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
                      {toggle.toggleColumns.category && (
                        <td className="table-td">
                          {result?.categories?.title}
                        </td>
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
                      {toggle.toggleColumns.audios_time && (
                        <td className="table-td">{result?.audios_time}</td>
                      )}
                      {toggle.toggleColumns.visits && (
                        <td className="table-td">{result?.visits_count}</td>
                      )}
                      {toggle.toggleColumns.favorites && (
                        <td className="table-td">{result?.favorites_count}</td>
                      )}
                      {toggle.toggleColumns.downloads && (
                        <td className="table-td">{result?.downloads_count}</td>
                      )}
                      {toggle.toggleColumns.shares && (
                        <td className="table-td">{result?.shares_count}</td>
                      )}
                      {toggle.toggleColumns.status && (
                        <td className="table-td">
                          <span
                            className="table-status badge"
                            style={{
                              backgroundColor:
                                result?.status === t("public")
                                  ? "green"
                                  : "red",
                              cursor: role === "admin" ? "pointer" : "default",
                            }}
                            onClick={() => {
                              if (role === "admin") {
                                const data = {
                                  id: result.id,
                                  title: result.title,
                                  elder_id: id,
                                  audios_time: result.audios_time,
                                  status:
                                    result?.status === t("public")
                                      ? "private"
                                      : "public",
                                  audios_categories_id: result.categories.id,
                                  is_active:
                                    result.is_active === t("active") ? 1 : 0,
                                  tag_name: ["tag 1", "tag 2"],
                                };
                                dispatch(updateAudioApi(data)).then((res) => {
                                  if (!res.error) {
                                    dispatch(getScholarByIdApi(id));
                                    toast.success(
                                      t("toast.audio.updatedSuccess")
                                    );
                                  } else {
                                    dispatch(getScholarByIdApi(id));
                                    toast.error(t("toast.audio.updatedError"));
                                  }
                                });
                              }
                            }}
                          >
                            {result?.status}
                          </span>
                        </td>
                      )}
                      {toggle.toggleColumns.activation && (
                        <td className="table-td">
                          <span
                            className="table-status badge"
                            style={{
                              backgroundColor:
                                result?.is_active === t("active")
                                  ? "green"
                                  : "red",
                              cursor: role === "admin" ? "pointer" : "default",
                            }}
                            onClick={() => {
                              if (role === "admin") {
                                const data = {
                                  id: result.id,
                                  title: result.title,
                                  elder_id: id,
                                  audios_time: result.audios_time,
                                  status:
                                    result?.status === t("public")
                                      ? "public"
                                      : "private",
                                  audios_categories_id: result.categories.id,
                                  is_active:
                                    result.is_active === t("active") ? 0 : 1,
                                  tag_name: ["tag 1", "tag 2"],
                                };
                                dispatch(updateAudioApi(data)).then((res) => {
                                  if (!res.error) {
                                    dispatch(getScholarByIdApi(id));
                                    toast.success(
                                      t("toast.audio.updatedSuccess")
                                    );
                                  } else {
                                    dispatch(getScholarByIdApi(id));
                                    toast.error(t("toast.audio.updatedError"));
                                  }
                                });
                              }
                            }}
                          >
                            {result?.is_active}
                          </span>
                        </td>
                      )}
                      {(role === "admin" ||
                        (addAudiosCookies === "1" &&
                          getAudiosCookies === "1") ||
                        role === "admin" ||
                        (editAudiosCookies === "1" &&
                          getAudiosCookies === "1")) &&
                        toggle.toggleColumns.control && (
                          <td className="table-td">
                            <span className="table-btn-container">
                              {(role === "admin" ||
                                (editAudiosCookies === "1" &&
                                  getAudiosCookies === "1")) &&
                                toggle.toggleColumns.control && (
                                  <FaEdit
                                    className="edit-btn"
                                    onClick={() => {
                                      handleEdit(result);
                                    }}
                                  />
                                )}
                              {(role === "admin" ||
                                (deleteAudiosCookies === "1" &&
                                  getAudiosCookies === "1")) &&
                                toggle.toggleColumns.control && (
                                  <MdDeleteOutline
                                    className="delete-btn"
                                    onClick={() => handleDelete(result)}
                                  />
                                )}
                            </span>
                          </td>
                        )}
                    </tr>
                  )
                )}
              </tbody>
            )}
        </table>
      </div>
      {/* Pagination */}
      {searchResultsAudioSCategoryAndTitleElder?.length > 0 &&
        error === null &&
        loading === false && <PaginationUI />}
      {(role === "admin" ||
        (addAudiosCookies === "1" && getAudiosCookies === "1")) && (
        <>
          {/* Add Audio */}
          <Modal
            isOpen={toggle.add}
            toggle={() => {
              setToggle({
                ...toggle,
                add: !toggle.add,
                elders: false,
                audioCategory: false,
                status: false,
              });
              formik.handleReset();
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
                  elders: false,
                  audioCategory: false,
                  status: false,
                });
                formik.handleReset();
              }}
            >
              {t("audios.addTitle")}
              <IoMdClose
                onClick={() => {
                  setToggle({
                    ...toggle,
                    add: !toggle.add,
                    elders: false,
                    audioCategory: false,
                    status: false,
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
                              formik.values?.image &&
                              formik.values.image?.preview
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
                              formik.values?.image &&
                              formik.values.image?.preview
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
                                  onClick={handleDeleteImage}
                                >
                                  {t("delete")}
                                </button>
                              </div>
                            </ModalFooter>
                          </Modal>
                        </label>
                      </div>
                      <div className="form-group-container d-flex justify-content-lg-start justify-content-center flex-row-reverse">
                        <label htmlFor="image" className="form-label">
                          <ImUpload /> {t("chooseImageAudio")}
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
                          <FaFileUpload /> {t("chooseAudio")}
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
                        {t("audios.columns.audio.title")}
                      </label>
                      <input
                        type="text"
                        className="form-input"
                        id="title"
                        placeholder={t("audios.columns.audio.title")}
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
                        {t("audios.columns.audio.category")}
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
                            : t("chooseCategory")}
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
                        {t("content")}
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
                          {formik.values.status === "Private"
                            ? t("private")
                            : formik.values.status === "Public"
                            ? t("public")
                            : t("content")}
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
                            {t("private")}
                          </button>
                          <button
                            type="button"
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
                            {t("public")}
                          </button>
                        </div>
                      </div>
                      {formik.errors.status && formik.touched.status ? (
                        <span className="error">{formik.errors.status}</span>
                      ) : null}
                    </div>
                    <div className="form-group-container d-flex flex-column justify-content-center align-items-end">
                      <label htmlFor="activation" className="form-label">
                        {t("activation")}
                      </label>
                      <div className="dropdown form-input">
                        <button
                          type="button"
                          onClick={() => {
                            setToggle({
                              ...toggle,
                              is_active: !toggle.is_active,
                            });
                          }}
                          className="dropdown-btn d-flex justify-content-between align-items-center"
                        >
                          {formik.values.is_active === 1
                            ? t("active")
                            : formik.values.is_active === 0
                            ? t("inactive")
                            : t("activation")}
                          <TiArrowSortedUp
                            className={`dropdown-icon ${
                              toggle.is_active ? "active" : ""
                            }`}
                          />
                        </button>
                        <div
                          className={`dropdown-content ${
                            toggle.is_active ? "active" : ""
                          }`}
                        >
                          <button
                            type="button"
                            className={`item ${
                              formik.values.is_active === 0 ? "active" : ""
                            }`}
                            value="inactive"
                            name="activation"
                            onClick={(e) => {
                              setToggle({
                                ...toggle,
                                is_active: !toggle.is_active,
                              });
                              formik.setFieldValue("is_active", 0);
                            }}
                          >
                            {t("inactive")}
                          </button>
                          <button
                            type="button"
                            className={`item ${
                              formik.values.is_active === 1 ? "active" : ""
                            }`}
                            value="active"
                            name="activation"
                            onClick={(e) => {
                              setToggle({
                                ...toggle,
                                is_active: !toggle.is_active,
                              });
                              formik.setFieldValue("is_active", 1);
                            }}
                          >
                            {t("active")}
                          </button>
                        </div>
                      </div>
                      {formik.errors.is_active && formik.touched.is_active ? (
                        <span className="error">{formik.errors.is_active}</span>
                      ) : null}
                    </div>
                  </Col>
                  <Col lg={12}>
                    <div className="form-group-container d-flex flex-row-reverse justify-content-lg-start justify-content-center gap-3">
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
                        ) : load ? (
                          <Spinner
                            color="light"
                            style={{
                              height: "1rem",
                              width: "1rem",
                            }}
                          >
                            Loading...
                          </Spinner>
                        ) : (
                          t("add")
                        )}
                      </button>
                      <button
                        type="button"
                        className="cancel-btn"
                        onClick={() => {
                          setToggle({
                            ...toggle,
                            add: !toggle.add,
                            elders: false,
                            audioCategory: false,
                            status: false,
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
        </>
      )}
      {(role === "admin" ||
        (editAudiosCookies === "1" && getAudiosCookies === "1")) && (
        <>
          {/* Edit audio */}
          <Modal
            isOpen={toggle.edit}
            toggle={() => {
              setToggle({
                ...toggle,
                edit: !toggle.edit,
                audioCategory: false,
                status: false,
                elders: false,
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
                  audioCategory: false,
                  status: false,
                  elders: false,
                });
                formik.handleReset();
              }}
            >
              {t("audios.editTitle")}
              <IoMdClose
                onClick={() => {
                  setToggle({
                    ...toggle,
                    edit: !toggle.edit,
                    audioCategory: false,
                    status: false,
                    elders: false,
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
                                  onClick={handleDeleteImage}
                                >
                                  {t("delete")}
                                </button>
                              </div>
                            </ModalFooter>
                          </Modal>
                        </label>
                      </div>
                      <div className="form-group-container d-flex justify-content-lg-start justify-content-center flex-row-reverse">
                        <label htmlFor="image" className="form-label">
                          <ImUpload /> {t("chooseImageAudio")}
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
                          <FaFileUpload /> {t("chooseAudio")}
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
                        {t("audios.columns.audio.title")}
                      </label>
                      <input
                        type="text"
                        className="form-input"
                        id="title"
                        placeholder={t("audios.columns.audio.title")}
                        name="title"
                        value={formik.values?.title}
                        onChange={handleInput}
                      />
                      {formik.errors?.title && formik.touched?.title ? (
                        <span className="error">{formik.errors?.title}</span>
                      ) : null}
                    </div>
                    <div className="form-group-container d-flex flex-column align-items-end mb-3">
                      <label htmlFor="audioCategory" className="form-label">
                        {t("audios.columns.audio.category")}
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
                            : t("chooseCategory")}
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
                        {t("content")}
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
                          {formik.values.status === "Private"
                            ? t("private")
                            : formik.values.status === "Public"
                            ? t("public")
                            : t("content")}
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
                            {t("private")}
                          </button>
                          <button
                            type="button"
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
                            {t("public")}
                          </button>
                        </div>
                      </div>
                      {formik.errors.status && formik.touched.status ? (
                        <span className="error">{formik.errors.status}</span>
                      ) : null}
                    </div>
                    <div className="form-group-container d-flex flex-column justify-content-center align-items-end">
                      <label htmlFor="activation" className="form-label">
                        {t("activation")}
                      </label>
                      <div className="dropdown form-input">
                        <button
                          type="button"
                          onClick={() => {
                            setToggle({
                              ...toggle,
                              is_active: !toggle.is_active,
                            });
                          }}
                          className="dropdown-btn d-flex justify-content-between align-items-center"
                        >
                          {formik.values.is_active === 1
                            ? t("active")
                            : formik.values.is_active === 0
                            ? t("inactive")
                            : t("activation")}
                          <TiArrowSortedUp
                            className={`dropdown-icon ${
                              toggle.is_active ? "active" : ""
                            }`}
                          />
                        </button>
                        <div
                          className={`dropdown-content ${
                            toggle.is_active ? "active" : ""
                          }`}
                        >
                          <button
                            type="button"
                            className={`item ${
                              formik.values.is_active === 0 ? "active" : ""
                            }`}
                            value="inactive"
                            name="activation"
                            onClick={(e) => {
                              setToggle({
                                ...toggle,
                                is_active: !toggle.is_active,
                              });
                              formik.setFieldValue("is_active", 0);
                            }}
                          >
                            {t("inactive")}
                          </button>
                          <button
                            type="button"
                            className={`item ${
                              formik.values.is_active === 1 ? "active" : ""
                            }`}
                            value="active"
                            name="activation"
                            onClick={(e) => {
                              setToggle({
                                ...toggle,
                                is_active: !toggle.is_active,
                              });
                              formik.setFieldValue("is_active", 1);
                            }}
                          >
                            {t("active")}
                          </button>
                        </div>
                      </div>
                      {formik.errors.is_active && formik.touched.is_active ? (
                        <span className="error">{formik.errors.is_active}</span>
                      ) : null}
                    </div>
                  </Col>
                  <Col lg={12}>
                    <div className="form-group-container d-flex flex-row-reverse justify-content-lg-start justify-content-center gap-3">
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
                        ) : load ? (
                          <Spinner
                            color="light"
                            style={{
                              height: "1rem",
                              width: "1rem",
                            }}
                          >
                            Loading...
                          </Spinner>
                        ) : (
                          t("save")
                        )}
                      </button>
                      <button
                        type="button"
                        className="cancel-btn"
                        onClick={() => {
                          setToggle({
                            ...toggle,
                            edit: !toggle.edit,
                            audioCategory: false,
                            status: false,
                            elders: false,
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
        </>
      )}
    </div>
  );
};

export default Elder;
