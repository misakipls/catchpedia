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
    name: 'Monofilament Lines',
    description: 'Traditional single-strand fishing lines with good stretch and visibility',
    slug: 'monofilament'
  },
  {
    name: 'Braided Lines',
    description: 'High-strength lines made from multiple woven strands',
    slug: 'braided'
  },
  {
    name: 'Fluorocarbon Lines',
    description: 'Nearly invisible lines with excellent abrasion resistance',
    slug: 'fluorocarbon'
  },
  {
    name: 'Fly Lines',
    description: 'Specialized lines designed for fly fishing techniques',
    slug: 'fly-lines'
  },
]

export default function FishingLinesPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    const lineArticles = getArticlesByCategory('fishing-lines')
    setArticles(lineArticles)
  }, [])

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="main-content">
        <div className="page-layout">
          <Sidebar />
          
          <div className="content-area">
            <div className="content-container">
              <Breadcrumb items={generateBreadcrumbs('/fishing-lines')} />
              <div className="category-header">
                <h1>Fishing Lines</h1>
                <p className="category-description">
                  Comprehensive guide to fishing lines, their types, strengths, and best applications for different fishing scenarios.
                </p>
              </div>
              
              <div className="category-structure">
                <div className="subcategories">
                  <h2>Subcategories</h2>
                  <div className="subcategory-grid">
                    {subcategories.map((subcategory, index) => {
                      const count = isClient ? getArticleCountBySubcategory('fishing-lines', subcategory.slug) : 0
                      return (
                        <Link 
                          key={subcategory.slug} 
                          href={`/fishing-lines/subcategory/${subcategory.slug}`} 
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
                              <Link href={`/fishing-lines/${article.id}`}>
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