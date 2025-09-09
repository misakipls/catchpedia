import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import AdminManageClient from './AdminManageClient'

// Server-side authentication check
async function checkAdminAuth() {
  const cookieStore = cookies()
  const adminCookie = cookieStore.get('catchpedia_admin')
  
  if (!adminCookie || adminCookie.value !== '1') {
    redirect('/admin')
  }
}

export default async function AdminManagePage() {
  // Check authentication before rendering
  await checkAdminAuth()

  return <AdminManageClient />
}
