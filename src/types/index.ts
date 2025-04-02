
export interface User {
  id: string;
  email: string;
  name: string;
}

export interface PricePoint {
  date: string;
  price: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  currentPrice: number;
  priceHistory: PricePoint[];
  imageUrl: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}
