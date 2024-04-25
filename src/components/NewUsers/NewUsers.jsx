import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Spinner } from "reactstrap";
import { getNewUsers } from "../../store/slices/userSlice";
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";
import { useFiltration } from "../../hooks";
import { useTranslation } from "react-i18next";

const NewUsers = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { newUsers, loading, error } = useSelector((state) => state.user);
  const [toggle, setToggle] = useState({
    add: false,
    readMessage: false,
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
      created_at: true,
      email_verified_at: true,
      phone_verified_at: true,
      subscription: true,
      login_count: true,
      register_method: true,
      activation: true,
    },
  });

  // Data
  const data = newUsers?.map((user) => ({
    ...user,
    created_at: new Date(user.created_at).toLocaleDateString(),
    updated_at: new Date(user.updated_at).toLocaleDateString(),
    email_verified_at:
      user.email_verified_at === null
        ? t("newUsers.columns.notVerified")
        : t("newUsers.columns.verified"),
    phone_verified_at:
      user.phone_verified_at === null
        ? t("newUsers.columns.notVerified")
        : t("newUsers.columns.verified"),
    is_active: user.is_active === 1 ? t("active") : t("inactive"),
    privacy: user.privacy === "public" ? t("public") : t("private"),
  }));

  // Filtration, Sorting, Pagination
  // Columns
  const columns = [
    { id: 0, name: "id", label: t("index") },
    { id: 1, name: "name", label: t("newUsers.columns.name") },
    { id: 2, name: "email", label: t("newUsers.columns.email") },
    { id: 3, name: "phone", label: t("newUsers.columns.phone") },
    { id: 4, name: "subscription", label: t("user.columns.subscription") },
    { id: 5, name: "created_at", label: t("user.columns.created_at") },
    { id: 6, name: "login_count", label: t("user.columns.login_count") },
    {
      id: 7,
      name: "register_method",
      label: t("user.columns.register_method"),
    },
    {
      id: 8,
      name: "email_verified_at",
      label: t("newUsers.columns.email_verified_at"),
    },
    {
      id: 9,
      name: "phone_verified_at",
      label: t("newUsers.columns.phone_verified_at"),
    },

    { id: 10, name: "activation", label: t("activation") },
  ];
  const {
    PaginationUI,
    handleSort,
    searchResultsNewUsers,
    handleToggleColumns,
    handleSearch,
  } = useFiltration({
    rowData: data,
    toggle,
    setToggle,
  });

  // get data from api
  useEffect(() => {
    try {
      dispatch(getNewUsers());
    } catch (error) {
      console.log(error);
    }
  }, [dispatch]);

  return (
    <div className="scholar-container mt-4 m-sm-3 m-0">
      <div className="table-header justify-content-end">
        <h2>{t("newUsers.title")}</h2>
      </div>
      <div className="scholar">
        <div className="table-header">
          {/* Search */}
          <div
            className="search-container form-group-container form-input"
            style={{
              width: "65%",
            }}
          >
            <input
              type="text"
              className="form-input"
              placeholder={t("searchNewUser")}
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
                  {t("newUsers.columns.name")}
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
                  {t("newUsers.columns.email")}
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
                  {t("newUsers.columns.phone")}
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
              {toggle.toggleColumns?.email_verified_at && (
                <th className="table-th" onClick={() => handleSort(columns[8])}>
                  {t("newUsers.columns.email_verified_at")}
                  {toggle.sortColumn === columns[8].name ? (
                    toggle.sortOrder === "asc" ? (
                      <TiArrowSortedUp />
                    ) : (
                      <TiArrowSortedDown />
                    )
                  ) : null}
                </th>
              )}
              {toggle.toggleColumns?.phone_verified_at && (
                <th className="table-th" onClick={() => handleSort(columns[9])}>
                  {t("newUsers.columns.phone_verified_at")}
                  {toggle.sortColumn === columns[9].name ? (
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
          {searchResultsNewUsers?.length === 0 &&
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
          {searchResultsNewUsers?.length > 0 &&
            error === null &&
            loading === false && (
              <tbody>
                {searchResultsNewUsers?.map((result, idx) => (
                  <tr key={result?.id + new Date().getDate()}>
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
                        {new Date(result?.created_at).toLocaleDateString()}
                      </td>
                    )}
                    {toggle.toggleColumns?.login_count && (
                      <td className="table-td login_count">
                        {result?.login_count}
                      </td>
                    )}
                    {toggle.toggleColumns?.register_method && (
                      <td className="table-td register_method">
                        {result?.type}
                      </td>
                    )}
                    {toggle.toggleColumns?.email_verified_at && (
                      <td className="table-td email_verified_at">
                        {result?.email_verified_at === t("inactive") ? (
                          <span
                            style={{
                              color: "#fff",
                              backgroundColor: "#dc3545",
                              padding: "0.2rem 0.5rem",
                              borderRadius: "0.2rem",
                              display: "inline-block",
                            }}
                          >
                            {t("newUsers.columns.notVerified")}
                          </span>
                        ) : (
                          <span
                            style={{
                              color: "#fff",
                              backgroundColor: "#28a745",
                              padding: "0.2rem 0.5rem",
                              borderRadius: "0.2rem",
                              display: "inline-block",
                            }}
                          >
                            {t("newUsers.columns.verified")}
                          </span>
                        )}
                      </td>
                    )}
                    {toggle.toggleColumns?.phone_verified_at && (
                      <td className="table-td phone_verified_at">
                        {result?.phone_verified_at === t("inactive") ? (
                          <span
                            style={{
                              color: "#fff",
                              backgroundColor: "#dc3545",
                              padding: "0.2rem 0.5rem",
                              borderRadius: "0.2rem",
                              display: "inline-block",
                            }}
                          >
                            {t("newUsers.columns.notVerified")}
                          </span>
                        ) : (
                          <span
                            style={{
                              color: "#fff",
                              backgroundColor: "#28a745",
                              padding: "0.2rem 0.5rem",
                              borderRadius: "0.2rem",
                              display: "inline-block",
                            }}
                          >
                            {t("newUsers.columns.verified")}
                          </span>
                        )}
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
                          }}
                        >
                          {result?.is_active}
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
      {searchResultsNewUsers?.length > 0 &&
        error === null &&
        loading === false && <PaginationUI />}
    </div>
  );
};

export default NewUsers;
