import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import type { CategoryNode } from "../../lib/api";

type CategoryMapColumnsProps = {
  tree: CategoryNode[];
};

export function CategoryMapColumns({ tree }: CategoryMapColumnsProps) {
  const [activeRootId, setActiveRootId] = useState<number | null>(null);

  useEffect(() => {
    if (tree.length > 0 && activeRootId === null) {
      setActiveRootId(tree[0].id);
    }
  }, [tree, activeRootId]);

  const selectedRoot = useMemo(
    () => tree.find((node) => node.id === activeRootId) ?? null,
    [tree, activeRootId],
  );

  return (
    <div className="space-y-6">
      {/* Верхние badge родительских категорий */}
      <div className="flex flex-wrap gap-3">
        {tree.map((root) => {
          const isActive = root.id === activeRootId;

          return (
            <button
              key={root.id}
              type="button"
              onClick={() => setActiveRootId(root.id)}
              className={[
                "rounded-full border px-4 py-2 text-sm font-medium transition",
                isActive
                  ? "border-laser-accent bg-laser-accent text-white shadow-md"
                  : "border-slate-300 bg-white text-slate-700 hover:border-laser-accent hover:text-laser-accent",
              ].join(" ")}
            >
              {root.name}
            </button>
          );
        })}
      </div>

      {/* Контент только выбранной родительской категории */}
      {selectedRoot && (
        <div className="rounded-2xl bg-white/90 p-5 shadow-card ring-1 ring-slate-200">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">
                {selectedRoot.name}
              </h2>

              <Link
                to={`/catalog/${encodeURIComponent(selectedRoot.slug)}`}
                className="mt-1 inline-block text-sm text-laser-accent hover:underline"
              >
                Перейти в раздел
              </Link>
            </div>
          </div>

          {selectedRoot.children && selectedRoot.children.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {splitIntoColumns(selectedRoot.children, 3).map(
                (column, index) => (
                  <div key={index} className="space-y-3">
                    {column.map((node) => (
                      <TreeNode key={node.id} node={node} depth={0} />
                    ))}
                  </div>
                ),
              )}
            </div>
          ) : (
            <p className="text-sm text-slate-500">
              У этой категории пока нет подкатегорий.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function splitIntoColumns(items: CategoryNode[], columnsCount: number) {
  const columns: CategoryNode[][] = Array.from(
    { length: columnsCount },
    () => [],
  );

  items.forEach((item, index) => {
    columns[index % columnsCount].push(item);
  });

  return columns;
}

type TreeNodeProps = {
  node: CategoryNode;
  depth: number;
};

function TreeNode({ node, depth }: TreeNodeProps) {
  const hasChildren = !!node.children && node.children.length > 0;
  const isFirstLevel = depth === 0;

  return (
    <div className={isFirstLevel ? "mb-3" : "mb-1"}>
      <Link
        to={`/catalog/${encodeURIComponent(node.slug)}`}
        className={
          isFirstLevel
            ? "block text-sm font-semibold text-slate-800 hover:text-laser-accent"
            : "block text-xs text-slate-700 hover:text-laser-accent"
        }
      >
        {node.name}
      </Link>

      {hasChildren && (
        <div
          className={
            isFirstLevel
              ? "mt-2 space-y-1 text-xs text-slate-600"
              : "mt-1 space-y-1 border-l border-slate-200 pl-3 text-[11px] text-slate-600"
          }
        >
          {node.children!.map((child) => (
            <TreeNode key={child.id} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}
