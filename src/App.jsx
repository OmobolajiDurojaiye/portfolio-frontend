import { Routes, Route } from "react-router-dom";

import LandingPage from "./pages/Landing/LandingPage";
import AboutPage from "./pages/About/AboutPage";
import ServicesPage from "./pages/Services/ServicesPage";
import PortfolioPage from "./pages/Portfolio/PortfolioPage";
import ContactPage from "./pages/Contact/ContactPage";
import ScrollToTop from "./components/ScrollToTop";
import DashboardLayout from "./components/DashboardLayout";

import AdminLoginPage from "./pages/Admin/AdminLoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./components/Admin/AdminLayout";
import AboutManager from "./components/Admin/AboutManager";
import ProjectManager from "./components/Admin/ProjectManager";
import BlogManager from "./components/Admin/BlogManager";
import BookingManager from "./components/Admin/BookingManager";
import DashboardOverview from "./components/Admin/DashboardOverview";

import BlogLayout from "./components/Blog/BlogLayout";
import BlogHomePage from "./pages/Blog/BlogHomePage";
import SinglePostPage from "./pages/Blog/SinglePostPage";
import ReadlistPage from "./pages/Blog/ReadlistPage";
import CategoriesListPage from "./pages/Blog/CategoriesListPage";
import CategoryPage from "./pages/Blog/CategoryPage";
import BlogSearchResults from "./pages/Blog/BlogSearchResults";
import ReadlistsListPage from "./pages/Blog/ReadlistsListPage";

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Admin Portal Routes */}
        <Route path="/admin" element={<AdminLoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/admin/dashboard" element={<AdminLayout />}>
            <Route path="overview" element={<DashboardOverview />} />
            <Route path="about" element={<AboutManager />} />
            <Route path="portfolio" element={<ProjectManager />} />
            <Route path="blog" element={<BlogManager />} />
            <Route path="bookings" element={<BookingManager />} />
          </Route>
        </Route>

        {/* Client Portal with Editorial Top-Nav & Dashed-Grid Layout */}
        <Route element={<DashboardLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/contact" element={<ContactPage />} />

          <Route path="/blog" element={<BlogLayout />}>
            <Route index element={<BlogHomePage />} />
            <Route path="search" element={<BlogSearchResults />} />
            <Route path="categories" element={<CategoriesListPage />} />
            <Route path="categories/:slug" element={<CategoryPage />} />
            <Route path="readlists" element={<ReadlistsListPage />} />
            <Route path="readlists/:slug" element={<ReadlistPage />} />
            <Route path=":slug" element={<SinglePostPage />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
