'use client'

import Link from 'next/link'

interface BreadcrumbItem {
  label: string
  href?: string
  isActive?: boolean
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

export default function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  return (
    <nav className={`breadcrumb-nav ${className}`} aria-label="Breadcrumb">
      <ol className="breadcrumb-list">
        {items.map((item, index) => (
          <li key={index} className="breadcrumb-item">
            {item.isActive ? (
              <span className="breadcrumb-current" aria-current="page">
                {item.label}
              </span>
            ) : (
              <Link href={item.href || '#'} className="breadcrumb-link">
                {item.label}
              </Link>
            )}
            {index < items.length - 1 && (
              <span className="breadcrumb-separator" aria-hidden="true">
                ›
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

// Helper function to generate breadcrumbs based on current path
export function generateBreadcrumbs(pathname: string, articleTitle?: string): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean)
  const breadcrumbs: BreadcrumbItem[] = [
    { label: 'Home', href: '/' }
  ]

  if (segments.length === 0) {
    return breadcrumbs
  }

  // Handle category pages
  if (segments.length === 1) {
    const category = segments[0]
    const categoryLabels: { [key: string]: string } = {
      'fish': 'Fish Species',
      'locations': 'Fishing Locations',
      'waters': 'Waters',
      'rods': 'Fishing Rods',
      'reels': 'Reels',
      'lines': 'Fishing Lines',
      'hooks': 'Hooks',
      'lures': 'Lures',
      'knots': 'Knots',
      'tackles': 'Tackles',
      'admin': 'Admin Panel',
      'search': 'Search Results',
      'edit': 'Edit Article',
      'account': 'Account',
      'submit': 'Submit Article'
    }

    breadcrumbs.push({
      label: categoryLabels[category] || category.charAt(0).toUpperCase() + category.slice(1),
      isActive: true
    })
  }

  // Handle subcategory pages
  else if (segments.length === 3 && segments[1] === 'subcategory') {
    const category = segments[0]
    const subcategory = segments[2]
    
    const categoryLabels: { [key: string]: string } = {
      'fish': 'Fish Species',
      'locations': 'Fishing Locations',
      'waters': 'Waters',
      'rods': 'Fishing Rods',
      'reels': 'Reels',
      'lines': 'Fishing Lines',
      'hooks': 'Hooks',
      'lures': 'Lures',
      'knots': 'Knots',
      'tackles': 'Tackles'
    }

    breadcrumbs.push({
      label: categoryLabels[category] || category.charAt(0).toUpperCase() + category.slice(1),
      href: `/${category}`
    })

    breadcrumbs.push({
      label: subcategory.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      isActive: true
    })
  }

  // Handle article pages
  else if (segments.length === 2) {
    const category = segments[0]
    const articleSlug = segments[1]
    
    const categoryLabels: { [key: string]: string } = {
      'fish': 'Fish Species',
      'locations': 'Fishing Locations',
      'waters': 'Waters',
      'rods': 'Fishing Rods',
      'reels': 'Reels',
      'lines': 'Fishing Lines',
      'hooks': 'Hooks',
      'lures': 'Lures',
      'knots': 'Knots',
      'tackles': 'Tackles'
    }

    breadcrumbs.push({
      label: categoryLabels[category] || category.charAt(0).toUpperCase() + category.slice(1),
      href: `/${category}`
    })

    breadcrumbs.push({
      label: articleTitle || articleSlug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      isActive: true
    })
  }

  // Handle edit pages
  else if (segments.length === 2 && segments[0] === 'edit') {
    breadcrumbs.push({
      label: 'Edit Article',
      isActive: true
    })
  }

  return breadcrumbs
}
