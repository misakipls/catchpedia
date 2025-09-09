import { NextRequest, NextResponse } from 'next/server'
import { setAdminCookie } from '../../utils/auth'

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()
    
    if (!password) {
      return NextResponse.json({ error: 'Password is required' }, { status: 400 })
    }
    
    // Temporary hardcoded password for testing
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'
    
    console.log('Environment check:', {
      hasPassword: !!adminPassword,
      passwordLength: adminPassword?.length || 0,
      nodeEnv: process.env.NODE_ENV
    })
    
    if (password !== adminPassword) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
    }
    
    // Password is correct, set admin cookie
    const response = NextResponse.json({ success: true })
    setAdminCookie(response)
    
    return response
  } catch (error) {
    console.error('Admin login error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
