'use client'
import React, { useState } from 'react'
import { PortableText } from '@portabletext/react'
import Image from 'next/image'
import { urlForImage } from '@/sanity/image'

// Code Block with Copy feature
const CodeBlock = ({ value }) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    if (!value?.code) return
    navigator.clipboard.writeText(value.code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="blog-code-container my-6 rounded-xl overflow-hidden border border-border/40 bg-[#090d16] shadow-2xl">
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#0e1422] border-b border-border/30 text-xs font-mono text-text-muted">
        <span className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500/80 inline-block"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block"></span>
          <span className="ml-2 font-semibold text-text-secondary">{value.filename || value.language || 'code'}</span>
        </span>
        <button
          onClick={handleCopy}
          className="px-2.5 py-1 rounded bg-white/5 hover:bg-white/10 text-text-secondary hover:text-white transition-all text-xs flex items-center gap-1.5 cursor-pointer"
        >
          {copied ? (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
              <span>Copied!</span>
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-sm leading-relaxed font-mono text-emerald-400 bg-black/40">
        <code>{value.code}</code>
      </pre>
    </div>
  )
}

// Callout Box Component
const Callout = ({ value }) => {
  const types = {
    info: { border: 'border-cyan-500/40', bg: 'bg-cyan-950/20', text: 'text-cyan-400', icon: 'ℹ️' },
    tip: { border: 'border-emerald-500/40', bg: 'bg-emerald-950/20', text: 'text-emerald-400', icon: '💡' },
    warning: { border: 'border-amber-500/40', bg: 'bg-amber-950/20', text: 'text-amber-400', icon: '⚠️' },
    highlight: { border: 'border-purple-500/40', bg: 'bg-purple-950/20', text: 'text-purple-400', icon: '✨' },
  }
  const config = types[value?.type] || types.info

  return (
    <div className={`my-6 p-4 rounded-xl border ${config.border} ${config.bg} backdrop-blur-sm`}>
      <div className="flex items-start gap-3">
        <span className="text-xl">{config.icon}</span>
        <div>
          {value?.title && <h4 className={`font-semibold text-sm mb-1 ${config.text}`}>{value.title}</h4>}
          <p className="text-sm text-text-secondary leading-relaxed">{value?.content}</p>
        </div>
      </div>
    </div>
  )
}

// PortableText Components configuration
export const components = {
  types: {
    image: ({ value }) => {
      const imgUrl = urlForImage(value)?.width(1200).url()
      if (!imgUrl) return null
      return (
        <figure className="my-8 rounded-2xl overflow-hidden border border-border/30 bg-card/40">
          <div className="relative w-full h-[320px] md:h-[450px]">
            <Image
              src={imgUrl}
              alt={value.alt || 'Blog illustration'}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 800px"
            />
          </div>
          {value.caption && (
            <figcaption className="text-center text-xs text-text-muted py-2.5 px-4 italic bg-surface/40 border-t border-border/20">
              {value.caption}
            </figcaption>
          )}
        </figure>
      )
    },
    codeBlock: CodeBlock,
    callout: Callout,
  },
  block: {
    h1: ({ children }) => <h1 className="text-3xl font-bold text-text-primary mt-10 mb-4 tracking-tight">{children}</h1>,
    h2: ({ children }) => <h2 className="text-2xl font-bold text-text-primary mt-8 mb-4 tracking-tight border-b border-border/20 pb-2">{children}</h2>,
    h3: ({ children }) => <h3 className="text-xl font-semibold text-text-primary mt-6 mb-3">{children}</h3>,
    h4: ({ children }) => <h4 className="text-lg font-semibold text-text-primary mt-4 mb-2">{children}</h4>,
    normal: ({ children }) => <p className="text-base text-text-secondary leading-relaxed mb-5">{children}</p>,
    blockquote: ({ children }) => (
      <blockquote className="my-6 border-l-4 border-[var(--red)] bg-white/[0.02] pl-4 py-2 italic text-text-primary rounded-r-lg">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="list-disc list-inside space-y-2 mb-6 text-text-secondary">{children}</ul>,
    number: ({ children }) => <ol className="list-decimal list-inside space-y-2 mb-6 text-text-secondary">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => <li className="leading-relaxed">{children}</li>,
    number: ({ children }) => <li className="leading-relaxed">{children}</li>,
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold text-text-primary">{children}</strong>,
    em: ({ children }) => <em className="italic text-text-secondary">{children}</em>,
    code: ({ children }) => (
      <code className="px-1.5 py-0.5 rounded bg-white/10 text-cyan-400 text-sm font-mono border border-cyan-500/20">
        {children}
      </code>
    ),
    link: ({ value, children }) => {
      const target = (value?.href || '').startsWith('http') ? '_blank' : undefined
      return (
        <a
          href={value?.href}
          target={target}
          rel={target === '_blank' ? 'noindex nofollow noreferrer' : undefined}
          className="text-cyan-400 hover:text-cyan-300 underline decoration-cyan-500/40 hover:decoration-cyan-400 transition-colors"
        >
          {children}
        </a>
      )
    },
  },
}

export default function PortableTextRenderer({ value }) {
  if (!value) return null
  return (
    <div className="blog-content-body">
      <PortableText value={value} components={components} />
    </div>
  )
}
