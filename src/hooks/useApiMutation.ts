import { useState } from 'react';

interface UseMutationOptions<T, P> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

export function useApiMutation<T, P = any>(
  mutationFn: (params: P) => Promise<T>,
  options?: UseMutationOptions<T, P>
) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = async (params: P) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await mutationFn(params);
      options?.onSuccess?.(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      setError(errorMessage);
      options?.onError?.(err instanceof Error ? err : new Error(errorMessage));
      throw err;
    } finally {
      // Keep button disabled for at least 2 seconds to prevent rapid clicks
      setTimeout(() => setIsLoading(false), 2000);
    }
  };

  return { mutate, isLoading, error, reset: () => setError(null) };
}