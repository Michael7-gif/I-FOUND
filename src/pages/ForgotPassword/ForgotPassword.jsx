import { useState } from "react"
import { Link } from "react-router-dom"
import Footer from "../../components/Footer"
import API_URL from "../../services/api"
import "./ForgotPassword.css"

function ForgotPassword() {
  const [step, setStep] = useState(1)
  const [email, setEmail] = useState("")
  const [code, setCode] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  const handleRequestCode = async (event) => {
    event.preventDefault()

    setLoading(true)
    setMessage("")
    setError("")

    try {
      const response = await fetch(
        `${API_URL}/api/auth/forgot-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to send reset code."
        )
      }

      setMessage(
        data.message ||
          "If an account exists with that email, a reset code has been sent."
      )

      setStep(2)
    } catch (error) {
      setError(
        error.message || "Unable to send reset code."
      )
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyCode = async (event) => {
    event.preventDefault()

    setLoading(true)
    setMessage("")
    setError("")

    try {
      const response = await fetch(
        `${API_URL}/api/auth/verify-reset-code`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            code: code.trim(),
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || "Invalid or expired reset code."
        )
      }

      setMessage(
        data.message || "Code verified successfully."
      )

      setStep(3)
    } catch (error) {
      setError(
        error.message || "Unable to verify reset code."
      )
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (event) => {
    event.preventDefault()

    setLoading(true)
    setMessage("")
    setError("")

    if (password.length < 8) {
      setError("Password must be at least 8 characters.")
      setLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      setLoading(false)
      return
    }

    try {
      const response = await fetch(
        `${API_URL}/api/auth/reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            code: code.trim(),
            newPassword: password,
            confirmPassword,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to reset password."
        )
      }

      setMessage(
        data.message ||
          "Your password has been reset successfully."
      )

      setPassword("")
      setConfirmPassword("")
      setStep(4)
    } catch (error) {
      setError(
        error.message || "Unable to reset password."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <main className="forgot-password-page">
        <section className="forgot-password-section">
          <div className="forgot-password-container">
            <div className="forgot-password-intro">
              <p>ACCOUNT RECOVERY</p>

              <h1>
                Reset your
                <span>password.</span>
              </h1>

              <p>
                Recover access to your I FOUND account using the
                email address connected to your account.
              </p>
            </div>

            <div className="forgot-password-card">
              <div className="forgot-password-step">
                Step {step === 4 ? 3 : step} of 3
              </div>

              {step === 1 && (
                <form onSubmit={handleRequestCode}>
                  <div className="form-group">
                    <label htmlFor="email">
                      Email Address
                    </label>

                    <input
                      id="email"
                      type="email"
                      placeholder="Enter your email address"
                      value={email}
                      onChange={(event) => {
                        setEmail(event.target.value)
                        setError("")
                        setMessage("")
                      }}
                      required
                    />
                  </div>

                  {error && (
                    <p className="forgot-password-message forgot-password-error">
                      {error}
                    </p>
                  )}

                  {message && (
                    <p className="forgot-password-message forgot-password-success">
                      {message}
                    </p>
                  )}

                  <button
                    type="submit"
                    className="forgot-password-button"
                    disabled={loading}
                  >
                    {loading
                      ? "Sending..."
                      : "Send Reset Code"}
                  </button>
                </form>
              )}

              {step === 2 && (
                <form onSubmit={handleVerifyCode}>
                  <div className="forgot-password-form-heading">
                    <h2>Enter your code</h2>

                    <p>
                      Enter the reset code sent to your email
                      address.
                    </p>
                  </div>

                  <div className="form-group">
                    <label htmlFor="code">
                      Reset Code
                    </label>

                    <input
                      id="code"
                      type="text"
                      inputMode="numeric"
                      placeholder="Enter your reset code"
                      value={code}
                      onChange={(event) => {
                        setCode(event.target.value)
                        setError("")
                        setMessage("")
                      }}
                      required
                    />
                  </div>

                  {error && (
                    <p className="forgot-password-message forgot-password-error">
                      {error}
                    </p>
                  )}

                  {message && (
                    <p className="forgot-password-message forgot-password-success">
                      {message}
                    </p>
                  )}

                  <button
                    type="submit"
                    className="forgot-password-button"
                    disabled={loading}
                  >
                    {loading
                      ? "Verifying..."
                      : "Verify Code"}
                  </button>

                  <button
                    type="button"
                    className="forgot-password-secondary-button"
                    onClick={() => {
                      setStep(1)
                      setCode("")
                      setError("")
                      setMessage("")
                    }}
                  >
                    Use another email
                  </button>
                </form>
              )}

              {step === 3 && (
                <form onSubmit={handleResetPassword}>
                  <div className="forgot-password-form-heading">
                    <h2>Create a new password</h2>

                    <p>
                      Choose a new password for your I FOUND
                      account.
                    </p>
                  </div>

                  <div className="form-group">
                    <label htmlFor="password">
                      New Password
                    </label>

                    <div className="password-input">
                      <input
                        id="password"
                        type={
                          showPassword
                            ? "text"
                            : "password"
                        }
                        placeholder="Enter your new password"
                        value={password}
                        onChange={(event) => {
                          setPassword(event.target.value)
                          setError("")
                          setMessage("")
                        }}
                        required
                      />

                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() =>
                          setShowPassword(
                            (previous) => !previous
                          )
                        }
                        aria-label={
                          showPassword
                            ? "Hide password"
                            : "Show password"
                        }
                      >
                        {showPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="confirmPassword">
                      Confirm Password
                    </label>

                    <div className="password-input">
                      <input
                        id="confirmPassword"
                        type={
                          showConfirmPassword
                            ? "text"
                            : "password"
                        }
                        placeholder="Confirm your new password"
                        value={confirmPassword}
                        onChange={(event) => {
                          setConfirmPassword(
                            event.target.value
                          )
                          setError("")
                          setMessage("")
                        }}
                        required
                      />

                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() =>
                          setShowConfirmPassword(
                            (previous) => !previous
                          )
                        }
                        aria-label={
                          showConfirmPassword
                            ? "Hide password"
                            : "Show password"
                        }
                      >
                        {showConfirmPassword
                          ? "Hide"
                          : "Show"}
                      </button>
                    </div>
                  </div>

                  {error && (
                    <p className="forgot-password-message forgot-password-error">
                      {error}
                    </p>
                  )}

                  {message && (
                    <p className="forgot-password-message forgot-password-success">
                      {message}
                    </p>
                  )}

                  <button
                    type="submit"
                    className="forgot-password-button"
                    disabled={loading}
                  >
                    {loading
                      ? "Resetting..."
                      : "Reset Password"}
                  </button>
                </form>
              )}

              {step === 4 && (
                <div className="forgot-password-complete">
                  <div className="forgot-password-complete-icon">
                    ✓
                  </div>

                  <h2>Password reset successful</h2>

                  <p>
                    Your password has been changed. You can now
                    log in with your new password.
                  </p>

                  <Link
                    to="/login"
                    className="forgot-password-button"
                  >
                    Go to Login
                  </Link>
                </div>
              )}

              {step !== 4 && (
                <div className="forgot-password-footer">
                  <Link to="/login">
                    ← Back to Login
                  </Link>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}

export default ForgotPassword