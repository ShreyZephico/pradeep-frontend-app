import { useState } from "react";
import Image from "next/image";
import type { Product } from "@/types/product";

type ProductModalProps = {
  product: Product | null;
  open: boolean;
  onClose: () => void;
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
};

const normalize = (value: string) => value.trim().toLowerCase();

export default function ProductModal({
  product,
  open,
  onClose,
}: ProductModalProps) {
  if (!open || !product) {
    return null;
  }

  return (
    <ProductModalContent key={product.id} product={product} onClose={onClose} />
  );
}

type ProductModalContentProps = {
  product: Product;
  onClose: () => void;
};

function ProductModalContent({ product, onClose }: ProductModalContentProps) {
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");
  const [selectedMetal, setSelectedMetal] = useState(
    product.metalOptions?.[0]?.label ?? ""
  );
  const [selectedCarat, setSelectedCarat] = useState(
    product.caratOptions?.[0]?.label ?? ""
  );
  const [selectedQuality, setSelectedQuality] = useState(
    product.diamondQualities?.[0]?.label ?? ""
  );
  const [selectedSize, setSelectedSize] = useState(
    product.sizeOptions?.[0]?.size ?? ""
  );
  const hasMetalOptions = Boolean(product.metalOptions?.length);
  const hasCaratOptions = Boolean(product.caratOptions?.length);
  const hasDiamondOptions = Boolean(product.diamondQualities?.length);
  const hasSizeOptions = Boolean(product.sizeOptions?.length);
  const selectedMetalOption = product.metalOptions?.find(
    (option) => option.label === selectedMetal
  );
  const selectedCaratOption = product.caratOptions?.find(
    (option) => option.label === selectedCarat
  );
  const selectedQualityOption = product.diamondQualities?.find(
    (option) => option.label === selectedQuality
  );
  const selectedSizeOption = product.sizeOptions?.find(
    (option) => option.size === selectedSize
  );
  const selectedVariant = product.variants?.find((variant) => {
    const selectedValues = [
      selectedMetal,
      selectedCarat,
      selectedQuality,
      selectedSize,
    ]
      .filter(Boolean)
      .map(normalize);
    const variantValues = variant.selectedOptions.map((option) =>
      normalize(option.value)
    );

    return selectedValues.every((value) => variantValues.includes(value));
  });
  const selectedVariantId = selectedVariant?.id ?? product.variantId;
  const estimatedPrice =
    (selectedVariant?.price ?? product.price) +
    (selectedMetalOption?.priceAdjustment ?? 0) +
    (selectedCaratOption?.priceAdjustment ?? 0) +
    (selectedQualityOption?.priceAdjustment ?? 0) +
    (selectedSizeOption?.priceAdjustment ?? 0);
  const selectedImage = selectedVariant?.image ?? product.image;

  const handleCheckout = async () => {
    if (!selectedVariantId) {
      setCheckoutError("Add this product in Shopify before taking payment.");
      return;
    }

    setCheckoutError("");
    setIsCheckingOut(true);

    try {
      const attributes = product.customizable
        ? [
            { key: "Metal", value: selectedMetal },
            { key: "Carat", value: selectedCarat },
            { key: "Diamond Quality", value: selectedQuality },
            { key: "Ring Size", value: selectedSize },
            { key: "Design", value: product.name },
            { key: "Estimated Custom Price", value: formatPrice(estimatedPrice) },
          ]
        : [];
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          variantId: selectedVariantId,
          attributes,
          productName: product.name,
          customPrice: estimatedPrice,
          useDraftOrder: product.customizable,
        }),
      });
      const data = await response.json();

      if (!response.ok || !data.checkoutUrl) {
        throw new Error(data.error ?? "Unable to start checkout.");
      }

      window.location.href = data.checkoutUrl;
    } catch (error) {
      setCheckoutError(
        error instanceof Error ? error.message : "Unable to start checkout."
      );
      setIsCheckingOut(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2f1c12]/60 px-4 py-6 backdrop-blur-sm">
      <div className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-[2rem] border border-[#eadcc8] bg-[#fffaf2] shadow-[0_30px_100px_rgba(47,28,18,0.38)]">
        <div className="flex items-start justify-between border-b border-[#eadcc8] bg-[#2f1c12] px-7 py-5">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#d8bd8a]">
              Estimated price
            </p>
            <div className="mt-1 flex items-baseline gap-2">
              <p className="text-xl font-black text-[#f7d58b]">
                {formatPrice(estimatedPrice)}
              </p>
              {product.compareAtPrice > estimatedPrice ? (
                <p className="text-sm font-semibold text-[#bda98f] line-through">
                  {formatPrice(product.compareAtPrice)}
                </p>
              ) : null}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close customisation modal"
            className="rounded-full p-2 text-[#f7d58b] transition hover:bg-white/10"
          >
            <span className="block text-2xl leading-none">x</span>
          </button>
        </div>

        <div className="space-y-8 overflow-y-auto px-7 py-6">
          <section className="grid gap-5 rounded-[1.5rem] border border-[#eadcc8] bg-white/65 p-4 sm:grid-cols-[180px_1fr]">
            <div className="flex h-44 items-center justify-center rounded-[1.25rem] bg-[#fbf4ea]">
              <Image
                src={selectedImage}
                alt={product.name}
                width={220}
                height={180}
                className="max-h-36 w-auto object-contain drop-shadow-[0_14px_18px_rgba(78,48,20,0.12)]"
              />
            </div>

            <div className="flex flex-col justify-center">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#b47723]">
                Selected Design
              </p>
              <h3 className="mt-2 text-2xl font-black tracking-[-0.03em] text-[#2f1c12]">
                {product.name}
              </h3>
              <p className="mt-3 max-w-md text-sm font-medium leading-6 text-[#765f4a]">
                {product.description}
              </p>
              {product.customizable ? (
                <p className="mt-3 rounded-2xl bg-[#fff7df] px-4 py-3 text-sm font-bold text-[#7a4a20]">
                  {/* Custom estimate updates as you select metal, carat, diamond
                  quality, and size. */}
                </p>
              ) : null}
            </div>
          </section>

          {hasMetalOptions ? (
          <section>
            <h3 className="text-sm font-black text-[#4a2b17]">
              {product.metalOptionName ?? "Choice of Metal"}
            </h3>

            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {product.metalOptions?.map((option) => {
                const isSelected = selectedMetal === option.label;

                return (
                  <button
                    key={option.label}
                    type="button"
                    onClick={() => setSelectedMetal(option.label)}
                    className={`rounded-2xl border px-4 py-3 text-left transition ${
                      isSelected
                        ? "border-[#2f1c12] bg-[#f7d58b] text-[#2f1c12]"
                        : "border-[#eadcc8] bg-white/70 text-[#765f4a] hover:border-[#d6a850]"
                    }`}
                  >
                    <span className="block text-sm font-bold">
                      {option.label}
                    </span>
                    {option.note ? (
                      <span className="mt-2 block rounded-lg bg-white/75 px-3 py-1 text-center text-xs font-bold text-[#765f4a]">
                        {option.note}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </section>
          ) : null}

          {hasCaratOptions ? (
          <section>
            <h3 className="text-sm font-black text-[#4a2b17]">
              {product.caratOptionName ?? "Select Carat"}
            </h3>

            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {product.caratOptions?.map((option) => {
                const isSelected = selectedCarat === option.label;

                return (
                  <button
                    key={option.label}
                    type="button"
                    onClick={() => setSelectedCarat(option.label)}
                    className={`rounded-2xl border px-4 py-3 text-left transition ${
                      isSelected
                        ? "border-[#2f1c12] bg-[#f7d58b] text-[#2f1c12]"
                        : "border-[#eadcc8] bg-white/70 text-[#765f4a] hover:border-[#d6a850]"
                    }`}
                  >
                    <span className="block text-sm font-bold">
                      {option.label}
                    </span>
                    {option.note ? (
                      <span className="mt-2 block rounded-lg bg-white/75 px-3 py-1 text-center text-xs font-bold text-[#765f4a]">
                        {option.note}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </section>
          ) : null}

          {hasDiamondOptions ? (
          <section>
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-sm font-black text-[#4a2b17]">
                {product.diamondOptionName ?? "Diamond Quality"}
              </h3>
              <button
                type="button"
                className="text-xs font-black uppercase tracking-wide text-[#b47723]"
              >
                Diamond Guide
              </button>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {product.diamondQualities?.map((option) => {
                const isSelected = selectedQuality === option.label;

                return (
                  <button
                    key={option.label}
                    type="button"
                    onClick={() => setSelectedQuality(option.label)}
                    className={`rounded-2xl border px-4 py-3 text-left transition ${
                      isSelected
                        ? "border-[#2f1c12] bg-[#f7d58b] text-[#2f1c12]"
                        : "border-[#eadcc8] bg-white/70 text-[#765f4a] hover:border-[#d6a850]"
                    }`}
                  >
                    <span className="block text-sm font-bold">
                      {option.label}
                    </span>
                    {option.note ? (
                      <span className="mt-2 block rounded-lg bg-white/75 px-3 py-1 text-center text-xs font-bold text-[#765f4a]">
                        {option.note}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </section>
          ) : null}

          {hasSizeOptions ? (
          <section>
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-sm font-black text-[#4a2b17]">
                {product.sizeOptionName ?? "Select Size"}
              </h3>
              <button
                type="button"
                className="text-xs font-black uppercase tracking-wide text-[#b47723]"
              >
                Size Guide
              </button>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
              {product.sizeOptions?.map((option) => {
                const isSelected = selectedSize === option.size;

                return (
                  <button
                    key={option.size}
                    type="button"
                    onClick={() => setSelectedSize(option.size)}
                    className={`rounded-2xl border px-3 py-3 text-center transition ${
                      isSelected
                        ? "border-[#2f1c12] bg-[#f7d58b] text-[#2f1c12]"
                        : "border-[#eadcc8] bg-white/70 text-[#765f4a] hover:border-[#d6a850]"
                    }`}
                  >
                    <span className="block text-base font-bold">
                      {option.size}
                    </span>
                    {option.mm ? (
                      <span className="block text-xs font-semibold">
                        {option.mm}
                      </span>
                    ) : null}
                    {option.note ? (
                      <span className="mt-2 block rounded-lg bg-white/75 px-2 py-1 text-[11px] font-bold text-[#765f4a]">
                        {option.note}
                      </span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </section>
          ) : null}
        </div>

        <div className="border-t border-[#eadcc8] bg-[#fffaf2] p-4">
          {checkoutError ? (
            <p className="mb-3 rounded-2xl bg-[#fff1e8] px-4 py-3 text-sm font-bold text-[#8a3c1c]">
              {checkoutError}
            </p>
          ) : null}

          <div>
            <button
              type="button"
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className="w-full rounded-full bg-[#2f1c12] px-6 py-4 text-sm font-black uppercase tracking-[0.14em] text-[#f7d58b] transition hover:bg-[#4a2b17] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isCheckingOut ? "Opening Checkout..." : "Proceed To Payment"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
