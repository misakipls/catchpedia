import { NextRequest, NextResponse } from 'next/server'
import { rejectPendingArticle, getPendingArticleById } from '../../data/store'
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
    
    // Reject the article
    const success = rejectPendingArticle(articleId, 'admin', reviewNotes)
    
    if (!success) {
      return NextResponse.json({ 
        error: 'Failed to reject article' 
      }, { status: 500 })
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Article rejected successfully'
    })
    
  } catch (error) {
    console.error('Error rejecting article:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}
