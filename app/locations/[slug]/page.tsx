'use client'

import Header from '../../components/Header'
import Footer from '../../components/Footer'
import Sidebar from '../../components/Sidebar'
import ArticleRenderer from '../../components/ArticleRenderer'
import Breadcrumb, { generateBreadcrumbs } from '../../components/Breadcrumb'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { useState, useEffect } from 'react'
import { getArticleById, Article } from '../../data/store'

interface PageProps {
  params: {
    slug: string
  }
}

export default function LocationArticlePage({ params }: PageProps) {
  const { slug } = params
  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    const foundArticle = getArticleById(slug)
    setArticle(foundArticle)
    setLoading(false)
  }, [slug])
  
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
  
  if (!article) {
    notFound()
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="main-content">
        <div className="page-layout">
          <Sidebar />
          
          <div className="content-area">
            <div className="content-container">
              <div className="wikipedia-page article-page">
                <Breadcrumb items={generateBreadcrumbs(`/locations/${slug}`, article?.title)} />
                <div className="page-header">
                  <Link href="/locations" className="back-button">
                    <i className="fas fa-arrow-left"></i> Back to Locations
                  </Link>
                </div>
                
                <div className="page-content">
                  <article className="wikipedia-article">
                    <header className="article-header">
                      <h1>{article.title}</h1>
                      <div className="article-meta">
                        <span className="article-category">{article.category}</span>
                        <span className="article-subcategory">{article.subcategory.replace('-', ' ')}</span>
                        <span className="article-date">Created: {new Date(article.createdAt).toLocaleDateString()}</span>
                      </div>
                    </header>
                    
                    <div className="article-content">
                      <div className="article-actions-top">
                        <Link href={`/edit/${article.id}`} className="edit-article-btn">
                          <i className="fas fa-edit"></i> Edit Article
                        </Link>
                      </div>
                      <ArticleRenderer content={article.content} />
                    </div>
                    
                    <footer className="article-footer">
                      <div className="article-tags">
                        {article.tags.map(tag => (
                          <span key={tag} className="tag">{tag}</span>
                        ))}
                      </div>
                    </footer>
                  </article>
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