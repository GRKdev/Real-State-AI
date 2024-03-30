'use client'
import { NavbarSearch } from '@/components/ui/SearchBar';
import { useState, useEffect } from 'react';
import PropertyCard from '@/components/ui/propertry_card';
import SkeletonCard from '@/components/ui/skeleton-card';
import { Property } from '@/types/property';
import ErrorMessageAlert from '@/components/ui/error-message';
import WelcomeMessage from '@/components/ui/welcome-message';
import { useLocale } from '@/contexts/localeContext';
import { usePropertyCardDictionary } from "@/hooks/usePropertyCardDictionary";

export default function Home() {
  const [response, setResponse] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [prevResponse, setPrevResponse] = useState<Property[] | null>(null);
  const [searchCount, setSearchCount] = useState(0);
  const [hasSearched, setHasSearched] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { locale } = useLocale();
  const propertyCardDict = usePropertyCardDictionary();
  const [lastSearchMessage, setLastSearchMessage] = useState('');


  useEffect(() => {
    if (response !== prevResponse) {
      setPrevResponse(response);
    }
  }, [response]);

  const handleSearch = async (message: string, combinedFilter: string) => {
    setIsLoading(true);
    setResponse([]);
    setSearchCount(prevCount => prevCount + 1);
    setHasSearched(true);
    setErrorMessage('');
    setLastSearchMessage(message);


    const messageToAI = message + "%"
    console.log('Message to AI:', messageToAI);
    const api_endpoint = `/${locale}/api/AI`;
    const pg_endpoint = `/${locale}/api/pg`;

    try {
      const res = await fetch(api_endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageToAI, combinedFilter }),
      });
      if (res.status === 401) {
        throw new Error('You need to be logged in to use this feature. Please Sign In or Sign Up and try again.');
      }
      if (!res.ok) throw new Error(`HTTP error! Try again.`);
      const data = await res.json();

      if (data.text) {
        const [order, ...extras] = combinedFilter.split('&');

        const finalResponseText = data.text + (extras.length ? `&${extras.join('&')}` : '') + (order ? `&order=${order}` : '');
        const apiEndpoint = `${pg_endpoint}?${finalResponseText}`;
        console.log('API Endpoint:', apiEndpoint);
        const propertiesResponse = await fetch(apiEndpoint);
        if (!propertiesResponse.ok) throw new Error(`HTTP error! status: ${propertiesResponse.status}`);

        const propertiesData: Property[] = await propertiesResponse.json();
        console.log('API Response:', propertiesData);
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


  return (
    <div>

      <nav className='navbar'>
        <NavbarSearch onSearch={handleSearch} onClientSort={handleClientSort} />
      </nav>

      {errorMessage && <ErrorMessageAlert errorMessage={errorMessage} />}

      {!hasSearched && !isLoading && !errorMessage && (
        <WelcomeMessage />
      )}

      <div key={searchCount} className="w-full card-container">
        {isLoading ? (
          [...Array(6)].map((_, index) => <SkeletonCard key={index} />)
        ) : response.length > 0 ? (
          response.map((property, index) => (
            <PropertyCard
              key={property.reference_number}
              property={property}
              className={!prevResponse || !prevResponse.find(prev => prev.reference_number === property.reference_number) ? 'new-result' : ''}
              style={{
                animationDelay: `${index * 0.1}s`
              }}
            />
          ))
        ) : !errorMessage && hasSearched && (
          <div className="w-full text-center py-4">
            <p className="text-center pt-32 pb-5">{propertyCardDict.no_results}</p>
            <p>{propertyCardDict.last_question}<strong>{lastSearchMessage}</strong></p>
          </div>

        )}
      </div>
      {!isLoading && response.length > 0 && (
        <div className="w-full text-center py-4 text-gray-500">
          <p>{propertyCardDict.last_question}<strong>{lastSearchMessage}</strong></p>
          <p>{propertyCardDict.total_results}<strong>{response.length}</strong></p>
        </div>
      )}
    </div>
  );
}  