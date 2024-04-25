import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";

import { Spinner } from "reactstrap";

import { getMostListening } from "../../store/slices/mostListeningSlice";

import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";
import { useFiltration } from "../../hooks";
import { useTranslation } from "react-i18next";
const MostListening = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { mostListening, loading, error } = useSelector(
    (state) => state.mostListening
  );
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
      imageElder: true,
      nameElder: true,
      image: true,
      title: true,
      audio: true,
      status: true,
      shares: true,
      visits: true,
      favorites: true,
      downloads: true,
      activation: true,
      control: false,
    },
  });

  const data = mostListening?.map((item) => {
    return {
      ...item,
      categories: item?.categories[0],
      is_active: item?.is_active === 1 ? t("active") : t("inactive"),
      status: item?.status === "public" ? t("public") : t("private"),
    };
  });

  // Filtration, Sorting, Pagination
  // Columns
  const columns = [
    { id: 0, name: "id", label: t("index") },
    {
      id: 1,
      name: "imageElder",
      label: t("mostListening.columns.elder.image"),
    },
    { id: 2, name: "nameElder", label: t("mostListening.columns.elder.name") },
    { id: 3, name: "image", label: t("mostListening.columns.audio.image") },
    { id: 4, name: "title", label: t("mostListening.columns.audio.title") },
    { id: 5, name: "audio", label: t("mostListening.columns.audio.audio") },
    { id: 6, name: "shares", label: t("shares") },
    { id: 7, name: "visits", label: t("visits") },
    { id: 8, name: "favorites", label: t("favorites") },
    { id: 9, name: "downloads", label: t("downloads") },
    { id: 10, name: "activation", label: t("activation") },
    { id: 11, name: "status", label: t("content") },
  ];
  const {
    PaginationUI,
    handleSort,
    handleSearch,
    handleToggleColumns,
    searchResults,
  } = useFiltration({
    rowData: data,
    toggle,
    setToggle,
  });

  // get data from api
  useEffect(() => {
    try {
      dispatch(getMostListening());
    } catch (error) {
      console.log(error);
    }
  }, [dispatch]);

  return (
    <div className="audio-container scholar-container mt-4 m-sm-3 m-0">
      <div className="table-header justify-content-end">
        <h2>{t("mostListening.title")}</h2>
      </div>
      <div className="audio scholar">
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
              placeholder={t("searchAudio")}
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
              {/* Show and Hide Columns */}
              {toggle.toggleColumns.id && (
                <th className="table-th">{t("index")}</th>
              )}
              {toggle.toggleColumns.imageElder && (
                <th className="table-th" onClick={() => handleSort(columns[0])}>
                  {t("mostListening.columns.elder.image")}
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
                  {t("mostListening.columns.elder.name")}
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
                  {t("mostListening.columns.audio.image")}
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
                  {t("mostListening.columns.audio.title")}
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
                  {t("mostListening.columns.audio.audio")}
                  {toggle.sortColumn === columns[4].name ? (
                    toggle.sortOrder === "asc" ? (
                      <TiArrowSortedUp />
                    ) : (
                      <TiArrowSortedDown />
                    )
                  ) : null}
                </th>
              )}
              {toggle.toggleColumns.visits && (
                <th className="table-th" onClick={() => handleSort(columns[5])}>
                  {t("visits")}
                  {toggle.sortColumn === columns[5].name ? (
                    toggle.sortOrder === "asc" ? (
                      <TiArrowSortedUp />
                    ) : (
                      <TiArrowSortedDown />
                    )
                  ) : null}
                </th>
              )}
              {toggle.toggleColumns.favorites && (
                <th className="table-th" onClick={() => handleSort(columns[6])}>
                  {t("favorites")}
                  {toggle.sortColumn === columns[6].name ? (
                    toggle.sortOrder === "asc" ? (
                      <TiArrowSortedUp />
                    ) : (
                      <TiArrowSortedDown />
                    )
                  ) : null}
                </th>
              )}
              {toggle.toggleColumns.downloads && (
                <th className="table-th" onClick={() => handleSort(columns[7])}>
                  {t("downloads")}
                  {toggle.sortColumn === columns[7].name ? (
                    toggle.sortOrder === "asc" ? (
                      <TiArrowSortedUp />
                    ) : (
                      <TiArrowSortedDown />
                    )
                  ) : null}
                </th>
              )}
              {toggle.toggleColumns.shares && (
                <th className="table-th" onClick={() => handleSort(columns[8])}>
                  {t("shares")}
                  {toggle.sortColumn === columns[8].name ? (
                    toggle.sortOrder === "asc" ? (
                      <TiArrowSortedUp />
                    ) : (
                      <TiArrowSortedDown />
                    )
                  ) : null}
                </th>
              )}
              {toggle.toggleColumns.activation && (
                <th className="table-th" onClick={() => handleSort(columns[9])}>
                  {t("activation")}
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
            </tr>
          </thead>
          {/* Error */}
          {error !== null && loading === false && (
            <tbody>
              <tr className="no-data-container">
                <td className="table-td" colSpan="12">
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
                <td className="table-td" colSpan="12">
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
                <td className="table-td" colSpan="12">
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
                <td className="table-td" colSpan="12">
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
                  {toggle.toggleColumns.activation && (
                    <td className="table-td">
                      <span
                        className="table-status badge"
                        style={{
                          backgroundColor:
                            result?.is_active === t("active") ? "green" : "red",
                        }}
                      >
                        {result?.is_active}
                      </span>
                    </td>
                  )}
                  {toggle.toggleColumns.status && (
                    <td className="table-td">
                      <span
                        className="table-status badge"
                        style={{
                          backgroundColor:
                            result?.status === t("public") ? "green" : "red",
                        }}
                      >
                        {result?.status}
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
      {searchResults?.length > 0 && error === null && loading === false && (
        <PaginationUI />
      )}
    </div>
  );
};

export default MostListening;
