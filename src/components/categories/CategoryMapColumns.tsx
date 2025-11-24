import { Link } from 'react-router-dom'
import type { CategoryNode } from '../../lib/api'

type CategoryMapColumnsProps = {
  tree: CategoryNode[]
}

export function CategoryMapColumns({ tree }: CategoryMapColumnsProps) {
  const columns: CategoryNode[][] = [[], [], []]

  // Раскладываем только корневые разделы по трем колонкам,
  // все вложенные уровни рисуем рекурсивно внутри своей колонки.
  tree.forEach((node, index) => {
    columns[index % 3].push(node)
  })

  return (
    <div className="grid gap-6 md:grid-cols-3">
      {columns.map((col, colIndex) => (
        <div
          key={colIndex}
          className="space-y-3 rounded-2xl bg-white/90 p-4 shadow-card ring-1 ring-slate-200"
        >
          {col.map((node) => (
            <ColumnNode key={node.id} node={node} depth={0} />
          ))}
        </div>
      ))}
    </div>
  )
}

type ColumnNodeProps = {
  node: CategoryNode
  depth: number
}

function ColumnNode({ node, depth }: ColumnNodeProps) {
  const hasChildren = !!node.children && node.children.length > 0
  const isRoot = depth === 0

  return (
    <div className={isRoot ? 'mb-3' : 'mb-1'}>
      <Link
        to={`/catalog/${encodeURIComponent(node.slug)}`}
        className={
          isRoot
            ? 'mb-1 block text-sm font-semibold text-slate-800 hover:text-laser-accent'
            : 'block text-xs text-slate-700 hover:text-laser-accent'
        }
      >
        {node.name}
      </Link>
      {hasChildren && (
        <div
          className={
            isRoot
              ? 'mt-1 space-y-1 text-xs text-slate-600'
              : 'mt-1 space-y-1 border-l border-slate-200 pl-3 text-[11px] text-slate-600'
          }
        >
          {node.children!.map((child) => (
            <ColumnNode
              key={child.id}
              node={child}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}




