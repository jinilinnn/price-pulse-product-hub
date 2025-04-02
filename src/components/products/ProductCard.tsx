
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Product } from '@/types';
import { formatDistanceToNow } from 'date-fns';
import { LineChart, Line, Tooltip, ResponsiveContainer } from 'recharts';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(`/product/${product.id}`);
  };
  
  const formattedDate = formatDistanceToNow(new Date(product.updatedAt), { addSuffix: true });
  
  // Format price history data for the chart
  const chartData = product.priceHistory.map(point => ({
    date: point.date,
    price: point.price
  }));
  
  return (
    <Card 
      className="h-full cursor-pointer hover:shadow-md transition-shadow duration-200"
      onClick={handleClick}
    >
      <div className="aspect-square overflow-hidden">
        <img 
          src={product.imageUrl} 
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-200 hover:scale-105"
        />
      </div>
      <CardContent className="pt-4">
        <div className="mb-2">
          <span className="inline-block px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full">
            {product.category}
          </span>
        </div>
        <h3 className="text-lg font-semibold">{product.name}</h3>
        <div className="mt-1 text-xl font-bold text-blue-600">
          ${product.currentPrice.toFixed(2)}
        </div>
        <p className="mt-2 text-sm text-gray-500 line-clamp-2">
          {product.description}
        </p>
        <div className="mt-3 h-20">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <Tooltip 
                formatter={(value) => [`$${Number(value).toFixed(2)}`, 'Price']}
                labelFormatter={(label) => new Date(label).toLocaleDateString()}
              />
              <Line 
                type="monotone" 
                dataKey="price" 
                stroke="#3B82F6" 
                strokeWidth={2} 
                dot={false} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
      <CardFooter className="pt-0 border-t border-gray-100">
        <p className="text-xs text-gray-500">
          Updated {formattedDate}
        </p>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
