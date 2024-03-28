import { useTranslation } from "react-i18next";
import { boolean, mixed, number, object, string } from "yup";

const useSchema = () => {
  const { t } = useTranslation();
  // Validation Schema for all app {login,forgetPassword,title,description,category,subCategory,article,audio,book,image,elder,mostListening,slider,contact,termsAndConditions,profile,subAdmins,messages,settings}
  const validationSchema = {
    forgetPassword: object().shape({
      email: string()
        .email(t("validation.email"))
        .required(t("validation.email")),
    }),
    login: object().shape({
      email: string()
        .email(t("validation.email"))
        .required(t("validation.email")),
      password: string()
        .min(8, t("validation.password"))
        .required(t("validation.password")),
      //   userType: string().required("يجب اختيار نوع المستخدم"),
    }),
    termsAndConditions: object().shape({
      titleArabic: string().required(t("validation.title")),
      titleEnglish: string().required(t("validation.title")),
      descriptionArabic: string().required(t("validation.description")),
      descriptionEnglish: string().required(t("validation.description")),
    }),
    elder: object().shape({
      name: string().required(t("validation.elder")),
      email: string()
        .email(t("validation.email"))
        .required(t("validation.email")),
      phone: number()
        .typeError(t("validation.phone"))
        .positive(t("validation.phone"))
        .integer(t("validation.phone"))
        .min(10000000000, t("validation.phone"))
        .max(99999999999, t("validation.phone"))
        .required(t("validation.phone")),
      status: string(),
      // Validation for image file must be uploaded with the form or just string
      image: mixed().test("fileSize", t("validation.image"), (value) => {
        if (value.file) {
          return value.file.size <= 2097152;
        }
        if (typeof value === "string") {
          return true;
        }
      }),
    }),
    article: object().shape({
      title: string().required(t("validation.title")),
      status: string(),
      image: mixed().test("fileSize", t("validation.image"), (value) => {
        if (value.file) {
          return value.file.size <= 2097152;
        }
        if (typeof value === "string") {
          return true;
        }
      }),
      content: string().required(t("validation.description")),
      elder: object().shape({
        name: string().required(t("validation.elder")),
      }),
      articleCategories: object().shape({
        title: string().required(t("validation.category")),
      }),
    }),
    image: object().shape({
      image: mixed().test("fileSize", t("validation.image"), (value) => {
        if (value.file) {
          return value.file.size <= 2097152;
        }
        if (typeof value === "string") {
          return true;
        }
      }),
      status: string(),
    }),
    pictureCategory: object().shape({
      title: string().required("يجب اختيار تصنيف"),
    }),
    slider: object().shape({
      image: mixed().test("fileSize", t("validation.image"), (value) => {
        if (value.file) {
          return value.file.size <= 2097152;
        }
        if (typeof value === "string") {
          return true;
        }
      }),
      title: string().required(t("validation.title")),
      description: string().required(t("validation.description")),
    }),
    category: object().shape({
      title: string().required(t("validation.category")),
    }),
    subAdmins: object().shape({
      name: string().required(t("validation.name")),
      email: string()
        .email(t("validation.email"))
        .required(t("validation.email")),
      phone: number()
        .typeError(t("validation.phone"))
        .positive(t("validation.phone"))
        .integer(t("validation.phone"))
        .min(1000000000, t("validation.phone"))
        .max(9999999999, t("validation.phone"))
        .required(t("validation.phone")),
      status: string(),
      // Validation for image file must be uploaded with the form or just string
      image: mixed().test("fileSize", t("validation.image"), (value) => {
        if (value.file) {
          return value.file.size <= 2097152;
        }
        if (typeof value === "string") {
          return true;
        }
      }),
    }),
    bookSubCategory: object().shape({
      title: string().required(t("validation.subCategory")),
      bookCategory: object().shape({
        title: string().required(t("validation.mainCategory")),
      }),
    }),
    book: object().shape({
      title: string().required(t("validation.title")),
      status: string(),
      image: mixed().test("fileSize", t("validation.image"), (value) => {
        if (value.file) {
          return value.file.size <= 2097152;
        }
        if (typeof value === "string") {
          return true;
        }
      }),
      bookCategory: object().shape({
        title: string().required(t("validation.category")),
      }),
      book: mixed().test("fileSize", t("validation.book"), (value) => {
        if (value?.file) {
          return value?.file?.size <= 2097152;
        }
        if (typeof value === "string") {
          return true;
        }
      }),
    }),
    settings: object().shape({
      image: mixed().notRequired(),
      prayerTime: boolean().notRequired(),
      adhan: boolean().notRequired(),
      facebook: string().url(t("validation.url")).notRequired(),
      whatsapp: string().url(t("validation.url")).notRequired(),
      messenger: string().url(t("validation.url")).notRequired(),
      instagram: string().url(t("validation.url")).notRequired(),
      playStore: string().url(t("validation.url")).notRequired(),
      appStore: string().url(t("validation.url")).notRequired(),
    }),
    codeContent: object().shape({
      code: number()
        .typeError(t("validation.code"))
        .positive(t("validation.code"))
        .integer(t("validation.code"))
        .min(1000, t("validation.code"))
        .max(9999, t("validation.code"))
        .required(t("validation.codeContent")),
    }),
  };

  return { validationSchema };
};

export default useSchema;
