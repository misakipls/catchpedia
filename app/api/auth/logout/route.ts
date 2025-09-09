import { NextRequest, NextResponse } from 'next/server'
import { clearAuthCookie } from '../../../utils/auth'

export async function POST(request: NextRequest) {
  try {
    const response = NextResponse.json({ 
      success: true,
      message: 'Logged out successfully'
    })
    
    clearAuthCookie(response)
    
    return response
    
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}
