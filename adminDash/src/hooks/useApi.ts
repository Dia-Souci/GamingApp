import { useState, useEffect, useCallback } from 'react';
import { ApiError, apiUtils } from '../services/api';

// Generic hook for API calls
export function useApi<T>(
  apiCall: () => Promise<T>,
  dependencies: unknown[] = []
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
export function useApiMutation<T, P = unknown>() {
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
  apiCall: (page: number, limit: number, filters?: unknown) => Promise<{ data: T[]; total: number }>,
  initialPage: number = 1,
  limit: number = 10,
  filters?: unknown
) {
  const [data, setData] = useState<T[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(initialPage);

  const fetchPage = useCallback(async (page: number) => {
    try {
      setLoading(true);
      setError(null);
      const result = await apiCall(page, limit, filters);
      setData(result.data);
      setTotal(result.total);
      setCurrentPage(page);
    } catch (err) {
      const errorMessage = apiUtils.handleError(err as ApiError);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [apiCall, limit]); // Removed filters from dependencies to prevent infinite loops

  useEffect(() => {
    fetchPage(currentPage);
  }, [fetchPage, currentPage]);

  // Handle filter changes separately to prevent infinite loops
  useEffect(() => {
    if (currentPage === 1) {
      fetchPage(1);
    } else {
      setCurrentPage(1); // Reset to first page when filters change
    }
  }, [filters]); // Only depend on filters

  const goToPage = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const nextPage = useCallback(() => {
    const totalPages = Math.ceil(total / limit);
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  }, [currentPage, total, limit]);

  const prevPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  }, [currentPage]);

  return {
    data,
    total,
    loading,
    error,
    currentPage,
    totalPages: Math.ceil(total / limit),
    goToPage,
    nextPage,
    prevPage,
    refetch: () => fetchPage(currentPage),
  };
}