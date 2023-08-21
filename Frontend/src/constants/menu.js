import { adminRoot } from "./config";

export default 
parseInt(localStorage.getItem("rol")) == 1 ?[
  // [

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
      to: `${adminRoot}/users/users/users`,
    },
   
    ]
  }
  ]
},


{
  id: "movies",
  icon: "iconsminds-digital-drawing",
  label: "menu.movies",
  to: `${adminRoot}/movies`,
  subs: [
  {
    id: "pages-product",
    label: "menu.movie",
    subs: [
      {
        icon: "simple-icon-link",
        label: "menu.programin",
        to: `${adminRoot}/movies/movies/programin`
      },
    {
      icon: "simple-icon-grid",
      label: "menu.movie",
      to: `${adminRoot}/movies/movies/movie`
    },

    
    ]
  },

  ]
},
{
  id: "ventas",
  icon: "iconsminds-shopping-cart",
  label: "menu.ventas",
  subs: [
  {
    icon: "simple-icon-layers",
    label: "menu.registro",
    subs: [
     
      {
        icon: "iconsminds-checkout",
        label: "menu.listado-ventas",
        to: `${adminRoot}/ventas/registro/listado-ventas`
      },
    ]
  },
  
  ]
},

]: [] ;
