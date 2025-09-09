import { NextRequest, NextResponse } from 'next/server'
import { clearAdminCookie } from '../../utils/auth'

export async function POST(request: NextRequest) {
  try {
    const response = NextResponse.json({ success: true })
    clearAdminCookie(response)
    
    return response
  } catch (error) {
    console.error('Admin logout error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
