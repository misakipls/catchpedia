import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { NextRequest, NextResponse } from 'next/server'

// Environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-in-production'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'
const BCRYPT_SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10')

// JWT payload interface
export interface JWTPayload {
  sub: string // user ID
  email: string
  iat?: number
  exp?: number
}

// User interface
export interface User {
  id: string
  email: string
  displayName?: string
  passwordHash: string
  createdAt: string
}

/**
 * Hash a plain text password using bcrypt
 */
export async function hashPassword(plainPassword: string): Promise<string> {
  return bcrypt.hash(plainPassword, BCRYPT_SALT_ROUNDS)
}

/**
 * Verify a plain text password against a hash
 */
export async function verifyPassword(plainPassword: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plainPassword, hash)
}

/**
 * Sign a JWT token with user payload
 */
export function signToken(payload: Omit<JWTPayload, 'iat' | 'exp'>): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN } as jwt.SignOptions)
}

/**
 * Verify and decode a JWT token
 */
export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload
  } catch (error) {
    return null
  }
}

/**
 * Set authentication cookie in response
 */
export function setAuthCookie(res: NextResponse, token: string): void {
  const isProduction = process.env.NODE_ENV === 'production'
  const secureFlag = isProduction ? 'Secure; ' : ''
  
  // Calculate max age from JWT_EXPIRES_IN
  const maxAge = JWT_EXPIRES_IN === '7d' ? 7 * 24 * 60 * 60 : 24 * 60 * 60 // 7 days or 1 day in seconds
  
  const cookieValue = `catchpedia_user=${token}; Path=/; SameSite=Lax; ${secureFlag}Max-Age=${maxAge}; HttpOnly`
  res.headers.set('Set-Cookie', cookieValue)
}

/**
 * Clear authentication cookie in response
 */
export function clearAuthCookie(res: NextResponse): void {
  const cookieValue = 'catchpedia_user=; Path=/; SameSite=Lax; Max-Age=0; HttpOnly'
  res.headers.set('Set-Cookie', cookieValue)
}

/**
 * Extract and verify authentication from request cookies
 */
export function getAuthFromReq(req: NextRequest): { userId: string; email: string } | null {
  const cookieHeader = req.headers.get('cookie')
  if (!cookieHeader) return null
  
  const cookies = cookieHeader.split(';').map(cookie => cookie.trim())
  const authCookie = cookies.find(cookie => cookie.startsWith('catchpedia_user='))
  
  if (!authCookie) return null
  
  const token = authCookie.split('=')[1]
  if (!token) return null
  
  const payload = verifyToken(token)
  if (!payload) return null
  
  return {
    userId: payload.sub,
    email: payload.email
  }
}

/**
 * Server-side helper for checking user authentication in API routes
 */
export function checkUserAuth(req: NextRequest): { isAuthenticated: boolean; user?: { userId: string; email: string }; response?: NextResponse } {
  const auth = getAuthFromReq(req)
  
  if (!auth) {
    return {
      isAuthenticated: false,
      response: NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }
  }
  
  return {
    isAuthenticated: true,
    user: auth
  }
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate password strength
 */
export function isValidPassword(password: string): { valid: boolean; error?: string } {
  if (password.length < 8) {
    return { valid: false, error: 'Password must be at least 8 characters long' }
  }
  
  if (!/(?=.*[a-z])/.test(password)) {
    return { valid: false, error: 'Password must contain at least one lowercase letter' }
  }
  
  if (!/(?=.*[A-Z])/.test(password)) {
    return { valid: false, error: 'Password must contain at least one uppercase letter' }
  }
  
  if (!/(?=.*\d)/.test(password)) {
    return { valid: false, error: 'Password must contain at least one number' }
  }
  
  return { valid: true }
}

// Admin Authentication Functions (for backward compatibility)

/**
 * Verifies if the admin cookie is present and valid
 */
export function verifyAdminCookie(req: NextRequest): boolean {
  const cookieHeader = req.headers.get('cookie')
  if (!cookieHeader) return false
  
  const cookies = cookieHeader.split(';').map(cookie => cookie.trim())
  const adminCookie = cookies.find(cookie => cookie.startsWith('catchpedia_admin='))
  
  return adminCookie === 'catchpedia_admin=1'
}

/**
 * Sets the admin cookie in the response
 */
export function setAdminCookie(res: NextResponse): void {
  const isProduction = process.env.NODE_ENV === 'production'
  const secureFlag = isProduction ? 'Secure; ' : ''
  
  const cookieValue = `catchpedia_admin=1; Path=/; SameSite=Lax; ${secureFlag}Max-Age=86400; HttpOnly`
  res.headers.set('Set-Cookie', cookieValue)
}

/**
 * Clears the admin cookie in the response
 */
export function clearAdminCookie(res: NextResponse): void {
  const cookieValue = 'catchpedia_admin=; Path=/; SameSite=Lax; Max-Age=0; HttpOnly'
  res.headers.set('Set-Cookie', cookieValue)
}

/**
 * Server-side helper for checking admin authentication in API routes
 */
export function checkAdminAuth(req: NextRequest): { isAuthenticated: boolean; response?: NextResponse } {
  if (!verifyAdminCookie(req)) {
    return {
      isAuthenticated: false,
      response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
  }
  
  return { isAuthenticated: true }
}

// Server-side user authentication helpers for pages

/**
 * Get user information from server-side cookies (for pages)
 */
export function getUserFromCookies(cookieHeader: string | null): { userId: string; email: string; displayName?: string } | null {
  if (!cookieHeader) return null
  
  const cookies = cookieHeader.split(';').map(cookie => cookie.trim())
  const authCookie = cookies.find(cookie => cookie.startsWith('catchpedia_user='))
  
  if (!authCookie) return null
  
  const token = authCookie.split('=')[1]
  if (!token) return null
  
  const payload = verifyToken(token)
  if (!payload) return null
  
  return {
    userId: payload.sub,
    email: payload.email,
    displayName: payload.email.split('@')[0] // Use email prefix as display name for now
  }
}

/**
 * Check if user is authenticated (for server-side pages)
 */
export function isUserAuthenticated(cookieHeader: string | null): boolean {
  return getUserFromCookies(cookieHeader) !== null
}