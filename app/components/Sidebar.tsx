'use client'

import { usePathname } from 'next/navigation'

export default function Sidebar() {
  const pathname = usePathname()

  const getTableOfContents = () => {
    if (pathname === '/') {
      return (
        <div className="toc-content">
          <div className="toc-section">Quick Navigation</div>
          <ul className="toc-list">
            <li className="toc-item">
              <a href="#search" className="toc-link toc-level-1">Search</a>
            </li>
            <li className="toc-item">
              <a href="#quick-links" className="toc-link toc-level-1">Quick Access</a>
            </li>
          </ul>
        </div>
      )
    } else if (pathname.startsWith('/fish/') && pathname !== '/fish') {
      return (
        <div className="toc-content">
          <div className="toc-section">Article Contents</div>
          <ul className="toc-list">
            <li className="toc-item">
              <a href="#introduction" className="toc-link toc-level-1">Introduction</a>
            </li>
            <li className="toc-item">
              <a href="#description" className="toc-link toc-level-1">Description</a>
            </li>
            <li className="toc-item">
              <a href="#fishing-methods" className="toc-link toc-level-1">Fishing Methods</a>
            </li>
            <li className="toc-item">
              <a href="#related-topics" className="toc-link toc-level-1">Related Topics</a>
            </li>
          </ul>
        </div>
      )
    } else if (pathname === '/admin') {
      return (
        <div className="toc-content">
          <div className="toc-section">Content Management</div>
          <ul className="toc-list">
            <li className="toc-item">
              <a href="#add-article" className="toc-link toc-level-1">Add New Article</a>
            </li>
            <li className="toc-item">
              <a href="#manage-articles" className="toc-link toc-level-1">Manage Articles</a>
            </li>
            <li className="toc-item">
              <a href="#site-stats" className="toc-link toc-level-1">Site Statistics</a>
            </li>
          </ul>
        </div>
      )
    } else {
      const categoryName = getCategoryDisplayName(pathname)
      return (
        <div className="toc-content">
          <div className="toc-placeholder">
            <p>{categoryName}</p>
            <p>Content will be displayed here</p>
          </div>
        </div>
      )
    }
  }

  const getCategoryDisplayName = (path: string) => {
    const names: { [key: string]: string } = {
      '/locations': 'Fishing Locations',
      '/waters': 'Water Types',
      '/fish': 'Fish Species',
      '/rods': 'Fishing Rods',
      '/reels': 'Reels',
      '/lines': 'Fishing Lines',
      '/hooks': 'Hooks',
      '/lures': 'Lures',
      '/knots': 'Fishing Knots',
      '/tackles': 'Tackles'
    }
    return names[path] || 'Category'
  }

  const getPathBreadcrumb = () => {
    if (pathname === '/') {
      return <span className="path-item active">Home</span>
    } else if (pathname.startsWith('/fish/') && pathname !== '/fish') {
      return <span className="path-item">Fish Article</span>
    } else if (pathname.startsWith('/locations/') && pathname !== '/locations') {
      return <span className="path-item">Location Article</span>
    } else {
      const categoryName = getCategoryDisplayName(pathname)
      return <span className="path-item active">{categoryName}</span>
    }
  }

  return (
    <aside className="sidebar">
      <div className="sidebar-content">
        <div className="sidebar-section">
          <h3 className="sidebar-title">Table of Contents</h3>
          <nav className="sidebar-nav">
            <div id="tableOfContents" className="toc-content">
              {getTableOfContents()}
            </div>
          </nav>
        </div>
        
        <div className="sidebar-section">
          <h3 className="sidebar-title">Current Path</h3>
          <div className="path-breadcrumb">
            {getPathBreadcrumb()}
          </div>
        </div>
      </div>
    </aside>
  )
}
