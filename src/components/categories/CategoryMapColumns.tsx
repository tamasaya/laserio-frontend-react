import { Link } from 'react-router-dom'
import type { CategoryNode } from '../../lib/api'

type CategoryMapColumnsProps = {
  tree: CategoryNode[]
}

export function CategoryMapColumns({ tree }: CategoryMapColumnsProps) {
  const columns: CategoryNode[][] = [[], [], []]
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
            <ColumnNode key={node.id} node={node} />
          ))}
        </div>
      ))}
    </div>
  )
}

type ColumnNodeProps = {
  node: CategoryNode
}

function ColumnNode({ node }: ColumnNodeProps) {
  return (
    <div>
      <Link
        to={`/catalog/${encodeURIComponent(node.slug)}`}
        className="mb-1 block text-sm font-semibold text-slate-800 hover:text-laser-accent"
      >
        {node.name}
      </Link>
      {node.children && node.children.length > 0 && (
        <ul className="space-y-1 text-xs text-slate-600">
          {node.children.map((child) => (
            <li key={child.id}>
              <Link
                to={`/catalog/${encodeURIComponent(child.slug)}`}
                className="hover:text-laser-accent"
              >
                {child.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}


