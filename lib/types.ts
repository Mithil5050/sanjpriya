export interface Product {
  id: number;
  name: string;
  slug: string;
  category: 'kurtis' | 'blouses' | 'dresses';
  price: number;
  originalPrice?: number;
  description: string;
  fabric: string;
  care: string;
  sizes: string[];
  colors: string[];
  images: string[];
  badge?: string;
  inStock: boolean;
  featured: boolean;
  rating: number;
  reviewCount: number;
  createdAt: string;
}

export interface CartItem {
  productId: number;
  name: string;
  price: number;
  image: string;
  size: string;
  color: string;
  quantity: number;
  slug: string;
}

export interface Order {
  id: number;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  paymentMethod: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  productCount: number;
}

export interface Review {
  id: number;
  productId: number;
  customerName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface NewsletterSubscriber {
  id: number;
  email: string;
  createdAt: string;
}

export interface ProductFilters {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sizes?: string[];
  colors?: string[];
  sort?: 'price_asc' | 'price_desc' | 'newest' | 'popular';
  search?: string;
  page?: number;
  limit?: number;
}
