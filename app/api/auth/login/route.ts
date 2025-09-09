import { NextRequest, NextResponse } from 'next/server'
import { verifyPassword, signToken, setAuthCookie, isValidEmail } from '../../../utils/auth'
import { getUserByEmail } from '../../../data/store-users'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body
    
    // Validate required fields
    if (!email || !password) {
      return NextResponse.json({ 
        error: 'Email and password are required' 
      }, { status: 400 })
    }
    
    // Validate email format
    if (!isValidEmail(email)) {
      return NextResponse.json({ 
        error: 'Invalid email format' 
      }, { status: 400 })
    }
    
    // Find user by email
    const user = getUserByEmail(email)
    if (!user) {
      return NextResponse.json({ 
        error: 'Invalid email or password' 
      }, { status: 401 })
    }
    
    // Verify password
    const isValid = await verifyPassword(password, user.passwordHash)
    if (!isValid) {
      return NextResponse.json({ 
        error: 'Invalid email or password' 
      }, { status: 401 })
    }
    
    // Create JWT token
    const token = signToken({
      sub: user.id,
      email: user.email
    })
    
    // Set authentication cookie
    const response = NextResponse.json({ 
      success: true,
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        createdAt: user.createdAt
      }
    })
    
    setAuthCookie(response, token)
    
    return response
    
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}
