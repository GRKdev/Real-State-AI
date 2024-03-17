'use client'
import { NavbarSearch } from '@/components/ui/SearchBar';
import { useState, useEffect } from 'react';
import PropertyCard from '@/components/ui/propertry_card';
import SkeletonCard from '@/components/ui/skeleton-card';
import { Property } from '@/types/property';

export default function Home() {
  const [response, setResponse] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [prevResponse, setPrevResponse] = useState<Property[] | null>(null);
  const [searchCount, setSearchCount] = useState(0);

  useEffect(() => {
    if (response !== prevResponse) {
      setPrevResponse(response);
    }
  }, [response]);

  const handleSearch = async (message: string, filter: string) => {
    setIsLoading(true);
    setResponse([]);
    setSearchCount(prevCount => prevCount + 1); // Increment search count to trigger re-render

    try {
      const res = await fetch('/api/AI', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, filter }),
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();

      if (data.text) {
        const finalResponseText = data.text + (filter ? `&order=${filter}` : '');
        const apiEndpoint = `/api/search?${finalResponseText}`;
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
      <nav className='navbar-search'>
        <NavbarSearch onSearch={handleSearch} onClientSort={handleClientSort} />
      </nav>
      <div className="w-full pt-28 pb-32">
        {!isLoading && response.length > 0 && (
          <div className="w-full text-center py-4">
            <span>Total Results: {response.length}</span>
          </div>
        )}
        <div key={searchCount} className="w-full card-container">
          {isLoading ? (
            [...Array(6)].map((_, index) => <SkeletonCard key={index} />)
          ) : (
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
          )}
        </div>
      </div>
    </div>
  );
}