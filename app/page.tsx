'use client'
import { NavbarSearch } from '@/components/ui/SearchBar';
import { useState, useEffect } from 'react';
import PropertyCard from '@/components/ui/propertry_card';
import SkeletonCard from '@/components/ui/skeleton-card';
import { Property } from '@/types/property';
import {
  SignInButton,
} from "@clerk/nextjs";

export default function Home() {
  const [response, setResponse] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [prevResponse, setPrevResponse] = useState<Property[] | null>(null);
  const [searchCount, setSearchCount] = useState(0);
  const [hasSearched, setHasSearched] = useState(false);
  const [errorMessage, setErrorMessage] = useState(''); // Initialize state for errorMessage


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
    setErrorMessage(''); // Clear previous error messages


    const messageToAI = message + "%"
    console.log('Message to AI:', messageToAI);
    try {
      const res = await fetch('/api/AI', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: messageToAI, combinedFilter }),
      });
      if (res.status === 401) {
        throw new Error('You are unauthorized to access, please ');
      }
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();

      if (data.text) {
        const [order, ...extras] = combinedFilter.split('&');

        const finalResponseText = data.text + (extras.length ? `&${extras.join('&')}` : '') + (order ? `&order=${order}` : '');
        const apiEndpoint = `/api/pg?${finalResponseText}`;
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
      setErrorMessage(error.message); // Set error message to display to the user

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

      {errorMessage && (
        <div className="text-center text-red-500 pt-20">
          {errorMessage}
          <SignInButton />
        </div>
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
          <p className="text-center pt-32">No results found. Please try different search criteria.</p>
        )}
      </div>
      {!isLoading && response.length > 0 && (
        <div className="w-full text-center py-4">
          <span>Total Results: {response.length}</span>
        </div>
      )}
    </div>
  );
}  