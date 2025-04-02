
import { supabase } from "@/integrations/supabase/client";
import { Product, PricePoint } from "@/types";

/**
 * Fetches all products with their current price from the database
 */
export async function fetchProducts(): Promise<Product[]> {
  try {
    // First, get all products
    const { data: productsData, error: productsError } = await supabase
      .from('product')
      .select('*');

    if (productsError) {
      console.error('Error fetching products:', productsError);
      throw productsError;
    }

    // For each product, find the latest price from pricehist
    const productsWithPrices = await Promise.all(
      productsData.map(async (product) => {
        // Get the latest price based on effective date
        const { data: priceData, error: priceError } = await supabase
          .from('pricehist')
          .select('*')
          .eq('prodcode', product.prodcode)
          .order('effdate', { ascending: false })
          .limit(1);

        if (priceError) {
          console.error(`Error fetching price for ${product.prodcode}:`, priceError);
          return null;
        }

        // Get all price history for this product
        const { data: priceHistory, error: historyError } = await supabase
          .from('pricehist')
          .select('*')
          .eq('prodcode', product.prodcode)
          .order('effdate', { ascending: true });

        if (historyError) {
          console.error(`Error fetching price history for ${product.prodcode}:`, historyError);
          return null;
        }

        // Map the price history to match our PricePoint type
        const priceHistoryFormatted: PricePoint[] = priceHistory.map(item => ({
          date: item.effdate,
          price: item.unitprice
        }));

        // Map database product to our Product type
        const currentPrice = priceData?.[0]?.unitprice || 0;
        
        return {
          id: product.prodcode,
          name: product.prodcode,
          description: product.description || 'No description available',
          currentPrice: currentPrice,
          priceHistory: priceHistoryFormatted,
          imageUrl: 'https://placehold.co/400x400/e6e6e6/black?text=' + encodeURIComponent(product.prodcode),
          category: product.unit || 'Uncategorized',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        } as Product;
      })
    );

    // Filter out null values (products that failed to fetch prices)
    return productsWithPrices.filter(Boolean) as Product[];
  } catch (error) {
    console.error('Error in fetchProducts:', error);
    throw error;
  }
}
