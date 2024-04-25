import React from "react";
import { TiArrowLeft, TiArrowRight, TiArrowSortedUp } from "react-icons/ti";

const useFiltration = ({ rowData, rowDataUser, toggle, setToggle }) => {
  // TODO: Pagination
  // Logic Pagination
  const startPoint = (toggle.currentPage - 1) * toggle.rowsPerPage;
  const endPoint = toggle.currentPage * toggle.rowsPerPage;
  const totalPages = Math.ceil(rowData?.length / toggle.rowsPerPage);
  const results = rowData?.slice(startPoint, endPoint);

  // UI Pagination
  const PaginationUI = () =>
    toggle.searchTerm === "" && (
      <div className="d-flex justify-content-between align-items-center p-3">
        {/* Dropdown to show row from 5 rows to 100 rows increase 5 rows every time and staring from 5 rows*/}
        <div className="dropdown rows form-input">
          <button
            type="button"
            onClick={() => {
              setToggle({
                ...toggle,
                activeRows: !toggle.activeRows,
              });
            }}
            className="dropdown-btn d-flex justify-content-between align-items-center"
          >
            <span>{toggle.rowsPerPage}</span>
            <TiArrowSortedUp
              className={`dropdown-icon ${toggle.activeRows ? "active" : ""}`}
            />
          </button>
          <div
            className={`dropdown-content ${toggle.activeRows ? "active" : ""}`}
            style={{
              width: "100px",
            }}
          >
            {Array(20)
              .fill(0)
              .map((_, index) => (
                <button
                  type="button"
                  key={index + new Date().getDate()}
                  className="item d-flex justify-content-center align-content-center"
                  onClick={() => {
                    setToggle({
                      ...toggle,
                      rowsPerPage: (index + 1) * 5,
                      currentPage: 1,
                      activeRows: !toggle.activeRows,
                    });
                  }}
                >
                  {(index + 1) * 5}
                </button>
              ))}
          </div>
        </div>
        {/* Pagination Buttons */}
        <div className="pagination-container">
          <button
            className="pagination-btn"
            onClick={() =>
              toggle.currentPage > 1 &&
              setToggle({
                ...toggle,
                currentPage: toggle.currentPage - 1,
              })
            }
            disabled={toggle.currentPage === 1}
          >
            <TiArrowLeft />
          </button>
          {/* Button for the current page */}
          <button className="pagination-btn">{toggle.currentPage}</button>
          <span>of</span>
          {/* Button for the total pages */}
          <button className="pagination-btn">{totalPages}</button>
          <button
            className="pagination-btn"
            onClick={() =>
              toggle.currentPage < totalPages &&
              setToggle({
                ...toggle,
                currentPage: toggle.currentPage + 1,
              })
            }
            disabled={
              toggle.currentPage ===
              Math.ceil(rowData?.length / toggle.rowsPerPage)
            }
          >
            <TiArrowRight />
          </button>
        </div>
      </div>
    );

  // TODO: Sorting
  // Sorting
  results?.sort((firstRow, otherRow) =>
    firstRow[toggle.sortColumn]
      ?.toString()
      .localeCompare(otherRow[toggle.sortColumn].toString())
  );
  if (toggle.sortOrder === "desc") {
    results.reverse();
  }

  // Handle Click on Column to Sort
  const handleSort = (column) => {
    setToggle({
      ...toggle,
      sortColumn: column.name,
      sortOrder: toggle.sortOrder === "asc" ? "desc" : "asc",
    });
  };

  // Filters Column
  const handleToggleColumns = (column) => {
    setToggle({
      ...toggle,
      activeColumn: true,
      toggleColumns: {
        ...toggle.toggleColumns,
        [column]: !toggle.toggleColumns[column],
      },
    });
  };

  // TODO: Filtration
  // Search
  const handleSearch = (e) => {
    setToggle({
      ...toggle,
      searchTerm: e.target.value,
    });
  };
  const handleSearchUser = (e) => {
    setToggle({
      ...toggle,
      searchTermUser: e.target.value,
    });
  };

  // Search Filter Results without any link
  const searchResults =
    toggle.searchTerm && toggle.searchTerm !== ""
      ? rowData?.filter((dataRow) => {
          return Object.values(dataRow).some(
            (val) =>
              !String(val).includes("https://") &&
              String(val)
                ?.toLowerCase()
                .includes(toggle.searchTerm?.toLowerCase())
          );
        })
      : results;

  // Search images using just category
  const searchResultsImagesCategory =
    toggle.searchTerm && toggle.searchTerm !== ""
      ? rowData?.filter((dataRow) => {
          return (
            dataRow?.image_category?.title
              ?.toLowerCase()
              .includes(toggle.searchTerm?.toLowerCase()) ||
            dataRow?.status
              ?.toLowerCase()
              .includes(toggle.searchTerm?.toLowerCase()) ||
            dataRow?.is_active
              ?.toLowerCase()
              .includes(toggle.searchTerm?.toLowerCase())
          );
        })
      : results;

  // Search books using just category and title
  const searchResultsBookSCategoryAndTitle =
    toggle.searchTerm && toggle.searchTerm !== ""
      ? rowData?.filter((dataRow) => {
          return (
            dataRow?.categories?.title
              ?.toLowerCase()
              .includes(toggle.searchTerm?.toLowerCase()) ||
            dataRow?.name
              ?.toLowerCase()
              .includes(toggle.searchTerm?.toLowerCase()) ||
            dataRow?.status
              ?.toLowerCase()
              .includes(toggle.searchTerm?.toLowerCase()) ||
            dataRow?.is_active
              ?.toLowerCase()
              .includes(toggle.searchTerm?.toLowerCase())
          );
        })
      : results;

  // Search Audio using just category and title and author
  const searchResultsAudioSCategoryAndTitleAndAuthor =
    toggle.searchTerm && toggle.searchTerm !== ""
      ? rowData?.filter((dataRow) => {
          return (
            dataRow?.categories?.title
              ?.toLowerCase()
              .includes(toggle.searchTerm?.toLowerCase()) ||
            dataRow?.title
              ?.toLowerCase()
              .includes(toggle.searchTerm?.toLowerCase()) ||
            dataRow?.elder?.name
              ?.toLowerCase()
              .includes(toggle.searchTerm?.toLowerCase()) ||
            dataRow?.status
              ?.toLowerCase()
              .includes(toggle.searchTerm?.toLowerCase()) ||
            dataRow?.is_active
              ?.toLowerCase()
              .includes(toggle.searchTerm?.toLowerCase())
          );
        })
      : results;

  // Search Users using just name and email
  const searchResultsUsersSNameAndEmail =
    toggle.searchTerm && toggle.searchTerm !== ""
      ? rowData?.filter((dataRow) => {
          return (
            dataRow?.name
              ?.toLowerCase()
              .includes(toggle.searchTerm?.toLowerCase()) ||
            dataRow?.email
              ?.toLowerCase()
              .includes(toggle.searchTerm?.toLowerCase())
          );
        })
      : results;

  // Search Users using just name and email
  const searchResultsUsers =
    toggle.searchTermUser && toggle.searchTermUser !== ""
      ? rowDataUser?.filter((dataRow) => {
          return dataRow?.email
            ?.toLowerCase()
            .includes(toggle.searchTermUser?.toLowerCase());
        })
      : rowDataUser;

  // Search Articles using just category and title and author
  const searchResultsArticleSCategoryAndTitleAndAuthor =
    toggle.searchTerm && toggle.searchTerm !== ""
      ? rowData?.filter((dataRow) => {
          return (
            dataRow?.Category?.title
              ?.toLowerCase()
              .includes(toggle.searchTerm?.toLowerCase()) ||
            dataRow?.title
              ?.toLowerCase()
              .includes(toggle.searchTerm?.toLowerCase()) ||
            dataRow?.writer
              ?.toLowerCase()
              .includes(toggle.searchTerm?.toLowerCase()) ||
            dataRow?.status
              ?.toLowerCase()
              .includes(toggle.searchTerm?.toLowerCase()) ||
            dataRow?.is_active
              ?.toLowerCase()
              .includes(toggle.searchTerm?.toLowerCase())
          );
        })
      : results;

  // Search Notifications using title
  const searchResultsNotifications =
    toggle.searchTerm && toggle.searchTerm !== ""
      ? rowData?.filter((dataRow) => {
          return dataRow?.notification?.title
            ?.toLowerCase()
            .includes(toggle.searchTerm?.toLowerCase());
        })
      : results;

  const searchResultsAudioSCategoryAndTitleElder =
    toggle.searchTerm && toggle.searchTerm !== ""
      ? rowData?.filter((dataRow) => {
          return (
            dataRow?.categories?.title
              ?.toLowerCase()
              .includes(toggle.searchTerm?.toLowerCase()) ||
            dataRow?.title
              ?.toLowerCase()
              .includes(toggle.searchTerm?.toLowerCase()) ||
            dataRow?.status
              ?.toLowerCase()
              .includes(toggle.searchTerm?.toLowerCase()) ||
            dataRow?.is_active
              ?.toLowerCase()
              .includes(toggle.searchTerm?.toLowerCase())
          );
        })
      : results;

  const searchResultsElders =
    toggle.searchTerm && toggle.searchTerm !== ""
      ? rowData?.filter((dataRow) => {
          return (
            dataRow?.name
              ?.toLowerCase()
              .includes(toggle.searchTerm?.toLowerCase()) ||
            dataRow?.email
              ?.toLowerCase()
              .includes(toggle.searchTerm?.toLowerCase()) ||
            dataRow?.phone
              ?.toLowerCase()
              .includes(toggle.searchTerm?.toLowerCase()) ||
            dataRow?.address
              ?.toLowerCase()
              .includes(toggle.searchTerm?.toLowerCase()) ||
            dataRow?.status
              ?.toLowerCase()
              .includes(toggle.searchTerm?.toLowerCase()) ||
            dataRow?.is_active
              ?.toLowerCase()
              .includes(toggle.searchTerm?.toLowerCase())
          );
        })
      : results;

  const searchResultsBooks =
    toggle.searchTerm && toggle.searchTerm !== ""
      ? rowData?.filter((dataRow) => {
          return (
            dataRow?.name
              ?.toLowerCase()
              .includes(toggle.searchTerm?.toLowerCase()) ||
            dataRow?.author
              ?.toLowerCase()
              .includes(toggle.searchTerm?.toLowerCase()) ||
            dataRow?.status
              ?.toLowerCase()
              .includes(toggle.searchTerm?.toLowerCase()) ||
            dataRow?.is_active
              ?.toLowerCase()
              .includes(toggle.searchTerm?.toLowerCase())
          );
        })
      : results;

  const searchResultsUser =
    toggle.searchTerm && toggle.searchTerm !== ""
      ? rowData?.filter((dataRow) => {
          return (
            dataRow?.name
              ?.toLowerCase()
              .includes(toggle.searchTerm?.toLowerCase()) ||
            dataRow?.email
              ?.toLowerCase()
              .includes(toggle.searchTerm?.toLowerCase()) ||
            dataRow?.phone
              ?.toLowerCase()
              .includes(toggle.searchTerm?.toLowerCase()) ||
            dataRow?.register_method
              ?.toLowerCase()
              .includes(toggle.searchTerm?.toLowerCase()) ||
            dataRow?.privacy
              ?.toLowerCase()
              .includes(toggle.searchTerm?.toLowerCase())
          );
        })
      : results;

  const searchResultsSubSubBookCategories =
    toggle.searchTerm && toggle.searchTerm !== ""
      ? rowData?.filter((dataRow) => {
          return (
            dataRow?.title
              ?.toLowerCase()
              .includes(toggle.searchTerm?.toLowerCase()) ||
            dataRow?.BooksCategories?.title
              ?.toLowerCase()
              .includes(toggle.searchTerm?.toLowerCase())
          );
        })
      : results;

  const searchResultsNewUsers =
    toggle.searchTerm && toggle.searchTerm !== ""
      ? rowData?.filter((dataRow) => {
          return (
            dataRow?.name
              ?.toLowerCase()
              .includes(toggle.searchTerm?.toLowerCase()) ||
            dataRow?.email
              ?.toLowerCase()
              .includes(toggle.searchTerm?.toLowerCase()) ||
            dataRow?.phonenumber
              ?.toLowerCase()
              .includes(toggle.searchTerm?.toLowerCase()) ||
            dataRow?.type
              ?.toLowerCase()
              .includes(toggle.searchTerm?.toLowerCase()) ||
            dataRow?.privacy
              ?.toLowerCase()
              .includes(toggle.searchTerm?.toLowerCase()) ||
            dataRow?.is_active
              ?.toLowerCase()
              .includes(toggle.searchTerm?.toLowerCase()) ||
            dataRow?.type
              ?.toLowerCase()
              .includes(toggle.searchTerm?.toLowerCase()) ||
            dataRow?.email_verified_at
              ?.toLowerCase()
              .includes(toggle.searchTerm?.toLowerCase()) ||
            dataRow?.phone_verified_at
              ?.toLowerCase()
              .includes(toggle.searchTerm?.toLowerCase())
          );
        })
      : results;

  return {
    PaginationUI,
    handleSort,
    handleSearch,
    handleSearchUser,
    handleToggleColumns,
    searchResults,
    searchResultsElders,
    searchResultsUsersSNameAndEmail,
    searchResultsUsers,
    searchResultsUser,
    searchResultsNewUsers,
    searchResultsImagesCategory,
    searchResultsBookSCategoryAndTitle,
    searchResultsSubSubBookCategories,
    searchResultsAudioSCategoryAndTitleAndAuthor,
    searchResultsAudioSCategoryAndTitleElder,
    searchResultsArticleSCategoryAndTitleAndAuthor,
    searchResultsBooks,
    searchResultsNotifications,
  };
};

export default useFiltration;
