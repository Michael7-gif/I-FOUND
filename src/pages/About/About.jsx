import { Link } from "react-router-dom"
import "./About.css"
import Footer from "../../components/Footer"

function About() {
  return (
    <>
    <main className="about-page">
      <section className="about-hero">
        <div className="about-hero-content">
          <p className="about-label">ABOUT I FOUND</p>

          <h1>
            A simpler way
            <span>to reconnect.</span>
          </h1>

          <p className="about-hero-text">
            I FOUND is a Lost & Found platform designed to help people,
            schools, organizations, and communities report, discover, and
            reconnect with lost belongings.
          </p>
        </div>
      </section>

      <section className="about-intro">
        <div>
          <p className="section-label">OUR PURPOSE</p>

          <h2>
            Making lost and found
            <br />
            easier for everyone.
          </h2>
        </div>

        <div className="about-intro-text">
          <p>
            Losing something can be frustrating. Finding something that
            belongs to someone else can be just as difficult when there is
            no clear way to report it.
          </p>

          <p>
            I FOUND brings both sides together in one simple platform.
            People can report what they have lost or found and browse
            reports to help reconnect belongings with their owners.
          </p>
        </div>
      </section>

      <section className="about-purpose">
        <div className="purpose-content">
          <p className="section-label">BUILT FOR COMMUNITIES</p>

          <h2>
            One platform.
            <br />
            Many communities.
          </h2>

          <p>
            I FOUND can be used by schools, universities, companies,
            organizations, residential communities, events, and other
            places where people regularly interact and belongings can
            be misplaced.
          </p>
        </div>

        <div className="purpose-list">
          <div className="purpose-item">
            <span>01</span>
            <div>
              <h3>Schools</h3>
              <p>
                Help students and staff report and discover lost
                belongings around campus.
              </p>
            </div>
          </div>

          <div className="purpose-item">
            <span>02</span>
            <div>
              <h3>Organizations</h3>
              <p>
                Give employees and members a central place to manage
                lost and found reports.
              </p>
            </div>
          </div>

          <div className="purpose-item">
            <span>03</span>
            <div>
              <h3>Communities</h3>
              <p>
                Make it easier for people within a community to
                reconnect with misplaced belongings.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="about-how">
        <div className="about-how-heading">
          <p className="section-label">HOW I FOUND WORKS</p>

          <h2>
            Simple from
            <br />
            start to finish.
          </h2>
        </div>

        <div className="about-steps">
          <div className="about-step">
            <span>01</span>

            <h3>Report</h3>

            <p>
              Tell I FOUND about an item you lost or found by providing
              the important details.
            </p>
          </div>

          <div className="about-step">
            <span>02</span>

            <h3>Discover</h3>

            <p>
              Browse available reports and look for an item that matches
              what you are searching for.
            </p>
          </div>

          <div className="about-step">
            <span>03</span>

            <h3>Reconnect</h3>

            <p>
              Use the available contact information to get in touch and
              arrange the return of the item.
            </p>
          </div>
        </div>
      </section>

      <section className="about-cta">
        <div>
          <p className="section-label">GET STARTED</p>

          <h2>
            Lost something?
            <br />
            Found something?
          </h2>
        </div>

        <div className="about-cta-actions">
          <Link to="/report-lost" className="about-primary-button">
            Report Lost Item
          </Link>

          <Link to="/report-found" className="about-secondary-button">
            Report Found Item
          </Link>
        </div>
      </section>
    </main>
    <Footer/>
    </>
  )
}

export default About