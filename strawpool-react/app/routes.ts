import {
  type RouteConfig,
  route,
  index,
  layout,
  prefix
} from "@react-router/dev/routes";

export default [
  route("/","./routes/home.tsx", [
    index("./components/home/HomePage.tsx"),
    layout("./auth/PrivateRoute.tsx", [
      route("dashboard", "./components/dashboard/Dashboard.tsx")
    ]),
    route("create", "./components/polls/CreatePoll.tsx"),
    route("signup", "./components/sign-in-up-out/SignUp.tsx"),
    route("signin", "./components/sign-in-up-out/SignIn.tsx"),
    route("poll/:pollId","./components/polls/Poll.tsx"),
    route("poll/:pollId/results","./components/polls/Results.tsx")
  ]),
] satisfies RouteConfig;
