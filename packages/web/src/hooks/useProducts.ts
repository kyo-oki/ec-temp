import { useQuery } from '@apollo/client/react';
import { GET_PRODUCTS, GET_PRODUCT, GET_PRODUCT_REVIEWS } from '../lib/graphql/queries';
import { Product, ProductFilterInput, Review } from '../lib/graphql/types';

export const useProducts = (filter?: ProductFilterInput) => {
  const { data, loading, error, refetch } = useQuery<{ products: Product[] }>(GET_PRODUCTS, {
    variables: { filter },
    errorPolicy: 'all',
  });

  return {
    products: data?.products || [],
    loading,
    error,
    refetch,
  };
};

export const useProduct = (id: string) => {
  const { data, loading, error } = useQuery<{ product: Product }>(GET_PRODUCT, {
    variables: { id },
    errorPolicy: 'all',
  });

  return {
    product: data?.product,
    loading,
    error,
  };
};

export const useProductReviews = (productId: string) => {
  const { data, loading, error } = useQuery<{ productReviews: Review[] }>(GET_PRODUCT_REVIEWS, {
    variables: { productId },
    errorPolicy: 'all',
  });

  return {
    reviews: data?.productReviews || [],
    loading,
    error,
  };
};
