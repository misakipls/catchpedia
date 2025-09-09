'use client'

import Header from '../../components/Header'
import Footer from '../../components/Footer'
import Sidebar from '../../components/Sidebar'
import Breadcrumb, { generateBreadcrumbs } from '../../components/Breadcrumb'
import RichTextEditor from '../../components/RichTextEditor'
import ImageGallery from '../../components/ImageGallery'
import ProgressBar from '../../components/ProgressBar'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { getAllArticles, addArticle, deleteArticle, getCategoriesWithCounts, Article } from '../../data/store'

export default function AdminManageClient() {
  const [articles, setArticles] = useState<Article[]>([])
  const [isClient, setIsClient] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    category: 'fish',
    subcategory: '',
    content: '',
    tags: ''
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('')
  const [status, setStatus] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitProgress, setSubmitProgress] = useState(0)

  useEffect(() => {
    setIsClient(true)
    const allArticles = getAllArticles()
    setArticles(allArticles)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitProgress(0)

    try {
      // Simulate progress
      const progressInterval = setInterval(() => {
        setSubmitProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 100)

      const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      
      const newArticle = addArticle({
        title: formData.title,
        category: formData.category,
        subcategory: formData.subcategory,
        content: formData.content,
        tags: tagsArray
      })

      // Complete progress
      setSubmitProgress(100)
      
      setTimeout(() => {
        setArticles(getAllArticles())
        setFormData({
          title: '',
          category: 'fish',
          subcategory: '',
          content: '',
          tags: ''
        })
        setStatus('Article created successfully!')
        setIsSubmitting(false)
        setSubmitProgress(0)
        clearInterval(progressInterval)
      }, 500)

    } catch (error) {
      console.error('Error creating article:', error)
      setStatus('Error creating article. Please try again.')
      setIsSubmitting(false)
      setSubmitProgress(0)
    }
  }

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this article?')) {
      deleteArticle(id)
      setArticles(getAllArticles())
      setStatus('Article deleted successfully!')
    }
  }

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = !filterCategory || article.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const categoryCounts = getCategoriesWithCounts()

  if (!isClient) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="main-content">
        <div className="page-layout">
          <Sidebar />
          
          <div className="content-area">
            <div className="content-container">
              <Breadcrumb items={generateBreadcrumbs('/admin/manage')} />
              
              <div className="admin-section">
                <h1>Admin Panel</h1>
                <p>Manage your fishing guide articles and content.</p>
              </div>

              {/* Create Article Form */}
              <div className="admin-section">
                <h2>Create New Article</h2>
                <form onSubmit={handleSubmit} className={`admin-form ${isSubmitting ? 'form-loading' : ''}`}>
                  <div className="form-group">
                    <label htmlFor="title">Title *</label>
                    <input
                      type="text"
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="category">Category *</label>
                    <select
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      required
                      disabled={isSubmitting}
                    >
                      <option value="fish">Fish Species</option>
                      <option value="locations">Fishing Locations</option>
                      <option value="waters">Water Types</option>
                      <option value="fishing-rods">Fishing Rods</option>
                      <option value="fishing-lines">Fishing Lines</option>
                      <option value="reels">Fishing Reels</option>
                      <option value="hooks">Fishing Hooks</option>
                      <option value="lures">Fishing Lures</option>
                      <option value="knots">Fishing Knots</option>
                      <option value="tackles">Fishing Tackle</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="subcategory">Subcategory</label>
                    <input
                      type="text"
                      id="subcategory"
                      value={formData.subcategory}
                      onChange={(e) => setFormData({...formData, subcategory: e.target.value})}
                      placeholder="e.g., freshwater-fish, spinning-rods"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="content">Content *</label>
                    <RichTextEditor
                      value={formData.content}
                      onChange={(content) => setFormData({...formData, content})}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="tags">Tags (comma-separated)</label>
                    <input
                      type="text"
                      id="tags"
                      value={formData.tags}
                      onChange={(e) => setFormData({...formData, tags: e.target.value})}
                      placeholder="e.g., beginner, freshwater, bass"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="form-group">
                    <label>Images</label>
                    <ImageGallery />
                  </div>

                  {isSubmitting && (
                    <div className="form-progress">
                      <ProgressBar progress={submitProgress} />
                    </div>
                  )}

                  <button type="submit" className="admin-btn" disabled={isSubmitting}>
                    {isSubmitting ? 'Creating Article...' : 'Create Article'}
                  </button>
                </form>
              </div>

              {/* Manage Articles */}
              <div className="admin-section">
                <h2>Manage Articles</h2>
                
                <div className="admin-filters">
                  <input
                    type="text"
                    placeholder="Search articles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="admin-search"
                  />
                  
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="admin-filter"
                  >
                    <option value="">All Categories</option>
                    {categoryCounts.map(category => (
                      <option key={category.value} value={category.value}>
                        {category.label} ({category.count})
                      </option>
                    ))}
                  </select>
                </div>

                {status && (
                  <div className="admin-status">
                    {status}
                  </div>
                )}

                <div className="admin-articles">
                  {filteredArticles.length > 0 ? (
                    filteredArticles.map((article) => (
                      <div key={article.id} className="admin-article">
                        <div className="article-info">
                          <h3>{article.title}</h3>
                          <p className="article-meta">
                            <span className="category">{article.category}</span>
                            {article.subcategory && <span className="subcategory">{article.subcategory}</span>}
                            <span className="date">{new Date(article.createdAt).toLocaleDateString()}</span>
                          </p>
                          <p className="article-preview">
                            {article.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
                          </p>
                        </div>
                        <div className="article-actions">
                          <Link href={`/admin/edit/${article.id}`} className="edit-btn">
                            Edit
                          </Link>
                          <button
                            onClick={() => handleDelete(article.id)}
                            className="delete-btn"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="empty-state">
                      <p>No articles found.</p>
                    </div>
                  )}
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
