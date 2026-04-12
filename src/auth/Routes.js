import RegionPage from "../pages/RegionPage";
import RegisterPage from "../pages/RegistrePage";
import TransportChoicePage from "../pages/TransportChoicePage";
import CalculPage from "../pages/CalculPage";
import HistoriquePage from "../pages/HistoriquePage";
import UsinePage from "../pages/UsinePage";
import LoginForm from "../auth/LoginForm";
import DepartmentPage from "../pages/DepartmentPage.js";
import MapPage from "../pages/MapPage.js";
import AdminRatesPage from "../pages/AdminRatesPage.js";

const routes = [
  { path: "/", element: <DepartmentPage /> },
  { path: "/login", element: <LoginForm /> }, // ← NEW: Login route
  { path: "/region", element: <RegionPage /> },
  { path: "/register", element: <RegisterPage /> },
  { path: "/usine", element: <UsinePage /> },
  { path: "/transport", element: <TransportChoicePage /> },
  { path: "/calcul", element: <CalculPage /> },
  { path: "/historique", element: <HistoriquePage /> },
  { path: "/map", element: <MapPage /> },
  { path: "/admin/rates", element: <AdminRatesPage /> },
];

export default routes;
