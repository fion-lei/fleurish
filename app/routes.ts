import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  // route(path, file)
  route("request-board", "routes/request-board.tsx"),
] satisfies RouteConfig;
