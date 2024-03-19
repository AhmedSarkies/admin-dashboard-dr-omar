import React from "react";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Col, Row } from "reactstrap";

const PrayerTime = () => {
  const { t } = useTranslation();
  const { loading } = useSelector((state) => state.settings);
  const formik = useFormik({
    initialValues: {},
    onSubmit: (values) => {
      console.log(values);
    },
  });

  const handleInputChange = (e) => {
    formik.handleChange(e);
  };

  return (
    <div className="scholar-container mt-4 m-3">
      <div className="table-header justify-content-end">
        <h3
          className="title"
          style={{
            color: "var(--main-color)",
          }}
        >
          {t("settings.settingsApp.prayer.time")}
        </h3>
      </div>
      <form onSubmit={formik.handleSubmit}>
        <Row>
          <Col md={6}>
            <div className="form-group d-flex justify-content-end mb-4">
              <label htmlFor="prayerTime" className="form-label">
                {t("settings.settingsApp.prayer.time")}
              </label>
              <input
                type="checkbox"
                className="prayer-time-input me-3 ms-3"
                id="prayerTime"
                name="prayerTime"
                onChange={handleInputChange}
              />
            </div>
          </Col>
          <Col md={6}>
            <div className="form-group d-flex justify-content-end mb-4">
              <label htmlFor="adhan" className="form-label">
                {t("settings.settingsApp.prayer.adhan")}
              </label>
              <input
                type="checkbox"
                className="prayer-time-input me-3 ms-3"
                id="adhan"
                name="adhan"
                onChange={handleInputChange}
              />
            </div>
          </Col>
          <Col md="12">
            <div className="form-group-container d-flex justify-content-md-end justify-content-center gap-3">
              <button type="submit" className="add-btn">
                {/* loading */}
                {loading ? (
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  ></span>
                ) : (
                  t("save")
                )}
              </button>
            </div>
          </Col>
        </Row>
      </form>
    </div>
  );
};

export default PrayerTime;
