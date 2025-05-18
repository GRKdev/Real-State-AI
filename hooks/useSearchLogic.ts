// hooks/useSearchLogic.tsx
import { useState } from 'react';
import { Property } from '@/types/property';

const useSearchLogic = (
  locale: string,
  propertyCardDict: any,
  setCurrentPage: (page: number) => void
) => {
  const [response, setResponse] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchCount, setSearchCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [hasSearched, setHasSearched] = useState(false);
  const [lastSearchMessage, setLastSearchMessage] = useState('');
  const [totalCost, setTotalCost] = useState<number>(0);

  const handleSearch = async (message: string, combinedFilter: string) => {
    setIsLoading(true);
    setResponse([]);
    setSearchCount((c) => c + 1);
    setHasSearched(true);
    setErrorMessage('');
    setLastSearchMessage(message);
    setCurrentPage(1);

    try {
      const aiRes = await fetch(`/${locale}/api/ai`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });

      if (aiRes.status === 401) {
        throw new Error(propertyCardDict.error_login);
      }
      if (!aiRes.ok) throw new Error('Failed to fetch AI filters.');

      const data = await aiRes.json();
      if (!data.text) {
        setResponse([]);
        return;
      }

      setTotalCost(data.total_cost);

      // Append any client-side filters and ordering
      const finalQS = combinedFilter
        ? `${data.text}&${combinedFilter}`
        : data.text;

      console.log('Final query string:', finalQS);

      const propRes = await fetch(`/${locale}/api/pg?${finalQS}`);
      if (!propRes.ok) {
        throw new Error(`Listings fetch failed: ${propRes.status}`);
      }
      const listings: Property[] = await propRes.json();
      setResponse(listings);
    } catch (err: any) {
      console.error('Search error:', err);
      setErrorMessage(err.message || 'An error occurred');
      setResponse([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClientSort = (sortOption: string) => {
    const [key, order] = sortOption.split('|');
    const sorted = [...response].sort((a, b) => {
      const va = a[key as keyof Property];
      const vb = b[key as keyof Property];
      if (order === 'asc') return va < vb ? -1 : va > vb ? 1 : 0;
      return vb < va ? -1 : vb > va ? 1 : 0;
    });
    setResponse(sorted);
  };

  return {
    response,
    isLoading,
    errorMessage,
    hasSearched,
    lastSearchMessage,
    handleSearch,
    searchCount,
    handleClientSort,
    totalCost
  };
};

export default useSearchLogic;
