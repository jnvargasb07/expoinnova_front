import React from "react";
import ReactDOM from "react-dom";

import { BrowserRouter, Route, Routes } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "./assets/css/animate.min.css";
import "./assets/scss/light-bootstrap-dashboard-react.scss?v=2.0.0";
import "./assets/css/demo.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

import AdminLayout from "./Admin.js";
import Login from "./screen/components/Auth/Login";
import Recovery from "./screen/components/Auth/Recovery";
import ChangePassword from "./screen/components/Auth/ChangePassword";

//  <Route path="/admin" element={ <Navigate replace to="/admin" />}  />
ReactDOM.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={ <Login />}  />
      <Route path="/recovery" element={ <Recovery />}  />
      <Route path="/change-password" element={ <ChangePassword /> } />
      <Route path="*" element={<AdminLayout />} />

    </Routes>
  </BrowserRouter>,
  document.getElementById("root")
);

/*      <Route path="/users/*" element={<AdminLayout />} />
      <Route path="/forum/*" element={<AdminLayout />} />*/
