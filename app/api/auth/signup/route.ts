import { NextRequest, NextResponse } from 'next/server'
import { hashPassword, signToken, setAuthCookie, isValidEmail, isValidPassword } from '../../../utils/auth'
import { createUser, getUserByEmail } from '../../../data/store-users'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, displayName } = body
    
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
    
    // Validate password strength
    const passwordValidation = isValidPassword(password)
    if (!passwordValidation.valid) {
      return NextResponse.json({ 
        error: passwordValidation.error 
      }, { status: 400 })
    }
    
    // Check if user already exists
    if (getUserByEmail(email)) {
      return NextResponse.json({ 
        error: 'User with this email already exists' 
      }, { status: 409 })
    }
    
    // Hash password
    const passwordHash = await hashPassword(password)
    
    // Create user
    const user = createUser({
      email,
      displayName: displayName || email.split('@')[0], // Use email prefix as default display name
      passwordHash
    })
    
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
    }, { status: 201 })
    
    setAuthCookie(response, token)
    
    return response
    
  } catch (error) {
    console.error('Signup error:', error)
    
    if (error instanceof Error && error.message.includes('already exists')) {
      return NextResponse.json({ 
        error: error.message 
      }, { status: 409 })
    }
    
    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500 })
  }
}
