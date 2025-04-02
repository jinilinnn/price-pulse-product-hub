
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Product } from '@/types';
import PageContainer from '@/components/layout/PageContainer';
import PriceHistoryChart from '@/components/products/PriceHistoryChart';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { supabase } from '@/integrations/supabase/client';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (id) {
      fetchProductDetails(id);
    }
  }, [id]);
  
  const fetchProductDetails = async (productId: string) => {
    try {
      setIsLoading(true);
      
      // Get product basic info
      const { data: productData, error: productError } = await supabase
        .from('product')
        .select('*')
        .eq('prodcode', productId)
        .single();
      
      if (productError) {
        console.error('Error fetching product:', productError);
        toast.error('Failed to load product details');
        setIsLoading(false);
        return;
      }
      
      // Get the latest price for this product
      const { data: latestPriceData, error: latestPriceError } = await supabase
        .from('pricehist')
        .select('*')
        .eq('prodcode', productId)
        .order('effdate', { ascending: false })
        .limit(1);
      
      if (latestPriceError) {
        console.error('Error fetching latest price:', latestPriceError);
      }
      
      // Get all price history for this product
      const { data: priceHistoryData, error: priceHistoryError } = await supabase
        .from('pricehist')
        .select('*')
        .eq('prodcode', productId)
        .order('effdate', { ascending: true });
      
      if (priceHistoryError) {
        console.error('Error fetching price history:', priceHistoryError);
      }
      
      // Format price history data
      const priceHistory = priceHistoryData?.map(item => ({
        date: item.effdate,
        price: parseFloat(item.unitprice) || 0
      })) || [];
      
      // Calculate current price
      const currentPrice = latestPriceData && latestPriceData.length > 0 
        ? parseFloat(latestPriceData[0].unitprice) || 0
        : 0;
      
      // Create complete product object with proper type conversion
      const completeProduct: Product = {
        id: productData.prodcode,
        name: productData.prodcode,
        description: productData.description || 'No description available',
        currentPrice: currentPrice,
        priceHistory: priceHistory,
        imageUrl: `https://placehold.co/400x400/e6e6e6/black?text=${encodeURIComponent(productData.prodcode)}`,
        category: productData.unit || 'Uncategorized',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setProduct(completeProduct);
    } catch (error) {
      console.error('Error in fetchProductDetails:', error);
      toast.error('Failed to load product details');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDelete = () => {
    // In a real app, we would call an API here
    toast.success('Product deleted successfully');
    navigate('/dashboard');
  };
  
  if (isLoading) {
    return (
      <PageContainer>
        <div className="flex items-center justify-center h-96">
          <p>Loading...</p>
        </div>
      </PageContainer>
    );
  }
  
  if (!product) {
    return (
      <PageContainer>
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-500">Product not found</h3>
          <Button
            variant="link"
            onClick={() => navigate('/dashboard')}
            className="mt-4"
          >
            Return to Dashboard
          </Button>
        </div>
      </PageContainer>
    );
  }
  
  const updatedAt = formatDistanceToNow(new Date(product.updatedAt), { addSuffix: true });
  
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="aspect-square rounded-lg overflow-hidden bg-white shadow-md">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          <div>
            <div className="mb-2">
              <span className="inline-block px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full">
                {product.category}
              </span>
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            
            <div className="text-2xl font-bold text-blue-600 mb-4">
              ${product.currentPrice.toFixed(2)}
            </div>
            
            <p className="text-gray-600 mb-6">{product.description}</p>
            
            <div className="flex flex-wrap gap-3 mb-6">
              <Button 
                variant="outline" 
                onClick={() => navigate(`/edit-product/${product.id}`)}
              >
                <Pencil className="h-4 w-4 mr-2" />
                Edit Product
              </Button>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Product
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete the product 
                      and remove all associated data.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
            
            <p className="text-sm text-gray-500">
              Last updated {updatedAt}
            </p>
          </div>
        </div>
        
        <div className="mt-12">
          <PriceHistoryChart priceHistory={product.priceHistory} />
        </div>
      </div>
    </PageContainer>
  );
};

export default ProductDetail;
