'use client'

import Header from '../components/Header'
import Footer from '../components/Footer'
import Sidebar from '../components/Sidebar'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { getAllArticles, Article } from '../data/store'
import { useSearchParams } from 'next/navigation'

export default function SearchPage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [searchResults, setSearchResults] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const searchParams = useSearchParams()

  useEffect(() => {
    const allArticles = getAllArticles()
    setArticles(allArticles)
    
    // Get search term from URL
    const query = searchParams.get('q') || ''
    setSearchTerm(query)
    
    if (query) {
      performSearch(query, allArticles)
    } else {
      setSearchResults([])
    }
    
    setLoading(false)
  }, [searchParams])

  // Clear results when search term changes
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSearchResults([])
    }
  }, [searchTerm])

  const performSearch = (term: string, articlesList?: Article[]) => {
    if (!term.trim()) {
      setSearchResults([])
      return
    }

    // Use the provided articlesList or fall back to current articles state
    const searchArticles = articlesList || articles
    
    const results = searchArticles.filter(article => {
      const searchLower = term.toLowerCase()
      return (
        article.title.toLowerCase().includes(searchLower) ||
        article.content.toLowerCase().includes(searchLower) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
        article.category.toLowerCase().includes(searchLower) ||
        (article.subcategory && article.subcategory.toLowerCase().includes(searchLower))
      )
    })

    setSearchResults(results)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Get fresh articles data and perform search
    const freshArticles = getAllArticles()
    performSearch(searchTerm, freshArticles)
  }

  const getHighlightedText = (text: string, searchTerm: string) => {
    if (!searchTerm) return text
    
    const regex = new RegExp(`(${searchTerm})`, 'gi')
    const parts = text.split(regex)
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="search-highlight">{part}</mark>
      ) : part
    )
  }

  const getSnippet = (content: string, searchTerm: string) => {
    const cleanContent = content.replace(/<[^>]*>/g, '')
    const searchLower = searchTerm.toLowerCase()
    const contentLower = cleanContent.toLowerCase()
    
    const index = contentLower.indexOf(searchLower)
    if (index === -1) {
      return cleanContent.substring(0, 200) + '...'
    }
    
    const start = Math.max(0, index - 100)
    const end = Math.min(cleanContent.length, index + searchTerm.length + 100)
    
    return cleanContent.substring(start, end) + '...'
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="main-content">
        <div className="page-layout">
          <Sidebar />
          
          <div className="content-area">
            <div className="content-container">
              <div className="search-page-header">
                <h1>Search Results</h1>
                
                <form onSubmit={handleSearch} className="search-form">
                  <div className="search-input-group">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search for fishing locations, fish species, equipment..."
                      className="search-input"
                    />
                    <button type="submit" className="search-submit-btn">
                      <i className="fas fa-search"></i>
                    </button>
                  </div>
                </form>
              </div>
              
              <div className="search-results">
                {loading ? (
                  <div className="loading">Searching...</div>
                ) : searchTerm ? (
                  <>
                    <div className="search-stats">
                      <p>
                        Found {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} for "{searchTerm}"
                      </p>
                    </div>
                    
                    {searchResults.length > 0 ? (
                      <div className="results-list">
                        {searchResults.map((article) => (
                          <div key={article.id} className="search-result-item">
                            <h3>
                              <Link href={`/${article.category}/${article.id}`}>
                                {getHighlightedText(article.title, searchTerm)}
                              </Link>
                            </h3>
                            
                            <div className="result-meta">
                              <span className="result-category">
                                <Link href={`/${article.category}`}>
                                  {article.category}
                                </Link>
                              </span>
                              {article.subcategory && (
                                <span className="result-subcategory">
                                  {article.subcategory}
                                </span>
                              )}
                              <span className="result-date">
                                {new Date(article.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            
                            <p className="result-snippet">
                              {getHighlightedText(getSnippet(article.content, searchTerm), searchTerm)}
                            </p>
                            
                            {article.tags.length > 0 && (
                              <div className="result-tags">
                                {article.tags.map((tag, index) => (
                                  <span key={index} className="result-tag">
                                    {getHighlightedText(tag, searchTerm)}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="no-results">
                        <i className="fas fa-search"></i>
                        <h2>No results found</h2>
                        <p>Try different keywords or check your spelling.</p>
                        <div className="search-suggestions">
                          <h3>Popular searches:</h3>
                          <div className="suggestion-tags">
                            <button onClick={() => setSearchTerm('bass')} className="suggestion-tag">bass</button>
                            <button onClick={() => setSearchTerm('salmon')} className="suggestion-tag">salmon</button>
                            <button onClick={() => setSearchTerm('fishing rod')} className="suggestion-tag">fishing rod</button>
                            <button onClick={() => setSearchTerm('knots')} className="suggestion-tag">knots</button>
                            <button onClick={() => setSearchTerm('lures')} className="suggestion-tag">lures</button>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="search-prompt">
                    <i className="fas fa-search"></i>
                    <h2>Search Catchpedia</h2>
                    <p>Enter a search term above to find articles about fishing locations, fish species, equipment, and more.</p>
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
