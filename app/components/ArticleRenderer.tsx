'use client'

import { useState, useEffect } from 'react'

interface ArticleRendererProps {
  content: string
  className?: string
}

export default function ArticleRenderer({ content, className = '' }: ArticleRendererProps) {
  const [processedContent, setProcessedContent] = useState('')

  useEffect(() => {
    // Process the HTML content to improve rendering
    let processed = content

    // Add proper spacing around headings
    processed = processed.replace(/<h([1-6])>/g, '<br><h$1>')
    processed = processed.replace(/<\/h([1-6])>/g, '</h$1><br>')

    // Ensure proper paragraph spacing
    processed = processed.replace(/<p>/g, '<p>')
    processed = processed.replace(/<\/p>/g, '</p>')

    // Add proper list spacing
    processed = processed.replace(/<ul>/g, '<ul>')
    processed = processed.replace(/<ol>/g, '<ol>')
    processed = processed.replace(/<\/ul>/g, '</ul>')
    processed = processed.replace(/<\/ol>/g, '</ol>')

    // Ensure blockquotes have proper styling
    processed = processed.replace(/<blockquote>/g, '<blockquote>')
    processed = processed.replace(/<\/blockquote>/g, '</blockquote>')

    // Add proper code block handling
    processed = processed.replace(/<pre>/g, '<pre>')
    processed = processed.replace(/<\/pre>/g, '</pre>')

    // Ensure tables are responsive
    processed = processed.replace(/<table>/g, '<div class="table-wrapper"><table>')
    processed = processed.replace(/<\/table>/g, '</table></div>')

    // Add proper link handling
    processed = processed.replace(/<a href="([^"]*)"([^>]*)>/g, '<a href="$1"$2 target="_blank" rel="noopener noreferrer">')

    // Enhance image handling
    processed = processed.replace(/<img([^>]*)>/g, (match, attrs) => {
      // Add responsive classes and styling to images
      if (!attrs.includes('style=')) {
        return `<img${attrs} style="max-width: 100%; height: auto; border-radius: 8px; margin: 16px 0; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">`
      }
      return match
    })

    // Clean up extra line breaks
    processed = processed.replace(/\n\s*\n/g, '\n')
    processed = processed.replace(/<br><br>/g, '<br>')

    setProcessedContent(processed)
  }, [content])

  return (
    <div 
      className={`article-body ${className}`}
      dangerouslySetInnerHTML={{ __html: processedContent }}
    />
  )
}
