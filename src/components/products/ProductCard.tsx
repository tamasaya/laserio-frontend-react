import { Link } from "react-router-dom";
import type { ProductSummary } from "../../lib/api";
import { normalizeImageUrl } from "../../lib/api";

type ProductCardProps = {
  product: ProductSummary;
};

export function ProductCard({ product }: ProductCardProps) {
  const imageUrl = normalizeImageUrl(
    product.primary_image_url ?? product.image ?? null,
  );

  return (
    <div className="flex h-full flex-col rounded-2xl bg-white shadow-card ring-1 ring-slate-200">
      <Link
        to={`/products/${encodeURIComponent(product.slug)}`}
        className="flex flex-1 flex-col"
      >
        <div className="flex h-44 items-center justify-center overflow-hidden rounded-t-2xl bg-slate-50">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={product.name}
              className="h-full w-full object-contain"
              loading="lazy"
            />
          ) : (
            <div className="text-xs text-slate-400">Нет изображения</div>
          )}
        </div>
        <div className="flex flex-1 flex-col px-4 py-3">
          <h3 className="mb-1 line-clamp-2 text-sm font-semibold text-slate-800">
            {product.name}
          </h3>
        </div>
      </Link>
    </div>
  );
}
