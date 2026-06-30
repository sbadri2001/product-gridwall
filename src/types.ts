export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  discountPrice: number | null;
  rating: number;
  reviewsCount: number;
  image: string;
  images: string[];
  description: string;
  specs: Record<string, string>;
  tagline: string;
  inStock: boolean;
  isFeatured: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface FiltersState {
  search: string;
  category: string | null;
  minPrice: number;
  maxPrice: number;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'rating';
}
