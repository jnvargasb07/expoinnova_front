
import Home from "./screen/components/Home/Home.js";


const dashboardRoutes = [
  {
    path: "/",
    name: "Inicio",
    icon: "nc-icon nc-chart-pie-35",
    component: Home,
    layout: "/admin",
  },
  {
    path: "/",
    name: "Usuarios",
    icon: "nc-icon nc-circle-09",
    component: Home,
    layout: "/users",
  },
  {
    path: "/",
    name: "Foro",
    icon: "nc-icon nc-paper-2",
    component: Home,
    layout: "/forum",
  }
];

export default dashboardRoutes;
