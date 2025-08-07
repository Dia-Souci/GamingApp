import { useState, useEffect, useCallback } from 'react';
import { ApiError } from '../types/api';
import { apiUtils } from '../services/api';

// Generic hook for API calls
export function useApi<T>(
  apiCall: () => Promise<T>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiCall();
      setData(result);
    } catch (err) {
      const errorMessage = apiUtils.handleError(err as ApiError);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    execute();
  }, [execute]);

  const refetch = useCallback(() => {
    execute();
  }, [execute]);

  return { data, loading, error, refetch };
}

// Hook for manual API calls (e.g., form submissions)
export function useApiMutation<T, P = any>() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(async (apiCall: (params: P) => Promise<T>, params: P): Promise<T | null> => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiCall(params);
      return result;
    } catch (err) {
      const errorMessage = apiUtils.handleError(err as ApiError);
      setError(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { mutate, loading, error, setError };
}

// Hook for paginated data
export function usePaginatedApi<T>(
  apiCall: (page: number, limit: number) => Promise<{ data: T[]; pagination: any }>,
  initialPage: number = 1,
  limit: number = 30
) {
  const [data, setData] = useState<T[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(initialPage);

  const fetchPage = useCallback(async (page: number) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiCall(page, limit);
      setData(result.data);
      setPagination(result.pagination);
      setCurrentPage(page);
    } catch (err) {
      const errorMessage = apiUtils.handleError(err as ApiError);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [apiCall, limit]);

  useEffect(() => {
    fetchPage(currentPage);
  }, [fetchPage, currentPage]);

  const goToPage = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const nextPage = useCallback(() => {
    if (pagination && currentPage < pagination.totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  }, [currentPage, pagination]);

  const prevPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  }, [currentPage]);

  return {
    data,
    pagination,
    loading,
    error,
    currentPage,
    goToPage,
    nextPage,
    prevPage,
    refetch: () => fetchPage(currentPage),
  };
}