import React from 'react';
import PropertyCard from '@/components/ui/property-card';
import SkeletonCard from '@/components/ui/skeleton-card';
import { Property } from '@/types/property';

interface PropertyCardsContainerProps {
    isLoading: boolean;
    hasSearched: boolean;
    errorMessage: string;
    currentData: Property[];
    propertyCardDict: any;
    lastSearchMessage: string;
    prevResponse: Property[] | null;
}

const PropertyCardsContainer: React.FC<PropertyCardsContainerProps> = ({
    isLoading,
    hasSearched,
    errorMessage,
    currentData,
    propertyCardDict,
    lastSearchMessage,
    prevResponse,
}) => (
    <div className="w-full card-container">
        {isLoading ? (
            [...Array(6)].map((_, index) => <SkeletonCard key={index} />)
        ) : currentData.length > 0 ? (
            currentData.map((property, index) => (
                <PropertyCard
                    key={property.reference_number}
                    property={property}
                    className={!prevResponse || !prevResponse.find(prev => prev.reference_number === property.reference_number) ? 'new-result' : ''}
                    style={{ animationDelay: `${index * 0.1}s` }}
                />
            ))
        ) : !errorMessage && hasSearched && (
            <div className="w-full text-center py-4">
                <p className="text-center pt-32 pb-20">{propertyCardDict.no_results}</p>
                <p>{propertyCardDict.last_question}<strong>{lastSearchMessage}</strong></p>
            </div>
        )}
    </div>
);

export default PropertyCardsContainer;
