
import { Link } from "react-router-dom"
import heroImage from "../../assets/hero-image.jpg"
import lostImage from "../../assets/lost-item.jpg"
import foundImage from "../../assets/found-item.jpg"
import Footer from "../../components/Footer"
import "./Home.css"

function Home() {
  return (
    <main className="home-page">

      <section className="hero-section">
        <div className="hero-content">
          <p className="hero-label">LOST & FOUND PLATFORM</p>

          <h1>
            Lost something?
            <span>Let's help you find it.</span>
          </h1>

          <p className="hero-description">
            I FOUND connects people with lost and found items,
            making it easier to report, discover, and reconnect
            with what matters.
          </p>

          <div className="hero-buttons">
            <Link to="/report-lost" className="primary-button">
              Report Lost Item
            </Link>

            <Link to="/found-items" className="secondary-button">
              Browse Found Items
            </Link>
          </div>
        </div>

        <div className="hero-visual">
          <div className="hero-image">
            <img src={heroImage} alt="Lost and found items" />
          </div>
        </div>
      </section>

      <section className="intro-section">
        <div>
          <p className="section-label">ONE PLATFORM</p>

          <h2>
            Lost or found,
            <br />
            we've got you covered.
          </h2>
        </div>

        <p className="intro-text">
          Whether you've misplaced something important or found
          something that belongs to someone else, I FOUND gives
          organizations and communities one simple place to connect
          people with their belongings.
        </p>
      </section>

      <section className="options-section">

        <div className="option-card lost-card">
          <div className="option-image">
            <img src={lostImage} alt="Lost item" />
          </div>

          <div className="option-content">
            <p className="section-label">CAN'T FIND SOMETHING?</p>

            <h2>Report a lost item.</h2>

            <p>
              Tell the community what you lost, where you lost it,
              and provide a description so someone can help you find it.
            </p>

            <Link to="/report-lost" className="text-button">
              Report Lost Item →
            </Link>
          </div>
        </div>

        <div className="option-card found-card">
          <div className="option-image">
            <img src={foundImage} alt="Found item" />
          </div>

          <div className="option-content">
            <p className="section-label">FOUND SOMETHING?</p>

            <h2>Report a found item.</h2>

            <p>
              Help someone get their belongings back by sharing
              information about an item you found.
            </p>

            <Link to="/report-found" className="text-button">
              Report Found Item →
            </Link>
          </div>
        </div>

      </section>

      <section className="how-section">
        <div className="how-heading">
          <p className="section-label">HOW IT WORKS</p>

          <h2>
            Three simple steps
            <br />
            to reconnect.
          </h2>
        </div>

        <div className="steps-grid">

          <div className="step-card">
            <span className="step-number">01</span>

            <h3>Report</h3>

            <p>
              Report an item you lost or found with its important
              details and an optional photo.
            </p>
          </div>

          <div className="step-card">
            <span className="step-number">02</span>

            <h3>Discover</h3>

            <p>
              Browse reports from other people and look for items
              that match what you're searching for.
            </p>
          </div>

          <div className="step-card">
            <span className="step-number">03</span>

            <h3>Reconnect</h3>

            <p>
              Find the person's contact information and get in touch
              to arrange the return of the item.
            </p>
          </div>

        </div>
      </section>

      <section className="cta-section">
        <div>
          <p className="section-label">I FOUND</p>

          <h2>
            Ready to find
            <br />
            what matters?
          </h2>
        </div>

        <div className="cta-buttons">
          <Link to="/report-lost" className="primary-button">
            Report Lost Item
          </Link>

          <Link to="/found-items" className="secondary-button">
            Browse Found Items
          </Link>
        </div>
      </section>

        <Footer />

    </main>
  )
}

export default Home
