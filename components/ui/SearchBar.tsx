'use client'
import { useState, FormEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem } from "@/components/ui/dropdown-menu";
import { TrendingUp, TrendingDown } from 'lucide-react';

interface NavbarSearchProps {
    onSearch: (message: string, filter: string) => void; // Callback when search is performed
}

export const NavbarSearch: React.FC<NavbarSearchProps> = ({ onSearch }) => {
    const [message, setMessage] = useState('');
    const [filter, setFilter] = useState('');
    const [filterLabel, setFilterLabel] = useState('Filters');
    const [isAscending, setIsAscending] = useState(true);

    const updateFilter = (value: string, label: string, ascending: boolean) => {
        setFilter(value);
        setFilterLabel(label);
        setIsAscending(ascending);
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onSearch(message, filter); // Use provided callback to perform the search
        setMessage(''); // Clear the input field after submitting
    };

    return (
        <form onSubmit={handleSubmit} className="flex gap-3 w-1/2">
            <Input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Search properties..."
                className="w-full px-4 py-2 rounded-md border border-gray-200" />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline">
                        {filterLabel !== 'Filters' && (
                            isAscending ? <TrendingUp className="mr-2 h-4 w-4" /> : <TrendingDown className="mr-2 h-4 w-4" />
                        )}
                        {filterLabel}
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="bottom">
                    <DropdownMenuRadioGroup value={filter}>
                        <DropdownMenuRadioItem value="" onClick={() => updateFilter('', 'Filters', true)}>No Filter</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="&price|asc" onClick={() => updateFilter('&price|asc', 'Price', true)}>Price Asc.</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="&price|desc" onClick={() => updateFilter('&price|desc', 'Price', false)}>Price Desc.</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="&bedrooms|asc" onClick={() => updateFilter('&bedrooms|asc', 'Bedroom', true)}>Bedroom Asc.</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="&bedrooms|desc" onClick={() => updateFilter('&bedrooms|desc', 'Bedroom', false)}>Bedroom Desc.</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="&bathrooms|asc" onClick={() => updateFilter('&bathrooms|asc', 'Bathroom', true)}>Bathroom Asc.</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="&bathrooms|desc" onClick={() => updateFilter('&bathrooms|desc', 'Bathroom', false)}>Bathroom Desc.</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="&square_meters|asc" onClick={() => updateFilter('&square_meters|asc', 'Square m.', true)}>Square Asc.</DropdownMenuRadioItem>
                        <DropdownMenuRadioItem value="&square_meters|desc" onClick={() => updateFilter('&square_meters|desc', 'Square m.', false)}>Square Desc.</DropdownMenuRadioItem>
                    </DropdownMenuRadioGroup>
                </DropdownMenuContent>
            </DropdownMenu>
        </form>
    );
};