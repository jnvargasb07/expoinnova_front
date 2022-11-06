import React from "react";
import { useLocation, Route, Routes, useParams, useNavigate } from "react-router-dom";

import AdminNavbar from "./screen/components/Layouts/Navbar";
import Footer from "./screen/components/Layouts/Footer";
import Sidebar from "./screen/components/Layouts/Header";
import FairDetail from './screen/components/Home/FairDetail';
import IdeaDetail from './screen/components/Home/IdeaDetail';
import Home from "./screen/components/Home/Home.js";

import routes from "./routes.js";

function Admin() {

  const location = useLocation();
  const mainPanel = React.useRef(null);
    const navigation = useNavigate();
    const params = useParams();
    console.log(location);
  const getRoutes = (routes) => {
    return routes.map((prop, key) => {

      if (prop.layout === "/home") {

        return (
          <Route
            path={prop.path}
            key={key}
            element={<prop.component />}
          />
        );
      }
      else
      {
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

//  {getRoutes(routes)}
/*    <Route
      path={'/home'}

      element={<Home />}
    />*/
    return (
      <>
        <div className="wrapper">
          <Sidebar color={'white'} routes={routes} />
          <div className="main-panel" ref={mainPanel}>
              <AdminNavbar />
            <div className="content">
              <Routes>
              {getRoutes(routes)}
                <Route
                  path={'/fairdetail/:id'}
                  element={<FairDetail navigate={navigation} params={params} location={location}  />}
                  />
                  <Route
                    path={'/fairdetail/idea/:id'}
                    element={<IdeaDetail navigate={navigation} params={params} location={location}  />}
                    />
              </Routes>
            </div>
            <Footer />
          </div>
        </div>
      </>
    );



}

export default Admin;
