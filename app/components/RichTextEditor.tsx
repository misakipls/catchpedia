'use client'

import { useState, useRef, useEffect } from 'react'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
}

export default function RichTextEditor({ 
  value, 
  onChange, 
  placeholder = "Write your article content here...", 
  className = '' 
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value
    }
  }, [value])

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML)
    }
  }

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value)
    editorRef.current?.focus()
    handleInput()
  }

  const insertLink = () => {
    const url = prompt('Enter URL:')
    if (url) {
      execCommand('createLink', url)
    }
  }

  const insertList = (ordered: boolean = false) => {
    execCommand(ordered ? 'insertOrderedList' : 'insertUnorderedList')
  }

  const insertQuote = () => {
    execCommand('formatBlock', 'blockquote')
  }

  const insertCode = () => {
    execCommand('formatBlock', 'pre')
  }

  const insertHeading = (level: number) => {
    execCommand('formatBlock', `h${level}`)
  }

  const insertHorizontalRule = () => {
    execCommand('insertHorizontalRule')
  }

  const insertImage = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          const img = document.createElement('img')
          img.src = e.target?.result as string
          img.style.maxWidth = '100%'
          img.style.height = 'auto'
          img.style.borderRadius = '8px'
          img.style.margin = '16px 0'
          img.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)'
          
          // Insert image at cursor position
          const selection = window.getSelection()
          if (selection && selection.rangeCount > 0) {
            const range = selection.getRangeAt(0)
            range.insertNode(img)
            range.setStartAfter(img)
            range.setEndAfter(img)
            selection.removeAllRanges()
            selection.addRange(range)
          } else {
            editorRef.current?.appendChild(img)
          }
          
          handleInput()
        }
        reader.readAsDataURL(file)
      }
    }
    input.click()
  }

  const ToolbarButton = ({ 
    onClick, 
    children, 
    title, 
    active = false 
  }: { 
    onClick: () => void
    children: React.ReactNode
    title: string
    active?: boolean
  }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`toolbar-btn ${active ? 'active' : ''}`}
    >
      {children}
    </button>
  )

  return (
    <div className={`rich-text-editor ${className} ${isFocused ? 'focused' : ''}`}>
      {/* Toolbar */}
      <div className="editor-toolbar">
        <div className="toolbar-group">
          <ToolbarButton onClick={() => execCommand('bold')} title="Bold">
            <strong>B</strong>
          </ToolbarButton>
          <ToolbarButton onClick={() => execCommand('italic')} title="Italic">
            <em>I</em>
          </ToolbarButton>
          <ToolbarButton onClick={() => execCommand('underline')} title="Underline">
            <u>U</u>
          </ToolbarButton>
        </div>

        <div className="toolbar-separator"></div>

        <div className="toolbar-group">
          <ToolbarButton onClick={() => insertHeading(1)} title="Heading 1">
            H1
          </ToolbarButton>
          <ToolbarButton onClick={() => insertHeading(2)} title="Heading 2">
            H2
          </ToolbarButton>
          <ToolbarButton onClick={() => insertHeading(3)} title="Heading 3">
            H3
          </ToolbarButton>
        </div>

        <div className="toolbar-separator"></div>

        <div className="toolbar-group">
          <ToolbarButton onClick={() => insertList(false)} title="Bullet List">
            <i className="fas fa-list-ul"></i>
          </ToolbarButton>
          <ToolbarButton onClick={() => insertList(true)} title="Numbered List">
            <i className="fas fa-list-ol"></i>
          </ToolbarButton>
        </div>

        <div className="toolbar-separator"></div>

        <div className="toolbar-group">
          <ToolbarButton onClick={insertImage} title="Insert Image">
            <i className="fas fa-image"></i>
          </ToolbarButton>
          <ToolbarButton onClick={insertLink} title="Insert Link">
            <i className="fas fa-link"></i>
          </ToolbarButton>
          <ToolbarButton onClick={insertQuote} title="Quote">
            <i className="fas fa-quote-left"></i>
          </ToolbarButton>
          <ToolbarButton onClick={insertCode} title="Code Block">
            <i className="fas fa-code"></i>
          </ToolbarButton>
          <ToolbarButton onClick={insertHorizontalRule} title="Horizontal Line">
            <i className="fas fa-minus"></i>
          </ToolbarButton>
        </div>

        <div className="toolbar-separator"></div>

        <div className="toolbar-group">
          <ToolbarButton onClick={() => execCommand('undo')} title="Undo">
            <i className="fas fa-undo"></i>
          </ToolbarButton>
          <ToolbarButton onClick={() => execCommand('redo')} title="Redo">
            <i className="fas fa-redo"></i>
          </ToolbarButton>
        </div>
      </div>

      {/* Editor */}
      <div
        ref={editorRef}
        className="editor-content"
        contentEditable
        onInput={handleInput}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        data-placeholder={placeholder}
        suppressContentEditableWarning={true}
      />
    </div>
  )
}
