import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import Footer from "../../components/Footer"
import API_URL from "../../services/api"
import "./ReportLost.css"

function ReportLost() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    itemName: "",
    location: "",
    itemDate: "",
    description: "",
  })

  const [selectedFile, setSelectedFile] = useState(null)
  const [imageName, setImageName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [progressMessage, setProgressMessage] = useState("")

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }))

    setError("")
    setProgressMessage("")
  }

  const handleImageChange = (event) => {
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
        "Only JPG, PNG and WebP images are allowed."
      )
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be smaller than 5MB.")
      return
    }

    setSelectedFile(file)
    setImageName(file.name)
    setError("")
    setProgressMessage("")
  }

  const uploadImage = async () => {
    if (!selectedFile) {
      return null
    }

    const uploadData = new FormData()
    uploadData.append("image", selectedFile)

    const response = await fetch(
      `${API_URL}/api/upload/image`,
      {
        method: "POST",
        credentials: "include",
        body: uploadData,
      }
    )

    const data = await response.json()

    if (!response.ok) {
      throw new Error(
        data.message || "Unable to upload image."
      )
    }

    return data.image.url
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (loading) {
      return
    }

    setLoading(true)
    setError("")

    try {
      let imageUrl = null

      if (selectedFile) {
        setProgressMessage(
          "Uploading your image..."
        )

        imageUrl = await uploadImage()
      }

      setProgressMessage(
        "Publishing your lost item..."
      )

      const response = await fetch(
        `${API_URL}/api/reports`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            type: "lost",
            itemName: formData.itemName.trim(),
            location: formData.location.trim(),
            itemDate: formData.itemDate,
            description: formData.description.trim(),
            imageUrl,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to report lost item."
        )
      }

      navigate("/my-reports")
    } catch (error) {
      setError(
        error.message ||
          "Something went wrong. Please try again."
      )

      setProgressMessage("")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <main className="report-lost-page">
        <section className="report-lost-header">
          <div className="report-lost-header-content">
            <p>REPORT LOST ITEM</p>

            <h1>Tell us what you lost.</h1>

            <span>
              Share the details of the item you lost so someone
              who finds it has a better chance of returning it.
            </span>
          </div>
        </section>

        <section className="report-lost-form-section">
          <div className="report-lost-form-container">
            <div className="report-lost-form-intro">
              <p>ITEM INFORMATION</p>

              <h2>Lost item details</h2>

              <span>
                Provide as much information as possible to make
                your report easier to identify.
              </span>
            </div>

            <form
              className="report-lost-form"
              onSubmit={handleSubmit}
            >
              {error && (
                <div className="report-form-error">
                  {error}
                </div>
              )}

              {progressMessage && (
                <div className="report-form-progress">
                  {progressMessage}
                </div>
              )}

              <div className="form-field">
                <label htmlFor="lostItemName">
                  Item Name
                </label>

                <input
                  id="lostItemName"
                  name="itemName"
                  type="text"
                  placeholder="e.g. Black backpack"
                  value={formData.itemName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="lostLocation">
                  Location Lost
                </label>

                <input
                  id="lostLocation"
                  name="location"
                  type="text"
                  placeholder="Where did you lose it?"
                  value={formData.location}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="lostDate">
                  Date Lost
                </label>

                <input
                  id="lostDate"
                  name="itemDate"
                  type="date"
                  value={formData.itemDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="lostDescription">
                  Item Description
                </label>

                <textarea
                  id="lostDescription"
                  name="description"
                  rows="6"
                  placeholder="Describe the item, its appearance, identifying features, or anything else that may help."
                  value={formData.description}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>

              <div className="form-field">
                <label htmlFor="lostImage">
                  Upload Photo
                  <span> Optional</span>
                </label>

                <div className="image-upload">
                  <input
                    id="lostImage"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleImageChange}
                  />

                  <label
                    htmlFor="lostImage"
                    className="image-upload-box"
                  >
                    <strong>
                      {imageName || "Choose an image"}
                    </strong>

                    <span>
                      JPG, PNG or WebP
                    </span>
                  </label>
                </div>
              </div>

              <div className="report-lost-actions">
                <Link
                  to="/"
                  className="cancel-button"
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  className="submit-lost-button"
                  disabled={loading}
                >
                  {loading
                    ? progressMessage ||
                      "Submitting..."
                    : "Report Lost Item"}
                </button>
              </div>
            </form>
          </div>
        </section>

        <section className="report-lost-info">
          <div>
            <p>YOUR PRIVACY</p>

            <h2>
              Help people contact you
              <br />
              without exposing your email.
            </h2>
          </div>

          <p>
            When your report is published, your name and phone
            number can be shown to people viewing the item. Your
            email address remains private and is only used for
            your account and password recovery.
          </p>
        </section>
      </main>

      <Footer />
    </>
  )
}

export default ReportLost
