import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import "./FoundItems.css"
import Footer from "../../components/Footer"
import API_URL from "../../services/api"

function FoundItems() {
  const [reports, setReports] = useState([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const loadReports = async () => {
      try {
        const response = await fetch(
          `${API_URL}/api/reports/found`
        )

        const data = await response.json()

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Unable to load found items."
          )
        }

        setReports(data.reports || [])
      } catch (error) {
        setError(
          error.message ||
            "Unable to load found items."
        )
      } finally {
        setLoading(false)
      }
    }

    loadReports()
  }, [])

  const filteredReports = useMemo(() => {
    const query = search.trim().toLowerCase()

    if (!query) {
      return reports
    }

    return reports.filter((report) => {
      return (
        report.item_name
          ?.toLowerCase()
          .includes(query) ||
        report.location
          ?.toLowerCase()
          .includes(query)
      )
    })
  }, [reports, search])

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

  return (
    <>
      <main className="found-items-page">
        <section className="found-items-header">
          <div className="found-items-header-content">
            <p>FOUND ITEMS</p>

            <h1>
              Help return what someone has lost.
            </h1>

            <span>
              Browse items people have found and see if one
              belongs to someone who is looking for it.
            </span>
          </div>

          <Link
            to="/report-found"
            className="report-found-button"
          >
            Report Found Item
          </Link>
        </section>

        <section className="found-items-content">
          <div className="found-items-search">
            <div className="search-field">
              <label htmlFor="foundSearch">
                Search found items
              </label>

              <input
                id="foundSearch"
                type="search"
                placeholder="Search by item name or location"
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
              />
            </div>

            <button
              type="button"
              className="search-button"
            >
              Search
            </button>
          </div>

          <div className="found-items-heading">
            <div>
              <p>REPORTS</p>
              <h2>Found items</h2>
            </div>
          </div>

          {loading && (
            <div className="found-items-empty">
              <h3>
                Loading found items...
              </h3>

              <p>
                Please wait while we load the latest reports.
              </p>
            </div>
          )}

          {!loading && error && (
            <div className="found-items-empty">
              <h3>
                Unable to load found items
              </h3>

              <p>{error}</p>
            </div>
          )}

          {!loading &&
            !error &&
            filteredReports.length === 0 && (
              <div className="found-items-empty">
                <div className="empty-icon">
                  +
                </div>

                <h3>
                  {search
                    ? "No matching found items"
                    : "No found items yet"}
                </h3>

                <p>
                  {search
                    ? "Try searching with another item name or location."
                    : "Found item reports will appear here when people report items they have found."}
                </p>

                {!search && (
                  <Link
                    to="/report-found"
                    className="empty-action"
                  >
                    Report a Found Item
                  </Link>
                )}
              </div>
            )}

          {!loading &&
            !error &&
            filteredReports.length > 0 && (
              <div className="found-items-grid">
                {filteredReports.map((report) => (
                  <Link
                    to={`/item/${report.id}`}
                    className="found-item-card"
                    key={report.id}
                  >
                    <div className="found-item-image">
                      {report.image_url ? (
                        <img
                          src={report.image_url}
                          alt={report.item_name}
                        />
                      ) : (
                        <div className="found-item-no-image">
                          No image
                        </div>
                      )}
                    </div>

                    <div className="found-item-card-content">
                      <div className="found-item-card-top">
                        <span className="found-item-status">
                          {report.status}
                        </span>
                      </div>

                      <h3>{report.item_name}</h3>

                      <p>{report.location}</p>

                      <span>
                        Found on{" "}
                        {formatDate(
                          report.item_date
                        )}
                      </span>

                      <div className="found-item-poster">
                        {report.poster_profile_picture ? (
                          <img
                            src={
                              report.poster_profile_picture
                            }
                            alt={
                              report.poster_name
                            }
                            className="found-item-poster-image"
                          />
                        ) : (
                          <div className="found-item-poster-placeholder">
                            {report.poster_name
                              ?.charAt(0)
                              ?.toUpperCase() || "U"}
                          </div>
                        )}

                        <div className="found-item-poster-info">
                          <span>
                            Posted by
                          </span>

                          <strong>
                            {report.poster_name ||
                              "Unknown user"}
                          </strong>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
        </section>

        <section className="found-items-bottom">
          <div>
            <p>LOOKING FOR A LOST ITEM?</p>

            <h2>
              Someone may have found
              <br />
              what you're missing.
            </h2>
          </div>

          <Link
            to="/lost-items"
            className="browse-lost-button"
          >
            Browse Lost Items →
          </Link>
        </section>
      </main>

      <Footer />
    </>
  )
}

export default FoundItems