import axios from "axios";

const Http = axios.create({
  baseURL: process.env.REACT_APP_DASHBOARD_API_URL,
  headers: {
    "Content-Type": "multipart/form-data",
    Accept: "application/json",
  },
});

export default Http;
