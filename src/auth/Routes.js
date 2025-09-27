import RegionPage from "../pages/RegionPage";
import RegisterPage from "../pages/RegistrePage";
import TransportChoicePage from "../pages/TransportChoicePage";
import CalculPage from "../pages/CalculPage";
import HistoriquePage from "../pages/HistoriquePage";
import UsinePage from "../pages/UsinePage";
import LoginForm from "../auth/LoginForm";
import DepartmentPage from "../pages/DepartmentPage.js";

const routes = [
  { path: "/", element: <DepartmentPage /> },
  { path: "/region", element: <RegionPage /> },
  { path: "/register", element: <RegisterPage /> },
  { path: "/usine", element: <UsinePage /> },
  { path: "/transport", element: <TransportChoicePage /> },
  { path: "/calcul", element: <CalculPage /> },
  { path: "/historique", element: <HistoriquePage /> },
];

export default routes;
