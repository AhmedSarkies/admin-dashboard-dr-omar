import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Spinner } from "reactstrap";
import { getUsers } from "../../store/slices/userSlice";
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";
import { useFiltration } from "../../hooks";
import { useTranslation } from "react-i18next";
import { MdDeleteOutline, MdEdit } from "react-icons/md";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import { Modal, ModalBody, ModalHeader, Row, Col } from "reactstrap";
import { IoMdClose } from "react-icons/io";
import { Link, useParams } from "react-router-dom";

const User = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { users, loading, error } = useSelector((state) => state.user);
  const [toggle, setToggle] = useState({
    user: {},
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
      control: true,
      favorite_count_articles: true,
      favorite_count_books: true,
      favorite_count_audios: true,
      favorite_count_images: true,
      favorite_count_elders: true,
      download_count_articles: true,
      download_count_books: true,
      download_count_audios: true,
      download_count_images: true,
      download_count_elders: true,
      elders: {
        image: true,
        name: true,
        email: true,
        phone: true,
        status: true,
      },
      books: {
        image: true,
        title: true,
        book: true,
        status: true,
      },
    },
  });

  // Filtration, Sorting, Pagination
  // Columns
  const columns = [
    { id: 0, name: "id", label: t("user.columns.id") },
    { id: 1, name: "name", label: t("user.columns.name") },
    { id: 2, name: "email", label: t("user.columns.email") },
    { id: 3, name: "phone", label: t("user.columns.phone") },
    { id: 4, name: "created_at", label: t("user.columns.created_at") },
    {
      id: 5,
      name: "favorite_count_articles",
      label: t("user.columns.favorite_count_articles"),
    },
    {
      id: 6,
      name: "favorite_count_books",
      label: t("user.columns.favorite_count_books"),
    },
    {
      id: 7,
      name: "favorite_count_audios",
      label: t("user.columns.favorite_count_audios"),
    },
    {
      id: 8,
      name: "favorite_count_images",
      label: t("user.columns.favorite_count_images"),
    },
    {
      id: 9,
      name: "favorite_count_elders",
      label: t("user.columns.favorite_count_elders"),
    },
    { id: 10, name: "control", label: t("action") },
  ];
  const {
    PaginationUI,
    handleSort,
    handleSearch,
    handleToggleColumns,
    searchResults,
  } = useFiltration({
    rowData: users,
    toggle,
    setToggle,
  });

  // get data from api
  useEffect(() => {
    try {
      dispatch(getUsers());
    } catch (error) {
      console.log(error);
    }
  }, [dispatch]);

  useEffect(() => {
    if (id === undefined) return;
    if (users.length === 0) return;
    // Get Data By ID Using Filter Method
    const data = users.filter((user) => user.id === parseInt(id));
    setToggle({ ...toggle, user: data[0] });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [users]);

  console.log("user", toggle.user);

  return (
    <div className="scholar-container mt-4 mb-5 pb-3 m-sm-3 m-0">
      {/* Download */}
      <div className="scholar">
        <div className="table-header justify-content-end">
          <h2>{t("user.download")}</h2>
        </div>
        <table className="table-body">
          <thead>
            <tr>
              <th className="table-th">
                {t("user.columns.download_count_books")}
              </th>
              <th className="table-th">
                {t("user.columns.download_count_audios")}
              </th>
              <th className="table-th">
                {t("user.columns.download_count_images")}
              </th>
              <th className="table-th">
                {t("user.columns.download_count_elders")}
              </th>
            </tr>
          </thead>
          {/* Error */}
          {error !== null && loading === false && (
            <tbody>
              <tr className="no-data-container">
                <td className="table-td" colSpan="6">
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
                <td className="table-td" colSpan="6">
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
                <td className="table-td" colSpan="6">
                  <p className="no-data mb-0">{t("noData")}</p>
                </td>
              </tr>
            </tbody>
          )}
          {/* Data */}
          {searchResults?.length > 0 && error === null && loading === false && (
            <tbody>
              <tr>
                <td className="table-td download_count_books">
                  {toggle?.user?.download_count?.books}
                </td>
                <td className="table-td download_count_audios">
                  {toggle?.user?.download_count?.audio}
                </td>
                <td className="table-td download_count_images">
                  {toggle?.user?.download_count?.images}
                </td>
                <td className="table-td download_count_elders">
                  {toggle?.user?.download_count?.elders}
                </td>
              </tr>
            </tbody>
          )}
        </table>
      </div>
      {/* Favorite */}
      <div className="scholar mt-5">
        <div className="table-header justify-content-end">
          <h2>{t("user.favorite")}</h2>
        </div>
        <table className="table-body">
          <thead>
            <tr>
              <th className="table-th">
                {t("user.columns.favorite_count_articles")}
              </th>
              <th className="table-th">
                {t("user.columns.favorite_count_books")}
              </th>
              <th className="table-th">
                {t("user.columns.favorite_count_audios")}
              </th>
              <th className="table-th">
                {t("user.columns.favorite_count_images")}
              </th>
              <th className="table-th">
                {t("user.columns.favorite_count_elders")}
              </th>
            </tr>
          </thead>
          {/* Error */}
          {error !== null && loading === false && (
            <tbody>
              <tr className="no-data-container">
                <td className="table-td" colSpan="6">
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
                <td className="table-td" colSpan="6">
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
                <td className="table-td" colSpan="6">
                  <p className="no-data mb-0">{t("noData")}</p>
                </td>
              </tr>
            </tbody>
          )}
          {/* Data */}
          {searchResults?.length > 0 && error === null && loading === false && (
            <tbody>
              <tr>
                <td className="table-td favorite_count_articles">
                  {toggle?.user?.favorite_count?.articles}
                </td>
                <td className="table-td favorite_count_books">
                  {toggle?.user?.favorite_count?.books}
                </td>
                <td className="table-td favorite_count_audios">
                  {toggle?.user?.favorite_count?.audios}
                </td>
                <td className="table-td favorite_count_images">
                  {toggle?.user?.favorite_count?.images}
                </td>
                <td className="table-td favorite_count_elders">
                  {toggle?.user?.favorite_count?.elders}
                </td>
              </tr>
            </tbody>
          )}
        </table>
      </div>
      {/* Elders */}
      <div className="scholar mt-5">
        <div className="table-header justify-content-end">
          <h2>{t("user.favorite_data_elders")}</h2>
        </div>
        <table className="table-body">
          <thead>
            <tr>
              <th className="table-th">{t("elders.columns.image")}</th>
              <th className="table-th">{t("elders.columns.name")}</th>
              <th className="table-th">{t("elders.columns.email")}</th>
              <th className="table-th">{t("elders.columns.phone")}</th>
              <th className="table-th">{t("status")}</th>
            </tr>
          </thead>
          {/* Error */}
          {error !== null && loading === false && (
            <tbody>
              <tr className="no-data-container">
                <td className="table-td" colSpan="5">
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
                <td className="table-td" colSpan="5">
                  <div className="no-data mb-0">
                    <Spinner
                      style={{
                        height: "3rem",
                        width: "3rem",
                        color: "var(--main-color)",
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
          {toggle?.user?.favorite_data?.elders?.length === 0 &&
            error === null &&
            !loading && (
              <tbody>
                <tr className="no-data-container">
                  <td className="table-td" colSpan="5">
                    <p className="no-data mb-0">{t("noData")}</p>
                  </td>
                </tr>
              </tbody>
            )}
          {/* Data */}
          {toggle?.user?.favorite_data?.elders?.length > 0 &&
            error === null &&
            loading === false && (
              <tbody>
                {toggle?.user?.favorite_data?.elders?.map((result) => (
                  <tr key={result?.id + new Date().getDate()}>
                    <td className="table-td">
                      <img
                        src={result?.image}
                        alt="scholar"
                        className="scholar-img"
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "cover",
                        }}
                      />
                    </td>
                    <td className="table-td name">{result?.name}</td>
                    <td className="table-td">
                      <a
                        className="text-white"
                        href={`mailto:${result?.email}`}
                      >
                        {result?.email}
                      </a>
                    </td>
                    <td className="table-td">
                      <a className="text-white" href={`tel:${result?.phone}`}>
                        {result?.phone}
                      </a>
                    </td>
                    <td className="table-td">
                      <span
                        className="table-status badge"
                        style={{
                          backgroundColor:
                            result?.status === "Approve"
                              ? "green"
                              : result?.status === "Pending"
                              ? "red"
                              : "red",
                        }}
                      >
                        {result?.status === "Approve"
                          ? t("approve")
                          : result?.status === "Pending"
                          ? t("pending")
                          : t("pending")}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
        </table>
      </div>
      {/* Books */}
      <div className="scholar mt-5">
        <div className="table-header justify-content-end">
          <h2>{t("user.favorite_data_books")}</h2>
        </div>
        <table className="table-body">
          <thead>
            <tr>
              <th className="table-th">{t("books.columns.book.image")}</th>
              <th className="table-th">{t("books.columns.book.title")}</th>
              <th className="table-th">{t("books.columns.book.book")}</th>
              <th className="table-th">{t("status")}</th>
            </tr>
          </thead>
          {/* Error */}
          {error !== null && loading === false && (
            <tbody>
              <tr className="no-data-container">
                <td className="table-td" colSpan="4">
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
                <td className="table-td" colSpan="4">
                  <div className="no-data mb-0">
                    <Spinner
                      style={{
                        height: "3rem",
                        width: "3rem",
                        color: "var(--main-color)",
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
          {toggle?.user?.favorite_data?.books?.length === 0 &&
            error === null &&
            !loading && (
              <tbody>
                <tr className="no-data-container">
                  <td className="table-td" colSpan="4">
                    <p className="no-data mb-0">{t("noData")}</p>
                  </td>
                </tr>
              </tbody>
            )}
          {/* Data */}
          {toggle?.user?.favorite_data?.books?.length > 0 &&
            error === null &&
            loading === false && (
              <tbody>
                {toggle?.user?.favorite_data?.books?.map((result) => (
                  <tr key={result?.id + new Date().getDate()}>
                    <td className="table-td">
                      <img
                        src={result?.image}
                        alt="scholar"
                        className="scholar-img"
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "cover",
                        }}
                      />
                    </td>
                    <td className="table-td name">{result?.name}</td>
                    <td className="table-td">
                      <a
                        className="text-white"
                        href={`mailto:${result?.email}`}
                      >
                        {result?.email}
                      </a>
                    </td>
                    <td className="table-td">
                      <a className="text-white" href={`tel:${result?.phone}`}>
                        {result?.phone}
                      </a>
                    </td>
                    <td className="table-td">
                      <span
                        className="table-status badge"
                        style={{
                          backgroundColor:
                            result?.status === "Approve"
                              ? "green"
                              : result?.status === "Pending"
                              ? "red"
                              : "red",
                        }}
                      >
                        {result?.status === "Approve"
                          ? t("approve")
                          : result?.status === "Pending"
                          ? t("pending")
                          : t("pending")}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
        </table>
      </div>
      {/* Articles */}
      <div className="scholar mt-5">
        <div className="table-header justify-content-end">
          <h2>{t("user.favorite_data_articles")}</h2>
        </div>
        <table className="table-body">
          <thead>
            <tr>
              <th className="table-th">{t("articles.columns.elder.image")}</th>
              <th className="table-th">{t("articles.columns.elder.name")}</th>
              <th className="table-th">{t("articles.columns.image")}</th>
              <th className="table-th">{t("articles.columns.title")}</th>
              <th className="table-th">{t("articles.columns.article")}</th>
              <th className="table-th">{t("articles.columns.category")}</th>
              <th className="table-th">{t("status")}</th>
              <th className="table-th">{t("visits")}</th>
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
                      style={{
                        height: "3rem",
                        width: "3rem",
                        color: "var(--main-color)",
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
          {toggle?.user?.favorite_data?.articles?.length === 0 &&
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
          {/* Data */}
          {toggle?.user?.favorite_data?.articles?.length > 0 &&
            error === null &&
            loading === false && (
              <tbody>
                {toggle?.user?.favorite_data?.articles?.map((result) => (
                  <tr key={result?.id + new Date().getDate()}>
                    <td className="table-td">
                      <img
                        src={result?.elder.image}
                        alt={result?.elder.name || "avatar"}
                        className="table-avatar"
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "cover",
                        }}
                      />
                    </td>
                    <td className="table-td title">{result?.elder.name}</td>
                    <td className="table-td">
                      <img
                        src={result?.image}
                        alt={result?.title || "avatar"}
                        className="table-avatar"
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "cover",
                        }}
                      />
                    </td>
                    <td className="table-td title">{result?.title}</td>
                    <td className="table-td article">
                      {result?.content?.length >= 50
                        ? result?.content?.slice(0, 50) + "..."
                        : result?.content}
                    </td>
                    <td className="table-td title">{result?.Category.title}</td>
                    <td className="table-td">
                      <span
                        className="table-status badge"
                        style={{
                          backgroundColor:
                            result?.status === "Public"
                              ? "green"
                              : result?.status === "Private"
                              ? "red"
                              : "red",
                        }}
                      >
                        {result?.status === "Public"
                          ? t("public")
                          : result?.status === "Public"
                          ? t("private")
                          : t("private")}
                      </span>
                    </td>
                    <td className="table-td">{result?.visit_count}</td>
                  </tr>
                ))}
              </tbody>
            )}
        </table>
      </div>
      {/* Audios */}
      <div className="scholar mt-5">
        <div className="table-header justify-content-end">
          <h2>{t("user.favorite_data_audios")}</h2>
        </div>
        <table className="table-body">
          <thead>
            <tr>
              <th className="table-th">{t("audios.columns.elder.image")}</th>
              <th className="table-th">{t("audios.columns.elder.name")}</th>
              <th className="table-th">{t("audios.columns.audio.image")}</th>
              <th className="table-th">{t("audios.columns.audio.title")}</th>
              <th className="table-th">{t("audios.columns.audio.audio")}</th>
              <th className="table-th">{t("visits")}</th>
              <th className="table-th">{t("status")}</th>
            </tr>
          </thead>
          {/* Error */}
          {error !== null && loading === false && (
            <tbody>
              <tr className="no-data-container">
                <td className="table-td" colSpan="7">
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
                <td className="table-td" colSpan="7">
                  <div className="no-data mb-0">
                    <Spinner
                      style={{
                        height: "3rem",
                        width: "3rem",
                        color: "var(--main-color)",
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
          {toggle?.user?.favorite_data?.audios?.length === 0 &&
            error === null &&
            !loading && (
              <tbody>
                <tr className="no-data-container">
                  <td className="table-td" colSpan="7">
                    <p className="no-data mb-0">{t("noData")}</p>
                  </td>
                </tr>
              </tbody>
            )}
          {/* Data */}
          {toggle?.user?.favorite_data?.audios?.length > 0 &&
            error === null &&
            loading === false && (
              <tbody>
                {toggle?.user?.favorite_data?.audios?.map((result) => (
                  <tr key={result?.id + new Date().getDate()}>
                    <td className="table-td">
                      <img
                        src={result?.elder.image}
                        alt={result?.elder.name || "avatar"}
                        className="table-avatar"
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "cover",
                        }}
                      />
                    </td>
                    <td className="table-td title">{result?.elder.name}</td>
                    <td className="table-td">
                      <img
                        src={result?.image}
                        alt={result?.title || "avatar"}
                        className="table-avatar"
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "cover",
                        }}
                      />
                    </td>
                    <td className="table-td title">{result?.title}</td>
                    <td className="table-td audio">
                      <audio
                        controls
                        src={result?.audio}
                        style={{ width: "250px" }}
                      />
                    </td>
                    <td className="table-td">{result?.visit_count}</td>
                    <td className="table-td">
                      <span
                        className="table-status badge"
                        style={{
                          backgroundColor:
                            result?.status === "Public"
                              ? "green"
                              : result?.status === "Private"
                              ? "red"
                              : "red",
                        }}
                      >
                        {result?.status === "Public"
                          ? t("public")
                          : result?.status === "Public"
                          ? t("private")
                          : t("private")}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
        </table>
      </div>
      {/* Images */}
      <div className="scholar mt-5 mb-3">
        <div className="table-header justify-content-end">
          <h2>{t("user.favorite_data_images")}</h2>
        </div>
        <table className="table-body">
          <thead>
            <tr>
              <th className="table-th">{t("images.columns.image")}</th>
              <th className="table-th">{t("images.columns.category")}</th>
              <th className="table-th">{t("status")}</th>
            </tr>
          </thead>
          {/* Error */}
          {error !== null && loading === false && (
            <tbody>
              <tr className="no-data-container">
                <td className="table-td" colSpan="3">
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
                <td className="table-td" colSpan="3">
                  <div className="no-data mb-0">
                    <Spinner
                      style={{
                        height: "3rem",
                        width: "3rem",
                        color: "var(--main-color)",
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
          {toggle?.user?.favorite_data?.audios?.length === 0 &&
            error === null &&
            !loading && (
              <tbody>
                <tr className="no-data-container">
                  <td className="table-td" colSpan="3">
                    <p className="no-data mb-0">{t("noData")}</p>
                  </td>
                </tr>
              </tbody>
            )}
          {/* Data */}
          {toggle?.user?.favorite_data?.audios?.length > 0 &&
            error === null &&
            loading === false && (
              <tbody>
                {toggle?.user?.favorite_data?.audios?.map((result) => (
                  <tr key={result?.id + new Date().getDate()}>
                    <td className="table-td">
                      <img
                        src={result?.elder.image}
                        alt={result?.elder.name || "avatar"}
                        className="table-avatar"
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "cover",
                        }}
                      />
                    </td>
                    <td className="table-td name">
                      {result?.image_category?.title}
                    </td>
                    <td className="table-td">
                      <span
                        className="table-status badge"
                        style={{
                          backgroundColor:
                            result?.status === "Public"
                              ? "green"
                              : result?.status === "Private"
                              ? "red"
                              : "red",
                        }}
                      >
                        {result?.status === "Public"
                          ? t("public")
                          : result?.status === "Private"
                          ? t("private")
                          : t("private")}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
        </table>
      </div>
    </div>
  );
};

export default User;
