import { useState } from 'react';
import { Property } from '@/types/property';

const useSearchLogic = (locale: string, propertyCardDict: any, setCurrentPage: (page: number) => void) => {
    const [response, setResponse] = useState<Property[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchCount, setSearchCount] = useState(0);
    const [errorMessage, setErrorMessage] = useState('');
    const [hasSearched, setHasSearched] = useState(false);
    const [lastSearchMessage, setLastSearchMessage] = useState('');
  
    const handleSearch = async (message: string, combinedFilter: string) => {
      setIsLoading(true);
      setResponse([]);
      setSearchCount(prevCount => prevCount + 1);
      setHasSearched(true);
      setErrorMessage('');
      setLastSearchMessage(message);
      setCurrentPage(1);

    const messageToAI = message
    const api_endpoint = `/${locale}/api/AI`;
    const pg_endpoint = `/${locale}/api/pg`;

    try {
      const res = await fetch(api_endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageToAI, combinedFilter }),
      });
      if (res.status === 401) {
        throw new Error(propertyCardDict.error_login);
      }
      if (!res.ok) throw new Error(`HTTP error! Try again.`);
      const data = await res.json();

      if (data.text) {
        const [order, ...extras] = combinedFilter.split('&');

        const finalResponseText = data.text + (extras.length ? `&${extras.join('&')}` : '') + (order ? `&order=${order}` : '');
        const apiEndpoint = `${pg_endpoint}?${finalResponseText}`;
        const propertiesResponse = await fetch(apiEndpoint);
        if (!propertiesResponse.ok) throw new Error(`HTTP error! status: ${propertiesResponse.status}`);

        const propertiesData: Property[] = await propertiesResponse.json();
        setResponse(propertiesData);
      } else {
        setResponse([]);
      }
    } catch (error: any) {
      console.error('Error processing the response:', error.message);
      setErrorMessage(error.message);

      setResponse([]);
    } finally {
      setIsLoading(false);
    }
  };
  const handleClientSort = (sortOption: string) => {
    const [key, order] = sortOption.split('|');
    const sorted = [...response].sort((a, b) => {
      const valueA = a[key as keyof Property];
      const valueB = b[key as keyof Property];
      if (order === 'asc') return (valueA < valueB ? -1 : valueA > valueB ? 1 : 0);
      if (order === 'desc') return (valueB < valueA ? -1 : valueB > valueA ? 1 : 0);
      return 0;
    });
    setResponse(sorted);
  };

  return { response, isLoading, errorMessage, hasSearched, lastSearchMessage, handleSearch, searchCount, handleClientSort};
};

export default useSearchLogic;