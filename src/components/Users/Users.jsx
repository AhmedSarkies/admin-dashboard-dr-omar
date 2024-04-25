import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Spinner } from "reactstrap";
import { deleteUser, getUsers, updateUser } from "../../store/slices/userSlice";
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";
import { useFiltration, useSchema } from "../../hooks";
import { useTranslation } from "react-i18next";
import { MdDeleteOutline, MdEdit } from "react-icons/md";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { useFormik } from "formik";
import { Modal, ModalBody, ModalHeader, Row, Col } from "reactstrap";
import { IoMdClose, IoMdEye } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import Cookies from "js-cookie";

const initialValues = {
  name: "",
  email: "",
  phone: "",
  password: "",
  confirmPassword: "",
  is_active: "",
};

const Users = () => {
  const { t } = useTranslation();
  const role = Cookies.get("_role");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { validationSchema } = useSchema();
  const { users, loading, error } = useSelector((state) => state.user);
  const [toggle, setToggle] = useState({
    showHidePassword: false,
    showHideConfirmedPassword: false,
    add: false,
    readMessage: false,
    is_active: false,
    searchTerm: "",
    activeColumn: false,
    activeRows: false,
    rowsPerPage: 5,
    currentPage: 1,
    sortColumn: "",
    sortOrder: "asc",
    toggleColumns: {
      id: true,
      name: true,
      email: true,
      phone: true,
      subscription: true,
      created_at: true,
      login_count: true,
      register_method: true,
      last_login: true,
      activation: true,
      control: true,
    },
  });

  // Formik
  const formik = useFormik({
    initialValues,
    validationSchema: validationSchema.user,
    onSubmit: (values) => {
      if (role === "admin") {
        // if email and phone is already exist with another user if just i change them to new values
        if (users.length > 0) {
          const emailExist = users.find(
            (user) => user.email === formik.values.email
          );
          if (emailExist && emailExist.id !== formik.values.id) {
            toast.error(t("emailExisted"));
            return;
          }
        }
        if (users.length > 0) {
          const phoneExist = users.find(
            (user) => user.phonenumber === formik.values.phone
          );
          if (phoneExist && phoneExist.id !== formik.values.id) {
            toast.error(t("phoneExisted"));
            return;
          }
        }
        const formData = new FormData();
        formData.append("id", values.id);
        formData.append("name", values.name);
        formData.append("email", values.email);
        formData.append("phonenumber", values.phone);
        formData.append("type", values.type);
        formData.append("is_active", values.is_active);
        if (values.password) {
          formData.append("password", values.password);
        }
        dispatch(updateUser(formData)).then((res) => {
          dispatch(getUsers());
          if (!res.error) {
            toast.success(t("toast.user.updatedSuccess"));
            formik.handleReset();
            setToggle({
              ...toggle,
              add: !toggle.add,
            });
          } else {
            toast.error(t("toast.user.updatedError"));
          }
        });
      }
    },
  });

  // handle Input Using Formik
  const handleInput = (e) => {
    formik.handleChange(e);
  };

  // Data
  const data = users?.map((user) => ({
    ...user,
    created_at: new Date(user.created_at).toLocaleDateString(),
    last_login: new Date(user.last_login).toLocaleDateString(),
    is_active: user.is_active === 1 ? t("active") : t("inactive"),
    privacy: user.privacy === "private" ? t("private") : t("public"),
  }));

  // Filtration, Sorting, Pagination
  // Columns
  const columns = [
    { id: 0, name: "id", label: t("index") },
    { id: 1, name: "name", label: t("user.columns.name") },
    { id: 2, name: "email", label: t("user.columns.email") },
    { id: 3, name: "phone", label: t("user.columns.phone") },
    { id: 4, name: "subscription", label: t("user.columns.subscription") },
    { id: 5, name: "created_at", label: t("user.columns.created_at") },
    { id: 6, name: "login_count", label: t("user.columns.login_count") },
    {
      id: 7,
      name: "register_method",
      label: t("user.columns.register_method"),
    },
    { id: 8, name: "last_login", label: t("user.columns.last_login") },
    { id: 9, name: "activation", label: t("activation") },
    { id: 10, name: "control", label: t("action") },
  ];
  const {
    PaginationUI,
    handleSort,
    handleSearch,
    handleToggleColumns,
    searchResultsUser,
  } = useFiltration({
    rowData: data,
    toggle,
    setToggle,
  });

  // Delete User
  const handleDelete = (user) => {
    if (role === "admin") {
      Swal.fire({
        title: `هل انت متأكد من حذف ${user?.name}؟`,
        text: "لن تتمكن من التراجع عن هذا الاجراء!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#0d1d34",
        confirmButtonText: "نعم, احذفه!",
        cancelButtonText: "الغاء",
      }).then((result) => {
        if (result.isConfirmed) {
          dispatch(deleteUser(user.id)).then((res) => {
            if (!res.error) {
              if (searchResultsUser.length === 1) {
                setToggle({
                  ...toggle,
                  currentPage: 1,
                });
              }
              dispatch(getUsers());
              Swal.fire({
                title: `تم حذف ${user?.name}`,
                text: `تم حذف ${user?.name} بنجاح`,
                icon: "success",
                confirmButtonColor: "#0d1d34",
              }).then(() => toast.success(t("toast.user.deletedSuccess")));
            } else {
              toast.error(t("toast.user.deletedError"));
            }
          });
        }
      });
    }
  };

  // Edit User
  const handleEdit = (user) => {
    formik.setValues({
      id: user?.id,
      name: user?.name,
      email: user?.email,
      phone: user?.phonenumber,
      is_active: user?.is_active === t("active") ? 1 : 0,
      password: user?.password,
      type: user?.type,
    });
    setToggle({
      ...toggle,
      add: !toggle.add,
      is_active: false,
    });
  };

  // get data from api
  useEffect(() => {
    try {
      dispatch(getUsers());
    } catch (error) {
      console.log(error);
    }
  }, [dispatch]);

  return (
    <div className="scholar-container mt-4 m-sm-3 m-0">
      <div className="scholar">
        <div className="table-header">
          {/* Search */}
          <div
            className="search-container form-group-container form-input"
            style={{
              width: "45%",
            }}
          >
            <input
              type="text"
              className="form-input"
              placeholder={t("searchUser")}
              value={toggle.searchTerm}
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
              {toggle.toggleColumns?.subscription && (
                <th className="table-th" onClick={() => handleSort(columns[4])}>
                  {t("user.columns.subscription")}
                  {toggle.sortColumn === columns[4].name ? (
                    toggle.sortOrder === "asc" ? (
                      <TiArrowSortedUp />
                    ) : (
                      <TiArrowSortedDown />
                    )
                  ) : null}
                </th>
              )}
              {toggle.toggleColumns?.created_at && (
                <th className="table-th" onClick={() => handleSort(columns[5])}>
                  {t("user.columns.created_at")}
                  {toggle.sortColumn === columns[5].name ? (
                    toggle.sortOrder === "asc" ? (
                      <TiArrowSortedUp />
                    ) : (
                      <TiArrowSortedDown />
                    )
                  ) : null}
                </th>
              )}
              {toggle.toggleColumns?.login_count && (
                <th className="table-th" onClick={() => handleSort(columns[6])}>
                  {t("user.columns.login_count")}
                  {toggle.sortColumn === columns[6].name ? (
                    toggle.sortOrder === "asc" ? (
                      <TiArrowSortedUp />
                    ) : (
                      <TiArrowSortedDown />
                    )
                  ) : null}
                </th>
              )}
              {toggle.toggleColumns?.register_method && (
                <th className="table-th" onClick={() => handleSort(columns[7])}>
                  {t("user.columns.register_method")}
                  {toggle.sortColumn === columns[7].name ? (
                    toggle.sortOrder === "asc" ? (
                      <TiArrowSortedUp />
                    ) : (
                      <TiArrowSortedDown />
                    )
                  ) : null}
                </th>
              )}
              {toggle.toggleColumns?.last_login && (
                <th className="table-th" onClick={() => handleSort(columns[8])}>
                  {t("user.columns.last_login")}
                  {toggle.sortColumn === columns[8].name ? (
                    toggle.sortOrder === "asc" ? (
                      <TiArrowSortedUp />
                    ) : (
                      <TiArrowSortedDown />
                    )
                  ) : null}
                </th>
              )}
              {toggle.toggleColumns?.activation && (
                <th className="table-th">{t("activation")}</th>
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
                <td className="table-td" colSpan="9">
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
                <td className="table-td" colSpan="9">
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
          {searchResultsUser?.length === 0 && error === null && !loading && (
            <tbody>
              <tr className="no-data-container">
                <td className="table-td" colSpan="9">
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
                <td className="table-td" colSpan="9">
                  <p className="no-data no-columns mb-0">{t("noColumns")}</p>
                </td>
              </tr>
            </tbody>
          )}
          {/* Data */}
          {searchResultsUser?.length > 0 &&
            error === null &&
            loading === false && (
              <tbody>
                {searchResultsUser?.map((result, idx) => (
                  <tr key={result?.id + new Date().getDate()}>
                    {toggle.toggleColumns?.id && (
                      <td className="table-td">{idx + 1}#</td>
                    )}
                    {toggle.toggleColumns?.name && (
                      <td className="table-td name">
                        <Link
                          to={`/dr-omar/users/${result?.id}`}
                          className="scholar-link"
                        >
                          {result?.name}
                        </Link>
                      </td>
                    )}
                    {toggle.toggleColumns?.email && (
                      <td className="table-td email">
                        <a href={`mailto: ${result?.email}`}>{result?.email}</a>
                      </td>
                    )}
                    {toggle.toggleColumns?.phone && (
                      <td className="table-td phone">
                        <a href={`mailto:${result?.phonenumber}`}>
                          {result?.phonenumber}
                        </a>
                      </td>
                    )}
                    {toggle.toggleColumns?.subscription && (
                      <td className="table-td subscription">
                        <span
                          className={`status ${
                            result?.privacy === t("private")
                              ? "inactive"
                              : "active"
                          }`}
                        >
                          {result?.privacy}
                        </span>
                      </td>
                    )}
                    {toggle.toggleColumns?.created_at && (
                      <td className="table-td created_at">
                        {result?.created_at}
                      </td>
                    )}
                    {toggle.toggleColumns?.login_count && (
                      <td className="table-td login_count">
                        {result?.login_count}
                      </td>
                    )}
                    {toggle.toggleColumns?.register_method && (
                      <td className="table-td register_method">
                        {result?.register_method}
                      </td>
                    )}
                    {toggle.toggleColumns?.last_login && (
                      <td className="table-td last_login">
                        {result?.last_login}
                      </td>
                    )}
                    {toggle.toggleColumns?.activation && (
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
                                name: result.name,
                                email: result.email,
                                phonenumber: result.phonenumber,
                                is_active:
                                  result.is_active === t("active") ? 0 : 1,
                              };
                              dispatch(updateUser(data)).then((res) => {
                                if (!res.error) {
                                  dispatch(getUsers());
                                  toast.success(t("toast.user.updatedSuccess"));
                                } else {
                                  dispatch(getUsers());
                                  toast.error(t("toast.user.updatedError"));
                                }
                              });
                            }
                          }}
                        >
                          {result?.is_active}
                        </span>
                      </td>
                    )}
                    {toggle.toggleColumns?.control && (
                      <td className="table-td">
                        <span className="table-btn-container">
                          <IoMdEye
                            className="view-btn"
                            onClick={() =>
                              navigate(`/dr-omar/users/${result?.id}`)
                            }
                          />
                          {role === "admin" && (
                            <>
                              <MdDeleteOutline
                                className="delete-btn"
                                onClick={() => handleDelete(result)}
                              />
                              <MdEdit
                                className="edit-btn"
                                onClick={() => handleEdit(result)}
                              />
                            </>
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
      {searchResultsUser?.length > 0 && error === null && loading === false && (
        <PaginationUI />
      )}
      {role === "admin" && (
        <>
          {/* Add & Edit Sub Admin */}
          <Modal
            isOpen={toggle.add}
            toggle={() => {
              formik.handleReset();
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
                formik.handleReset();
                setToggle({
                  ...toggle,
                  add: !toggle.add,
                });
              }}
            >
              {t("user.editTitle")}
              <IoMdClose
                onClick={() => {
                  formik.handleReset();
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
                      <label htmlFor="name" className="form-label">
                        {t("user.columns.name")}
                      </label>
                      <input
                        type="text"
                        className="form-input"
                        id="name"
                        placeholder={t("user.columns.name")}
                        name="name"
                        value={formik.values.name}
                        onChange={handleInput}
                      />
                      {formik.errors.name && formik.touched.name ? (
                        <span className="error">{formik.errors.name}</span>
                      ) : null}
                    </div>
                    <div className="form-group-container d-flex flex-column align-items-end mb-3">
                      <label htmlFor="email" className="form-label">
                        {t("user.columns.email")}
                      </label>
                      <input
                        type="text"
                        className="form-input"
                        id="email"
                        placeholder={t("user.columns.email")}
                        name="email"
                        value={formik.values.email}
                        onChange={handleInput}
                      />
                      {formik.errors.email && formik.touched.email ? (
                        <span className="error">{formik.errors.email}</span>
                      ) : null}
                    </div>
                    <div className="form-group-container d-flex flex-column align-items-end mb-3">
                      <label htmlFor="phone" className="form-label">
                        {t("user.columns.phone")}
                      </label>
                      <input
                        type="text"
                        className="form-input"
                        id="phone"
                        placeholder={t("user.columns.phone")}
                        name="phone"
                        value={formik.values.phone}
                        onChange={handleInput}
                      />
                      {formik.errors.phone && formik.touched.phone ? (
                        <span className="error">{formik.errors.phone}</span>
                      ) : null}
                    </div>
                    <div className="form-group-container d-flex flex-column justify-content-center align-items-end mb-3">
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
                    </div>
                    <div className="form-group-container password d-flex flex-column align-items-end mb-3">
                      <label htmlFor="password" className="form-label">
                        {t("auth.login.password")}
                      </label>
                      <input
                        type={`${
                          toggle.showHidePassword ? "text" : "password"
                        }`}
                        className="form-input"
                        id="password"
                        placeholder="********"
                        name="password"
                        value={formik.values.password}
                        onChange={handleInput}
                      />
                      <span className="show-hide-password">
                        {toggle.showHidePassword ? (
                          <FaRegEye
                            onClick={() =>
                              setToggle({
                                ...toggle,
                                showHidePassword: !toggle.showHidePassword,
                              })
                            }
                          />
                        ) : (
                          <FaRegEyeSlash
                            onClick={() =>
                              setToggle({
                                ...toggle,
                                showHidePassword: !toggle.showHidePassword,
                              })
                            }
                          />
                        )}
                      </span>
                      {formik.errors.password && formik.touched.password ? (
                        <span className="error">{formik.errors.password}</span>
                      ) : null}
                    </div>
                    <div className="form-group-container password d-flex flex-column align-items-end mb-3">
                      <label htmlFor="confirmPassword" className="form-label">
                        {t("auth.login.confirmPassword")}
                      </label>
                      <input
                        type={`${
                          toggle.showHideConfirmedPassword ? "text" : "password"
                        }`}
                        className="form-input"
                        id="confirmPassword"
                        placeholder="********"
                        name="confirmPassword"
                        value={formik.values.confirmPassword}
                        onChange={handleInput}
                      />
                      <span className="show-hide-password">
                        {toggle.showHideConfirmedPassword ? (
                          <FaRegEye
                            onClick={() =>
                              setToggle({
                                ...toggle,
                                showHideConfirmedPassword:
                                  !toggle.showHideConfirmedPassword,
                              })
                            }
                          />
                        ) : (
                          <FaRegEyeSlash
                            onClick={() =>
                              setToggle({
                                ...toggle,
                                showHideConfirmedPassword:
                                  !toggle.showHideConfirmedPassword,
                              })
                            }
                          />
                        )}
                      </span>
                      {formik.errors.confirmPassword &&
                      formik.touched.confirmPassword ? (
                        <span className="error">
                          {formik.errors.confirmPassword}
                        </span>
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
                        ) : (
                          t("edit")
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

export default Users;
