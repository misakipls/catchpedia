import { User } from '../utils/auth'

/**
 * User data store abstraction
 * 
 * ⚠️  SECURITY WARNING: This is a dev-only file-based user store.
 * For production, replace with a proper database (PostgreSQL, MongoDB, etc.)
 * or use a service like Supabase Auth, Auth0, or NextAuth.js
 * 
 * File-based storage is NOT suitable for production because:
 * - No concurrent access control
 * - No data persistence guarantees on serverless platforms
 * - No backup/recovery mechanisms
 * - Security vulnerabilities with file system access
 */

const USERS_STORAGE_KEY = 'catchpedia_users'
const USERS_FILE_PATH = 'data/users.json'

/**
 * Get all users from storage
 */
export function getAllUsers(): User[] {
  if (typeof window === 'undefined') {
    // Server-side: try to read from file system first, then fallback to empty array
    try {
      const fs = require('fs')
      const path = require('path')
      const filePath = path.join(process.cwd(), USERS_FILE_PATH)
      
      if (fs.existsSync(filePath)) {
        const fileContent = fs.readFileSync(filePath, 'utf8')
        return JSON.parse(fileContent)
      }
    } catch (error) {
      console.warn('Could not read users from file system:', error)
    }
    return []
  }
  
  // Client-side: read from localStorage
  try {
    const stored = localStorage.getItem(USERS_STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Error loading users:', error)
    return []
  }
}

/**
 * Save users to storage
 */
export function saveUsers(users: User[]): void {
  if (typeof window === 'undefined') {
    // Server-side: save to file system
    try {
      const fs = require('fs')
      const path = require('path')
      const filePath = path.join(process.cwd(), USERS_FILE_PATH)
      
      // Ensure directory exists
      const dir = path.dirname(filePath)
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true })
      }
      
      fs.writeFileSync(filePath, JSON.stringify(users, null, 2))
    } catch (error) {
      console.error('Error saving users to file system:', error)
    }
  } else {
    // Client-side: save to localStorage
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))
    } catch (error) {
      console.error('Error saving users:', error)
    }
  }
}

/**
 * Get user by ID
 */
export function getUserById(id: string): User | null {
  const users = getAllUsers()
  return users.find(user => user.id === id) || null
}

/**
 * Get user by email
 */
export function getUserByEmail(email: string): User | null {
  const users = getAllUsers()
  return users.find(user => user.email.toLowerCase() === email.toLowerCase()) || null
}

/**
 * Create a new user
 */
export function createUser(userData: {
  email: string
  displayName?: string
  passwordHash: string
}): User {
  const users = getAllUsers()
  
  // Check if user already exists
  if (getUserByEmail(userData.email)) {
    throw new Error('User with this email already exists')
  }
  
  const newUser: User = {
    id: generateUserId(),
    email: userData.email.toLowerCase(),
    displayName: userData.displayName,
    passwordHash: userData.passwordHash,
    createdAt: new Date().toISOString()
  }
  
  users.push(newUser)
  saveUsers(users)
  
  return newUser
}

/**
 * Update user information
 */
export function updateUser(id: string, updates: Partial<Pick<User, 'displayName' | 'email'>>): User | null {
  const users = getAllUsers()
  const userIndex = users.findIndex(user => user.id === id)
  
  if (userIndex === -1) return null
  
  // Check email uniqueness if email is being updated
  if (updates.email && updates.email !== users[userIndex].email) {
    if (getUserByEmail(updates.email)) {
      throw new Error('User with this email already exists')
    }
    updates.email = updates.email.toLowerCase()
  }
  
  users[userIndex] = {
    ...users[userIndex],
    ...updates
  }
  
  saveUsers(users)
  return users[userIndex]
}

/**
 * Delete user
 */
export function deleteUser(id: string): boolean {
  const users = getAllUsers()
  const userIndex = users.findIndex(user => user.id === id)
  
  if (userIndex === -1) return false
  
  users.splice(userIndex, 1)
  saveUsers(users)
  return true
}

/**
 * Generate a unique user ID
 */
function generateUserId(): string {
  return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
}

/**
 * Initialize with a default admin user (for development)
 * This should be removed in production
 */
export function initializeDefaultUsers(): void {
  const users = getAllUsers()
  
  // Only initialize if no users exist
  if (users.length === 0) {
    console.log('Initializing default users for development...')
    
    // Note: In production, you should create admin users through a proper setup process
    // and never store default passwords in code
  }
}
