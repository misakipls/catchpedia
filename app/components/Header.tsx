'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import Image from 'next/image'
import { useState, useEffect, useRef } from 'react'

const navigation = [
  { name: 'Search', href: '/search', isSearch: true },
  { name: 'Locations', href: '/locations' },
  { name: 'Waters', href: '/waters' },
  { name: 'Fish', href: '/fish' },
  { name: 'Fishing Rods', href: '/fishing-rods' },
  { name: 'Reels', href: '/reels' },
  { name: 'Fishing Lines', href: '/fishing-lines' },
  { name: 'Hooks', href: '/hooks' },
  { name: 'Lures', href: '/lures' },
  { name: 'Knots', href: '/knots' },
  { name: 'Tackles', href: '/tackles' },
  { name: 'Submit Article', href: '/submit', isSubmit: true },
]

export default function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false)
  const [user, setUser] = useState<{ userId: string; email: string; displayName?: string } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const accountMenuRef = useRef<HTMLDivElement>(null)

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/submit-article', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ test: true })
        })
        
        if (response.status === 200) {
          // User is authenticated, get user info from JWT
          const data = await response.json()
          // For now, we'll use a placeholder since we don't have user info in the test response
          setUser({
            userId: 'user',
            email: 'user@example.com',
            displayName: 'User'
          })
        } else {
          setUser(null)
        }
      } catch (error) {
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  // Close account menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target as Node)) {
        setIsAccountMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      setUser(null)
      setIsAccountMenuOpen(false)
      router.push('/')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  return (
    <header className="header">
      <div className="container">
        <div className="logo">
          <Link href="/">
            <Image
              src="/logo/catchpedia.png"
              alt="Catchpedia Logo"
              width={200}
              height={144}
              className="logo-img"
            />
          </Link>
        </div>
        
        <nav className={`nav ${isMobileMenuOpen ? 'active' : ''}`}>
          <ul className="nav-list">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`nav-link ${isActive ? 'active' : ''} ${item.isSearch ? 'search-link' : ''} ${item.isSubmit ? 'submit-link' : ''}`}
                  >
                    {item.name}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
        
        <div className="header-actions">
          {/* Account Menu */}
          {!isLoading && (
            <>
              {user ? (
                <div className="account-menu" ref={accountMenuRef}>
                  <button
                    onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                    className="account-button"
                  >
                    <img
                      src="https://via.placeholder.com/32"
                      alt="Profile"
                      className="profile-image"
                    />
                    <span className="user-name">{user.displayName || user.email}</span>
                    <i className={`fas fa-chevron-down ${isAccountMenuOpen ? 'rotate-180' : ''}`}></i>
                  </button>
                  
                  {isAccountMenuOpen && (
                    <div className="account-dropdown">
                      <Link
                        href="/account"
                        className="dropdown-item"
                        onClick={() => setIsAccountMenuOpen(false)}
                      >
                        <i className="fas fa-user"></i>
                        Account
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="dropdown-item"
                      >
                        <i className="fas fa-sign-out-alt"></i>
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="auth-buttons">
                  <Link href="/auth/signup" className="auth-button signup-button">
                    Sign Up
                  </Link>
                  <Link href="/auth/login" className="auth-button login-button">
                    Login
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
        
        <div 
          className="mobile-menu-toggle"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
        </div>
      </div>
    </header>
  )
}
