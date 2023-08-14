import { adminRoot } from "./config";

export default parseInt(localStorage.getItem("rol")) == 1 ?[

{
  id: "administracion",
  icon: "iconsminds-user",
  label: "menu.users",
  subs: [
  {
    icon: "simple-icon-layers",
    label: "menu.users",
    subs: [
    {
      icon: "simple-icon-user",
      label: "menu.users",
      to: `${adminRoot}/empleados/empleados/usuarios`,
    },
   
    ]
  }
  ]
},
// ACA ESTAN LAS VENTAS






// ACA ESTAN LOS PROVEEDORES


] :
[];
