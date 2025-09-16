import RegionPage from "../pages/RegionPage";
import RegisterPage from "../pages/RegistrePage";
import TransportChoicePage from "../pages/TransportChoicePage";
import CalculPage from "../pages/CalculPage";
import HistoriquePage from "../pages/HistoriquePage";
import UsinePage from "../pages/UsinePage";
import LoginForm from "../auth/LoginForm";

const routes = [
  //{ path: "/", element: <LoginForm /> },
  { path: "/", element: <RegionPage /> },
  { path: "/region", element: <RegionPage /> },
  { path: "/register", element: <RegisterPage /> },
  { path: "/transport", element: <TransportChoicePage /> },
  { path: "/usine", element: <UsinePage /> },
  { path: "/calcul", element: <CalculPage /> },
  { path: "/historique", element: <HistoriquePage /> },
];

export default routes;
