import type { Product } from "./index";

export interface ProductsListResponse {
  data: Product[];
  total: number;
  page: number;
  totalPages: number;
  hasMore: boolean;
}
