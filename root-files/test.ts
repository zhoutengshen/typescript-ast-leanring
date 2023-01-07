interface Route {
  path: string;
  children?: Route[];
}
const route: Route = {
  path: "user",
  children: [
    {
      path: "Info",
    },
  ],
};
export default route;
