
export type Category = 'All' | 'Food' | 'Drinks' | 'Snack' | 'Dessert';

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  image: string;
  category: Category;
  stock: number;
  available: string; // 'TRUE' or 'FALSE'
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface Order {
  id: string;
  table: string;
  type: 'Dine In' | 'Take Away';
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  paymentMethod: 'Cash' | 'Debit' | 'QRIS';
  timestamp: string;
  cashReceived: number;
}

// Fix: Define and export NewProduct interface to resolve module import errors in apiService.ts and ProductForm.tsx
export interface NewProduct {
  id: string;
  name: string;
  category: Category;
  price: number;
  stock: number;
  stokType: string;
  available: boolean;
  description: string;
  imageBlob?: string;
  imageFileName?: string;
}
