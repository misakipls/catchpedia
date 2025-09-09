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
    name: 'Hard Baits',
    description: 'Plugs, crankbaits, and other hard plastic lures',
    slug: 'hard-baits'
  },
  {
    name: 'Soft Plastics',
    description: 'Worms, grubs, and other soft plastic lures',
    slug: 'soft-plastics'
  },
  {
    name: 'Spinnerbaits',
    description: 'Lures with spinning blades for flash and vibration',
    slug: 'spinnerbaits'
  },
  {
    name: 'Jigs',
    description: 'Weighted lures with various head shapes and materials',
    slug: 'jigs'
  },
]

export default function LuresPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const lureArticles = getArticlesByCategory('lures')
    setArticles(lureArticles)
  }, [])

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="main-content">
        <div className="page-layout">
          <Sidebar />
          
          <div className="content-area">
            <div className="content-container">
              <Breadcrumb items={generateBreadcrumbs('/lures')} />
              <div className="category-header">
                <h1>Fishing Lures</h1>
                <p className="category-description">
                  Complete guide to fishing lures, their types, colors, and best applications for different fish species and water conditions.
                </p>
              </div>
              
              <div className="category-structure">
                <div className="subcategories">
                  <h2>Subcategories</h2>
                  <div className="subcategory-grid">
                    {subcategories.map((subcategory, index) => {
                      const count = isClient ? getArticleCountBySubcategory('lures', subcategory.slug) : 0
                      return (
                        <Link 
                          key={subcategory.slug} 
                          href={`/lures/subcategory/${subcategory.slug}`} 
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
                              <Link href={`/lures/${article.id}`}>
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