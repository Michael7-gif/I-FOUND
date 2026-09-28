import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import "./LostItems.css"
import Footer from "../../components/Footer"

function LostItems() {
  const [reports, setReports] = useState([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    const loadReports = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/reports/lost")

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.message || "Unable to load lost items.")
        }

        setReports(data.reports || [])
      } catch (error) {
        setError(error.message || "Unable to load lost items.")
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
        report.item_name?.toLowerCase().includes(query) ||
        report.location?.toLowerCase().includes(query)
      )
    })
  }, [reports, search])

  const formatDate = (date) => {
    if (!date) return "Date unavailable"

    return new Date(date).toLocaleDateString("en-NG", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  return (
    <>
      <main className="lost-items-page">
        <section className="lost-items-header">
          <div className="lost-items-header-content">
            <p>LOST ITEMS</p>

            <h1>Help bring lost belongings home.</h1>

            <span>
              Browse items reported as lost and see if you can help
              reconnect someone with what they are looking for.
            </span>
          </div>

          <Link to="/report-lost" className="report-lost-button">
            Report Lost Item
          </Link>
        </section>

        <section className="lost-items-content">
          <div className="lost-items-search">
            <div className="search-field">
              <label htmlFor="lostSearch">Search lost items</label>

              <input
                id="lostSearch"
                type="search"
                placeholder="Search by item name or location"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>

            <button type="button" className="search-button">
              Search
            </button>
          </div>

          <div className="lost-items-heading">
            <div>
              <p>REPORTS</p>
              <h2>Lost items</h2>
            </div>
          </div>

          {loading && (
            <div className="lost-items-empty">
              <h3>Loading lost items...</h3>
              <p>Please wait while we load the latest reports.</p>
            </div>
          )}

          {!loading && error && (
            <div className="lost-items-empty">
              <h3>Unable to load lost items</h3>
              <p>{error}</p>
            </div>
          )}

          {!loading && !error && filteredReports.length === 0 && (
            <div className="lost-items-empty">
              <div className="empty-icon">+</div>

              <h3>
                {search ? "No matching lost items" : "No lost items yet"}
              </h3>

              <p>
                {search
                  ? "Try searching with another item name or location."
                  : "Lost item reports will appear here when people report belongings they have lost."}
              </p>

              {!search && (
                <Link to="/report-lost" className="empty-action">
                  Report a Lost Item
                </Link>
              )}
            </div>
          )}

          {!loading && !error && filteredReports.length > 0 && (
            <div className="lost-items-grid">
              {filteredReports.map((report) => (
                <Link
                  to={`/item/${report.id}`}
                  className="lost-item-card"
                  key={report.id}
                >
                  <div className="lost-item-image">
                    {report.image_url ? (
                      <img
                        src={report.image_url}
                        alt={report.item_name}
                      />
                    ) : (
                      <div className="lost-item-no-image">
                        No image
                      </div>
                    )}
                  </div>

                  <div className="lost-item-card-content">
                    <div className="lost-item-card-top">
                      <span className="lost-item-status">
                        {report.status}
                      </span>
                    </div>

                    <h3>{report.item_name}</h3>

                    <p>{report.location}</p>

                    <span>
                      Lost on {formatDate(report.item_date)}
                    </span>

                    <div className="lost-item-poster">
                      {report.poster_profile_picture ? (
                        <img
                          src={report.poster_profile_picture}
                          alt={report.poster_name}
                          className="lost-item-poster-image"
                        />
                      ) : (
                        <div className="lost-item-poster-placeholder">
                          {report.poster_name?.charAt(0)?.toUpperCase() || "U"}
                        </div>
                      )}

                      <div className="lost-item-poster-info">
                        <span>Posted by</span>
                        <strong>{report.poster_name || "Unknown user"}</strong>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        <section className="lost-items-bottom">
          <div>
            <p>LOOKING FOR SOMETHING?</p>

            <h2>
              Someone may have found
              <br />
              what you're looking for.
            </h2>
          </div>

          <Link to="/found-items" className="browse-found-button">
            Browse Found Items →
          </Link>
        </section>
      </main>

      <Footer />
    </>
  )
}

export default LostItems