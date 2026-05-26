import React from 'react'

type Node = any

function renderNode(node: Node, key: number): React.ReactNode {
  if (!node) return null
  if (node.type === 'text') {
    let el: React.ReactNode = node.text
    if (node.format & 1) el = <strong key={key}>{el}</strong>
    if (node.format & 2) el = <em key={key}>{el}</em>
    return <React.Fragment key={key}>{el}</React.Fragment>
  }
  const children = (node.children || []).map((c: Node, i: number) => renderNode(c, i))
  switch (node.type) {
    case 'heading': {
      const Tag = (node.tag || 'h3') as keyof React.JSX.IntrinsicElements
      return React.createElement(Tag, { key, className: 'font-serif text-brand-navy mt-6 mb-3' }, children)
    }
    case 'paragraph':
      return <p key={key} className="text-brand-muted leading-relaxed mb-4">{children}</p>
    case 'list':
      return node.tag === 'ol'
        ? <ol key={key} className="list-decimal pl-6 mb-4 text-brand-muted">{children}</ol>
        : <ul key={key} className="list-disc pl-6 mb-4 text-brand-muted">{children}</ul>
    case 'listitem':
      return <li key={key} className="mb-1">{children}</li>
    case 'link':
      return <a key={key} href={node.fields?.url} className="text-brand-gold hover:underline">{children}</a>
    case 'root':
      return <>{children}</>
    default:
      return <>{children}</>
  }
}

export function RichText({ content }: { content: any }) {
  if (!content) return null
  const root = content.root || content
  return <div>{renderNode(root, 0)}</div>
}
