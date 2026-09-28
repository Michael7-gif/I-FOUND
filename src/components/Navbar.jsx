import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"
import "./Navbar.css"

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { user, loading, logout } = useAuth()
  const navigate = useNavigate()

  const closeMenu = () => {
    setMenuOpen(false)
  }

  const handleLogout = async () => {
    await logout()
    closeMenu()
    navigate("/")
  }

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-logo" onClick={closeMenu}>
        I FOUND
      </Link>

      <div className={`navbar-links ${menuOpen ? "open" : ""}`}>
        <Link to="/" onClick={closeMenu}>
          Home
        </Link>

        <Link to="/lost-items" onClick={closeMenu}>
          Lost Items
        </Link>

        <Link to="/found-items" onClick={closeMenu}>
          Found Items
        </Link>

        <Link to="/about" onClick={closeMenu}>
          About Us
        </Link>

        {user && (
          <>
            <Link to="/my-reports" onClick={closeMenu}>
              My Reports
            </Link>

            <Link to="/profile" onClick={closeMenu}>
              Profile
            </Link>
          </>
        )}
      </div>

      <div className="navbar-actions">
        {!loading && !user && (
          <>
            <Link to="/login" className="login-link">
              Login
            </Link>

            <Link to="/signup" className="signup-button">
              Sign Up
            </Link>
          </>
        )}

        {!loading && user && (
          <button
            type="button"
            className="logout-button"
            onClick={handleLogout}
          >
            Logout
          </button>
        )}

        <button
          type="button"
          className={`menu-button ${menuOpen ? "active" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </nav>
  )
}

export default Navbar