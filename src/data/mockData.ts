
import { Product, User } from '@/types';

// Mock users
export const users: User[] = [
  {
    id: '1',
    email: 'demo@example.com',
    name: 'Demo User',
  },
];

// Mock products
export const products: Product[] = [
  {
    id: '1',
    name: 'Wireless Headphones',
    description: 'Premium noise-cancelling wireless headphones with 30-hour battery life.',
    currentPrice: 199.99,
    priceHistory: [
      { date: '2023-01-01', price: 249.99 },
      { date: '2023-02-15', price: 229.99 },
      { date: '2023-04-10', price: 199.99 },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    category: 'Electronics',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-04-10T00:00:00Z',
  },
  {
    id: '2',
    name: 'Smart Watch',
    description: 'Fitness tracker and smartwatch with heart rate monitoring and GPS.',
    currentPrice: 149.99,
    priceHistory: [
      { date: '2023-01-01', price: 179.99 },
      { date: '2023-03-15', price: 159.99 },
      { date: '2023-05-10', price: 149.99 },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    category: 'Electronics',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-05-10T00:00:00Z',
  },
  {
    id: '3',
    name: 'Ergonomic Office Chair',
    description: 'Adjustable office chair with lumbar support and breathable mesh back.',
    currentPrice: 249.99,
    priceHistory: [
      { date: '2023-01-01', price: 299.99 },
      { date: '2023-02-01', price: 279.99 },
      { date: '2023-04-15', price: 249.99 },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    category: 'Furniture',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-04-15T00:00:00Z',
  },
  {
    id: '4',
    name: 'Coffee Maker',
    description: 'Programmable coffee maker with thermal carafe and auto shut-off feature.',
    currentPrice: 79.99,
    priceHistory: [
      { date: '2023-01-01', price: 99.99 },
      { date: '2023-03-01', price: 89.99 },
      { date: '2023-05-01', price: 79.99 },
    ],
    imageUrl: 'https://images.unsplash.com/photo-1520970519539-8c57b34033a6?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3',
    category: 'Kitchen',
    createdAt: '2023-01-01T00:00:00Z',
    updatedAt: '2023-05-01T00:00:00Z',
  },
];
