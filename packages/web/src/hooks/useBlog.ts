import { useQuery } from '@apollo/client/react';
import { GET_BLOG_POSTS, GET_BLOG_POST, GET_BLOG_CATEGORIES } from '../lib/graphql/queries';
import { BlogPost, BlogFilterInput } from '../lib/graphql/types';

export const useBlogPosts = (filter?: BlogFilterInput) => {
  const { data, loading, error, refetch } = useQuery<{ publishedBlogPosts: BlogPost[] }>(GET_BLOG_POSTS, {
    variables: { filter },
    errorPolicy: 'all',
  });

  return {
    blogPosts: data?.publishedBlogPosts || [],
    loading,
    error,
    refetch,
  };
};

export const useBlogPost = (id: string) => {
  const { data, loading, error } = useQuery<{ blogPost: BlogPost }>(GET_BLOG_POST, {
    variables: { id },
    errorPolicy: 'all',
  });

  return {
    blogPost: data?.blogPost,
    loading,
    error,
  };
};

export const useBlogCategories = () => {
  const { data, loading, error } = useQuery<{ blogCategories: string[] }>(GET_BLOG_CATEGORIES, {
    errorPolicy: 'all',
  });

  return {
    categories: data?.blogCategories || [],
    loading,
    error,
  };
};
