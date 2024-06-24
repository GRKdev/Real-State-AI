import React from 'react';
import PaginationSection from '@/components/ui/pagination-component';
import { Dictionary } from '@/types/dictionary';

interface FooterCardProps {
    currentPage: number;
    setCurrentPage: (page: number) => void;
    postsPerPage: number;
    totalPosts: number;
    lastSearchMessage: string;
    totalResults: number;
    propertyCardDict: Dictionary['property_card'];
    totalCost: number;
}

const FooterCard: React.FC<FooterCardProps> = ({
    currentPage,
    setCurrentPage,
    postsPerPage,
    totalPosts,
    lastSearchMessage,
    totalResults,
    propertyCardDict,
    totalCost,
}) => (
    <div className="w-full text-center pt-5 text-gray-500">
        {totalPosts > postsPerPage && (
            <PaginationSection
                totalPosts={totalPosts}
                postsPerPage={postsPerPage}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
            />
        )}
        <p className='pt-5'>{propertyCardDict.total_results}<strong>{totalResults}</strong></p>
        <p className='pt-2'>{propertyCardDict.last_question}<strong>{lastSearchMessage}</strong></p>
        <p>{propertyCardDict.total_cost}: <strong>{totalCost.toFixed(6)}</strong> $</p>
    </div>
);

export default FooterCard;
