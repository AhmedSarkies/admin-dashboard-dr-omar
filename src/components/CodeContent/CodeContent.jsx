import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Col, Modal, ModalBody, ModalHeader, Row, Spinner } from "reactstrap";
import { MdEdit, MdSend } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import {
  getCodeContent,
  sendCodeContent,
  sendCodeContentAll,
  sendCodeContentArray,
  updateCodeContent,
} from "../../store/slices/codeContentSlice";
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";
import { toast } from "react-toastify";
import { useFiltration, useSchema } from "../../hooks";
import { getUsers } from "../../store/slices/userSlice";
import Swal from "sweetalert2";
import Cookies from "js-cookie";

const CodeContent = () => {
  const { t } = useTranslation();
  const role = Cookies.get("_role");
  const dispatch = useDispatch();
  const { validationSchema } = useSchema();
  const { users, loading, error } = useSelector((state) => state.user);
  const { codeContent } = useSelector((state) => state.codeContent);
  const [toggle, setToggle] = useState({
    add: false,
    show: false,
    checked: false,
    checkedAll: false,
    id: [],
    searchTerm: "",
    activeColumn: false,
    activeRows: false,
    rowsPerPage: 5,
    currentPage: 1,
    sortColumn: "",
    sortOrder: "asc",
    toggleColumns: {
      checkboxes: true,
      id: true,
      name: true,
      email: true,
      subscription: true,
      send: true,
    },
  });

  // Formik
  const formik = useFormik({
    initialValues: {
      User_id: "",
      code: "",
    },
    validationSchema: validationSchema.codeContent,
    onSubmit: (values) => {
      if (role === "admin") {
        if (values?.id) {
          dispatch(updateCodeContent(values)).then((res) => {
            if (!res.error) {
              setToggle({
                ...toggle,
                add: !toggle.add,
              });
              dispatch(getCodeContent());
              dispatch(getUsers());
              formik.handleReset();
              toast.success(t("toast.codeContent.updatedSuccess"));
            } else {
              dispatch(getCodeContent());
              dispatch(getUsers());
              toast.error(t("toast.codeContent.updatedError"));
            }
          });
        } else {
          dispatch(sendCodeContentAll(values)).then((res) => {
            if (!res.error) {
              setToggle({
                ...toggle,
                add: !toggle.add,
              });
              dispatch(getCodeContent());
              dispatch(getUsers());
              formik.handleReset();
              toast.success(t("toast.codeContent.addedSuccess"));
            } else {
              dispatch(getCodeContent());
              dispatch(getUsers());
              toast.error(t("toast.codeContent.addedError"));
            }
          });
        }
      }
    },
  });

  // Filtration, Sorting, Pagination
  // Columns
  const columns = [
    { id: 0, name: "checkboxes", label: t("checkboxes") },
    { id: 1, name: "id", label: t("index") },
    { id: 2, name: "name", label: t("user.columns.name") },
    { id: 3, name: "email", label: t("user.columns.email") },
    { id: 4, name: "subscription", label: t("user.columns.subscription") },
    { id: 5, name: "send", label: t("settings.codeContent.columns.send") },
  ];
  const { handleSort, handleSearch, handleToggleColumns } = useFiltration({
    rowData: users,
    toggle,
    setToggle,
  });

  // Filter Results
  const results =
    toggle.searchTerm && toggle.searchTerm !== ""
      ? users?.filter((dataRow) => {
          return (
            dataRow?.name
              ?.toLowerCase()
              .includes(toggle.searchTerm?.toLowerCase()) ||
            dataRow?.email
              ?.toLowerCase()
              .includes(toggle.searchTerm?.toLowerCase())
          );
        })
      : users;

  // Handle Add
  const handleAddOne = (user) => {
    Swal.fire({
      title: t("areYouSure"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: t("confirm"),
      cancelButtonText: t("cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(
          sendCodeContent({ User_id: user?.id, code: codeContent[0].code })
        ).then((res) => {
          if (!res.error) {
            dispatch(getCodeContent());
            dispatch(getUsers());
            Swal.fire({
              title: t("doneConfirm"),
              icon: "success",
            });
          }
        });
      }
    });
  };

  // Send Array
  const sendArray = (idsList) => {
    Swal.fire({
      title: t("areYouSure"),
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: t("confirm"),
      cancelButtonText: t("cancel"),
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(
          sendCodeContentArray({ user_ids: idsList, code: codeContent[0].code })
        ).then((res) => {
          if (!res.error) {
            dispatch(getCodeContent());
            dispatch(getUsers());
            Swal.fire({
              title: t("doneConfirm"),
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
      dispatch(getCodeContent());
      dispatch(getUsers());
      formik.setValues({
        id: codeContent[0]?.id,
        code: codeContent[0]?.code,
      });
      if (role !== "admin") {
        setToggle({
          ...toggle,
          toggleColumns: {
            ...toggle.toggleColumns,
            checkboxes: false,
            send: false,
          },
        });
      }
    } catch (error) {
      console.log(error);
    }
    // eslint-disable-next-line
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
    if (ids.length === users.length) {
      setIds([]);
      // Make All checkboxes Not checked
      const checkboxes = document.querySelectorAll(".checked");
      checkboxes.forEach((checkbox) => {
        checkbox.checked = false;
      });
      return;
    } else {
      const allIds = users.map((user) => user.id);
      setIds(allIds);
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

  return (
    <div className="scholar-container mt-4 m-sm-3 m-0">
      <div
        className="table-header"
        style={{
          margin: "1.5rem 0",
        }}
      >
        {role === "admin" && !loading && (
          <button
            className="add-btn send"
            onClick={() => {
              setToggle({
                ...toggle,
                add: !toggle.add,
                everyOne: true,
                edit: true,
              });
              dispatch(getCodeContent());
              formik.setValues({
                id: codeContent[0]?.id,
                code: codeContent[0]?.code,
              });
            }}
            style={{
              opacity: loading ? "0.5" : "1",
              pointerEvents: loading ? "none" : "auto",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? (
              <span
                className="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              ></span>
            ) : (
              <>
                <MdEdit />
                {t("settings.codeContent.editTitle")}
              </>
            )}
          </button>
        )}
        {!loading && (
          <button
            className="add-btn send"
            onClick={() => {
              setToggle({
                ...toggle,
                show: !toggle.show,
              });
              dispatch(getCodeContent());
              formik.setValues({
                id: codeContent[0]?.id,
                code: codeContent[0]?.code,
              });
            }}
            style={{
              opacity: loading ? "0.5" : "1",
              pointerEvents: loading ? "none" : "auto",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {t("settings.codeContent.showTitle")}
          </button>
        )}
        {role === "admin" && !loading && (
          <button
            className="add-btn send"
            onClick={() =>
              setToggle({
                ...toggle,
                add: !toggle.add,
                everyOne: true,
                edit: false,
              })
            }
            style={{
              opacity: loading ? "0.5" : "1",
              pointerEvents: loading ? "none" : "auto",
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading ? (
              <span
                className="spinner-border spinner-border-sm"
                role="status"
                aria-hidden="true"
              ></span>
            ) : (
              <>
                <MdSend />
                {t("settings.codeContent.addTitle")}
              </>
            )}
          </button>
        )}
      </div>
      <div className="scholar">
        <div className={`table-header ${ids.length > 0 ? "mb-3" : "mb-4"}`}>
          {/* Search */}
          <div
            className="search-container form-group-container form-input"
            style={{
              width: "40%",
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
              {columns
                .filter(
                  (column) =>
                    column.name !== "checkboxes" && column.name !== "send"
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
        {/* Send Selected Users */}
        {role === "admin" && ids.length > 0 && (
          <div className="table-header justify-content-start m-0">
            <button
              className="add-btn send"
              onClick={() => sendArray(ids)}
              style={{
                opacity: loading ? "0.5" : "1",
                pointerEvents: loading ? "none" : "auto",
                cursor: loading ? "not-allowed" : "pointer",
                fontSize: "0.8rem",
                padding: "0.2rem 0.75rem",
              }}
            >
              {loading ? (
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
              ) : (
                <>
                  <MdSend />
                  {t("send")}
                </>
              )}
            </button>
          </div>
        )}
        <table className="table-body">
          <thead>
            <tr>
              {role === "admin" && toggle.toggleColumns?.checkboxes && (
                <th className="table-th" onClick={handleAddAll}>
                  <input
                    type="checkbox"
                    className="checkbox"
                    checked={ids.length === users.length}
                    readOnly
                  />
                </th>
              )}
              {toggle.toggleColumns?.id && (
                <th className="table-th" onClick={() => handleSort(columns[1])}>
                  {t("index")}
                  {toggle.sortColumn === columns[1].name ? (
                    toggle.sortOrder === "asc" ? (
                      <TiArrowSortedUp />
                    ) : (
                      <TiArrowSortedDown />
                    )
                  ) : null}
                </th>
              )}
              {toggle.toggleColumns?.name && (
                <th className="table-th" onClick={() => handleSort(columns[2])}>
                  {t("user.columns.name")}
                  {toggle.sortColumn === columns[2].name ? (
                    toggle.sortOrder === "asc" ? (
                      <TiArrowSortedUp />
                    ) : (
                      <TiArrowSortedDown />
                    )
                  ) : null}
                </th>
              )}
              {toggle.toggleColumns?.email && (
                <th className="table-th" onClick={() => handleSort(columns[3])}>
                  {t("user.columns.email")}
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
              {role === "admin" && toggle.toggleColumns?.send && (
                <th className="table-th">
                  {t("settings.codeContent.columns.send")}
                </th>
              )}
            </tr>
          </thead>
          {/* Error */}
          {error !== null && loading === false && (
            <tbody>
              <tr className="no-data-container">
                <td className="table-td" colSpan={role === "admin" ? 6 : 5}>
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
                <td className="table-td" colSpan={role === "admin" ? 6 : 5}>
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
                <td className="table-td" colSpan={role === "admin" ? 6 : 5}>
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
                <td className="table-td" colSpan={role === "admin" ? 6 : 5}>
                  <p className="no-data no-columns mb-0">{t("noColumns")}</p>
                </td>
              </tr>
            </tbody>
          )}
          {/* Data */}
          {results?.length > 0 && error === null && loading === false && (
            <tbody>
              {results?.map((result, idx) => (
                <tr key={result?.id + new Date().getDate()}>
                  {role === "admin" && toggle.toggleColumns?.checkboxes && (
                    <td className="table-td">
                      <input
                        type="checkbox"
                        className={`checked-${result?.id} checked`}
                        value={result?.id}
                        onChange={handleAddSelected}
                      />
                    </td>
                  )}
                  {toggle.toggleColumns?.id && (
                    <td className="table-td">{idx + 1}#</td>
                  )}
                  {toggle.toggleColumns?.name && (
                    <td className="table-td name">{result?.name}</td>
                  )}
                  {toggle.toggleColumns?.email && (
                    <td className="table-td email">
                      <a href={`mailto:${result?.email}`}>{result?.email}</a>
                    </td>
                  )}
                  {toggle.toggleColumns?.subscription && (
                    <td className="table-td subscription">
                      <span
                        className={`status ${
                          result?.privacy === "private" ? "inactive" : "active"
                        }`}
                      >
                        {result?.privacy === "private"
                          ? t("private")
                          : t("public")}
                      </span>
                    </td>
                  )}
                  {role === "admin" && toggle.toggleColumns?.send && (
                    <td className="table-td send">
                      <MdSend
                        className="btn-edit"
                        style={{
                          color: "green",
                          cursor: "pointer",
                        }}
                        onClick={() => handleAddOne(result)}
                      />
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>
      {/* Add Book */}
      <Modal
        isOpen={toggle.show}
        toggle={() => {
          setToggle({
            ...toggle,
            show: !toggle.show,
          });
          formik.handleReset();
        }}
        centered={true}
        keyboard={true}
        size={"md"}
        contentClassName="modal-add-book modal-add-scholar"
      >
        <ModalHeader
          toggle={() => {
            setToggle({
              ...toggle,
              show: !toggle.add,
            });
            formik.handleReset();
          }}
        >
          {t("settings.codeContent.showTitle")}
          <IoMdClose
            onClick={() => {
              setToggle({
                ...toggle,
                show: !toggle.show,
              });
              formik.handleReset();
            }}
          />
        </ModalHeader>
        <ModalBody>
          <form className="overlay-form" onSubmit={formik.handleSubmit}>
            <Row className="d-flex justify-content-center align-items-center p-3">
              <Col lg={12}>
                {/* Code */}
                <div className="form-group-container d-flex flex-column align-items-end mb-3">
                  <label htmlFor="code" className="form-label">
                    {t("settings.codeContent.columns.code")}
                  </label>
                  <input
                    type="text"
                    id="code"
                    name="code"
                    className="form-input w-100"
                    placeholder={t("settings.codeContent.columns.code")}
                    disabled={true}
                    value={formik.values.code}
                  />
                  {formik.errors.code && formik.touched.code ? (
                    <span className="error">{formik.errors.code}</span>
                  ) : null}
                </div>
              </Col>
            </Row>
            <Row className="d-flex justify-content-center align-items-center p-3">
              <Col lg={12}>
                <div className="form-group-container d-flex flex-row-reverse justify-content-lg-start justify-content-center gap-3">
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => {
                      setToggle({
                        ...toggle,
                        show: !toggle.show,
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
      {role === "admin" && (
        <>
          {/* Add Book */}
          <Modal
            isOpen={toggle.add}
            toggle={() => {
              setToggle({
                ...toggle,
                add: !toggle.add,
              });
              formik.handleReset();
            }}
            centered={true}
            keyboard={true}
            size={"md"}
            contentClassName="modal-add-book modal-add-scholar"
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
              {toggle.add === true && toggle.edit === false
                ? t("settings.codeContent.addTitle")
                : t("settings.codeContent.editTitle")}
              <IoMdClose
                onClick={() => {
                  setToggle({
                    ...toggle,
                    add: !toggle.add,
                  });
                  formik.handleReset();
                }}
              />
            </ModalHeader>
            <ModalBody>
              <form className="overlay-form" onSubmit={formik.handleSubmit}>
                <Row className="d-flex justify-content-center align-items-center p-3">
                  <Col lg={12}>
                    {/* Code */}
                    <div className="form-group-container d-flex flex-column align-items-end mb-3">
                      <label htmlFor="code" className="form-label">
                        {t("settings.codeContent.columns.code")}
                      </label>
                      <input
                        type="text"
                        id="code"
                        name="code"
                        className="form-input w-100"
                        placeholder={t("settings.codeContent.columns.code")}
                        disabled={role === "admin" ? false : true}
                        value={formik.values.code}
                        onChange={formik.handleChange}
                      />
                      {formik.errors.code && formik.touched.code ? (
                        <span className="error">{formik.errors.code}</span>
                      ) : null}
                    </div>
                  </Col>
                </Row>
                <Row className="d-flex justify-content-center align-items-center p-3">
                  <Col lg={12}>
                    <div className="form-group-container d-flex flex-row-reverse justify-content-lg-start justify-content-center gap-3">
                      {role === "admin" && (
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
                          ) : toggle.add === true && toggle.edit === false ? (
                            t("settings.codeContent.addTitle")
                          ) : (
                            t("settings.codeContent.editTitle")
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

export default CodeContent;
