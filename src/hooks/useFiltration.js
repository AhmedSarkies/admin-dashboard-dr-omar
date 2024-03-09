import React from "react";
import { TiArrowLeft, TiArrowRight, TiArrowSortedUp } from "react-icons/ti";

const useFiltration = ({ rowData, toggle, setToggle }) => {
  // TODO: Pagination
  // Logic Pagination
  const startPoint = (toggle.currentPage - 1) * toggle.rowsPerPage;
  const endPoint = toggle.currentPage * toggle.rowsPerPage;
  const totalPages = Math.ceil(rowData.length / toggle.rowsPerPage);
  let results = rowData.slice(startPoint, endPoint);

  // UI Pagination
  const PaginationUI = () => (
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
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index + new Date().getDate()}
            className={`pagination-btn ${
              toggle.currentPage === index + 1 ? "active" : ""
            }`}
            onClick={() =>
              setToggle({
                ...toggle,
                currentPage: index + 1,
              })
            }
          >
            {index + 1}
          </button>
        ))}
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
            Math.ceil(rowData.length / toggle.rowsPerPage)
          }
        >
          <TiArrowRight />
        </button>
      </div>
    </div>
  );
  // TODO: Sorting
  // Sorting
  results.sort((firstRow, otherRow) =>
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

  // TODO: Filtration
  // Search
  const handleSearch = (e) => {
    setToggle({
      ...toggle,
      searchTerm: e.target.value,
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
  if (toggle.searchTerm !== "") {
    results = results.filter((dataRow) =>
      Object.values(dataRow).some((val) =>
        String(val)?.toLowerCase().includes(toggle.searchTerm?.toLowerCase())
      )
    );
  }

  return {
    PaginationUI,
    handleSort,
    handleSearch,
    handleToggleColumns,
    results,
    rowData,
  };
};

export default useFiltration;
