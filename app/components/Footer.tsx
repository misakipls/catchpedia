import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Catchpedia</h3>
            <p>Your complete resource for everything fishing. From locations to equipment, we've got you covered.</p>
          </div>
          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li><Link href="/locations">Locations</Link></li>
              <li><Link href="/fish">Fish Species</Link></li>
              <li><Link href="/rods">Equipment</Link></li>
              <li><Link href="/knots">Knots</Link></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Contact</h3>
            <p>Have questions? Reach out to us!</p>
            <div className="social-links">
              <a href="#"><i className="fab fa-facebook"></i></a>
              <a href="#"><i className="fab fa-twitter"></i></a>
              <a href="#"><i className="fab fa-instagram"></i></a>
              <a href="#"><i className="fab fa-youtube"></i></a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2024 Catchpedia. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
