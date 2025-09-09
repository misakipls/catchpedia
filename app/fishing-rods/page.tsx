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
    name: 'Spinning Rods',
    description: 'Versatile rods perfect for beginners and general fishing',
    slug: 'spinning-rods'
  },
  {
    name: 'Baitcasting Rods',
    description: 'Precision rods for experienced anglers',
    slug: 'baitcasting-rods'
  },
  {
    name: 'Fly Rods',
    description: 'Specialized rods for fly fishing techniques',
    slug: 'fly-rods'
  },
  {
    name: 'Ice Fishing Rods',
    description: 'Short rods designed for ice fishing',
    slug: 'ice-rods'
  },
]

export default function FishingRodsPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const rodArticles = getArticlesByCategory('fishing-rods')
    setArticles(rodArticles)
  }, [])
  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="main-content">
        <div className="page-layout">
          <Sidebar />
          
          <div className="content-area">
            <div className="content-container">
              <Breadcrumb items={generateBreadcrumbs('/fishing-rods')} />
              <div className="category-header">
                <h1>Fishing Rods</h1>
                <p className="category-description">
                  Complete guide to fishing rods, their types, specifications, and best uses for different fishing scenarios.
                </p>
              </div>
              
              <div className="category-structure">
                <div className="subcategories">
                  <h2>Subcategories</h2>
                  <div className="subcategory-grid">
                    {subcategories.map((subcategory, index) => {
                      const count = isClient ? getArticleCountBySubcategory('fishing-rods', subcategory.slug) : 0
                      return (
                        <Link 
                          key={subcategory.slug} 
                          href={`/fishing-rods/subcategory/${subcategory.slug}`} 
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
                              <Link href={`/fishing-rods/${article.id}`}>
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
