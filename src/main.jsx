import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import "./main.css";

dayjs.locale('zh-cn');

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
