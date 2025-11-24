import { useEffect, useMemo, useState } from 'react'
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
  const hasChildren = !!node.children && node.children.length > 0
  const isActive = activeSlug === node.slug

  const containsActive = useMemo(() => {
    if (!activeSlug) return false
    const walk = (current: CategoryNode): boolean => {
      if (current.slug === activeSlug) return true
      if (!current.children) return false
      return current.children.some((c) => walk(c))
    }
    return walk(node)
  }, [activeSlug, node])

  const [open, setOpen] = useState(
    depth === 0 || containsActive,
  )

  useEffect(() => {
    if (containsActive) {
      setOpen(true)
    }
  }, [containsActive])

  return (
    <div>
      <div
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
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={
              open
                ? 'Свернуть подкатегории'
                : 'Развернуть подкатегории'
            }
            className="ml-2 flex h-7 w-7 items-center justify-center rounded-full border border-slate-300 bg-white text-[11px] text-slate-600 hover:border-laser-blue hover:text-laser-blue"
          >
            <span className="text-base leading-none">
              {open ? '▾' : '▸'}
            </span>
          </button>
        )}
      </div>
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




