import { Routes, Route, useLocation, Outlet } from "react-router-dom";
import { Container } from "react-bootstrap";

import AppNavbar from "./components/Navbar";
import Footer from "./components/Footer";
import LandingPage from "./pages/Landing/LandingPage";
import AboutPage from "./pages/About/AboutPage";
import PortfolioPage from "./pages/Portfolio/PortfolioPage";
import MarketplaceLayout from "./components/Marketplace/MarketplaceLayout";
import MarketplacePage from "./pages/Marketplace/MarketplacePage";
import ProductDetailPage from "./pages/Marketplace/ProductDetailPage";
import CartPage from "./pages/Marketplace/CartPage";
import ContactPage from "./pages/Contact/ContactPage";
import ScrollToTop from "./components/ScrollToTop";

import AdminLoginPage from "./pages/Admin/AdminLoginPage";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./components/Admin/AdminLayout";
import AboutManager from "./components/Admin/AboutManager";
import ProjectManager from "./components/Admin/ProjectManager";
import BlogManager from "./components/Admin/BlogManager";
import MarketplaceManager from "./components/Admin/MarketplaceManager";
import OrderManager from "./components/Admin/OrderManager";
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
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isBlogRoute = location.pathname.startsWith("/blog");

  return (
    <>
      <ScrollToTop />
      {!isAdminRoute && <AppNavbar />}

      <main style={{ minHeight: "80vh" }}>
        <Routes>
          <Route
            path="/"
            element={
              <Container fluid className="px-md-5">
                <LandingPage />
              </Container>
            }
          />
          <Route
            path="/about"
            element={
              <Container fluid className="py-5 px-md-5">
                <AboutPage />
              </Container>
            }
          />
          <Route
            path="/portfolio"
            element={
              <Container fluid className="py-5 px-md-5">
                <PortfolioPage />
              </Container>
            }
          />

          <Route path="/blog" element={<BlogLayout />}>
            <Route index element={<BlogHomePage />} />
            <Route path="search" element={<BlogSearchResults />} />
            <Route path="categories" element={<CategoriesListPage />} />
            <Route path="categories/:slug" element={<CategoryPage />} />
            <Route path="readlists" element={<ReadlistsListPage />} />
            <Route path="readlists/:slug" element={<ReadlistPage />} />
            <Route path=":slug" element={<SinglePostPage />} />
          </Route>

          <Route path="/marketplace" element={<MarketplaceLayout />}>
            <Route index element={<MarketplacePage />} />
            <Route path="cart" element={<CartPage />} />
            <Route path=":slug" element={<ProductDetailPage />} />
          </Route>

          <Route
            path="/contact"
            element={
              <Container fluid className="py-5 px-md-5">
                <ContactPage />
              </Container>
            }
          />
          <Route path="/admin" element={<AdminLoginPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/admin/dashboard" element={<AdminLayout />}>
              <Route path="overview" element={<DashboardOverview />} />
              <Route path="about" element={<AboutManager />} />
              <Route path="portfolio" element={<ProjectManager />} />
              <Route path="blog" element={<BlogManager />} />
              <Route path="marketplace" element={<MarketplaceManager />} />
              <Route path="orders" element={<OrderManager />} />
              <Route path="bookings" element={<BookingManager />} />
            </Route>
          </Route>
        </Routes>
      </main>

      {!isAdminRoute && !isBlogRoute && <Footer />}
    </>
  );
}

export default App;
