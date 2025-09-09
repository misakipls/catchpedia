'use client'

import Header from '../../../components/Header'
import Footer from '../../../components/Footer'
import Sidebar from '../../../components/Sidebar'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { getArticlesBySubcategory, Article } from '../../../data/store'

interface PageProps {
  params: {
    slug: string
  }
}

const subcategoryInfo: { [key: string]: { name: string; description: string } } = {
  'line-to-line': {
    name: 'Line to Line Knots',
    description: 'Knots for joining different types of fishing line'
  },
  'hook-knots': {
    name: 'Hook Knots',
    description: 'Knots for attaching hooks to fishing line'
  },
  'lure-knots': {
    name: 'Lure Knots',
    description: 'Knots for attaching lures and baits'
  },
  'loop-knots': {
    name: 'Loop Knots',
    description: 'Knots that create loops for various applications'
  }
}

export default function KnotSubcategoryPage({ params }: PageProps) {
  const { slug } = params
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const subcategoryArticles = getArticlesBySubcategory('knots', slug)
    setArticles(subcategoryArticles)
    setLoading(false)
  }, [slug])

  const subcategory = subcategoryInfo[slug]

  if (!subcategory) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="main-content">
          <div className="page-layout">
            <Sidebar />
            <div className="content-area">
              <div className="content-container">
                <div className="category-header">
                  <h1>Subcategory Not Found</h1>
                  <p>The requested subcategory does not exist.</p>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="main-content">
          <div className="page-layout">
            <Sidebar />
            <div className="content-area">
              <div className="content-container">
                <div className="loading">Loading...</div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="main-content">
        <div className="page-layout">
          <Sidebar />
          
          <div className="content-area">
            <div className="content-container">
              <div className="category-header">
                <nav className="breadcrumb">
                  <Link href="/">Home</Link>
                  <span className="breadcrumb-separator">›</span>
                  <Link href="/knots">Fishing Knots</Link>
                  <span className="breadcrumb-separator">›</span>
                  <span className="breadcrumb-current">{subcategory.name}</span>
                </nav>
                <h1>{subcategory.name}</h1>
                <p className="category-description">
                  {subcategory.description}
                </p>
              </div>
              
              <div className="category-content">
                {articles.length > 0 ? (
                  <div className="article-titles">
                    <h2>Articles in {subcategory.name}</h2>
                    {articles.map((article) => (
                      <div key={article.id} className="article-title-item">
                        <h3>
                          <Link href={`/knots/${article.id}`}>
                            {article.title}
                          </Link>
                        </h3>
                        <p className="article-description">
                          {article.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
                        </p>
                        <div className="article-meta">
                          <span className="article-date">
                            {new Date(article.createdAt).toLocaleDateString()}
                          </span>
                          {article.tags.length > 0 && (
                            <div className="article-tags">
                              {article.tags.map((tag, index) => (
                                <span key={index} className="tag">{tag}</span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state">
                    <i className="fas fa-fish"></i>
                    <h2>No Articles Yet</h2>
                    <p>There are no articles in the {subcategory.name} subcategory yet.</p>
                    <Link href="/admin" className="admin-link">
                      <i className="fas fa-plus"></i> Add Your First Article
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
