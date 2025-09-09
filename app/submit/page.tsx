'use client'

import Header from '../components/Header'
import Footer from '../components/Footer'
import Sidebar from '../components/Sidebar'
import Breadcrumb, { generateBreadcrumbs } from '../components/Breadcrumb'
import RichTextEditor from '../components/RichTextEditor'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function SubmitArticlePage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: '',
    category: 'locations',
    subcategory: '',
    content: '',
    tags: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Try to access a protected endpoint to check if user is authenticated
        const response = await fetch('/api/submit-article', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ test: true })
        })
        
        if (response.status === 401) {
          // Not authenticated, redirect to signup
          router.push('/auth/signup?next=/submit')
        } else {
          // Authenticated or other error (we'll handle in form submission)
          setIsAuthenticated(true)
        }
      } catch (error) {
        // Network error, assume not authenticated
        router.push('/auth/signup?next=/submit')
      } finally {
        setIsCheckingAuth(false)
      }
    }

    checkAuth()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/submit-article', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage(data.message)
        // Reset form
        setFormData({
          title: '',
          category: 'locations',
          subcategory: '',
          content: '',
          tags: ''
        })
      } else {
        setError(data.error || 'Failed to submit article')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const categories = [
    { value: 'locations', label: 'Locations' },
    { value: 'waters', label: 'Waters' },
    { value: 'fish', label: 'Fish' },
    { value: 'fishing-rods', label: 'Fishing Rods' },
    { value: 'reels', label: 'Reels' },
    { value: 'fishing-lines', label: 'Fishing Lines' },
    { value: 'hooks', label: 'Hooks' },
    { value: 'lures', label: 'Lures' },
    { value: 'knots', label: 'Knots' },
    { value: 'tackles', label: 'Tackles' }
  ]

  const subcategories = {
    'locations': [
      { value: 'freshwater-lakes', label: 'Freshwater Lakes' },
      { value: 'saltwater-oceans', label: 'Saltwater Oceans' },
      { value: 'rivers-streams', label: 'Rivers & Streams' },
      { value: 'ponds-reservoirs', label: 'Ponds & Reservoirs' },
      { value: 'coastal-areas', label: 'Coastal Areas' },
      { value: 'deep-sea', label: 'Deep Sea' }
    ],
    'waters': [
      { value: 'freshwater', label: 'Freshwater' },
      { value: 'saltwater', label: 'Saltwater' },
      { value: 'brackish', label: 'Brackish Water' },
      { value: 'cold-water', label: 'Cold Water' },
      { value: 'warm-water', label: 'Warm Water' },
      { value: 'tropical', label: 'Tropical Waters' }
    ],
    'fish': [
      { value: 'freshwater-fish', label: 'Freshwater Fish' },
      { value: 'saltwater-fish', label: 'Saltwater Fish' },
      { value: 'game-fish', label: 'Game Fish' },
      { value: 'pan-fish', label: 'Pan Fish' },
      { value: 'predator-fish', label: 'Predator Fish' },
      { value: 'bottom-feeders', label: 'Bottom Feeders' }
    ],
    'fishing-rods': [
      { value: 'spinning-rods', label: 'Spinning Rods' },
      { value: 'casting-rods', label: 'Casting Rods' },
      { value: 'fly-rods', label: 'Fly Rods' },
      { value: 'trolling-rods', label: 'Trolling Rods' },
      { value: 'ice-fishing-rods', label: 'Ice Fishing Rods' },
      { value: 'surf-rods', label: 'Surf Rods' }
    ],
    'reels': [
      { value: 'spinning-reels', label: 'Spinning Reels' },
      { value: 'baitcasting-reels', label: 'Baitcasting Reels' },
      { value: 'fly-reels', label: 'Fly Reels' },
      { value: 'trolling-reels', label: 'Trolling Reels' },
      { value: 'ice-fishing-reels', label: 'Ice Fishing Reels' },
      { value: 'conventional-reels', label: 'Conventional Reels' }
    ],
    'fishing-lines': [
      { value: 'monofilament', label: 'Monofilament' },
      { value: 'braided-line', label: 'Braided Line' },
      { value: 'fluorocarbon', label: 'Fluorocarbon' },
      { value: 'fly-line', label: 'Fly Line' },
      { value: 'wire-line', label: 'Wire Line' },
      { value: 'lead-core', label: 'Lead Core' }
    ],
    'hooks': [
      { value: 'j-hooks', label: 'J-Hooks' },
      { value: 'circle-hooks', label: 'Circle Hooks' },
      { value: 'treble-hooks', label: 'Treble Hooks' },
      { value: 'bait-hooks', label: 'Bait Hooks' },
      { value: 'fly-hooks', label: 'Fly Hooks' },
      { value: 'specialty-hooks', label: 'Specialty Hooks' }
    ],
    'lures': [
      { value: 'crankbaits', label: 'Crankbaits' },
      { value: 'spinnerbaits', label: 'Spinnerbaits' },
      { value: 'jigs', label: 'Jigs' },
      { value: 'soft-plastics', label: 'Soft Plastics' },
      { value: 'topwater-lures', label: 'Topwater Lures' },
      { value: 'spoons', label: 'Spoons' }
    ],
    'knots': [
      { value: 'line-to-line', label: 'Line to Line' },
      { value: 'line-to-hook', label: 'Line to Hook' },
      { value: 'line-to-lure', label: 'Line to Lure' },
      { value: 'loop-knots', label: 'Loop Knots' },
      { value: 'terminal-knots', label: 'Terminal Knots' },
      { value: 'specialty-knots', label: 'Specialty Knots' }
    ],
    'tackles': [
      { value: 'sinkers', label: 'Sinkers' },
      { value: 'swivels', label: 'Swivels' },
      { value: 'snaps', label: 'Snaps' },
      { value: 'leaders', label: 'Leaders' },
      { value: 'floats', label: 'Floats' },
      { value: 'accessories', label: 'Accessories' }
    ]
  }

  // Show loading state while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="main-content">
          <div className="page-layout">
            <Sidebar />
            <div className="content-area">
              <div className="content-container">
                <div className="category-header">
                  <h1>Checking authentication...</h1>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  // If not authenticated, this will redirect, but show a message just in case
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="main-content">
          <div className="page-layout">
            <Sidebar />
            <div className="content-area">
              <div className="content-container">
                <div className="category-header">
                  <h1>Redirecting to signup...</h1>
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
              <Breadcrumb items={generateBreadcrumbs('/submit')} />
              
              <div className="category-header">
                <h1>Submit an Article</h1>
                <p className="category-description">
                  Share your fishing knowledge with the Catchpedia community! Submit your article for review and it will be published once approved.
                </p>
              </div>
              
              <div className="admin-section">
                {message && (
                  <div className="success-message">
                    <i className="fas fa-check-circle"></i>
                    {message}
                  </div>
                )}
                
                {error && (
                  <div className="error-message">
                    <i className="fas fa-exclamation-circle"></i>
                    {error}
                  </div>
                )}
                
                <form onSubmit={handleSubmit} className="admin-form">
                  <div className="form-group">
                    <label htmlFor="title">Article Title *</label>
                    <input
                      type="text"
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      required
                      disabled={isSubmitting}
                      placeholder="Enter a descriptive title for your article"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="category">Category *</label>
                    <select
                      id="category"
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value, subcategory: ''})}
                      required
                      disabled={isSubmitting}
                    >
                      {categories.map(cat => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="subcategory">Subcategory (optional)</label>
                    <select
                      id="subcategory"
                      value={formData.subcategory}
                      onChange={(e) => setFormData({...formData, subcategory: e.target.value})}
                      disabled={isSubmitting}
                    >
                      <option value="">Select a subcategory</option>
                      {subcategories[formData.category as keyof typeof subcategories]?.map(sub => (
                        <option key={sub.value} value={sub.value}>{sub.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="content">Article Content *</label>
                    <RichTextEditor
                      value={formData.content}
                      onChange={(content) => setFormData({...formData, content})}
                      placeholder="Write your article content here. Use the toolbar above to format your text with headings, lists, links, and more!"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="tags">Tags (comma-separated)</label>
                    <input
                      type="text"
                      id="tags"
                      value={formData.tags}
                      onChange={(e) => setFormData({...formData, tags: e.target.value})}
                      disabled={isSubmitting}
                      placeholder="e.g., beginner, bass, lake, tips"
                    />
                  </div>

                  <button type="submit" className="admin-btn" disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit Article'}
                  </button>
                </form>
                
                <div className="submit-info">
                  <h3>Submission Guidelines</h3>
                  <ul>
                    <li>Articles should be informative and well-written</li>
                    <li>Include relevant details and practical advice</li>
                    <li>Use proper formatting with headings and lists</li>
                    <li>Add appropriate tags to help readers find your content</li>
                    <li>All submissions are reviewed before publication</li>
                    <li>You'll be notified via email once your article is reviewed</li>
                  </ul>
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
