import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import React from "react";
import SearchResultPage from "./pages/SearchResultPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import MainPage from "./pages/MainPage"
import Nav from './components/Nav'; 
import Signup from "./pages/SignupPage";
import Login from "./pages/LoginPage";
import WishlistPage from "./pages/WishlistPage";

// Helper component to conditionally render Nav
function Layout({ children }) {
  const location = useLocation();
  // Agar current path /signup ya /login hai to navbar mat dikhao
  const hideNavPaths = ["/signup", "/login"];
  const hideNav = hideNavPaths.includes(location.pathname);

  return (
    <>
      {!hideNav && <Nav />}
      {children}
    </>
  );
}

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<MainPage/>} />
          <Route path="/search" element={<SearchResultPage />} />
          <Route path="/product/:productId" element={<ProductDetailPage />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/wishlist" element={<WishlistPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
