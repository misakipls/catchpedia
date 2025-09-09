import { NextRequest, NextResponse } from 'next/server'
import { submitPendingArticle } from '../../data/store'
import { checkUserAuth } from '../../utils/auth'

export async function POST(request: NextRequest) {
  try {
    // Check user authentication
    const authCheck = checkUserAuth(request)
    if (!authCheck.isAuthenticated) {
      return authCheck.response!
    }
    
    const body = await request.json()
    
    // Handle test requests for authentication checking
    if (body.test) {
      return NextResponse.json({ success: true, message: 'Authentication verified' })
    }
    
    const { title, category, subcategory, content, tags } = body
    
    // Validate required fields
    if (!title || !category || !content) {
      return NextResponse.json({ 
        error: 'Missing required fields: title, category, content' 
      }, { status: 400 })
    }
    
    // Submit the pending article with authenticated user info
    const pendingArticle = submitPendingArticle({
      title,
      category,
      subcategory: subcategory || '',
      content,
      tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag) : []),
      authorName: authCheck.user?.email || 'Authenticated User',
      authorEmail: authCheck.user?.email || 'user@example.com'
    })
    
    return NextResponse.json({ 
      success: true, 
      message: 'Article submitted successfully! It will be reviewed by our team.',
      articleId: pendingArticle.id
    })
    
  } catch (error) {
    console.error('Error submitting article:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}
