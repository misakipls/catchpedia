'use client'

import Header from '../../components/Header'
import Footer from '../../components/Footer'
import Sidebar from '../../components/Sidebar'
import Breadcrumb, { generateBreadcrumbs } from '../../components/Breadcrumb'
import RichTextEditor from '../../components/RichTextEditor'
import { useState, useEffect } from 'react'
import { getArticleById, editArticle, Article } from '../../data/store'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface PageProps {
  params: {
    id: string
  }
}

export default function EditArticlePage({ params }: PageProps) {
  const { id } = params
  const router = useRouter()
  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    subcategory: '',
    content: '',
    tags: ''
  })

  useEffect(() => {
    const foundArticle = getArticleById(id)
    if (foundArticle) {
      setArticle(foundArticle)
      setFormData({
        title: foundArticle.title,
        category: foundArticle.category,
        subcategory: foundArticle.subcategory || '',
        content: foundArticle.content,
        tags: foundArticle.tags.join(', ')
      })
    }
    setLoading(false)
  }, [id])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage('')

    try {
      const tags = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      
      const updatedArticle = editArticle(id, {
        title: formData.title,
        category: formData.category,
        subcategory: formData.subcategory,
        content: formData.content,
        tags
      })

      if (updatedArticle) {
        setMessage(`Article "${updatedArticle.title}" updated successfully!`)
        
        // Redirect to the article page after a short delay
        setTimeout(() => {
          router.push(`/${updatedArticle.category}/${updatedArticle.id}`)
        }, 1500)
      } else {
        setMessage('Error updating article. Please try again.')
      }
    } catch (error) {
      setMessage('Error updating article. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const categories = [
    { value: 'fish', label: 'Fish' },
    { value: 'locations', label: 'Locations' },
    { value: 'waters', label: 'Waters' },
    { value: 'rods', label: 'Fishing Rods' },
    { value: 'reels', label: 'Reels' },
    { value: 'lines', label: 'Fishing Lines' },
    { value: 'hooks', label: 'Hooks' },
    { value: 'lures', label: 'Lures' },
    { value: 'knots', label: 'Knots' },
    { value: 'tackles', label: 'Tackles' }
  ]

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="main-content">
          <div className="page-layout">
            <Sidebar />
            <div className="content-area">
              <div className="content-container">
                <div className="loading">Loading article...</div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (!article) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="main-content">
          <div className="page-layout">
            <Sidebar />
            <div className="content-area">
              <div className="content-container">
                <div className="error-state">
                  <h1>Article Not Found</h1>
                  <p>The article you're trying to edit doesn't exist.</p>
                  <Link href="/admin" className="admin-link">
                    <i className="fas fa-arrow-left"></i> Back to Admin
                  </Link>
                </div>
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
              <Breadcrumb items={generateBreadcrumbs(`/edit/${id}`, article?.title)} />
              <div className="edit-page-header">
                <h1>Edit Article</h1>
                <p className="edit-description">
                  Edit the article "{article.title}"
                </p>
              </div>
              
              <div className="edit-form-container">
                {message && (
                  <div className={`message ${message.includes('Error') ? 'error' : 'success'}`}>
                    {message}
                  </div>
                )}
                
                <form className="edit-form" onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="editTitle">Article Title</label>
                    <input 
                      type="text" 
                      id="editTitle" 
                      name="title" 
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      required 
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="editCategory">Category</label>
                    <select 
                      id="editCategory" 
                      name="category" 
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map(cat => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="editSubcategory">Subcategory (optional)</label>
                    <input 
                      type="text" 
                      id="editSubcategory" 
                      name="subcategory" 
                      value={formData.subcategory}
                      onChange={(e) => setFormData({...formData, subcategory: e.target.value})}
                      placeholder="e.g., spinning-rods, freshwater-fish" 
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="editContent">Content</label>
                    <RichTextEditor
                      value={formData.content}
                      onChange={(content) => setFormData({...formData, content})}
                      placeholder="Write your article content here. Use the toolbar above to format your text with headings, lists, links, and more!"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="editTags">Tags (comma-separated)</label>
                    <input 
                      type="text" 
                      id="editTags" 
                      name="tags" 
                      value={formData.tags}
                      onChange={(e) => setFormData({...formData, tags: e.target.value})}
                      placeholder="e.g., beginner, bass, lake" 
                    />
                  </div>
                  
                  <div className="form-actions">
                    <button type="submit" className="edit-btn" disabled={isSubmitting}>
                      {isSubmitting ? 'Updating...' : 'Update Article'}
                    </button>
                    <Link href={`/${article.category}/${article.id}`} className="cancel-btn">
                      Cancel
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
