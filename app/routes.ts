import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("login", "routes/login.tsx"),
  route("register", "routes/register.tsx"),
  route("garden", "routes/garden.tsx"),
  route("my-tasks", "routes/my-tasks.tsx"),
  route("community-tasks", "routes/community-tasks.tsx"),
  route("leaderboard", "routes/leaderboard.tsx"),
  route("profile", "routes/profile.tsx"),
  route("request-board", "routes/request-board.tsx"),
] satisfies RouteConfig;
