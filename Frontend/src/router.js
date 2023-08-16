import Vue from "vue";
import VueRouter from "vue-router";
import AuthGuard from "./utils/auth.guard";
import { adminRoot } from "./constants/config";
import { UserRole } from "./utils/auth.roles";

Vue.use(VueRouter);


const router = new VueRouter({
  linkActiveClass: "active",
  // routes,
  routes:
    parseInt(localStorage.getItem("rol")) == 1
      ? 
      [
          {
            path: "/",
            redirect: `/user/login`,
          },
          {
            path: adminRoot,
            component: () => import("./views/app"),
            redirect: `${adminRoot}/principal`,
            meta: { loginRequired: true },
            /*
      define with Authorization :
      meta: { loginRequired: true, roles: [UserRole.Admin, UserRole.Editor] },
      */
            children: [
              {
                path: "principal",
                component: () => import("./views/app/dashboards/Default"),
              },
              {
                path: "vamp",
                component: () => import("./views/app/blank-page"),
              },
           
              {
                path: "users",
                component: () =>
                  import(
                    /* webpackChunkName: "dashboards" */ "./views/app/pages"
                  ),
                children: [
                  {
                    path: "users",
                    component: () =>
                      import(
                        /* webpackChunkName: "dashboards" */ "./views/app/pages"
                      ),
                    children: [
    
                     
                      {
                        path: "users",
                        name: "users",
                        component: () =>
                          import("./views/app/pages/empleados/Usuario"),
                      },
                    ],
                  },
                ],
              },
              {
                path: "movies",
                component: () =>
                  import(
                    /* webpackChunkName: "dashboards" */ "./views/app/pages"
                  ),
                children: [
                  {
                    path: "movies",
                    component: () =>
                      import(
                        /* webpackChunkName: "dashboards" */ "./views/app/pages"
                      ),
                    children: [

                      {
                        path: "programin",
                        name: "programin",
                        component: () =>
                          import("./views/app/pages/cine/Programacion/Programacion.vue"),
                      },
                      {
                        path: "view_programacion/:id",
                        name: "view_programacion",
                        component: () =>
                            import("./views/app/pages/cine/Programacion/ViewProgramacion.vue"),
                      },
                         
                      {
                        path: "new_programacion",
                        name: "new_programacion",
                        component: () =>
                          import(
                            "./views/app/pages/cine/Programacion//NuevaProgramacion.vue"
                          ),
                      },
                      {
                        path: "movie",
                        name: "movie",
                        component: () =>
                          import("./views/app/pages/cine/Peliculas.vue"),
                      },
                      {
                        path: "detalle/:id",
                        name: "detalle",
                        component: () =>
                            import("./views/app/pages/cine/DetallePelicula.vue"),
                      },
                    ],
                  },
                ],
              },
         
            ],
          },
          {
            path: "/error",
            component: () =>
              import(/* webpackChunkName: "error" */ "./views/Error"),
          },
          {
            path: "/unauthorized",
            component: () =>
              import(/* webpackChunkName: "error" */ "./views/Unauthorized"),
          },
          {
            path: "/user",
            component: () =>
              import(/* webpackChunkName: "user" */ "./views/user"),
            redirect: "/user/login",
            children: [
              {
                path: "login",
                component: () =>
                  import(/* webpackChunkName: "user" */ "./views/user/Login"),
              },
              {
                path: "register",
                component: () =>
                  import(
                    /* webpackChunkName: "user" */ "./views/user/Register"
                  ),
              },
              {
                path: "forgot-password",
                component: () =>
                  import(
                    /* webpackChunkName: "user" */ "./views/user/ForgotPassword"
                  ),
              },
              {
                path: "reset-password",
                component: () =>
                  import(
                    /* webpackChunkName: "user" */ "./views/user/ResetPassword"
                  ),
              },
            ],
          },
          {
            path: "*",
            component: () =>
              import(/* webpackChunkName: "error" */ "./views/Error"),
          },
        ]
      :
      [
          {
            path: "/",
            redirect: `/user/login`,
          },
          {
            path: adminRoot,
            component: () => import("./views/app"),
            redirect: `${adminRoot}/principal`,
            meta: { loginRequired: true },
            /*
      define with Authorization :
      meta: { loginRequired: true, roles: [UserRole.Admin, UserRole.Editor] },
      */
            children: [
              {
                path: "principal",
                component: () => import("./views/app/dashboards/Default"),
              },
              {
                path: "vamp",
                component: () => import("./views/app/blank-page"),
              },
            ],
          },
          {
            path: "/error",
            component: () =>
              import(/* webpackChunkName: "error" */ "./views/Error"),
          },
          {
            path: "/unauthorized",
            component: () =>
              import(/* webpackChunkName: "error" */ "./views/Unauthorized"),
          },
          {
            path: "/user",
            component: () =>
              import(/* webpackChunkName: "user" */ "./views/user"),
            redirect: "/user/login",
            children: [
              {
                path: "login",
                component: () =>
                  import(/* webpackChunkName: "user" */ "./views/user/Login"),
              },
              {
                path: "register",
                component: () =>
                  import(
                    /* webpackChunkName: "user" */ "./views/user/Register"
                  ),
              },
              {
                path: "forgot-password",
                component: () =>
                  import(
                    /* webpackChunkName: "user" */ "./views/user/ForgotPassword"
                  ),
              },
              {
                path: "reset-password",
                component: () =>
                  import(
                    /* webpackChunkName: "user" */ "./views/user/ResetPassword"
                  ),
              },
            ],
          },
          {
            path: "*",
            component: () =>
              import(/* webpackChunkName: "error" */ "./views/Error"),
          },
        ]
        ,
  mode: "history",
});
router.beforeEach(AuthGuard);
router.beforeEach((to, from, next) => {
  const publicPages = ["/user/login"];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = localStorage.getItem("auth.token");
  // console.log(authRequired, loggedIn);
  if (authRequired && !loggedIn) {
    next("/user/login");
  } else {
    next();
  }
});
export default router;
