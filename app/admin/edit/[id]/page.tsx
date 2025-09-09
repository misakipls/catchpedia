import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import EditArticleClient from './EditArticleClient'

// Server-side authentication check
async function checkAdminAuth() {
  const cookieStore = cookies()
  const adminCookie = cookieStore.get('catchpedia_admin')
  
  if (!adminCookie || adminCookie.value !== '1') {
    redirect('/admin')
  }
}

interface PageProps {
  params: {
    id: string
  }
}

export default async function AdminEditPage({ params }: PageProps) {
  // Check authentication before rendering
  await checkAdminAuth()

  return <EditArticleClient articleId={params.id} />
}
