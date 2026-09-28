import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import Footer from "../../components/Footer"
import API_URL from "../../services/api"
import "./ItemDetails.css"

function ItemDetails() {
  const { id } = useParams()

  const [report, setReport] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const loadReport = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/reports/${id}`
        )

        const data = await response.json()

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Unable to load item."
          )
        }

        setReport(data.report)
      } catch (error) {
        setError(
          error.message ||
            "Unable to load item."
        )
      } finally {
        setLoading(false)
      }
    }

    loadReport()
  }, [id])

  const formatDate = (date) => {
    if (!date) {
      return "Date unavailable"
    }

    return new Date(date).toLocaleDateString(
      "en-NG",
      {
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    )
  }

  const getWhatsAppNumber = (number) => {
    if (!number) {
      return ""
    }

    const cleaned = number.replace(/\D/g, "")

    if (cleaned.startsWith("234")) {
      return cleaned
    }

    if (cleaned.startsWith("0")) {
      return `234${cleaned.slice(1)}`
    }

    return cleaned
  }

  if (loading) {
    return (
      <>
        <main className="item-details-page">
          <div className="item-details-state">
            <h2>Loading item...</h2>

            <p>
              Please wait while we load the report.
            </p>
          </div>
        </main>

        <Footer />
      </>
    )
  }

  if (error || !report) {
    return (
      <>
        <main className="item-details-page">
          <div className="item-details-state">
            <h2>Unable to load item</h2>

            <p>
              {error ||
                "This report could not be found."}
            </p>

            <Link
              to="/lost-items"
              className="item-details-back-button"
            >
              Back to Items
            </Link>
          </div>
        </main>

        <Footer />
      </>
    )
  }

  const isLost = report.type === "lost"

  const whatsappNumber = getWhatsAppNumber(
    report.poster_whatsapp
  )

  return (
    <>
      <main className="item-details-page">
        <section className="item-details-header">
          <div className="item-details-header-content">
            <Link
              to={
                isLost
                  ? "/lost-items"
                  : "/found-items"
              }
              className="back-link"
            >
              ← Back to{" "}
              {isLost
                ? "Lost Items"
                : "Found Items"}
            </Link>

            <p>
              {isLost
                ? "LOST ITEM"
                : "FOUND ITEM"}
            </p>

            <h1>{report.item_name}</h1>

            <span>
              {isLost
                ? "Someone reported this item as lost."
                : "Someone reported finding this item."}
            </span>
          </div>
        </section>

        <section className="item-details-content">
          <div className="item-details-layout">
            <div className="item-details-image-section">
              <div className="item-details-image">
                {report.image_url ? (
                  <img
                    src={report.image_url}
                    alt={report.item_name}
                  />
                ) : (
                  <div className="item-details-no-image">
                    No image available
                  </div>
                )}
              </div>
            </div>

            <div className="item-details-info">
              <div className="item-details-status-row">
                <span
                  className={`item-details-status ${report.status}`}
                >
                  {report.status}
                </span>
              </div>

              <div className="item-details-main-info">
                <div className="item-info-block">
                  <span>LOCATION</span>

                  <strong>
                    {report.location}
                  </strong>
                </div>

                <div className="item-info-block">
                  <span>
                    {isLost
                      ? "DATE LOST"
                      : "DATE FOUND"}
                  </span>

                  <strong>
                    {formatDate(
                      report.item_date
                    )}
                  </strong>
                </div>

                <div className="item-info-block item-description-block">
                  <span>DESCRIPTION</span>

                  <p>
                    {report.description}
                  </p>
                </div>
              </div>

              <div className="item-reported-by">
                <p>REPORTED BY</p>

                <div className="item-reporter">
                  {report.poster_profile_picture ? (
                    <img
                      src={
                        report.poster_profile_picture
                      }
                      alt={
                        report.poster_name ||
                        "Reporter"
                      }
                      className="item-reporter-image"
                    />
                  ) : (
                    <div className="item-reporter-placeholder">
                      {report.poster_name
                        ?.charAt(0)
                        ?.toUpperCase() ||
                        "U"}
                    </div>
                  )}

                  <div className="item-reporter-info">
                    <strong>
                      {report.poster_name ||
                        "Unknown user"}
                    </strong>

                    <span>
                      Report posted by this user
                    </span>
                  </div>
                </div>

                <div className="reporter-contact-details">
                  {report.poster_phone && (
                    <a
                      href={`tel:${report.poster_phone}`}
                      className="reporter-contact-link"
                    >
                      <span>Phone</span>

                      <strong>
                        {report.poster_phone}
                      </strong>
                    </a>
                  )}

                  {report.poster_whatsapp && (
                    <a
                      href={`https://wa.me/${whatsappNumber}`}
                      target="_blank"
                      rel="noreferrer"
                      className="reporter-contact-link"
                    >
                      <span>WhatsApp</span>

                      <strong>
                        {report.poster_whatsapp}
                      </strong>
                    </a>
                  )}
                </div>

                <div className="reporter-actions">
                  {report.poster_phone && (
                    <a
                      href={`tel:${report.poster_phone}`}
                      className="contact-reporter-button"
                    >
                      Call{" "}
                      {report.poster_name ||
                        "Reporter"}
                    </a>
                  )}

                  {report.poster_whatsapp &&
                    whatsappNumber && (
                      <a
                        href={`https://wa.me/${whatsappNumber}`}
                        target="_blank"
                        rel="noreferrer"
                        className="whatsapp-reporter-button"
                      >
                        WhatsApp
                      </a>
                    )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}

export default ItemDetails