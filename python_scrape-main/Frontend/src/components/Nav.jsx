import React, { useContext, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "./Nav.css";

const Nav = () => {
  const { user, fetchUser } = useContext(AuthContext);
  const location = useLocation();

  useEffect(() => {
    fetchUser(); // Re-fetch user on route change
  }, [location]);

  return (
    <nav className="nav">
      <div className="nav-logo">
        <i className="bi bi-bar-chart-fill"></i> Track
      </div>

      <ul className="nav-links">
        <li>
          <Link to="/wishlist" className="nav-link">
            <i className="bi bi-heart-fill"></i> Wishlist
          </Link>
        </li>

        {!user ? (
          <>
            <li>
              <Link to="/login" className="nav-link">
                <i className="bi bi-box-arrow-in-right"></i> Login
              </Link>
            </li>
            <li>
              <Link to="/signup" className="nav-link">
                <i className="bi bi-person-plus-fill"></i> Signup
              </Link>
            </li>
          </>
        ) : (
          <li>
            <Link to="/profile" className="nav-link user-link">
              <i className="bi bi-person-circle"></i> {user.username}
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Nav;
