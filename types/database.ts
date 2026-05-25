export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          icon: string | null;
          parent_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          icon?: string | null;
          parent_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          icon?: string | null;
          parent_id?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      products: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          price: number;
          original_price: number | null;
          min_order: number;
          unit: string;
          stock: number;
          sold: number;
          rating: number;
          reviews_count: number;
          category_id: string | null;
          subcategory: string | null;
          seller_name: string | null;
          seller_country: string | null;
          seller_flag: string | null;
          free_shipping: boolean;
          is_featured: boolean;
          badge: "Hot" | "New" | "Sale" | "Verified" | null;
          images: string[];
          specs: Json;
          tags: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          price: number;
          original_price?: number | null;
          min_order?: number;
          unit?: string;
          stock?: number;
          sold?: number;
          rating?: number;
          reviews_count?: number;
          category_id?: string | null;
          subcategory?: string | null;
          seller_name?: string | null;
          seller_country?: string | null;
          seller_flag?: string | null;
          free_shipping?: boolean;
          is_featured?: boolean;
          badge?: "Hot" | "New" | "Sale" | "Verified" | null;
          images?: string[];
          specs?: Json;
          tags?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["products"]["Insert"]>;
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey";
            columns: ["category_id"];
            isOneToOne: false;
            referencedRelation: "categories";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          email: string;
          avatar_url: string | null;
          role: "user" | "admin";
          phone: string | null;
          address: string | null;
          city: string | null;
          country: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          email: string;
          avatar_url?: string | null;
          role?: "user" | "admin";
          phone?: string | null;
          address?: string | null;
          city?: string | null;
          country?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
        Relationships: [];
      };
      cart_items: {
        Row: {
          id: string;
          session_id: string;
          user_id: string | null;
          product_id: string;
          quantity: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          session_id?: string;
          user_id?: string | null;
          product_id: string;
          quantity?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          session_id?: string;
          user_id?: string | null;
          product_id?: string;
          quantity?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "cart_items_product_id_fkey";
            columns: ["product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

export type CategoryRow = Database["public"]["Tables"]["categories"]["Row"];
export type ProductRow = Database["public"]["Tables"]["products"]["Row"];
export type ProductInsert = Database["public"]["Tables"]["products"]["Insert"];

export type ProductRowWithCategory = ProductRow & {
  categories: Pick<CategoryRow, "name" | "slug"> | null;
};
