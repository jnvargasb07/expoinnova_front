
import Home from "./screen/components/Home/Home.js";


const dashboardRoutes = [
  {
    path: "/",
    name: "Inicio",
    icon: "nc-icon nc-chart-pie-35",
    component: Home,
    layout: "/home",
  },
  {
    path: "/users",
    name: "Usuarios",
    icon: "nc-icon nc-circle-09",
    component: Home,
    layout: "/home",
  },
  {
    path: "/forum",
    name: "Foro",
    icon: "nc-icon nc-paper-2",
    component: Home,
    layout: "/home",
  }
];

export default dashboardRoutes;
