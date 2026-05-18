export interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  minOrder: number;
  unit: string;
  image: string;
  images: string[];
  description: string;
  category: string;
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
}

export interface Category {
  name: string;
  icon: string;
  subcategories: string[];
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
