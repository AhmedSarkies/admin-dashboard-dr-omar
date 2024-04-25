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
import { MdAdd, MdDeleteOutline } from "react-icons/md";
import { IoMdClose, IoMdEye } from "react-icons/io";
import { ImUpload } from "react-icons/im";
import { useFormik } from "formik";
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import { useFiltration, useSchema } from "../../hooks";
import anonymous from "../../assets/images/anonymous.png";
import { getUsers } from "../../store/slices/userSlice";
import {
  deleteNotification,
  getNotification,
  sendNotificationSelectedUsers,
} from "../../store/slices/notificationSlice";
import Swal from "sweetalert2";
import Cookies from "js-cookie";

const Notifications = () => {
  const { t } = useTranslation();
  const role = Cookies.get("_role");
  const dispatch = useDispatch();
  const { validationSchema } = useSchema();
  const { users } = useSelector((state) => state.user);
  const { notifications, loading, error } = useSelector(
    (state) => state.notification
  );
  const [load, setLoad] = useState(false);
  const [toggle, setToggle] = useState({
    is_user: false,
    add: false,
    edit: false,
    sendAll: false,
    sendOne: false,
    sendSelected: false,
    showNotification: false,
    searchTerm: "",
    searchTermUser: "",
    imagePreview: false,
    status: false,
    elders: false,
    pictureCategories: false,
    activeColumn: false,
    toggleColumns: {
      id: true,
      name: true,
      email: true,
      phone: true,
      image: true,
      title: true,
      body: true,
      control: true,
    },
    sortColumn: "",
    sortOrder: "asc",
    rowsPerPage: 20,
    currentPage: 1,
  });

  const filteredNotifications = notifications.filter((notification) => {
    return notification?.type?.toLowerCase() === "notification";
  });

  // Filtration, Sorting, Pagination
  const columns = [
    { id: 0, name: "id", label: t("index") },
    { id: 1, name: "name", label: t("user.columns.name") },
    { id: 2, name: "email", label: t("user.columns.email") },
    { id: 3, name: "phone", label: t("user.columns.phone") },
    { id: 4, name: "image", label: t("notifications.columns.image") },
    { id: 6, name: "title", label: t("notifications.columns.title") },
    { id: 7, name: "body", label: t("notifications.columns.body") },
    { id: 8, name: "control", label: t("action") },
  ];
  const {
    PaginationUI,
    handleSort,
    handleSearch,
    handleToggleColumns,
    handleSearchUser,
    searchResultsNotifications,
    searchResultsUsers,
  } = useFiltration({
    rowData: filteredNotifications,
    rowDataUser: users,
    toggle,
    setToggle,
  });

  // Formik
  const formik = useFormik({
    initialValues: {
      image: {
        file: "",
        preview: "",
      },
      title: "",
      description: "",
    },
    validationSchema: validationSchema.notifications,
    onSubmit: (values) => {
      if (role === "admin") {
        setLoad(true);
        const data = {
          user_ids: ids.length === 0 ? users.map((user) => user.id) : ids,
          title: values.title,
          body: values.description,
        };
        if (values.image.file) {
          data.image = values.image.file;
        }
        dispatch(sendNotificationSelectedUsers(data)).then((res) => {
          if (!res.error) {
            setLoad(false);
            dispatch(getUsers());
            dispatch(getNotification());
            setToggle({
              ...toggle,
              add: !toggle.add,
              sendSelected: !toggle.sendSelected,
              is_user: false,
            });
            setIds([]);
            formik.handleReset();
            toast.success(t("toast.notifications.addedSuccess"));
          } else {
            dispatch(getNotification());
            dispatch(getUsers());
            setLoad(false);
            toast.error(t("toast.notifications.addedError"));
          }
        });
      }
    },
  });

  // Show Notification
  const showNotification = (notification) => {
    setToggle({
      ...toggle,
      showNotification: !toggle.showNotification,
    });
    formik.setValues({
      title: notification?.notification?.title,
      description: notification?.notification?.body,
      image: {
        file: "",
        preview: notification?.notification?.image,
      },
      name: notification?.user?.name,
      email: notification?.user?.email,
      phone: notification?.user?.phonenumber,
    });
    setToggle({
      ...toggle,
      showNotification: !toggle.showNotification,
      add: !toggle.add,
    });
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

  // const handleAddOne = (user) => {
  //   setToggle({
  //     ...toggle,
  //     sendOne: !toggle.sendOne,
  //     add: !toggle.add,
  //   });
  //   formik.setFieldValue("user_id", user.id);
  // };

  // Delete Notification// Delete term And Condition
  const handleDelete = (notification) => {
    Swal.fire({
      title: t("titleDeleteAlert") + notification?.notification?.title + "?",
      text: t("textDeleteAlert"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#0d1d34",
      confirmButtonText: t("confirmButtonText"),
      cancelButtonText: t("cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteNotification(notification?.notification?.id)).then(
          (res) => {
            if (!res.error) {
              if (searchResultsNotifications.length === 1) {
                setToggle({
                  ...toggle,
                  currentPage: 1,
                });
              }
              dispatch(getNotification());
              Swal.fire({
                title: `${t("titleDeletedSuccess")} ${
                  notification?.notification?.title
                }`,
                text: `${t("titleDeletedSuccess")} ${
                  notification?.notification?.title
                } ${t("textDeletedSuccess")}`,
                icon: "success",
                confirmButtonColor: "#0d1d34",
                confirmButtonText: t("doneDeletedSuccess"),
              }).then(() =>
                toast.success(t("toast.notifications.deletedSuccess"))
              );
            } else {
              dispatch(getNotification());
              toast.error(t("toast.notifications.deletedError"));
            }
          }
        );
      }
    });
  };

  // get data from api
  useEffect(() => {
    try {
      dispatch(getNotification());
      if (role === "admin") {
        dispatch(getUsers());
      }
    } catch (error) {
      console.log(error);
    }
  }, [dispatch, role]);

  // Add just selected users to the list
  const [ids, setIds] = useState([]);
  const handleAddSelected = (e) => {
    const userId = +e.target.value;
    const isChecked = e.target.checked;
    if (isChecked) {
      setIds([...ids, userId]);
    } else {
      setIds(ids.filter((id) => id !== userId));
    }
  };

  // Add All id users to the list
  const handleAddAll = () => {
    if (ids.length === searchResultsUsers.length) {
      setIds([]);
      // Make All checkboxes Not checked
      const checkboxes = document.querySelectorAll(".checked");
      checkboxes.forEach((checkbox) => {
        checkbox.checked = false;
      });
      return;
    } else {
      const allIds = searchResultsUsers.map((user) => user.id);
      setIds(allIds);
      setToggle({
        ...toggle,
        sendSelected: true,
      });
      // Make All checkboxes checked
      const checkboxes = document.querySelectorAll(".checked");
      checkboxes.forEach((checkbox) => {
        checkbox.checked = true;
      });
    }
  };

  // Remove Any id not checked from the list
  useEffect(() => {
    const checkboxes = document.querySelectorAll(".checked");
    checkboxes.forEach((checkbox) => {
      const userId = +checkbox.value;
      if (!ids.includes(userId)) {
        checkbox.checked = false;
      }
    });
  }, [ids]);

  // close dropdown when click outside and remove selected users
  const ref = useRef();
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setToggle({
          ...toggle,
          is_user: false,
        });
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [ref, toggle]);

  return (
    <div className="scholar-container mt-4 m-sm-3 m-0">
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
            {t("notifications.addTitle")}
          </button>
        </div>
      )}
      <div className="scholar">
        <div className="table-header justify-content-end mb-0">
          <h3>{t("notifications.title")}</h3>
        </div>
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
              placeholder={t("searchNotification")}
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
              {toggle.toggleColumns?.id && (
                <th className="table-th">{t("index")}</th>
              )}
              {toggle.toggleColumns?.name && (
                <th className="table-th" onClick={() => handleSort(columns[1])}>
                  {t("user.columns.name")}
                  {toggle.sortColumn === columns[1].name ? (
                    toggle.sortOrder === "asc" ? (
                      <TiArrowSortedUp />
                    ) : (
                      <TiArrowSortedDown />
                    )
                  ) : null}
                </th>
              )}
              {toggle.toggleColumns?.email && (
                <th className="table-th" onClick={() => handleSort(columns[2])}>
                  {t("user.columns.email")}
                  {toggle.sortColumn === columns[2].name ? (
                    toggle.sortOrder === "asc" ? (
                      <TiArrowSortedUp />
                    ) : (
                      <TiArrowSortedDown />
                    )
                  ) : null}
                </th>
              )}
              {toggle.toggleColumns?.phone && (
                <th className="table-th" onClick={() => handleSort(columns[3])}>
                  {t("user.columns.phone")}
                  {toggle.sortColumn === columns[3].name ? (
                    toggle.sortOrder === "asc" ? (
                      <TiArrowSortedUp />
                    ) : (
                      <TiArrowSortedDown />
                    )
                  ) : null}
                </th>
              )}
              {toggle.toggleColumns?.image && (
                <th className="table-th" onClick={() => handleSort(columns[4])}>
                  {t("notifications.columns.image")}
                  {toggle.sortColumn === columns[4].name ? (
                    toggle.sortOrder === "asc" ? (
                      <TiArrowSortedUp />
                    ) : (
                      <TiArrowSortedDown />
                    )
                  ) : null}
                </th>
              )}
              {toggle.toggleColumns?.title && (
                <th className="table-th" onClick={() => handleSort(columns[5])}>
                  {t("notifications.columns.title")}
                  {toggle.sortColumn === columns[5].name ? (
                    toggle.sortOrder === "asc" ? (
                      <TiArrowSortedUp />
                    ) : (
                      <TiArrowSortedDown />
                    )
                  ) : null}
                </th>
              )}
              {toggle.toggleColumns?.body && (
                <th className="table-th" onClick={() => handleSort(columns[6])}>
                  {t("notifications.columns.body")}
                  {toggle.sortColumn === columns[6].name ? (
                    toggle.sortOrder === "asc" ? (
                      <TiArrowSortedUp />
                    ) : (
                      <TiArrowSortedDown />
                    )
                  ) : null}
                </th>
              )}
              {toggle.toggleColumns?.control && (
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
          {searchResultsNotifications?.length === 0 &&
            error === null &&
            !loading && (
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
          {searchResultsNotifications?.length > 0 &&
            error === null &&
            loading === false && (
              <tbody>
                {searchResultsNotifications?.map((result, idx) => (
                  <tr key={idx}>
                    {toggle.toggleColumns?.id && (
                      <td className="table-td">{idx + 1}#</td>
                    )}
                    {toggle.toggleColumns.name && (
                      <td className="table-td name">{result?.user?.name}</td>
                    )}
                    {toggle.toggleColumns.email && (
                      <td className="table-td email">
                        <a href={`mailto:${result?.user?.email}`}>
                          {result?.user?.email}
                        </a>
                      </td>
                    )}
                    {toggle.toggleColumns.phone && (
                      <td className="table-td phonenumber">
                        <a href={`mailto:${result?.user?.phonenumber}`}>
                          {result?.user?.phonenumber}
                        </a>
                      </td>
                    )}
                    {toggle.toggleColumns.image && (
                      <td className="table-td">
                        <img
                          src={result?.notification?.image}
                          alt={result?.notification?.title || "avatar"}
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
                      <td className="table-td title">
                        {result?.notification?.title}
                      </td>
                    )}
                    {toggle.toggleColumns.body && (
                      <td className="table-td body">
                        {result?.notification?.body}
                      </td>
                    )}
                    {toggle.toggleColumns.control && (
                      <td className="table-td">
                        <span className="table-btn-container">
                          <IoMdEye
                            className="view-btn"
                            onClick={() => showNotification(result)}
                          />
                          {role === "admin" && (
                            <MdDeleteOutline
                              className="delete-btn"
                              onClick={() => handleDelete(result)}
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
      {searchResultsNotifications?.length > 0 &&
        error === null &&
        loading === false && <PaginationUI />}
      {/* Add Notifications */}
      <Modal
        isOpen={toggle.add}
        toggle={() => {
          setToggle({
            ...toggle,
            add: !toggle.add,
            showNotification: false,
            is_user: false,
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
              add: !toggle.add,
            });
            formik.handleReset();
          }}
        >
          {toggle.showNotification
            ? formik.values.title
            : t("notifications.addTitle")}
          <IoMdClose
            onClick={() => {
              setToggle({
                ...toggle,
                add: !toggle.add,
                showNotification: false,
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
                      {!toggle.showNotification && (
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
                              {t("delete")}
                            </button>
                          </div>
                        </ModalFooter>
                      )}
                    </Modal>
                  </label>
                </div>
                {!toggle.showNotification && (
                  <>
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
                    {formik.errors.image && formik.touched.image ? (
                      <span className="error text-center">
                        {formik.errors.image}
                      </span>
                    ) : null}
                  </>
                )}
              </Col>
              <Col
                lg={12}
                className={`${!toggle.showNotification ? "mb-5" : "mb-3"}`}
              >
                <div
                  className="form-group-container d-flex flex-column align-items-end mb-3"
                  style={{ marginTop: "-4px" }}
                >
                  <label htmlFor="title" className="form-label">
                    {t("notifications.columns.title")}
                  </label>
                  <input
                    type="text"
                    className="form-input w-100"
                    id="title"
                    placeholder={t("notifications.columns.title")}
                    name="title"
                    value={formik.values.title}
                    disabled={toggle.showNotification}
                    onChange={formik.handleChange}
                  />
                  {formik.errors.title && formik.touched.title ? (
                    <span className="error">{formik.errors.title}</span>
                  ) : null}
                </div>
                <div className="form-group-container d-flex flex-column align-items-end mt-3">
                  <label htmlFor="body" className="form-label">
                    {t("notifications.columns.body")}
                  </label>
                  <textarea
                    className="form-input"
                    id="body"
                    placeholder={t("notifications.columns.body")}
                    name="description"
                    disabled={toggle.showNotification}
                    value={formik.values.description}
                    onChange={formik.handleChange}
                  ></textarea>
                  {formik.errors.description && formik.touched.description ? (
                    <span className="error">{formik.errors.description}</span>
                  ) : null}
                </div>
                <div className="form-group-container d-flex flex-column align-items-end mt-3">
                  <label htmlFor="user" className="form-label">
                    {t("user.title")}
                  </label>
                  <div
                    className="dropdown dropdown-users form-input p-0"
                    ref={ref}
                  >
                    <button
                      type="button"
                      className="dropdown-btn d-flex justify-content-between align-items-center"
                    >
                      <input
                        type="text"
                        className="form-input border-0 search-dropdown"
                        placeholder={t("searchUserDropDown")}
                        dir="ltr"
                        focused={toggle.is_user === true ? "true" : "false"}
                        onClick={() => setToggle({ ...toggle, is_user: true })}
                        onChange={handleSearchUser}
                      />
                      <TiArrowSortedUp
                        className={`dropdown-icon ${
                          toggle.is_user ? "active" : ""
                        }`}
                        onClick={() =>
                          setToggle({ ...toggle, is_user: !toggle.is_user })
                        }
                      />
                    </button>
                    <div
                      className={`dropdown-content ${
                        toggle.is_user ? "active" : ""
                      }`}
                      style={{
                        top: "102%",
                      }}
                    >
                      {searchResultsUsers.length === 0 ? (
                        <label className="item form-label d-flex justify-content-end align-items-center gap-2 m-0">
                          {t("noData")}
                        </label>
                      ) : (
                        <>
                          <label
                            htmlFor="users_all"
                            className={`item ${
                              ids.length === users.length ? "active" : ""
                            } item form-label d-flex justify-content-end align-items-center gap-2 m-0`}
                          >
                            {t("user.columns.selectAll")}
                            <input
                              type="checkbox"
                              className="checkbox"
                              id="users_all"
                              checked={ids.length === users.length}
                              onClick={handleAddAll}
                              readOnly
                            />
                          </label>
                          {searchResultsUsers.map((user, idx) => {
                            const match = ids.includes(+user.id);
                            const active = match ? "active" : "";
                            return (
                              <label
                                key={idx}
                                htmlFor={`user_${user?.id}`}
                                className={`${active} item form-label d-flex justify-content-end align-items-center gap-2 m-0`}
                              >
                                {user.email}
                                <input
                                  type="checkbox"
                                  id={`user_${user?.id}`}
                                  className={`checked-${user?.id} checked`}
                                  value={user?.id}
                                  onChange={handleAddSelected}
                                  readOnly
                                />
                              </label>
                            );
                          })}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </Col>
              {toggle.showNotification && (
                <Col lg={12} className="mb-5">
                  <div
                    className="form-group-container d-flex flex-column align-items-end mb-3"
                    style={{ marginTop: "-4px" }}
                  >
                    <label htmlFor="name" className="form-label">
                      {t("user.columns.name")}
                    </label>
                    <input
                      type="text"
                      className="form-input w-100"
                      id="name"
                      placeholder={t("user.columns.name")}
                      name="name"
                      value={formik.values.name}
                      disabled={toggle.showNotification}
                    />
                  </div>
                  <div
                    className="form-group-container d-flex flex-column align-items-end mb-3"
                    style={{ marginTop: "-4px" }}
                  >
                    <label htmlFor="email" className="form-label">
                      {t("user.columns.email")}
                    </label>
                    <input
                      type="text"
                      className="form-input w-100"
                      id="email"
                      placeholder={t("notifications.columns.email")}
                      name="email"
                      value={formik.values.email}
                      disabled={toggle.showNotification}
                    />
                  </div>
                  <div
                    className="form-group-container d-flex flex-column align-items-end mb-3"
                    style={{ marginTop: "-4px" }}
                  >
                    <label htmlFor="phone" className="form-label">
                      {t("user.columns.phone")}
                    </label>
                    <input
                      type="text"
                      className="form-input w-100"
                      id="phone"
                      placeholder={t("user.columns.phone")}
                      name="phone"
                      value={formik.values.phone}
                      disabled={toggle.showNotification}
                    />
                  </div>
                </Col>
              )}
              <Col lg={12}>
                <div className="form-group-container d-flex flex-row-reverse justify-content-lg-start justify-content-center gap-3">
                  {!toggle.showNotification && (
                    <button
                      type="submit"
                      className="add-btn"
                      style={{
                        cursor: load ? "not-allowed" : "pointer",
                        pointerEvents: load ? "none" : "auto",
                      }}
                    >
                      {/* loading */}
                      {load ? (
                        <span
                          className="spinner-border spinner-border-sm"
                          role="status"
                          aria-hidden="true"
                        ></span>
                      ) : (
                        t("send")
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
                        showNotification: false,
                        is_user: false,
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

export default Notifications;
