import { useEffect, useRef, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import Footer from "../../components/Footer"
import API_URL from "../../services/api"
import "./Profile.css"

function Profile() {
  const { user, setUser, logout } = useAuth()
  const navigate = useNavigate()
  const fileInputRef = useRef(null)

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    whatsappNumber: "",
  })

  const [profilePicture, setProfilePicture] = useState("")
  const [selectedFile, setSelectedFile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/profile`,
          {
            method: "GET",
            credentials: "include",
          }
        )

        const data = await response.json()

        if (!response.ok) {
          setError(
            data.message || "Unable to load your profile."
          )
          return
        }

        setFormData({
          fullName: data.user.full_name || "",
          email: data.user.email || "",
          phoneNumber: data.user.phone_number || "",
          whatsappNumber: data.user.whatsapp_number || "",
        })

        setProfilePicture(
          data.user.profile_picture || ""
        )

        setUser(data.user)
      } catch (error) {
        setError("Unable to connect to the server.")
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [setUser])

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }))

    setMessage("")
    setError("")
  }

  const handlePictureChange = (event) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ]

    if (!allowedTypes.includes(file.type)) {
      setError(
        "Only JPG, PNG, and WebP images are allowed."
      )
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError(
        "Profile picture must be smaller than 5MB."
      )
      return
    }

    setSelectedFile(file)
    setMessage("")
    setError("")
  }

  const handleUploadPicture = async () => {
    if (!selectedFile) {
      return
    }

    setUploading(true)
    setMessage("")
    setError("")

    try {
      const uploadData = new FormData()
      uploadData.append("image", selectedFile)

      const uploadResponse = await fetch(
        `${API_URL}/api/upload/image`,
        {
          method: "POST",
          credentials: "include",
          body: uploadData,
        }
      )

      const uploadResult = await uploadResponse.json()

      if (!uploadResponse.ok) {
        throw new Error(
          uploadResult.message ||
            "Unable to upload profile picture."
        )
      }

      const pictureResponse = await fetch(
        `${API_URL}/api/profile/picture`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            imageUrl: uploadResult.image.url,
          }),
        }
      )

      const pictureResult = await pictureResponse.json()

      if (!pictureResponse.ok) {
        throw new Error(
          pictureResult.message ||
            "Unable to save profile picture."
        )
      }

      setProfilePicture(
        pictureResult.user.profile_picture
      )
      setUser(pictureResult.user)
      setSelectedFile(null)
      setMessage(
        "Profile picture updated successfully."
      )
    } catch (error) {
      setError(
        error.message ||
          "Unable to update profile picture."
      )
    } finally {
      setUploading(false)

      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setMessage("")
    setError("")

    try {
      const response = await fetch(
        `${API_URL}/api/profile`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            fullName: formData.fullName,
            phoneNumber: formData.phoneNumber,
            whatsappNumber: formData.whatsappNumber,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        setError(
          data.message ||
            "Unable to update your profile."
        )
        return
      }

      setFormData({
        fullName: data.user.full_name || "",
        email: data.user.email || "",
        phoneNumber: data.user.phone_number || "",
        whatsappNumber:
          data.user.whatsapp_number || "",
      })

      setUser(data.user)
      setMessage("Profile updated successfully.")
    } catch (error) {
      setError("Unable to connect to the server.")
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      fullName: user?.full_name || "",
      email: user?.email || "",
      phoneNumber: user?.phone_number || "",
      whatsappNumber: user?.whatsapp_number || "",
    })

    setSelectedFile(null)
    setMessage("")
    setError("")

    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleLogout = async () => {
    await logout()
    navigate("/")
  }

  if (loading) {
    return (
      <>
        <main className="profile-page">
          <section className="profile-header">
            <div className="profile-header-content">
              <p className="profile-label">
                YOUR ACCOUNT
              </p>

              <h1>
                Your
                <span>profile.</span>
              </h1>

              <p className="profile-intro">
                Manage your personal information and account
                details.
              </p>
            </div>
          </section>

          <section className="profile-content">
            <div className="profile-loading">
              Loading your profile...
            </div>
          </section>
        </main>

        <Footer />
      </>
    )
  }

  return (
    <>
      <main className="profile-page">
        <section className="profile-header">
          <div className="profile-header-content">
            <p className="profile-label">
              YOUR ACCOUNT
            </p>

            <h1>
              Your
              <span>profile.</span>
            </h1>

            <p className="profile-intro">
              Manage your personal information and account
              details.
            </p>
          </div>
        </section>

        <section className="profile-content">
          <div className="profile-card">
            <div className="profile-card-top">
              <div className="profile-picture-area">
                <div className="profile-picture">
                  {profilePicture ? (
                    <img
                      src={profilePicture}
                      alt="Profile"
                    />
                  ) : (
                    <span>+</span>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handlePictureChange}
                  hidden
                />

                <button
                  type="button"
                  className="change-picture-button"
                  onClick={() =>
                    fileInputRef.current?.click()
                  }
                  disabled={uploading}
                >
                  {uploading
                    ? "Uploading..."
                    : "Change Picture"}
                </button>

                {selectedFile && (
                  <button
                    type="button"
                    className="upload-picture-button"
                    onClick={handleUploadPicture}
                    disabled={uploading}
                  >
                    {uploading
                      ? "Saving Picture..."
                      : "Save Picture"}
                  </button>
                )}

                <p>
                  Optional. Use a clear image that represents
                  you.
                </p>
              </div>

              <div className="profile-form">
                <div className="form-section-heading">
                  <p className="section-label">
                    PERSONAL INFORMATION
                  </p>

                  <h2>Account details</h2>
                </div>

                {error && (
                  <p className="profile-message profile-error">
                    {error}
                  </p>
                )}

                {message && (
                  <p className="profile-message profile-success">
                    {message}
                  </p>
                )}

                <div className="form-group">
                  <label htmlFor="fullName">
                    Full Name
                  </label>

                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">
                    Email Address
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    readOnly
                  />

                  <span className="field-note">
                    Your email is used for your account and
                    password recovery.
                  </span>
                </div>

                <div className="form-group">
                  <label htmlFor="phoneNumber">
                    Phone Number
                  </label>

                  <input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="whatsappNumber">
                    WhatsApp Number
                    <span className="optional-label">
                      {" "}
                      Optional
                    </span>
                  </label>

                  <input
                    id="whatsappNumber"
                    name="whatsappNumber"
                    type="tel"
                    placeholder="Enter your WhatsApp number"
                    value={formData.whatsappNumber}
                    onChange={handleChange}
                  />

                  <span className="field-note">
                    If provided, this number can be shown with
                    your phone number on your reports.
                  </span>
                </div>

                <div className="profile-actions">
                  <button
                    type="button"
                    className="cancel-button"
                    onClick={handleCancel}
                    disabled={saving}
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    className="save-button"
                    onClick={handleSave}
                    disabled={saving}
                  >
                    {saving
                      ? "Saving..."
                      : "Save Changes"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="profile-account-section">
          <div>
            <p className="section-label">ACCOUNT</p>

            <h2>
              Manage your I FOUND account.
            </h2>
          </div>

          <div className="account-actions">
            <Link
              to="/my-reports"
              className="account-link"
            >
              My Reports
              <span>→</span>
            </Link>

            <button
              type="button"
              className="logout-button"
              onClick={handleLogout}
            >
              Log Out
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}

export default Profile