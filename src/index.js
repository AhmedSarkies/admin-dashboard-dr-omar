import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";

import { Provider } from "react-redux";

import store from "./store/store.js";

import { ToastContainer } from "react-toastify";

// eslint-disable-next-line no-unused-vars
import { Chart as ChartJS } from "chart.js/auto";

import App from "./App";

import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import "@sweetalert2/theme-dark/dark.css";
import "./index.css";

const root = createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <Router>
      <Provider store={store}>
        <ToastContainer
          position="top-right"
          closeOnClick
          pauseOnFocusLoss={false}
          draggable
          pauseOnHover={false}
          theme="dark"
          autoClose={3000}
          hideProgressBar={false}
        />
        <App />
      </Provider>
    </Router>
  </StrictMode>
);
