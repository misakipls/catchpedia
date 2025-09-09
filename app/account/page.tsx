import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import Header from '../components/Header'
import Footer from '../components/Footer'
import Sidebar from '../components/Sidebar'
import Breadcrumb from '../components/Breadcrumb'

// Server-side authentication check
async function checkUserAuth() {
  const cookieStore = cookies()
  const authCookie = cookieStore.get('catchpedia_user')
  
  if (!authCookie || !authCookie.value) {
    redirect('/auth/login?next=/account')
  }
  
  // Verify JWT token
  try {
    const jwt = require('jsonwebtoken')
    const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-change-in-production'
    const payload = jwt.verify(authCookie.value, JWT_SECRET)
    
    if (!payload || !payload.sub) {
      redirect('/auth/login?next=/account')
    }
    
    return {
      userId: payload.sub,
      email: payload.email
    }
  } catch (error) {
    redirect('/auth/login?next=/account')
  }
}

export default async function AccountPage() {
  // Check authentication before rendering
  const user = await checkUserAuth()

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="main-content">
        <div className="page-layout">
          <Sidebar />
          
          <div className="content-area">
            <div className="content-container">
              <Breadcrumb items={[
                { label: 'Home', href: '/' },
                { label: 'Account', isActive: true }
              ]} />
              
              <div className="category-header">
                <h1>Account Page</h1>
                <p className="category-description">
                  Manage your Catchpedia account settings and preferences.
                </p>
              </div>
              
              <div className="admin-section">
                <div className="bg-white p-6 rounded-lg shadow">
                  <h2 className="text-xl font-semibold mb-4">Account Information</h2>
                  <div className="space-y-2">
                    <p><strong>User ID:</strong> {user.userId}</p>
                    <p><strong>Email:</strong> {user.email}</p>
                  </div>
                  
                  <div className="mt-6">
                    <h3 className="text-lg font-medium mb-3">Account Settings</h3>
                    <p className="text-gray-600">
                      This is a placeholder page. Account management features will be added here in the future.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
