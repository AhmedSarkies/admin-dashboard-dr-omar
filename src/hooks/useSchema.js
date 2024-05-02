import { useTranslation } from "react-i18next";
import { boolean, mixed, number, object, ref, string } from "yup";

const useSchema = () => {
  const { t } = useTranslation();
  // Validation Schema for all app {login,forgetPassword,title,description,category,subCategory,article,audio,book,image,elder,mostListening,introductionPage,contact,termsAndConditions,profile,subAdmins,messages,settings}
  const validationSchema = {
    forgetPassword: object().shape({
      email: string()
        .email(t("validation.email"))
        .required(t("validation.email")),
    }),
    ChangePassword: object().shape({
      current_password: string().required(t("validation.oldPassword")),
      new_password: string()
        .min(8, t("validation.password"))
        .required(t("validation.newPassword")),
      new_password_confirmation: string()
        .oneOf([ref("new_password")], t("validation.confirmPassword"))
        .required(t("validation.confirmPassword")),
    }),
    editProfile: object().shape({
      name: string()
        .max(40, t("validation.maxCharacters"))
        .required(t("validation.name")),
      email: string()
        .email(t("validation.email"))
        .required(t("validation.email")),
      phone: string()
        .matches(/^\+[1-9]{1}[0-9]{6,14}$/, t("validation.phone"))
        .required(t("validation.phone")),
      status: string(),
      // Validation for image file must be uploaded with the form or just string
      image: mixed().test("fileSize", t("validation.image"), (value) => {
        if (value.file) {
          return value.file.size > 0;
        }
        if (typeof value.preview === "string") {
          return true;
        }
      }),
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
      title: string()
        .max(40, t("validation.maxCharacters"))
        .required(t("validation.title")),
      title_en: string()
        .max(40, t("validation.maxCharacters"))
        .required(t("validation.title")),
      country: string()
        .max(40, t("validation.maxCharacters"))
        .required(t("validation.title")),
      country_en: string()
        .max(40, t("validation.maxCharacters"))
        .required(t("validation.title")),
      text: string().required(t("validation.description")),
      text_en: string().required(t("validation.description")),
    }),
    notifications: object().shape({
      image: mixed(),
      title: string()
        .max(40, t("validation.maxCharacters"))
        .required(t("validation.title")),
      title_en: string()
        .max(40, t("validation.maxCharacters"))
        .required(t("validation.title")),
      description: string().required(t("validation.description")),
      description_en: string().required(t("validation.description")),
    }),
    elder: object().shape({
      name: string()
        .max(40, t("validation.maxCharacters"))
        .required(t("validation.elder")),
      email: string()
        .email(t("validation.email"))
        .required(t("validation.email")),
      phone: string()
        .matches(/^\+[1-9]{1}[0-9]{6,14}$/, t("validation.phone"))
        .required(t("validation.phone")),
      status: string(),
      // Validation for image file must be uploaded with the form or just string
      image: mixed().test("fileSize", t("validation.imageElder"), (value) => {
        if (value.file) {
          return value.file.size > 0;
        }
        if (typeof value === "string") {
          return true;
        }
      }),
    }),
    article: object().shape({
      title: string()
        .max(40, t("validation.maxCharacters"))
        .required(t("validation.title")),
      status: string().required(t("validation.status")),
      image: mixed().test("fileSize", t("validation.imageArticle"), (value) => {
        if (value.file) {
          return value.file.size > 0;
        }
        if (typeof value.preview === "string") {
          return true;
        }
      }),
      content: string().required(t("validation.description")),
      writer: string().required(t("validation.writer")),
      articleCategories: object().shape({
        title: string().required(t("validation.category")),
      }),
      is_active: string().required(t("validation.activation")),
      showWriter: string().required(t("validation.showWriter")),
    }),
    image: object().shape({
      image: mixed().test("fileSize", t("validation.image"), (value) => {
        if (value.file) {
          return value.file.size > 0;
        }
        if (typeof value === "string") {
          return true;
        }
      }),
      status: string(),
      is_active: string().required(t("validation.activation")),
      pictureCategory: object().shape({
        title: string().required(t("validation.category")),
      }),
    }),
    pictureCategory: object().shape({
      title: string()
        .max(40, t("validation.maxCharacters"))
        .required("يجب اختيار تصنيف"),
    }),
    introductionPage: object().shape({
      image: mixed().test("fileSize", t("validation.image"), (value) => {
        if (value.file) {
          return value.file.size > 0;
        }
        if (typeof value.preview === "string") {
          return true;
        }
      }),
      title: string()
        .max(40, t("validation.maxCharacters"))
        .required(t("validation.title")),
      description: string().required(t("validation.description")),
      titleEn: string()
        .max(40, t("validation.maxCharacters"))
        .required(t("validation.title")),
      descriptionEn: string().required(t("validation.description")),
    }),
    category: object().shape({
      title: string()
        .max(40, t("validation.maxCharacters"))
        .required(t("validation.category")),
    }),
    subAdmins: object().shape({
      name: string()
        .max(40, t("validation.maxCharacters"))
        .required(t("validation.name")),
      email: string()
        .email(t("validation.email"))
        .required(t("validation.email")),
      password: string()
        .min(8, t("validation.password"))
        .required(t("validation.password")),
      // Match password with confirm password
      confirmPassword: string()
        .oneOf([ref("password")], t("validation.confirmPassword"))
        .required(t("validation.confirmPassword")),
      phone: string()
        .matches(/^\+[1-9]{1}[0-9]{6,14}$/, t("validation.phone"))
        .required(t("validation.phone")),
      status: string(),
      powers: string().required(t("validation.powers")),
      // Validation for image file must be uploaded with the form or just string
      image: mixed().test("fileSize", t("validation.image"), (value) => {
        if (value.file) {
          return value.file.size > 0;
        }
        if (typeof value.preview === "string") {
          return true;
        }
      }),
    }),
    subAdminsEdit: object().shape({
      name: string()
        .max(40, t("validation.maxCharacters"))
        .required(t("validation.name")),
      email: string()
        .email(t("validation.email"))
        .required(t("validation.email")),
      // make password required when creating new subAdmin and not required when updating
      password: string().min(8, t("validation.password")).notRequired(),
      confirmPassword: string()
        .oneOf([ref("password")], t("validation.confirmPassword"))
        .notRequired(),
      phone: string()
        .matches(/^\+[1-9]{1}[0-9]{6,14}$/, t("validation.phone"))
        .required(t("validation.phone")),
      status: string(),
      powers: string().required(t("validation.powers")),
      // Validation for image file must be uploaded with the form or just string
      image: mixed().test("fileSize", t("validation.image"), (value) => {
        if (value.file) {
          return value.file.size > 0;
        }
        if (typeof value.preview === "string") {
          return true;
        }
      }),
    }),
    user: object().shape({
      name: string()
        .max(40, t("validation.maxCharacters"))
        .required(t("validation.name")),
      email: string()
        .email(t("validation.email"))
        .required(t("validation.email")),
      password: string().min(8, t("validation.password")).notRequired(),
      confirmPassword: string()
        .oneOf([ref("password")], t("validation.confirmPassword"))
        .notRequired(),
      // phone must start with code of country
      phone: string()
        .matches(/^\+[1-9]{1}[0-9]{6,14}$/, t("validation.phone"))
        .required(t("validation.phone")),
    }),
    bookSubCategory: object().shape({
      title: string()
        .max(40, t("validation.maxCharacters"))
        .required(t("validation.subCategory")),
      bookCategory: object().shape({
        title: string().required(t("validation.mainCategory")),
      }),
    }),
    editBookSubCategory: object().shape({
      title: string()
        .max(40, t("validation.maxCharacters"))
        .required(t("validation.subCategory")),
    }),
    book: object().shape({
      title: string()
        .max(40, t("validation.maxCharacters"))
        .required(t("validation.title")),
      number_pages: number()
        .typeError(t("validation.pages"))
        .positive(t("validation.pages"))
        .integer(t("validation.pages"))
        .min(1, t("validation.pages"))
        .required(t("validation.pages")),
      is_active: string().required(t("validation.activation")),
      status: string(),
      image: mixed().test("fileSize", t("validation.imageBook"), (value) => {
        if (value?.file) {
          return value?.file.size <= 2097152;
        }
        if (typeof value.preview === "string") {
          return true;
        }
      }),
      bookCategory: object().shape({
        title: string().required(t("validation.category")),
      }),
      book: mixed().test("fileSize", t("validation.book"), (value) => {
        if (value?.file) {
          return value?.file.size > 0;
        }
        if (typeof value === "string") {
          return true;
        }
      }),
    }),
    audio: object().shape({
      title: string()
        .max(40, t("validation.maxCharacters"))
        .required(t("validation.title")),
      status: string().required(t("validation.content")),
      is_active: string().required(t("validation.activation")),
      image: mixed().test("fileSize", t("validation.imageAudio"), (value) => {
        if (value.file) {
          return value.file.size > 0;
        }
        if (typeof value === "string") {
          return true;
        }
      }),
      audio: mixed().test("fileSize", t("validation.audio"), (value) => {
        if (value.file) {
          return value.file.size > 0;
        }
        if (typeof value === "string") {
          return true;
        }
      }),
      elder: object().shape({
        name: string().required(t("validation.elder")),
      }),
      audioCategory: object().shape({
        title: string().required(t("validation.category")),
      }),
    }),
    audioElder: object().shape({
      title: string()
        .max(40, t("validation.maxCharacters"))
        .required(t("validation.title")),
      status: string().required(t("validation.status")),
      image: mixed().test("fileSize", t("validation.imageAudio"), (value) => {
        if (value.file) {
          return value.file.size > 0;
        }
        if (typeof value === "string") {
          return true;
        }
      }),
      audio: mixed().test("fileSize", t("validation.audio"), (value) => {
        if (value.file) {
          return value.file.size > 0;
        }
        if (typeof value === "string") {
          return true;
        }
      }),
      audioCategory: object().shape({
        title: string().required(t("validation.category")),
      }),
      is_active: string().required(t("validation.activation")),
    }),
    settings: object().shape({
      image: mixed().notRequired(),
      background: mixed().notRequired(),
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
      code: string()
        .min(4, t("validation.code"))
        .max(4, t("validation.code"))
        .required(t("validation.code")),
    }),
  };

  return { validationSchema };
};

export default useSchema;
