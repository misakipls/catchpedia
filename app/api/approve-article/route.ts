import { NextRequest, NextResponse } from 'next/server'
import { approvePendingArticle, getPendingArticleById } from '../../data/store'
import { checkAdminAuth } from '../../utils/auth'

export async function POST(request: NextRequest) {
  try {
    // Check admin authentication
    const authCheck = checkAdminAuth(request)
    if (!authCheck.isAuthenticated) {
      return authCheck.response!
    }
    
    const body = await request.json()
    const { articleId, reviewNotes } = body
    
    if (!articleId) {
      return NextResponse.json({ 
        error: 'Article ID is required' 
      }, { status: 400 })
    }
    
    // Check if pending article exists
    const pendingArticle = getPendingArticleById(articleId)
    if (!pendingArticle) {
      return NextResponse.json({ 
        error: 'Pending article not found' 
      }, { status: 404 })
    }
    
    if (pendingArticle.status !== 'pending') {
      return NextResponse.json({ 
        error: 'Article has already been reviewed' 
      }, { status: 400 })
    }
    
    // Approve the article
    const approvedArticle = approvePendingArticle(articleId, 'admin', reviewNotes)
    
    if (!approvedArticle) {
      return NextResponse.json({ 
        error: 'Failed to approve article' 
      }, { status: 500 })
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Article approved and published successfully!',
      article: approvedArticle
    })
    
  } catch (error) {
    console.error('Error approving article:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}
