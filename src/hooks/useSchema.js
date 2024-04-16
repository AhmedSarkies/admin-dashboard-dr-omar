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
      titleArabic: string()
        .max(40, t("validation.maxCharacters"))
        .required(t("validation.title")),
      titleEnglish: string()
        .max(40, t("validation.maxCharacters"))
        .required(t("validation.title")),
      descriptionArabic: string().required(t("validation.description")),
      descriptionEnglish: string().required(t("validation.description")),
    }),
    elder: object().shape({
      name: string()
        .max(40, t("validation.maxCharacters"))
        .required(t("validation.elder")),
      email: string()
        .email(t("validation.email"))
        .required(t("validation.email")),
      phone: number()
        .typeError(t("validation.phone"))
        .positive(t("validation.phone"))
        .integer(t("validation.phone"))
        .min(100000000, t("validation.phone"))
        .max(9999999999, t("validation.phone"))
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
      status: string(),
      image: mixed().test("fileSize", t("validation.imageArticle"), (value) => {
        if (value.file) {
          return value.file.size > 0;
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
          return value.file.size > 0;
        }
        if (typeof value === "string") {
          return true;
        }
      }),
      status: string(),
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
      // make password required when creating new subAdmin and not required when updating
      password: string().min(8, t("validation.password")).notRequired(),
      phone: number()
        .typeError(t("validation.phone"))
        .positive(t("validation.phone"))
        .integer(t("validation.phone"))
        .min(1000000000, t("validation.phone"))
        .max(9999999999, t("validation.phone"))
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
      phone: number()
        .typeError(t("validation.phone"))
        .positive(t("validation.phone"))
        .integer(t("validation.phone"))
        .min(1000000000, t("validation.phone"))
        .max(9999999999, t("validation.phone"))
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
    book: object().shape({
      title: string()
        .max(40, t("validation.maxCharacters"))
        .required(t("validation.title")),
      status: string(),
      image: mixed().test("fileSize", t("validation.imageBook"), (value) => {
        if (value?.file) {
          return value?.file.size <= 2097152;
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
      status: string(),
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
