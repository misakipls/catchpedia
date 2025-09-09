'use client'

import { useState, useEffect } from 'react'
import { getAllPendingArticles, PendingArticle } from '../../data/store'

export default function PendingArticlesSection() {
  const [pendingArticles, setPendingArticles] = useState<PendingArticle[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const loadPendingArticles = () => {
      const pending = getAllPendingArticles().filter(article => article.status === 'pending')
      setPendingArticles(pending)
      setIsLoading(false)
    }

    loadPendingArticles()
  }, [])

  const handleApprove = async (articleId: string) => {
    try {
      const response = await fetch('/api/approve-article', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ articleId }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage(`Article "${data.article.title}" approved and published!`)
        // Reload pending articles
        const pending = getAllPendingArticles().filter(article => article.status === 'pending')
        setPendingArticles(pending)
      } else {
        setError(data.error || 'Failed to approve article')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    }
  }

  const handleReject = async (articleId: string) => {
    const reviewNotes = prompt('Please provide a reason for rejection (optional):')
    
    try {
      const response = await fetch('/api/reject-article', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ articleId, reviewNotes }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage('Article rejected successfully')
        // Reload pending articles
        const pending = getAllPendingArticles().filter(article => article.status === 'pending')
        setPendingArticles(pending)
      } else {
        setError(data.error || 'Failed to reject article')
      }
    } catch (error) {
      setError('Network error. Please try again.')
    }
  }

  if (isLoading) {
    return (
      <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading pending articles...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Pending Articles ({pendingArticles.length})
        </h2>
        <p className="text-gray-600">
          Review and approve articles submitted by the community.
        </p>
      </div>

      {message && (
        <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          <i className="fas fa-check-circle mr-2"></i>
          {message}
        </div>
      )}

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <i className="fas fa-exclamation-circle mr-2"></i>
          {error}
        </div>
      )}

      {pendingArticles.length === 0 ? (
        <div className="text-center py-8">
          <i className="fas fa-inbox text-4xl text-gray-400 mb-4"></i>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Pending Articles</h3>
          <p className="text-gray-600">All submitted articles have been reviewed.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingArticles.map((article) => (
            <div key={article.id} className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {article.title}
                  </h3>
                  <div className="flex flex-wrap gap-2 mb-2">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {article.category}
                    </span>
                    {article.subcategory && (
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {article.subcategory}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    By <strong>{article.authorName}</strong> ({article.authorEmail})
                  </p>
                  <p className="text-sm text-gray-500">
                    Submitted: {new Date(article.submittedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
              
              <div className="mb-4">
                <div 
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ 
                    __html: article.content.substring(0, 200) + (article.content.length > 200 ? '...' : '')
                  }}
                />
              </div>
              
              {article.tags.length > 0 && (
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {article.tags.map((tag, index) => (
                      <span key={index} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex gap-3">
                <button
                  onClick={() => handleApprove(article.id)}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <i className="fas fa-check mr-2"></i>
                  Approve
                </button>
                <button
                  onClick={() => handleReject(article.id)}
                  className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <i className="fas fa-times mr-2"></i>
                  Reject
                </button>
                <button
                  onClick={() => window.open(`/admin/preview/${article.id}`, '_blank')}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <i className="fas fa-eye mr-2"></i>
                  Preview
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
