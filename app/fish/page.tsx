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
    name: 'Freshwater Fish',
    description: 'Fish species found in lakes, rivers, and streams',
    slug: 'freshwater-fish'
  },
  {
    name: 'Saltwater Fish',
    description: 'Marine fish species from oceans and seas',
    slug: 'saltwater-fish'
  },
  {
    name: 'Game Fish',
    description: 'Popular sport fishing species',
    slug: 'game-fish'
  },
  {
    name: 'Panfish',
    description: 'Smaller fish species perfect for beginners',
    slug: 'panfish'
  },
]

export default function FishPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const fishArticles = getArticlesByCategory('fish')
    setArticles(fishArticles)
  }, [])

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="main-content">
        <div className="page-layout">
          <Sidebar />
          
          <div className="content-area">
            <div className="content-container">
              <Breadcrumb items={generateBreadcrumbs('/fish')} />
              <div className="category-header">
                <h1>Fish Species</h1>
                <p className="category-description">
                  Comprehensive guide to fish species that can be caught with fishing rods, organized by family and habitat.
                </p>
              </div>
              
              <div className="category-structure">
                <div className="subcategories">
                  <h2>Subcategories</h2>
                  <div className="subcategory-grid">
                    {subcategories.map((subcategory, index) => {
                      const count = isClient ? getArticleCountBySubcategory('fish', subcategory.slug) : 0
                      return (
                        <Link 
                          key={subcategory.slug} 
                          href={`/fish/subcategory/${subcategory.slug}`} 
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
                              <Link href={`/fish/${article.id}`}>
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
