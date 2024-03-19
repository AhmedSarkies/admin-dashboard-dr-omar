import React from "react";
import { useFormik } from "formik";
import { Col, Row } from "reactstrap";
import { useTranslation } from "react-i18next";

const contactFields = [
  {
    name: "facebook",
  },
  {
    name: "twitter",
  },
  {
    name: "instagram",
  },
  {
    name: "snapchat",
  },
  {
    name: "linkedin",
  },
  {
    name: "youtube",
  },
  {
    name: "tikTok",
  },
  {
    name: "whatsapp",
  },
  {
    name: "telegram",
  },
  {
    name: "phone",
  },
  {
    name: "email",
  },
  {
    name: "address",
  },
  {
    name: "map",
  },
];

const appFields = [
  {
    name: "appStore",
  },
  {
    name: "playStore",
  },
];

const Links = () => {
  const { t } = useTranslation();
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
    <>
      <div className="scholar-container mt-4 m-3">
        <div className="table-header justify-content-end">
          <h3
            className="title"
            style={{
              color: "var(--main-color)",
            }}
          >
            {t("settings.links.contact.title")}
          </h3>
        </div>
        <form onSubmit={formik.handleSubmit}>
          <div className="form-group mb-4">
            <Row className="flex-row-reverse justify-content-between g-3">
              {contactFields.map((field, index) => (
                <Col lg="6" key={index}>
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-control"
                      id={field.name}
                      name={field.name}
                      placeholder={t(
                        `settings.links.contact.columns.${field.name}`
                      )}
                      onChange={handleInputChange}
                    />
                    <label htmlFor={field.name} className="label-form">
                      {t(`settings.links.contact.columns.${field.name}`)}
                    </label>
                  </div>
                </Col>
              ))}
              <Col lg={12}>
                <div className="form-group-container d-flex justify-content-center">
                  <button type="submit" className="add-btn">
                    {t("add")}
                  </button>
                </div>
              </Col>
            </Row>
          </div>
        </form>
      </div>
      <div className="scholar-container mt-5 mb-5 m-3">
        <div className="table-header justify-content-end">
          <h3
            className="title"
            style={{
              color: "var(--main-color)",
            }}
          >
            {t("settings.links.appLink.title")}
          </h3>
        </div>
        <form onSubmit={formik.handleSubmit}>
          <div className="form-group mb-4">
            <Row className="flex-row-reverse justify-content-between g-3">
              {appFields.map((field, index) => (
                <Col lg="6" key={index}>
                  <div className="form-group">
                    <input
                      type="text"
                      className="form-control"
                      id={field.name}
                      name={field.name}
                      placeholder={t(
                        `settings.links.appLink.columns.${field.name}`
                      )}
                      onChange={handleInputChange}
                    />
                    <label htmlFor={field.name} className="label-form">
                      {t(`settings.links.appLink.columns.${field.name}`)}
                    </label>
                  </div>
                </Col>
              ))}
              <Col lg={12}>
                <div className="form-group-container d-flex justify-content-center">
                  <button type="submit" className="add-btn">
                    {t("add")}
                  </button>
                </div>
              </Col>
            </Row>
          </div>
        </form>
      </div>
    </>
  );
};

export default Links;
