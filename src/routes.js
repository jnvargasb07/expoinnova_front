
import Home from "./screen/components/Home/Home.js";
import Settings from "./screen/components/Settings/Settings.js";

import crypto from "crypto-js";

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
    component: Settings,
    layout: "/home",
  }
];

if(sessionStorage.getItem('user')){
  let bytes = crypto.AES.decrypt(
    sessionStorage.getItem("user"),
      "@virtual_cr"
    );
  let userDecrypt = JSON.parse(bytes.toString(crypto.enc.Utf8));
  let user = userDecrypt.roles[0].name;

  if(user === "Students" || user === 'Judges'){
    dashboardRoutes.splice(1,1);
    dashboardRoutes.splice(1,1);
  }
}

export default dashboardRoutes;
