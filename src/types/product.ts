export type ProductOption = {
  label: string;
  note?: string;
  priceAdjustment?: number;
};

export type ProductSizeOption = {
  size: string;
  mm?: string;
  note?: string;
  priceAdjustment?: number;
};

export type ProductVariant = {
  id: string;
  image?: string;
  price: number;
  selectedOptions: {
    name: string;
    value: string;
  }[];
};

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice: number;
  image: string;
  variantId?: string;
  variants?: ProductVariant[];
  badge?: string;
  customizable: boolean;
  metalOptionName?: string;
  caratOptionName?: string;
  diamondOptionName?: string;
  sizeOptionName?: string;
  metalOptions?: ProductOption[];
  caratOptions?: ProductOption[];
  diamondQualities?: ProductOption[];
  sizeOptions?: ProductSizeOption[];
};
