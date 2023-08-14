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
      ? [
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
           
              // EMPLEADOS
              {
                path: "empleados",
                component: () =>
                  import(
                    /* webpackChunkName: "dashboards" */ "./views/app/pages"
                  ),
                children: [
                  {
                    path: "empleados",
                    component: () =>
                      import(
                        /* webpackChunkName: "dashboards" */ "./views/app/pages"
                      ),
                    children: [
    
                     
                      {
                        path: "usuarios",
                        name: "usuarios",
                        component: () =>
                          import("./views/app/pages/empleados/Usuario"),
                      },
                    ],
                  },
                ],
              },
              // PROVEEDORES
              // Todo esto se modifico
         
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
        ],
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
