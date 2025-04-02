
import React from 'react';
import PageContainer from '@/components/layout/PageContainer';
import ProductForm from '@/components/products/ProductForm';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/sonner';
import { Product } from '@/types';

const AddProduct: React.FC = () => {
  const navigate = useNavigate();
  
  const handleSubmit = (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    // In a real app, we would call an API here
    // For demo purposes, we'll just show a success message
    toast.success('Product added successfully');
  };
  
  return (
    <PageContainer>
      <div className="py-6">
        <Button
          variant="ghost"
          size="sm"
          className="mb-6"
          onClick={() => navigate('/dashboard')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Button>
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Add New Product</h1>
          <p className="text-gray-600 mt-1">
            Create a new product and track its price history
          </p>
        </div>
        
        <ProductForm onSubmit={handleSubmit} />
      </div>
    </PageContainer>
  );
};

export default AddProduct;
