import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getScholarByIdApi } from "../../store/slices/scholarSlice";

import { Modal, ModalBody, ModalHeader, Spinner } from "reactstrap";
import { IoMdClose } from "react-icons/io";

const Elder = () => {
  const { t } = useTranslation();
  const { id } = useParams();
  const dispatch = useDispatch();
  const { dataById, error, loading } = useSelector((state) => state.scholar);
  const [toggle, setToggle] = useState({
    add: false,
    edit: false,
    imagePreview: false,
    readMore: false,
    article: {},
    status: false,
    elders: false,
    audioCategories: false,
    duration: "00:00",
    activeColumn: false,
    toggleColumns: {
      imageElder: true,
      nameElder: true,
      image: true,
      title: true,
      audio: true,
      visits: true,
      favorites: true,
      downloads: true,
      shares: true,
      status: true,
      control: true,
    },
    sortColumn: "",
    sortOrder: "asc",
    rowsPerPage: 5,
    currentPage: 1,
  });

  useEffect(() => {
    dispatch(getScholarByIdApi(id));
  }, [dispatch, id]);

  return (
    <div className="audio-container scholar-container mt-4 m-sm-3 m-0">
      <div className="table-header justify-content-end">
        <h2>{dataById?.name}</h2>
      </div>
      <div className="audio scholar">
        <div className="table-header justify-content-end">
          <h2>{t("audios.title")}</h2>
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
              <th className="table-th">{t("favorites")}</th>
              <th className="table-th">{t("downloads")}</th>
              <th className="table-th">{t("shares")}</th>
              <th className="table-th">{t("activation")}</th>
              <th className="table-th">{t("status")}</th>
            </tr>
          </thead>
          {/* Error */}
          {error !== null && loading === false && (
            <tbody>
              <tr className="no-data-container">
                <td className="table-td" colSpan="11">
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
                <td className="table-td" colSpan="11">
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
          {dataById?.Audio?.length === 0 && error === null && !loading && (
            <tbody>
              <tr className="no-data-container">
                <td className="table-td" colSpan="11">
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
                <td className="table-td" colSpan="11">
                  <p className="no-data no-columns mb-0">{t("noColumns")}</p>
                </td>
              </tr>
            </tbody>
          )}
          {/* Data */}
          {dataById?.Audio?.length > 0 &&
            error === null &&
            loading === false && (
              <tbody>
                {dataById?.Audio?.map((result) => (
                  <tr key={result?.id + new Date().getDate()}>
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
                    <td className="table-td name">{result?.elder?.name}</td>
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
                    <td className="table-td">{result?.title}</td>
                    <td className="table-td">
                      <audio
                        controls
                        src={result?.audio}
                        style={{ width: "250px" }}
                      />
                    </td>
                    <td className="table-td">{result?.visits_count}</td>
                    <td className="table-td">{result?.favorites_count}</td>
                    <td className="table-td">{result?.downloads_count}</td>
                    <td className="table-td">{result?.shares_count}</td>
                    <td className="table-td">
                      <span
                        className="table-status badge"
                        style={{
                          backgroundColor:
                            result?.status === "public"
                              ? "green"
                              : result?.status === "private"
                              ? "red"
                              : "red",
                        }}
                      >
                        {result?.status === "public"
                          ? t("public")
                          : result?.status === "private"
                          ? t("private")
                          : t("private")}
                      </span>
                    </td>
                    <td className="table-td">
                      <span
                        className="table-status badge"
                        style={{
                          backgroundColor:
                            result?.is_active === 1
                              ? "green"
                              : result?.is_active === 0
                              ? "red"
                              : "red",
                        }}
                      >
                        {result?.is_active === 1
                          ? t("active")
                          : result?.is_active === 0
                          ? t("inactive")
                          : t("inactive")}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            )}
        </table>
      </div>
      {/* Read More */}
      <Modal
        isOpen={toggle.readMore}
        toggle={() =>
          setToggle({
            ...toggle,
            readMore: !toggle.readMore,
          })
        }
        centered={true}
        keyboard={true}
        size={"md"}
        contentClassName="modal-read-more modal-add-scholar"
      >
        <ModalHeader
          toggle={() =>
            setToggle({
              ...toggle,
              readMore: !toggle.readMore,
            })
          }
        >
          {toggle?.article?.title}
          <IoMdClose
            onClick={() =>
              setToggle({
                ...toggle,
                readMore: !toggle.readMore,
              })
            }
          />
        </ModalHeader>
        <ModalBody>
          <div className="read-more-container text-center">
            <h3 className="text-center mb-3">{toggle?.article?.title}</h3>
            <img
              src={toggle?.article?.image}
              alt={toggle?.article?.title || "avatar"}
              className="read-more-image mb-3"
              style={{
                maxWidth: "700px",
                maxHeight: "400px",
                objectFit: "cover",
              }}
            />
            <div className="content text-end">{toggle?.article?.content}</div>
          </div>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default Elder;
