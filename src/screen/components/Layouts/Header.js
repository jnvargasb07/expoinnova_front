import React from "react";
import { useLocation, NavLink } from "react-router-dom";

import { Nav } from "react-bootstrap";
import crypto from "crypto-js";
// dibuja el header y opciones de arriba 
function Sidebar({ color, image, routes }) {

  const location = useLocation();

  let bytes = crypto.AES.decrypt(
    sessionStorage.getItem("user"),
      "@virtual_cr"
    );
  let userDecrypt = JSON.parse(bytes.toString(crypto.enc.Utf8));
  let user = userDecrypt.roles[0].name;

  const activeRoute = (routeName) => {


    return (location.pathname === routeName && "active").toString();
  };


  return (
    <div className="sidebar d-none d-md-flex">
      <div
        className="sidebar-background"

      />
      <div className="sidebar-wrapper">
        <div className="logo d-flex align-items-center justify-content-start">
          <a
            href="/home"
            className="simple-text logo-mini mx-1"
          >
            <div className="logo-img">
              <img
                src={require("../../../assets/PNG/LOGO.png")}
                alt="..."
              />
            </div>
          </a>

        </div>
        <Nav>
          {routes.map((prop, key) => {
            if (!prop.redirect)
              return (
                <li
                  className={activeRoute(`${prop.layout}${prop.path}`)}
                  key={key}
                  >
                  <NavLink
                    to={prop.layout + prop.path}
                    className="nav-link"

                  >
                    <i className={prop.icon} />
                    <p>{prop.name}</p>
                  </NavLink>
                </li>
              );
            return null;
          })}
        </Nav>
      </div>
    </div>
  );
}

export default Sidebar;
