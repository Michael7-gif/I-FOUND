import { Link, useNavigate } from "react-router-dom"
import { useState } from "react"
import "./SignUp.css"
import API_URL from "../../services/api"

function SignUp() {
  const navigate = useNavigate()

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)

  const handleChange = (event) => {
    const { id, value } = event.target

    setFormData((previous) => ({
      ...previous,
      [id]: value,
    }))

    setError("")
    setSuccess("")
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    setError("")
    setSuccess("")
    setLoading(true)

    try {
      const response = await fetch(`${API_URL}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || "Unable to create account.")
        return
      }

      setSuccess("Account created successfully.")

      setFormData({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
      })

      setTimeout(() => {
        navigate("/login")
      }, 1200)
    } catch (error) {
      setError("Unable to connect to the server. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="signup-page">
      <div className="signup-container">

        <div className="signup-header">
          <p className="signup-label">CREATE AN ACCOUNT</p>

          <h1>Join I FOUND.</h1>

          <p>
            Create an account to report lost or found items and
            reconnect people with what matters.
          </p>
        </div>

        <form className="signup-form" onSubmit={handleSubmit}>

          <div className="form-group">
            <label htmlFor="fullName">Full Name</label>

            <input
              id="fullName"
              type="text"
              placeholder="Enter your full name"
              autoComplete="name"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>

            <input
              id="email"
              type="email"
              placeholder="Enter your email address"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>

            <div className="password-input">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>

            <div className="password-input">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                autoComplete="new-password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />

              <button
                type="button"
                onClick={() =>
                  setShowConfirmPassword(!showConfirmPassword)
                }
              >
                {showConfirmPassword ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          {error && (
            <p className="signup-message signup-error">
              {error}
            </p>
          )}

          {success && (
            <p className="signup-message signup-success">
              {success}
            </p>
          )}

          <button
            type="submit"
            className="signup-submit"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>

        </form>

        <p className="login-prompt">
          Already have an account?{" "}
          <Link to="/login">Log in</Link>
        </p>

      </div>
    </main>
  )
}

export default SignUp