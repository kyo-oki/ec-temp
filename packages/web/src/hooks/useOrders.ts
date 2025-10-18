import { useMutation } from '@apollo/client/react';
import { CREATE_ORDER, UPDATE_ORDER } from '../lib/graphql/mutations';
import { CreateOrderInput, UpdateOrderInput, Order } from '../lib/graphql/types';

export const useCreateOrder = () => {
  const [createOrderMutation, { loading, error }] = useMutation<{ createOrder: Order }>(CREATE_ORDER);

  const createOrder = async (input: CreateOrderInput) => {
    try {
      const { data } = await createOrderMutation({ variables: { input } });
      return { success: true, order: data?.createOrder };
    } catch (error) {
      console.error('Create order error:', error);
      return { success: false, error: error.message };
    }
  };

  return {
    createOrder,
    loading,
    error,
  };
};

export const useUpdateOrder = () => {
  const [updateOrderMutation, { loading, error }] = useMutation<{ updateOrder: Order }>(UPDATE_ORDER);

  const updateOrder = async (id: string, input: UpdateOrderInput) => {
    try {
      const { data } = await updateOrderMutation({ 
        variables: { id, input } 
      });
      return { success: true, order: data?.updateOrder };
    } catch (error) {
      console.error('Update order error:', error);
      return { success: false, error: error.message };
    }
  };

  return {
    updateOrder,
    loading,
    error,
  };
};
