import React from "react";
import { Books, Articles, Audios } from "../";
import { useTranslation } from "react-i18next";
const Elder = () => {
  const { t } = useTranslation();

  return (
    <div>
      <div className="table-header justify-content-end pt-5 pe-5">
        <h2>{t("elders.title")}</h2>
      </div>
      <Books />
      <Articles />
      <Audios />
    </div>
  );
};

export default Elder;
