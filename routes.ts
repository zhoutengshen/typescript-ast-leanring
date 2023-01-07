interface Route {
  path: string;
  query?: Record<string, any>;
  component: () => Promise<string>;
  children?: Route[];
}
const userPath = "/user";
const routes: Route = {
  path: userPath,
  component: () => Promise.resolve("User"),
  children: [
    {
      path: "info",
      component: () => Promise.resolve("UserInfo"),
    },
  ],
};

export default routes;
