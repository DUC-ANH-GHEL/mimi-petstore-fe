import { apiClient } from './apiClient';

export type CategoryCreatePayload = {
  name: string;
  description?: string | null;
  is_active?: boolean;
};

export const createCategory = async (payload: CategoryCreatePayload) => {
  const body: CategoryCreatePayload = {
    name: String(payload.name ?? '').trim(),
    description:
      payload.description !== undefined && payload.description !== null
        ? String(payload.description)
        : null,
    is_active: payload.is_active ?? true,
  };

  const response = await apiClient.post('/categories/', body);
  return response.data;
};

export const getCategories = async () => {
  const response = await apiClient.get('/categories/');
  return response.data;
};
