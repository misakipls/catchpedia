import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import Link from 'next/link'
import PendingArticlesSection from './PendingArticlesSection'

// Server-side authentication check
async function checkAdminAuth() {
  const cookieStore = cookies()
  const adminCookie = cookieStore.get('catchpedia_admin')
  
  if (!adminCookie || adminCookie.value !== '1') {
    redirect('/admin')
  }
}

export default async function AdminDashboard() {
  // Check authentication before rendering
  await checkAdminAuth()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 mb-8">
                Welcome to the Catchpedia admin panel. Manage your fishing guide content.
              </p>
              
              <div className="space-y-4">
                <Link
                  href="/admin/manage"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Manage Articles
                </Link>
                
                <div className="mt-4">
                  <form action="/api/admin-logout" method="POST">
                    <button
                      type="submit"
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Logout
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Pending Articles Section */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <PendingArticlesSection />
        </div>
      </div>
    </div>
  )
}
