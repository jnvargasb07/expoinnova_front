import React from "react";
import axios from "axios";
import {createRoot} from "react-dom/client";

import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

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
axios.defaults.headers.common['access-control-allow-origin'] = '*';

const root = createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" exact element={ <Login />}  />
      <Route path="/recovery" exact element={ <Recovery />}  />
      <Route path="/change-password" exact element={ <ChangePassword /> } />
      {
        (sessionStorage.getItem('token') === null ? <Route path="/home/*" element={ <Navigate replace to="/" />}  /> :<Route path="/home/*" element={<AdminLayout />} /> )
      }


    </Routes>
  </BrowserRouter>,

);

/*
{
  (sessionStorage.getItem('token') === null ? <Route path="/home" element={ <Navigate replace to="/" />}  /> : )

}


*/
