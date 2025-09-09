export interface Article {
  id: string
  title: string
  category: string
  subcategory: string
  content: string
  tags: string[]
  createdAt: string
  updatedAt: string
}

export interface PendingArticle {
  id: string
  title: string
  category: string
  subcategory: string
  content: string
  tags: string[]
  authorName: string
  authorEmail: string
  submittedAt: string
  status: 'pending' | 'approved' | 'rejected'
  reviewedAt?: string
  reviewedBy?: string
  reviewNotes?: string
}

/**
 * Data store abstraction for articles
 * Currently uses localStorage, but can be easily swapped for other storage solutions
 */

const STORAGE_KEY = 'catchpedia_articles'
const PENDING_STORAGE_KEY = 'catchpedia_pending_articles'

export function getAllArticles(): Article[] {
  if (typeof window === 'undefined') return []
  
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Error loading articles:', error)
    return []
  }
}

export function saveArticles(articles: Article[]): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(articles))
  } catch (error) {
    console.error('Error saving articles:', error)
  }
}

export function getArticleById(id: string): Article | null {
  const articles = getAllArticles()
  return articles.find(article => article.id === id) || null
}

export function getArticlesByCategory(category: string): Article[] {
  const articles = getAllArticles()
  return articles.filter(article => article.category === category)
}

export function getArticlesBySubcategory(category: string, subcategory: string): Article[] {
  const articles = getAllArticles()
  return articles.filter(article => 
    article.category === category && article.subcategory === subcategory
  )
}

export function getArticleCountBySubcategory(category: string, subcategory: string): number {
  return getArticlesBySubcategory(category, subcategory).length
}

export function addArticle(articleData: {
  title: string
  category: string
  subcategory?: string
  content: string
  tags: string[]
}): Article {
  const articles = getAllArticles()
  const { generateSlug } = require('../utils/slugify')
  
  const newArticle: Article = {
    id: generateSlug(articleData.title),
    title: articleData.title,
    category: articleData.category,
    subcategory: articleData.subcategory || '',
    content: articleData.content,
    tags: articleData.tags,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  
  articles.push(newArticle)
  saveArticles(articles)
  return newArticle
}

export function updateArticle(id: string, updates: Partial<Article>): Article | null {
  const articles = getAllArticles()
  const index = articles.findIndex(article => article.id === id)

  if (index === -1) return null

  articles[index] = {
    ...articles[index],
    ...updates,
    updatedAt: new Date().toISOString()
  }

  saveArticles(articles)
  return articles[index]
}

export function deleteArticle(id: string): boolean {
  const articles = getAllArticles()
  const filteredArticles = articles.filter(article => article.id !== id)
  
  if (filteredArticles.length === articles.length) return false
  
  saveArticles(filteredArticles)
  return true
}

export function editArticle(id: string, articleData: {
  title: string
  category: string
  subcategory?: string
  content: string
  tags: string[]
}): Article | null {
  const articles = getAllArticles()
  const index = articles.findIndex(article => article.id === id)

  if (index === -1) return null

  // Generate new slug if title changed
  const { generateSlug } = require('../utils/slugify')
  const newSlug = generateSlug(articleData.title)
  const oldArticle = articles[index]

  articles[index] = {
    ...oldArticle,
    ...articleData,
    id: newSlug, // Update ID if title changed
    updatedAt: new Date().toISOString()
  }

  // If the slug changed, we need to handle the old article
  if (newSlug !== oldArticle.id) {
    // Remove the old article and add the new one
    articles.splice(index, 1)
    articles.push(articles[index])
  }

  saveArticles(articles)
  return articles[index]
}

export function getCategoriesWithCounts() {
  const articles = getAllArticles()
  const categories = new Map()
  
  articles.forEach(article => {
    const count = categories.get(article.category) || 0
    categories.set(article.category, count + 1)
  })
  
  return Array.from(categories.entries()).map(([category, count]) => ({
    value: category,
    label: category.charAt(0).toUpperCase() + category.slice(1),
    count
  }))
}

// Pending Articles Functions

export function getAllPendingArticles(): PendingArticle[] {
  if (typeof window === 'undefined') return []
  
  try {
    const stored = localStorage.getItem(PENDING_STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Error loading pending articles:', error)
    return []
  }
}

export function savePendingArticles(pendingArticles: PendingArticle[]): void {
  if (typeof window === 'undefined') return
  
  try {
    localStorage.setItem(PENDING_STORAGE_KEY, JSON.stringify(pendingArticles))
  } catch (error) {
    console.error('Error saving pending articles:', error)
  }
}

export function submitPendingArticle(articleData: {
  title: string
  category: string
  subcategory?: string
  content: string
  tags: string[]
  authorName: string
  authorEmail: string
}): PendingArticle {
  const { generateSlug } = require('../utils/slugify')
  const id = generateSlug(articleData.title) + '-' + Date.now()
  
  const pendingArticle: PendingArticle = {
    id,
    title: articleData.title,
    category: articleData.category,
    subcategory: articleData.subcategory || '',
    content: articleData.content,
    tags: articleData.tags,
    authorName: articleData.authorName,
    authorEmail: articleData.authorEmail,
    submittedAt: new Date().toISOString(),
    status: 'pending'
  }
  
  const pendingArticles = getAllPendingArticles()
  pendingArticles.push(pendingArticle)
  savePendingArticles(pendingArticles)
  
  return pendingArticle
}

export function getPendingArticleById(id: string): PendingArticle | null {
  const pendingArticles = getAllPendingArticles()
  return pendingArticles.find(article => article.id === id) || null
}

export function approvePendingArticle(id: string, reviewedBy: string, reviewNotes?: string): Article | null {
  const pendingArticles = getAllPendingArticles()
  const pendingIndex = pendingArticles.findIndex(article => article.id === id)
  
  if (pendingIndex === -1) return null
  
  const pendingArticle = pendingArticles[pendingIndex]
  
  // Update pending article status
  pendingArticles[pendingIndex] = {
    ...pendingArticle,
    status: 'approved',
    reviewedAt: new Date().toISOString(),
    reviewedBy,
    reviewNotes
  }
  savePendingArticles(pendingArticles)
  
  // Create approved article
  const { generateSlug } = require('../utils/slugify')
  const articleId = generateSlug(pendingArticle.title)
  
  const approvedArticle: Article = {
    id: articleId,
    title: pendingArticle.title,
    category: pendingArticle.category,
    subcategory: pendingArticle.subcategory,
    content: pendingArticle.content,
    tags: pendingArticle.tags,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
  
  // Add to main articles
  const articles = getAllArticles()
  articles.push(approvedArticle)
  saveArticles(articles)
  
  return approvedArticle
}

export function rejectPendingArticle(id: string, reviewedBy: string, reviewNotes?: string): boolean {
  const pendingArticles = getAllPendingArticles()
  const pendingIndex = pendingArticles.findIndex(article => article.id === id)
  
  if (pendingIndex === -1) return false
  
  pendingArticles[pendingIndex] = {
    ...pendingArticles[pendingIndex],
    status: 'rejected',
    reviewedAt: new Date().toISOString(),
    reviewedBy,
    reviewNotes
  }
  
  savePendingArticles(pendingArticles)
  return true
}

export function getPendingArticlesByStatus(status: 'pending' | 'approved' | 'rejected'): PendingArticle[] {
  const pendingArticles = getAllPendingArticles()
  return pendingArticles.filter(article => article.status === status)
}
