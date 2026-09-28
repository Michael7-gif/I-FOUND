import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import "./MyReports.css"
import Footer from "../../components/Footer"
import API_URL from "../../services/api"

function MyReports() {
  const [reports, setReports] = useState([])
  const [filter, setFilter] = useState("all")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [actionId, setActionId] = useState(null)

  const loadReports = async () => {
    try {
      setError("")

      const response = await fetch(
        `${API_URL}/api/reports/mine`,
        {
          credentials: "include",
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to load your reports."
        )
      }

      setReports(data.reports || [])
    } catch (error) {
      setError(
        error.message ||
          "Unable to load your reports."
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadReports()
  }, [])

  const filteredReports = useMemo(() => {
    if (filter === "all") {
      return reports
    }

    return reports.filter(
      (report) => report.type === filter
    )
  }, [reports, filter])

  const lostCount = reports.filter(
    (report) => report.type === "lost"
  ).length

  const foundCount = reports.filter(
    (report) => report.type === "found"
  ).length

  const formatDate = (date) => {
    if (!date) {
      return "Date unavailable"
    }

    return new Date(date).toLocaleDateString(
      "en-NG",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    )
  }

  const formatStatus = (status) => {
    if (!status) {
      return "Unknown"
    }

    return (
      status.charAt(0).toUpperCase() +
      status.slice(1)
    )
  }

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this report?"
    )

    if (!confirmed) {
      return
    }

    setActionId(id)
    setError("")

    try {
      const response = await fetch(
        `${API_URL}/api/reports/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to delete report."
        )
      }

      setReports((previous) =>
        previous.filter(
          (report) => report.id !== id
        )
      )
    } catch (error) {
      setError(
        error.message ||
          "Unable to delete report."
      )
    } finally {
      setActionId(null)
    }
  }

  const handleStatusChange = async (
    id,
    status
  ) => {
    setActionId(id)
    setError("")

    try {
      const response = await fetch(
        `${API_URL}/api/reports/${id}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            status,
          }),
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to update report status."
        )
      }

      setReports((previous) =>
        previous.map((report) =>
          report.id === id
            ? {
                ...report,
                status: data.report.status,
              }
            : report
        )
      )
    } catch (error) {
      setError(
        error.message ||
          "Unable to update report status."
      )
    } finally {
      setActionId(null)
    }
  }

  return (
    <>
      <main className="my-reports-page">
        <section className="my-reports-header">
          <div className="my-reports-header-content">
            <p>YOUR REPORTS</p>

            <h1>
              Manage what you've
              <span>reported.</span>
            </h1>

            <span>
              View, update, and manage the lost and found items
              you have reported on I FOUND.
            </span>
          </div>

          <div className="my-reports-header-actions">
            <Link
              to="/report-lost"
              className="my-reports-lost-button"
            >
              Report Lost Item
            </Link>

            <Link
              to="/report-found"
              className="my-reports-found-button"
            >
              Report Found Item
            </Link>
          </div>
        </section>

        <section className="my-reports-content">
          <div className="my-reports-summary">
            <button
              type="button"
              className={
                filter === "all"
                  ? "summary-card active"
                  : "summary-card"
              }
              onClick={() => setFilter("all")}
            >
              <span>Total Reports</span>
              <strong>{reports.length}</strong>
            </button>

            <button
              type="button"
              className={
                filter === "lost"
                  ? "summary-card active"
                  : "summary-card"
              }
              onClick={() => setFilter("lost")}
            >
              <span>Lost Items</span>
              <strong>{lostCount}</strong>
            </button>

            <button
              type="button"
              className={
                filter === "found"
                  ? "summary-card active"
                  : "summary-card"
              }
              onClick={() => setFilter("found")}
            >
              <span>Found Items</span>
              <strong>{foundCount}</strong>
            </button>
          </div>

          {error && (
            <div className="my-reports-error">
              {error}
            </div>
          )}

          {loading && (
            <div className="my-reports-empty">
              <h3>Loading your reports...</h3>

              <p>
                Please wait while we load your reports.
              </p>
            </div>
          )}

          {!loading &&
            !error &&
            filteredReports.length === 0 && (
              <div className="my-reports-empty">
                <div className="my-reports-empty-icon">
                  +
                </div>

                <h3>
                  {filter === "all"
                    ? "You have no reports yet"
                    : `You have no ${filter} reports`}
                </h3>

                <p>
                  Create a lost or found report to start
                  using I FOUND.
                </p>

                <div className="my-reports-empty-actions">
                  <Link
                    to="/report-lost"
                    className="my-reports-empty-lost"
                  >
                    Report Lost Item
                  </Link>

                  <Link
                    to="/report-found"
                    className="my-reports-empty-found"
                  >
                    Report Found Item
                  </Link>
                </div>
              </div>
            )}

          {!loading &&
            filteredReports.length > 0 && (
              <div className="my-reports-list">
                {filteredReports.map((report) => (
                  <article
                    className="my-report-card"
                    key={report.id}
                  >
                    <Link
                      to={`/item/${report.id}`}
                      className="my-report-image"
                    >
                      {report.image_url ? (
                        <img
                          src={report.image_url}
                          alt={report.item_name}
                        />
                      ) : (
                        <div className="my-report-no-image">
                          No image
                        </div>
                      )}
                    </Link>

                    <div className="my-report-content">
                      <div className="my-report-top">
                        <div>
                          <span
                            className={`my-report-type ${report.type}`}
                          >
                            {report.type}
                          </span>

                          <h2>
                            {report.item_name}
                          </h2>
                        </div>

                        <span
                          className={`my-report-status ${report.status}`}
                        >
                          {formatStatus(
                            report.status
                          )}
                        </span>
                      </div>

                      <div className="my-report-details">
                        <div>
                          <span>
                            LOCATION
                          </span>

                          <strong>
                            {report.location}
                          </strong>
                        </div>

                        <div>
                          <span>
                            {report.type === "lost"
                              ? "DATE LOST"
                              : "DATE FOUND"}
                          </span>

                          <strong>
                            {formatDate(
                              report.item_date
                            )}
                          </strong>
                        </div>
                      </div>

                      <p className="my-report-description">
                        {report.description}
                      </p>

                      <div className="my-report-actions">
                        <select
                          value={
                            report.status || ""
                          }
                          onChange={(event) =>
                            handleStatusChange(
                              report.id,
                              event.target.value
                            )
                          }
                          disabled={
                            actionId === report.id
                          }
                        >
                          <option value="lost">
                            Lost
                          </option>

                          <option value="found">
                            Found
                          </option>

                          <option value="claimed">
                            Claimed
                          </option>

                          <option value="returned">
                            Returned
                          </option>

                          <option value="closed">
                            Closed
                          </option>
                        </select>

                        <Link
                          to={`/item/${report.id}`}
                          className="view-report-button"
                        >
                          View Report
                        </Link>

                        <button
                          type="button"
                          className="delete-report-button"
                          onClick={() =>
                            handleDelete(
                              report.id
                            )
                          }
                          disabled={
                            actionId === report.id
                          }
                        >
                          {actionId === report.id
                            ? "Working..."
                            : "Delete"}
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
        </section>
      </main>

      <Footer />
    </>
  )
}

export default MyReports