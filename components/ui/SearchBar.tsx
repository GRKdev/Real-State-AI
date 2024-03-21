'use client'
import { useState, FormEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem } from "@/components/ui/dropdown-menu";
import { TrendingUp, TrendingDown } from 'lucide-react';
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu"

interface NavbarSearchProps {
    onSearch: (message: string, filter: string) => void;
    onClientSort: (sortOption: string) => void;
}
type Checked = DropdownMenuCheckboxItemProps["checked"]

export const NavbarSearch: React.FC<NavbarSearchProps> = ({ onSearch, onClientSort }) => {
    const [message, setMessage] = useState('');
    const [filter, setFilter] = useState('');
    const [filterLabel, setFilterLabel] = useState('Filters');
    const [isAscending, setIsAscending] = useState(true);

    const [showTerrace, setShowTerrace] = useState<Checked>(false)
    const [showParking, setShowParking] = useState<Checked>(false)
    const [showBalcony, setShowBalcony] = useState<Checked>(false)
    const [showGarden, setShowGarden] = useState<Checked>(false)
    const [showElevator, setShowElevator] = useState<Checked>(false)
    const [showHeating, setShowHeating] = useState<Checked>(false)
    const [showElectrodometics, setShowElectrodometics] = useState<Checked>(false)
    const [showFurnished, setShowFurnished] = useState<Checked>(false)


    const updateFilter = (value: string, label: string, ascending: boolean) => {
        setFilter(value);
        setFilterLabel(label);
        setIsAscending(ascending);
        if (label !== 'Filters') {
            onClientSort(value);
        }
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        let extraFilters = '';
        if (showTerrace) extraFilters += '&terrace=1';
        if (showParking) extraFilters += '&parking=1';
        if (showBalcony) extraFilters += '&balcony=1';
        if (showGarden) extraFilters += '&garden=1';
        if (showElevator) extraFilters += '&elevator=1';
        if (showHeating) extraFilters += '&heating=1';
        if (showElectrodometics) extraFilters += '&electrodometics=1';
        if (showFurnished) extraFilters += '&furnished=1';

        const combinedFilter = `${filter}${extraFilters}`;

        onSearch(message, combinedFilter);
        setMessage('');
    };

    return (
        <div className="flex gap-5 w-full justify-center">
            <form onSubmit={handleSubmit} className="flex gap-5 w-1/2">
                <Input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Search properties with AI..."
                    className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-5 text-sm outline-1 placeholder:text-gray-500"
                />
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
                            <DropdownMenuRadioItem value="price|asc" onClick={() => updateFilter('price|asc', 'Price', true)}>Price Asc.</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="price|desc" onClick={() => updateFilter('price|desc', 'Price', false)}>Price Desc.</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="bedrooms|asc" onClick={() => updateFilter('bedrooms|asc', 'Bedroom', true)}>Bedroom Asc.</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="bedrooms|desc" onClick={() => updateFilter('bedrooms|desc', 'Bedroom', false)}>Bedroom Desc.</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="bathrooms|asc" onClick={() => updateFilter('bathrooms|asc', 'Bathroom', true)}>Bathroom Asc.</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="bathrooms|desc" onClick={() => updateFilter('bathrooms|desc', 'Bathroom', false)}>Bathroom Desc.</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="square_meters|asc" onClick={() => updateFilter('square_meters|asc', 'Square m.', true)}>Square Asc.</DropdownMenuRadioItem>
                            <DropdownMenuRadioItem value="square_meters|desc" onClick={() => updateFilter('square_meters|desc', 'Square m.', false)}>Square Desc.</DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                </DropdownMenu>
            </form>
            <aside className="fixed left-40 h-full pt-32 options">
                <h3 className="mt-4 mb-2">Extra Options:</h3>
                <div >
                    <div className='hover:text-orange-500'>
                        <input
                            type="checkbox"
                            className="accent-orange-500"
                            id="showTerrace"
                            checked={!!showTerrace}
                            onChange={() => setShowTerrace(!showTerrace)}
                        />
                        <label htmlFor="showTerrace"> Terrace</label>
                    </div>
                    <div className='hover:text-orange-500'>
                        <input
                            type="checkbox"
                            className="accent-orange-500"
                            id="showParking"
                            checked={!!showParking}
                            onChange={() => setShowParking(!showParking)}
                        />
                        <label htmlFor="showParking"> Parking</label>
                    </div>
                    <div className='hover:text-orange-500'>
                        <input
                            type="checkbox"
                            className="accent-orange-500"
                            id="showBalcony"
                            checked={!!showBalcony}
                            onChange={() => setShowBalcony(!showBalcony)}
                        />
                        <label htmlFor="showBalcony"> Balcony</label>
                    </div>
                    <div className='hover:text-orange-500'>
                        <input
                            type="checkbox"
                            className="accent-orange-500"
                            id="showGarden"
                            checked={!!showGarden}
                            onChange={() => setShowGarden(!showGarden)}
                        />
                        <label htmlFor="showGarden"> Garden</label>
                    </div>
                    <div className='hover:text-orange-500'>
                        <input
                            type="checkbox"
                            className="accent-orange-500"
                            id="showElevator"
                            checked={!!showElevator}
                            onChange={() => setShowElevator(!showElevator)}
                        />
                        <label htmlFor="showElevator"> Elevator</label>
                    </div>
                    <div className='hover:text-orange-500'>
                        <input
                            type="checkbox"
                            className="accent-orange-500"
                            id="showHeating"
                            checked={!!showHeating}
                            onChange={() => setShowHeating(!showHeating)}
                        />
                        <label htmlFor="showHeating"> Heating</label>
                    </div>
                    <div className='hover:text-orange-500'>
                        <input
                            type="checkbox"
                            className="accent-orange-500"
                            id="showElectrodometics"
                            checked={!!showElectrodometics}
                            onChange={() => setShowElectrodometics(!showElectrodometics)}
                        />
                        <label htmlFor="showElectrodometics"> Electrod.</label>
                    </div>
                    <div className='hover:text-orange-500'>
                        <input
                            className="accent-orange-500"
                            type="checkbox"
                            id="showFurnished"
                            checked={!!showFurnished}
                            onChange={() => setShowFurnished(!showFurnished)}
                        />
                        <label htmlFor="showFurnished"> Furnished</label>
                    </div>
                </div>
            </aside>
        </div>
    );
};
