import React from "react";
import ReactDOM from "react-dom";

import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/css/animate.min.css";
import "./assets/scss/light-bootstrap-dashboard-react.scss?v=2.0.0";
import "./assets/css/demo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

import AdminLayout from "./Admin.js";
import Login from "./screen/components/Auth/Login";
import Recovery from "./screen/components/Auth/Recovery";

ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route path="*" render={(props) => <AdminLayout {...props} />} element={<AdminLayout />} />
      <Route path="/admin" element={ <Navigate replace to="/admin" />}  />
      <Route path="/" element={ <Login />}  />
      <Route path="/recovery" element={ <Recovery />}  />

    </Routes>
  </BrowserRouter>,
  document.getElementById("root")
);
