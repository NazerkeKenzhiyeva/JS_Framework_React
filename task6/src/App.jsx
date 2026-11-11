import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import RootLayout from "./layouts/RootLayout.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import HomePage from "./pages/HomePage.jsx";
import SneakersPage from "./pages/SneakersPage.jsx";

// These pages are loaded only when the user opens their route.
const AboutPage = lazy(() => import("./pages/AboutPage.jsx"));
const SneakerDetailsPage = lazy(() => import("./pages/SneakerDetailsPage.jsx"));
const DashboardPage = lazy(() => import("./pages/DashboardPage.jsx"));
const LoginPage = lazy(() => import("./pages/LoginPage.jsx"));
const SignupPage = lazy(() => import("./pages/SignupPage.jsx"));
const ProfilePage = lazy(() => import("./pages/ProfilePage.jsx"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage.jsx"));

export default function App() {
  return (
    <Suspense fallback={<div className="page-loader">LOADING PAGE...</div>}>
      <Routes>
        {/* All pages use the same header and footer from RootLayout. */}
        <Route element={<RootLayout />}>
          <Route index element={<HomePage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="sneakers" element={<SneakersPage />} />
          <Route path="sneakers/:id" element={<SneakerDetailsPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="signup" element={<SignupPage />} />
          <Route path="profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </Suspense>
  );
}
