'use client'

import Header from '../components/Header'
import Footer from '../components/Footer'
import Sidebar from '../components/Sidebar'
import Breadcrumb, { generateBreadcrumbs } from '../components/Breadcrumb'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { getArticlesByCategory, getArticleCountBySubcategory, Article } from '../data/store'

const subcategories = [
  {
    name: 'By Continent',
    description: 'Explore fishing locations organized by continent',
    slug: 'continents'
  },
  {
    name: 'By Country',
    description: 'Detailed fishing guides for specific countries',
    slug: 'countries'
  },
  {
    name: 'By Water Type',
    description: 'Locations categorized by ocean, lake, river, etc.',
    slug: 'water-types'
  },
  {
    name: 'By Season',
    description: 'Best fishing times and seasonal patterns',
    slug: 'seasons'
  },
]

export default function LocationsPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const locationArticles = getArticlesByCategory('locations')
    setArticles(locationArticles)
  }, [])

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="main-content">
        <div className="page-layout">
          <Sidebar />
          
          <div className="content-area">
            <div className="content-container">
              <Breadcrumb items={generateBreadcrumbs('/locations')} />
              <div className="category-header">
                <h1>Fishing Locations</h1>
                <p className="category-description">
                  Comprehensive guide to fishing locations around the world, organized by continent and country.
                </p>
              </div>
              
              <div className="category-structure">
                <div className="subcategories">
                  <h2>Subcategories</h2>
                  <div className="subcategory-grid">
                    {subcategories.map((subcategory) => {
                      const count = isClient ? getArticleCountBySubcategory('locations', subcategory.slug) : 0
                      return (
                        <Link key={subcategory.slug} href={`/locations/subcategory/${subcategory.slug}`} className="subcategory-card">
                          <h3>{subcategory.name}</h3>
                          <p>{subcategory.description}</p>
                          <div className="article-count">{count} articles</div>
                        </Link>
                      )
                    })}
                  </div>
                </div>
                
                <div className="recent-articles">
                  <h2>Recent Articles</h2>
                  <div className="article-list">
                    {articles.length > 0 ? (
                      <div className="article-titles">
                        {articles.map((article) => (
                          <div key={article.id} className="article-title-item">
                            <h4>
                              <Link href={`/locations/${article.id}`}>
                                {article.title}
                              </Link>
                            </h4>
                            <div className="article-meta">
                              <span className="article-date">{new Date(article.createdAt).toLocaleDateString()}</span>
                              <span className="article-preview">{article.content.replace(/<[^>]*>/g, '').substring(0, 100)}...</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="empty-state">
                        <i className="fas fa-file-alt"></i>
                        <p>No articles yet. Use the Admin panel to add content.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
