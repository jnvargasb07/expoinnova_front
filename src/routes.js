
import Home from "./screen/components/Home/Home.js";


const dashboardRoutes = [
  {
    path: "/",
    name: "Ferias de negocios",
    icon: "fas fa-folder",
    component: Home,
    layout: "/home",

  },
  {
    path: "/",
    name: "Crear Nuevo",
    icon: "fas fa-user-plus",
    component: Home,
    layout: "/home/new-profile",
  },
  {
    path: "/forum",
    name: "Ajustes",
    icon: "fas fa-cog",
    component: Home,
    layout: "/home",
  }
];

export default dashboardRoutes;
