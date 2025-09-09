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
    name: 'Terminal Tackle',
    description: 'Swivels, snaps, and other terminal fishing tackle',
    slug: 'terminal-tackle'
  },
  {
    name: 'Weights & Sinkers',
    description: 'Various weights and sinkers for different fishing conditions',
    slug: 'weights-sinkers'
  },
  {
    name: 'Floats & Bobbers',
    description: 'Floats and bobbers for detecting bites',
    slug: 'floats-bobbers'
  },
  {
    name: 'Accessories',
    description: 'Fishing accessories and tools',
    slug: 'accessories'
  },
]

export default function TacklesPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const tackleArticles = getArticlesByCategory('tackles')
    setArticles(tackleArticles)
  }, [])

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="main-content">
        <div className="page-layout">
          <Sidebar />
          
          <div className="content-area">
            <div className="content-container">
              <Breadcrumb items={generateBreadcrumbs('/tackles')} />
              <div className="category-header">
                <h1>Fishing Tackle</h1>
                <p className="category-description">
                  Complete guide to fishing tackle, including terminal tackle, weights, floats, and essential fishing accessories.
                </p>
              </div>
              
              <div className="category-structure">
                <div className="subcategories">
                  <h2>Subcategories</h2>
                  <div className="subcategory-grid">
                    {subcategories.map((subcategory, index) => {
                      const count = isClient ? getArticleCountBySubcategory('tackles', subcategory.slug) : 0
                      return (
                        <Link 
                          key={subcategory.slug} 
                          href={`/tackles/subcategory/${subcategory.slug}`} 
                          className="subcategory-card"
                        >
                          <h3>{subcategory.name}</h3>
                          <p>{subcategory.description}</p>
                          <div className="article-count">
                            {isClient ? `${count} articles` : '0 articles'}
                          </div>
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
                          <div 
                            key={article.id} 
                            className="article-title-item"
                          >
                            <h4>
                              <Link href={`/tackles/${article.id}`}>
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