interface Route {
  path: string;
  navHandleName?: string;
  query?: Record<string, any>;
  component: () => Promise<string>;
  children?: Route[];
}

const userPath = "/user";
const subUserPath = "/sub";
const routes: Route = {
  path: userPath,
  component: () => Promise.resolve("User"),
  children: [
    {
      path: "info",
      navHandleName: "navToInfo",
      component: () => Promise.resolve("UserInfo"),
    },
    {
      path: "sub".concat("/ok"),
      navHandleName: "navInfoSubOK",
      component: () => Promise.resolve("UserInfo"),
    },
    {
      path: "sub" + subUserPath,
      navHandleName: "navInfoSubSubPath",
      component: () => Promise.resolve("UserInfo"),
    },
    {
      path: `sub/${subUserPath}`,
      navHandleName: "navInfoSubSubPath",
      component: () => Promise.resolve("UserInfo"),
    },
  ],
  navHandleName: ""
};

export default routes;
