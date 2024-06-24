'use client'

import { NavbarSearch } from '@/components/ui/SearchBar';
import { useState, useEffect } from 'react';
import { useLocale } from '@/contexts/localeContext';
import { Property } from '@/types/property';
import { usePropertyCardDictionary } from "@/hooks/usePropertyCardDictionary";
import PropertyCardsContainer from '@/components/ui/property-card-container';
import WelcomeMessage from '@/components/ui/welcome-message';
import ErrorMessageAlert from '@/components/ui/error-message';
import useSearchLogic from '@/hooks/useSearchLogic';
import FooterCard from '@/components/ui/footer-card';

export default function Home() {
  const { locale: currentLocale } = useLocale();
  const propertyCardDict = usePropertyCardDictionary();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchCount, setSearchCount] = useState(0);
  const [prevResponse, setPrevResponse] = useState<Property[] | null>(null);
  const { response, isLoading, errorMessage, hasSearched, lastSearchMessage, handleSearch, handleClientSort, totalCost } = useSearchLogic(currentLocale, propertyCardDict, setCurrentPage);
  const [postsPerPage] = useState(6);
  const lastPostIndex = currentPage * postsPerPage;
  const firstPostIndex = lastPostIndex - postsPerPage;
  const currentData = response.slice(firstPostIndex, lastPostIndex);

  useEffect(() => {
    setSearchCount(searchCount + 1);
  }, [response]);

  useEffect(() => {
    if (response !== prevResponse) {
      setPrevResponse(response);
    }
  }, [response]);

  return (
    <div>

      <nav className='navbar'>
        <NavbarSearch onSearch={handleSearch} onClientSort={handleClientSort} />
      </nav>
      <div className="middle-container">
      </div>
      {errorMessage && <ErrorMessageAlert errorMessage={errorMessage} />}

      {!hasSearched && !isLoading && !errorMessage && (
        <WelcomeMessage />
      )}

      <PropertyCardsContainer
        isLoading={isLoading}
        hasSearched={hasSearched}
        errorMessage={errorMessage}
        currentData={currentData}
        propertyCardDict={propertyCardDict}
        lastSearchMessage={lastSearchMessage}
        prevResponse={prevResponse}
        totalCost={totalCost}

      />

      {!isLoading && response.length > 0 && (
        <FooterCard
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          postsPerPage={postsPerPage}
          totalPosts={response.length}
          lastSearchMessage={lastSearchMessage}
          totalResults={response.length}
          propertyCardDict={propertyCardDict}
          totalCost={totalCost}
        />
      )}
    </div>
  );
}  