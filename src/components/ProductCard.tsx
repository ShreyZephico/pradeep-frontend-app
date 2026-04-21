import Image from "next/image";
import type { Product } from "@/types/product";

type ProductCardProps = {
  product: Product;
  onCustomize: (product: Product) => void;
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
};

export default function ProductCard({ product, onCustomize }: ProductCardProps) {
  return (
    <article className="group overflow-hidden rounded-[2rem] border border-[#e9d7bd] bg-[#fffdf8] shadow-[0_18px_50px_rgba(70,45,21,0.08)] transition duration-300 hover:-translate-y-1.5 hover:border-[#d6a850] hover:shadow-[0_28px_70px_rgba(70,45,21,0.16)]">
      <div className="relative flex h-60 items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_50%_30%,#fff7df_0%,#fbf4ea_48%,#f4e7d7_100%)] p-6">
        <Image
          src={product.image}
          alt={product.name}
          width={260}
          height={220}
          className="relative max-h-48 w-auto object-contain drop-shadow-[0_18px_18px_rgba(78,48,20,0.12)] transition duration-500 group-hover:scale-110 group-hover:rotate-[-2deg]"
        />
      </div>

      <div className="space-y-3 p-4">
        <div>
          <div className="flex items-baseline gap-2">
            <p className="text-lg font-black text-[#2f1c12]">
              {formatPrice(product.price)}
            </p>

            {product.compareAtPrice > product.price ? (
              <p className="text-sm font-semibold text-[#b39d86] line-through">
                {formatPrice(product.compareAtPrice)}
              </p>
            ) : null}
          </div>

          <button
            type="button"
            className="mt-1 text-sm font-bold text-[#b47723] transition hover:text-[#6e3d18]"
          >
            Check Delivery Date
          </button>
        </div>

        <div>
          <h3 className="line-clamp-1 text-sm font-black text-[#4b3527]">
            {product.name}
          </h3>

          <p className="mt-1 text-xs font-medium text-[#9d8a76]">
            {product.description}
          </p>
        </div>

        <button
          type="button"
          onClick={() => onCustomize(product)}
          className="w-full rounded-full border border-[#d8bd8a] bg-[#fffaf2] px-4 py-2 text-sm font-black text-[#3c2415] transition hover:border-[#9F2B68] hover:bg-[#9F2B68] hover:text-[#f7d58b]"
        >
          {product.customizable ? "Customize" : "View Details"}
        </button>
      </div>
    </article>
  );
}
