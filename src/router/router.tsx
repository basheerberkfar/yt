import Home from "../pages/home";
import About from "../pages/about";
import { Route } from "@tanstack/react-location";

const useRouter = () => {
  const result: Route[] = [
    {
      path: "home",
      element: <Home />,
    },
    {
      path: "about",
      element: <About />,
    },
  ];
  return result;
};

export default useRouter;
