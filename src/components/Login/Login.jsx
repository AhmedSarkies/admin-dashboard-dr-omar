import React, { useState } from "react";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import Http from "../../Http";
import { useSchema } from "../../hooks";
import logo from "../../assets/images/logo.jpg";

const permissions = [
  {
    id: 15,
    name: "addAdmin",
  },
  {
    id: 32,
    name: "addArticles",
  },
  {
    id: 28,
    name: "addArticlesCategories",
  },
  {
    id: 4,
    name: "addAudio",
  },
  {
    id: 72,
    name: "addAudiosCategories",
  },
  {
    id: 52,
    name: "addBook",
  },
  {
    id: 44,
    name: "addBooksCategories",
  },
  {
    id: 11,
    name: "addElder",
  },
  {
    id: 24,
    name: "addImage",
  },
  {
    id: 20,
    name: "addImageCategories",
  },
  {
    id: 64,
    name: "addIntroductionPage",
  },
  {
    id: 40,
    name: "addMainCategoriesBook",
  },
  {
    id: 36,
    name: "addMessage",
  },
  {
    id: 68,
    name: "addNotification",
  },
  {
    id: 60,
    name: "addSettings",
  },
  {
    id: 8,
    name: "addSpecialContent",
  },
  {
    id: 48,
    name: "addSubBooksCategories",
  },
  {
    id: 56,
    name: "addTermsConditions",
  },
  {
    id: 17,
    name: "deleteAdmin",
  },
  {
    id: 34,
    name: "deleteArticles",
  },
  {
    id: 30,
    name: "deleteArticlesCategories",
  },
  {
    id: 6,
    name: "deleteAudio",
  },
  {
    id: 74,
    name: "deleteAudiosCategories",
  },
  {
    id: 54,
    name: "deleteBook",
  },
  {
    id: 46,
    name: "deleteBooksCategories",
  },
  {
    id: 13,
    name: "deleteElder",
  },
  {
    id: 26,
    name: "deleteImage",
  },
  {
    id: 22,
    name: "deleteImageCategories",
  },
  {
    id: 66,
    name: "deleteIntroductionPage",
  },
  {
    id: 42,
    name: "deleteMainCategoriesBook",
  },
  {
    id: 38,
    name: "deleteMessage",
  },
  {
    id: 70,
    name: "deleteNotification",
  },
  {
    id: 62,
    name: "deleteSettings",
  },
  {
    id: 50,
    name: "deleteSubBooksCategories",
  },
  {
    id: 58,
    name: "deleteTermsConditions",
  },
  {
    id: 2,
    name: "deleteUser",
  },
  {
    id: 16,
    name: "editAdmin",
  },
  {
    id: 33,
    name: "editArticles",
  },
  {
    id: 29,
    name: "editArticlesCategories",
  },
  {
    id: 5,
    name: "editAudio",
  },
  {
    id: 73,
    name: "editAudiosCategories",
  },
  {
    id: 53,
    name: "editBook",
  },
  {
    id: 45,
    name: "editBooksCategories",
  },
  {
    id: 12,
    name: "editElder",
  },
  {
    id: 25,
    name: "editImage",
  },
  {
    id: 21,
    name: "editImageCategories",
  },
  {
    id: 65,
    name: "editIntroductionPage",
  },
  {
    id: 41,
    name: "editMainCategoriesBook",
  },
  {
    id: 37,
    name: "editMessage",
  },
  {
    id: 69,
    name: "editNotification",
  },
  {
    id: 61,
    name: "editSettings",
  },
  {
    id: 9,
    name: "editSpecialContent",
  },
  {
    id: 49,
    name: "editSubBooksCategories",
  },
  {
    id: 57,
    name: "editTermsConditions",
  },
  {
    id: 1,
    name: "editUser",
  },
  {
    id: 18,
    name: "GetAdmin",
  },
  {
    id: 31,
    name: "GetArticles",
  },
  {
    id: 27,
    name: "GetArticlesCategories",
  },
  {
    id: 7,
    name: "GetAudio",
  },
  {
    id: 71,
    name: "GetAudiosCategories",
  },
  {
    id: 51,
    name: "GetBook",
  },
  {
    id: 43,
    name: "GetBooksCategories",
  },
  {
    id: 14,
    name: "GetElder",
  },
  {
    id: 23,
    name: "GetImage",
  },
  {
    id: 19,
    name: "GetImageCategories",
  },
  {
    id: 63,
    name: "GetIntroductionPage",
  },
  {
    id: 39,
    name: "GetMainCategoriesBook",
  },
  {
    id: 35,
    name: "GetMessage",
  },
  {
    id: 67,
    name: "GetNotification",
  },
  {
    id: 59,
    name: "GetSettings",
  },
  {
    id: 10,
    name: "GetSpecialContent",
  },
  {
    id: 47,
    name: "GetSubBooksCategories",
  },
  {
    id: 55,
    name: "GetTermsConditions",
  },
  {
    id: 3,
    name: "GetUser",
  },
];

