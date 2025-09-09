import Header from './components/Header'
import Footer from './components/Footer'
import Sidebar from './components/Sidebar'
import Link from 'next/link'
import Image from 'next/image'

const categories = [
  {
    name: 'Locations',
    href: '/locations',
    description: 'Worldwide',
  },
  {
    name: 'Waters',
    href: '/waters',
    description: 'All Types',
  },
  {
    name: 'Fish',
    href: '/fish',
    description: 'Species',
  },
  {
    name: 'Fishing Rods',
    href: '/fishing-rods',
    description: 'Equipment',
  },
  {
    name: 'Reels',
    href: '/reels',
    description: 'Mechanics',
  },
  {
    name: 'Fishing Lines',
    href: '/fishing-lines',
    description: 'Materials',
  },
  {
    name: 'Hooks',
    href: '/hooks',
    description: 'Types',
  },
  {
    name: 'Lures',
    href: '/lures',
    description: 'Artificial',
  },
  {
    name: 'Knots',
    href: '/knots',
    description: 'Techniques',
  },
  {
    name: 'Tackles',
    href: '/tackles',
    description: 'Accessories',
  },
]

export default function HomePage() {
  return (
    <div className="homepage-wrapper">
      {/* No Header on homepage */}
      
      <main className="homepage-main">
        <div className="homepage-container">
          <div className="homepage-center">
            <div className="homepage-logo logo-large">
              <Image
                src="/logo/catchpedia.png"
                alt="Catchpedia Logo"
                width={400}
                height={288}
                priority
                className="logo-image"
              />
            </div>
            
            <div className="homepage-search">
              <form action="/search" method="GET" className="search-container">
                <input 
                  type="text" 
                  name="q"
                  id="homepageSearch" 
                  placeholder="Search for fishing locations, fish species, equipment..." 
                  required
                />
                <button type="submit" id="homepageSearchBtn" className="search-button">
                  <i className="fas fa-search"></i>
                </button>
              </form>
            </div>
            
            <div className="homepage-categories">
              <div className="category-links">
                {categories.map((category) => (
                  <Link key={category.name} href={category.href} className="category-link">
                    <span className="category-name">{category.name}</span>
                    <span className="category-description">{category.description}</span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
