import { Link } from "react-router-dom"
import "./Footer.css"

function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-main">
        <div className="site-footer-brand">
          <Link to="/" className="site-footer-logo">
            I FOUND
          </Link>

          <p>
            A simple Lost & Found platform for schools,
            organizations, and communities.
          </p>
        </div>

        <div className="site-footer-navigation">
          <p className="site-footer-title">EXPLORE</p>

          <Link to="/">Home</Link>
          <Link to="/lost-items">Lost Items</Link>
          <Link to="/found-items">Found Items</Link>
          <Link to="/about">About Us</Link>
        </div>

        <div className="site-footer-navigation">
          <p className="site-footer-title">ACCOUNT</p>

          <Link to="/login">Login</Link>
          <Link to="/signup">Sign Up</Link>
          <Link to="/my-reports">My Reports</Link>
          <Link to="/profile">Profile</Link>
        </div>

        <div className="site-footer-navigation">
          <p className="site-footer-title">REPORT</p>

          <Link to="/report-lost">Report Lost Item</Link>
          <Link to="/report-found">Report Found Item</Link>
        </div>
      </div>

      <div className="site-footer-bottom">
        <p>© 2026 I FOUND. All rights reserved.</p>

        <p>Lost & Found, made simple.</p>
      </div>
    </footer>
  )
}

export default Footer