const Login = () => {
  const { t } = useTranslation();
  const { validationSchema } = useSchema();
  const [loading, setLoading] = useState(false);
  const onSubmit = async (values) => {
    setLoading(true);
    try {
      const response = await Http({
        method: "POST",
        url: "/admin/login",
        data: values,
      });
      if (response.status === 200) {
        // Remove all Cookies using js-cookie and permissions
        Object.keys(Cookies.get()).map((cookie) => {
          if (
            permissions.map((permission) => permission.name).includes(cookie) ||
            cookie === "_auth" ||
            cookie === "_user" ||
            cookie === "_role" ||
            cookie === "_email" ||
            cookie === "_phone" ||
            cookie === "_image" ||
            cookie === "_active" ||
            cookie === "_id"
          ) {
            Cookies.remove(cookie);
          }
          return null;
        });
        // Set Token in Cookies
        Cookies.set("_auth", response.data.data.token, {
          expires: 30,
          secure: true,
          sameSite: "strict",
          path: "/",
          tokenType: "Bearer" + response.data.data.token,
        });
        Cookies.set("_user", response.data.data.name, {
          expires: 30,
          secure: true,
          sameSite: "strict",
          path: "/",
        });
        Cookies.set("_role", response.data.data.powers, {
          expires: 30,
          secure: true,
          sameSite: "strict",
          path: "/",
        });
        Cookies.set("_email", response.data.data.email, {
          expires: 30,
          secure: true,
          sameSite: "strict",
          path: "/",
        });
        Cookies.set("_phone", response.data.data.phone, {
          expires: 30,
          secure: true,
          sameSite: "strict",
          path: "/",
        });
        Cookies.set("_image", response.data.data.image, {
          expires: 30,
          secure: true,
          sameSite: "strict",
          path: "/",
        });
        Cookies.set("_active", response.data.data.active, {
          expires: 30,
          secure: true,
          sameSite: "strict",
          path: "/",
        });
        Cookies.set("_id", response.data.data.id, {
          expires: 30,
          secure: true,
          sameSite: "strict",
          path: "/",
        });
        response.data.data.permissions.map((permission) =>
          Cookies.set(permission, 1, {
            expires: 30,
            secure: true,
            sameSite: "strict",
            path: "/",
          })
        );
        setLoading(false);
        window.location.href = "/dr-omar/dashboard";
      }
    } catch (error) {
      setLoading(false);
      toast.error(t("toast.login.error"));
    }
  };
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      //   userType: "",
    },
    validationSchema: validationSchema.login,
    onSubmit,
  });
  //   Handle Input Change using formik
  const handleInputChange = (e) => {
    formik.handleChange(e);
  };

  return (
    <div className="login">
      <div className="login-header d-flex flex-column justify-content-center align-items-center gap-2">
        <img src={logo} alt="logo" className="login-logo mb-2" />
        <h6 className="login-title">{t("auth.login.title")}</h6>
      </div>
      <form
        className="d-flex justify-content-center align-items-center flex-column gap-3 w-100"
        onSubmit={formik.handleSubmit}
      >
        <div className="form-group">
          <input
            type="text"
            className="form-control"
            id="email"
            name="email"
            placeholder={t("auth.login.email")}
            value={formik.values.email}
            onChange={handleInputChange}
          />
          <label htmlFor="email" className="label-form">
            {t("auth.login.email")}
          </label>
        </div>
        <div className="error-container">
          {formik.touched.email && formik.errors.email ? (
            <span className="error">{formik.errors.email}</span>
          ) : null}
        </div>
        <div className="form-group">
          <input
            type="password"
            className="form-control"
            id="password"
            placeholder="*********"
            name="password"
            value={formik.values.password}
            onChange={handleInputChange}
          />
          <label htmlFor="password" className="label-form">
            {t("auth.login.password")}
          </label>
        </div>
        <div className="error-container">
          {formik.touched.password && formik.errors.password ? (
            <span className="error">{formik.errors.password}</span>
          ) : null}
        </div>
        {/*<div className="form-group radio-group mt-2">
          <label className="radio admin" htmlFor="admin">
            <input
              type="radio"
              name="userType"
              id="admin"
              value="admin"
              checked={formik.values.userType === "admin"}
              onChange={handleInputChange}
            />
            أدمن
            <div className="radio-btn"></div>
          </label>
          <label className="radio admin sub-admin" htmlFor="sub-admin">
            <input
              type="radio"
              name="userType"
              id="sub-admin"
              value="sub-admin"
              checked={formik.values.userType === "sub-admin"}
              onChange={handleInputChange}
            />
            مسؤول فرعي
            <div className="radio-btn"></div>
          </label>
        </div>*/}
        <button
          type="submit"
          className={`btn submit-btn w-100${loading ? " loading-btn" : ""}`}
          disabled={loading ? true : false}
          style={{
            opacity: 1,
            background: `${
              loading ? "rgb(11 28 48 / 85%)" : "rgb(11 28 48 / 93%)"
            }`,
            color: "#fff",
          }}
        >
          {loading ? (
            <div className="spinner-border text-light" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          ) : (
            t("auth.login.submit")
          )}
        </button>
      </form>
      {/*<Link to="/dr-omar/forget-password" className="forget-password">
        {t("auth.login.forgetPassword")}
      </Link>*/}
    </div>
  );
};

export default Login;
