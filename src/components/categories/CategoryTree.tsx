import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import type { CategoryNode } from '../../lib/api'

type CategoryTreeProps = {
  tree: CategoryNode[]
}

export function CategoryTree({ tree }: CategoryTreeProps) {
  const location = useLocation()
  const activeSlug = location.pathname.startsWith('/catalog/')
    ? location.pathname.replace('/catalog/', '')
    : null

  return (
    <div className="rounded-2xl bg-white/90 p-3 shadow-card ring-1 ring-slate-200">
      <div className="mb-3 flex items-center justify-between px-1 text-xs font-medium text-slate-500">
        <span>Категории</span>
      </div>
      <div className="space-y-1 text-xs">
        {tree.map((node) => (
          <TreeNode
            key={node.id}
            node={node}
            activeSlug={activeSlug}
            depth={0}
          />
        ))}
      </div>
    </div>
  )
}

type TreeNodeProps = {
  node: CategoryNode
  activeSlug: string | null
  depth: number
}

function TreeNode({ node, activeSlug, depth }: TreeNodeProps) {
  const [open, setOpen] = useState(
    activeSlug ? activeSlug.startsWith(node.slug) : depth === 0,
  )
  const isActive = activeSlug === node.slug

  const hasChildren = !!node.children && node.children.length > 0

  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left transition-colors ${
          isActive
            ? 'bg-laser-accent-soft text-laser-blue'
            : 'hover:bg-slate-100 text-slate-700'
        }`}
      >
        <Link
          to={`/catalog/${encodeURIComponent(node.slug)}`}
          className="flex-1 truncate text-xs"
        >
          {node.name}
        </Link>
        {hasChildren && (
          <span className="ml-2 text-[10px] text-slate-500">
            {open ? '▾' : '▸'}
          </span>
        )}
      </button>
      {hasChildren && open && (
        <div className="mt-1 space-y-1 pl-3">
          {node.children!.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              activeSlug={activeSlug}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}




