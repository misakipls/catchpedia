'use client'

import Header from '../components/Header'
import Footer from '../components/Footer'
import Sidebar from '../components/Sidebar'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { getArticlesByCategory, getArticleCountBySubcategory, Article } from '../data/store'

const subcategories = [
  {
    name: 'Saltwater',
    description: 'Ocean and sea fishing environments',
    slug: 'saltwater'
  },
  {
    name: 'Freshwater',
    description: 'Lakes, rivers, and streams',
    slug: 'freshwater'
  },
  {
    name: 'Brackish Water',
    description: 'Estuaries and coastal marshes',
    slug: 'brackish'
  },
  {
    name: 'Ice Fishing',
    description: 'Frozen water bodies and winter fishing',
    slug: 'ice-fishing'
  },
]

export default function WatersPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const waterArticles = getArticlesByCategory('waters')
    setArticles(waterArticles)
  }, [])

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="main-content">
        <div className="page-layout">
          <Sidebar />
          
          <div className="content-area">
            <div className="content-container">
              <div className="category-header">
                <h1>Fishing Waters</h1>
                <p className="category-description">
                  Comprehensive guide to different types of fishing waters and their characteristics.
                </p>
              </div>
              
              <div className="category-structure">
                <div className="subcategories">
                  <h2>Subcategories</h2>
                  <div className="subcategory-grid">
                    {subcategories.map((subcategory) => {
                      const count = isClient ? getArticleCountBySubcategory('waters', subcategory.slug) : 0
                      return (
                        <Link key={subcategory.slug} href={`/waters/subcategory/${subcategory.slug}`} className="subcategory-card">
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
                              <Link href={`/waters/${article.id}`}>
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
