import { CategoryMapColumns } from '../components/categories/CategoryMapColumns'
import { ErrorState, LoadingState } from '../components/common/States'
import { useCategoryTree } from '../lib/hooks'

export function CategoriesMapPage() {
  const { data, loading, error } = useCategoryTree()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-slate-900">
          Карта каталога
        </h1>
      </div>

      {loading && <LoadingState message="Загружаем структуру каталога..." />}
      {error && <ErrorState message={error} />}
      {data && !loading && !error && (
        <CategoryMapColumns tree={data} />
      )}
    </div>
  )
}





