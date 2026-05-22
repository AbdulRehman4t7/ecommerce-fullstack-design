export interface Product {
  id: string;
  slug?: string;
  name: string;
  price: number;
  originalPrice?: number;
  minOrder: number;
  unit: string;
  image: string;
  images: string[];
  description: string;
  category: string;
  categorySlug?: string;
  subcategory: string;
  rating: number;
  reviews: number;
  sold: number;
  seller: string;
  sellerCountry: string;
  sellerFlag: string;
  badge?: "Hot" | "New" | "Sale" | "Verified";
  freeShipping: boolean;
  inStock: boolean;
  stock: number;
  specs: { key: string; value: string }[];
  tags: string[];
  isFeatured?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  subcategories: string[];
  productCount?: number;
}

export interface SupplierCountry {
  name: string;
  flag: string;
  flagImage?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selected: boolean;
}

export interface Review {
  id: number;
  name: string;
  country: string;
  flag: string;
  rating: number;
  date: string;
  comment: string;
}

export interface DealProduct extends Product {
  discount?: number;
}
