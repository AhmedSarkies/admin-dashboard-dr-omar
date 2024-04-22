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
      updated_at: true,
      email_verified_at: true,
      phone_verified_at: true,
    },
  });

  // Filtration, Sorting, Pagination
  // Columns
  const columns = [
    { id: 0, name: "id", label: t("index") },
    { id: 1, name: "name", label: t("newUsers.columns.name") },
    { id: 2, name: "email", label: t("newUsers.columns.email") },
    { id: 3, name: "phone", label: t("newUsers.columns.phone") },
    { id: 4, name: "created_at", label: t("newUsers.columns.created_at") },
    { id: 5, name: "updated_at", label: t("newUsers.columns.updated_at") },
    {
      id: 6,
      name: "email_verified_at",
      label: t("newUsers.columns.email_verified_at"),
    },
    {
      id: 7,
      name: "phone_verified_at",
      label: t("newUsers.columns.phone_verified_at"),
    },
  ];
  const { PaginationUI, handleSort, searchResults } = useFiltration({
    rowData: newUsers,
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
        <table className="table-body">
          <thead>
            <tr>
            {
              toggle.toggleColumns?.id && (
              <th className="table-th">{t("index")}</th>
              )
            }
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
              {toggle.toggleColumns?.created_at && (
                <th className="table-th" onClick={() => handleSort(columns[4])}>
                  {t("newUsers.columns.created_at")}
                  {toggle.sortColumn === columns[4].name ? (
                    toggle.sortOrder === "asc" ? (
                      <TiArrowSortedUp />
                    ) : (
                      <TiArrowSortedDown />
                    )
                  ) : null}
                </th>
              )}
              {toggle.toggleColumns?.updated_at && (
                <th className="table-th" onClick={() => handleSort(columns[5])}>
                  {t("newUsers.columns.updated_at")}
                  {toggle.sortColumn === columns[5].name ? (
                    toggle.sortOrder === "asc" ? (
                      <TiArrowSortedUp />
                    ) : (
                      <TiArrowSortedDown />
                    )
                  ) : null}
                </th>
              )}
              {toggle.toggleColumns?.email_verified_at && (
                <th className="table-th" onClick={() => handleSort(columns[6])}>
                  {t("newUsers.columns.email_verified_at")}
                  {toggle.sortColumn === columns[6].name ? (
                    toggle.sortOrder === "asc" ? (
                      <TiArrowSortedUp />
                    ) : (
                      <TiArrowSortedDown />
                    )
                  ) : null}
                </th>
              )}
              {toggle.toggleColumns?.phone_verified_at && (
                <th className="table-th" onClick={() => handleSort(columns[7])}>
                  {t("newUsers.columns.phone_verified_at")}
                  {toggle.sortColumn === columns[7].name ? (
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
          {searchResults?.length === 0 && error === null && !loading && (
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
          {searchResults?.length > 0 && error === null && loading === false && (
            <tbody>
              {searchResults?.map((result, idx) => (
                <tr key={result?.id + new Date().getDate()}>
                  {toggle.toggleColumns?.id && (
                    <td className="table-td">{idx + 1}#</td>
                  )}
                  {
                    toggle.toggleColumns?.name &&
                  <td className="table-td name">{result?.name}</td>
                  }
                  {
                    toggle.toggleColumns?.email &&
                  <td className="table-td email">
                    <a href={`mailto:${result?.email}`}>{result?.email}</a>
                  </td>
                  }
                  {
                    toggle.toggleColumns?.phone &&
                  <td className="table-td phone">
                    <a href={`mailto:${result?.phonenumber}`}>
                      {result?.phonenumber}
                    </a>
                  </td>
                  }
                  {
                    toggle.toggleColumns?.created_at &&
                  <td className="table-td created_at">
                    {new Date(result?.created_at).toLocaleDateString()}
                  </td>
                  }
                  {
                    toggle.toggleColumns?.updated_at &&
                  <td className="table-td updated_at">
                    {new Date(result?.updated_at).toLocaleDateString()}
                  </td>
                  }
                  {
                    toggle.toggleColumns?.email_verified_at &&
                  <td className="table-td email_verified_at">
                    {result?.email_verified_at === null ? (
                      <span
                        style={{
                          color: "#fff",
                          backgroundColor: "#dc3545",
                          padding: "0.2rem 0.5rem",
                          borderRadius: "0.2rem",
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
                        }}
                      >
                        {t("newUsers.columns.verified")}
                      </span>
                    )}
                  </td>
                  }
                  {
                    toggle.toggleColumns?.phone_verified_at &&
                  <td className="table-td phone_verified_at">
                    {result?.phone_verified_at === null ? (
                      <span
                        style={{
                          color: "#fff",
                          backgroundColor: "#dc3545",
                          padding: "0.2rem 0.5rem",
                          borderRadius: "0.2rem",
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
                        }}
                      >
                        {t("newUsers.columns.verified")}
                      </span>
                    )}
                  </td>
                  }
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>
      {/* Pagination */}
      {searchResults?.length > 0 && error === null && loading === false && (
        <PaginationUI />
      )}
    </div>
  );
};

export default NewUsers;
