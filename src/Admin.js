import React from "react";
import { useLocation, Route, Routes } from "react-router-dom";

import AdminNavbar from "./screen/components/Layouts/Navbar";
import Footer from "./screen/components/Layouts/Footer";
import Sidebar from "./screen/components/Layouts/Header";
import FairDetail from './screen/components/Home/FairDetail';


import routes from "./routes.js";

function Admin() {

  const location = useLocation();
  const mainPanel = React.useRef(null);
  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/admin") {
        return (
          <Route
            path={prop.layout + prop.path}
            key={key}
            element={<prop.component />}
          />
        );
      } else {
        return null;
      }
    });
  };
  React.useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    mainPanel.current.scrollTop = 0;
    if (
      window.innerWidth < 993 &&
      document.documentElement.className.indexOf("nav-open") !== -1
    ) {
      document.documentElement.classList.toggle("nav-open");
      var element = document.getElementById("bodyClick");
      element.parentNode.removeChild(element);
    }
  }, [location]);
  return (
    <>
      <div className="wrapper">
        <Sidebar color={'black'} routes={routes} />
        <div className="main-panel" ref={mainPanel}>
            <AdminNavbar />
          <div className="content">
            <Routes>{getRoutes(routes)}
              <Route path={'/admin/fairdetail/:id'} element={<FairDetail />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </div>

    </>
  );
}

export default Admin;
