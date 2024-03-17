'use client'
import { useState, FormEvent } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuCheckboxItem, DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { TrendingUp, TrendingDown } from 'lucide-react';
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu"

interface NavbarSearchProps {
    onSearch: (message: string, filter: string) => void;
    onClientSort: (sortOption: string) => void; // Add this line
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
            onClientSort(value); // Call client-side sorting when a filter is applied
        }
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        onSearch(message, filter); // Use provided callback to perform the search
        setMessage(''); // Clear the input field after submitting
    };

    return (
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

            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline">Extra</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>Select the extras</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem
                        checked={showTerrace}
                        onCheckedChange={setShowTerrace}
                    >
                        Terrace
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                        checked={showParking}
                        onCheckedChange={setShowParking}
                    >
                        Parking
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                        checked={showBalcony}
                        onCheckedChange={setShowBalcony}
                    >

                        Balcony
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                        checked={showGarden}
                        onCheckedChange={setShowGarden}
                    >
                        Garden
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                        checked={showElevator}
                        onCheckedChange={setShowElevator}
                    >
                        Elevator
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                        checked={showHeating}
                        onCheckedChange={setShowHeating}
                    >
                        Heating
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                        checked={showElectrodometics}
                        onCheckedChange={setShowElectrodometics}
                    >
                        Electrodometics
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                        checked={showFurnished}
                        onCheckedChange={setShowFurnished}
                    >
                        Furnished
                    </DropdownMenuCheckboxItem>

                </DropdownMenuContent>
            </DropdownMenu>
        </form>
    );
};
