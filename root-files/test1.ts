interface Route {
  path: string;
  navHandleName?: string;
  query?: Record<string, any>;
  component: () => Promise<any>;
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
      component: () => Promise.resolve("./okk"),
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
  navHandleName: "",
};

export default routes;
