"use client"
import { useState, FormEvent, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem } from "@/components/ui/dropdown-menu";
import { TrendingUp, TrendingDown, ArrowDown } from 'lucide-react';
import { DropdownMenuCheckboxItemProps } from "@radix-ui/react-dropdown-menu"
import { ExtraOptionsCheckbox } from '@/components/ui/extra-options';
import { Microphone } from './button-microphone';
import { useExtraOptionsDictionary } from "@/hooks/useExtraOptionsDictionary";
import { useFiltersDictionary } from '@/hooks/useFiltersDictionary';


interface NavbarSearchProps {
    onSearch: (message: string, filter: string) => void;
    onClientSort: (sortOption: string) => void;
}
type Checked = DropdownMenuCheckboxItemProps["checked"]

export const NavbarSearch: React.FC<NavbarSearchProps> = ({ onSearch, onClientSort }) => {
    const [message, setMessage] = useState('');
    const [filter, setFilter] = useState('');
    const [isAscending, setIsAscending] = useState(true);

    const [showTerrace, setShowTerrace] = useState<Checked>(false)
    const [showParking, setShowParking] = useState<Checked>(false)
    const [showBalcony, setShowBalcony] = useState<Checked>(false)
    const [showGarden, setShowGarden] = useState<Checked>(false)
    const [showElevator, setShowElevator] = useState<Checked>(false)
    const [showHeating, setShowHeating] = useState<Checked>(false)
    const [showElectrodometics, setShowElectrodometics] = useState<Checked>(false)
    const [showFurnished, setShowFurnished] = useState<Checked>(false)

    const extraOptionsDict = useExtraOptionsDictionary();
    const filtersDict = useFiltersDictionary();


    const extraOptions = [
        { id: "showTerrace", label: extraOptionsDict.terrace, state: showTerrace, setState: setShowTerrace },
        { id: "showParking", label: extraOptionsDict.parking || "Parking", state: showParking, setState: setShowParking },
        { id: "showBalcony", label: extraOptionsDict.balcony || "Balcony", state: showBalcony, setState: setShowBalcony },
        { id: "showGarden", label: extraOptionsDict.garden || "Garden", state: showGarden, setState: setShowGarden },
        { id: "showElevator", label: extraOptionsDict.elevator || "Elevator", state: showElevator, setState: setShowElevator },
        { id: "showHeating", label: extraOptionsDict.heating || "Heating", state: showHeating, setState: setShowHeating },
        { id: "showElectrodometics", label: extraOptionsDict.electrod || "Electrod.", state: showElectrodometics, setState: setShowElectrodometics },
        { id: "showFurnished", label: extraOptionsDict.furnished || "Furnished", state: showFurnished, setState: setShowFurnished },
    ];

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
        triggerSearch(message);
    };

    const handleVoiceSearch = (message: string) => {
        triggerSearch(message);
    };

    const triggerSearch = (searchMessage: string) => {
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
        onSearch(searchMessage, combinedFilter);
        setMessage('');
    };
    const [filterLabel, setFilterLabel] = useState(filtersDict.title_filter);
    useEffect(() => {
        if (filtersDict) {
            setFilterLabel(filtersDict.title_filter);
            setFilter("");
        }
    }, [filtersDict]);
    return (
        <div className="flex justify-center">
            <div className="flex gap-2 w-5/6 justify-center items-center">

                <form onSubmit={handleSubmit} className="w-1/2 input-background">
                    <Input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder={filtersDict.searchbar}
                        className="input-class"
                        maxLength={125}
                    />
                </form>
                <Microphone onVoiceSubmit={handleVoiceSearch} />
                <div className='hidden lg:block'>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline">
                                {filterLabel !== filtersDict.title_filter && (
                                    isAscending ? <TrendingUp className="mr-2 h-4 w-4" /> : <TrendingDown className="mr-2 h-4 w-4" />
                                )}
                                {filterLabel}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent side="bottom">
                            <DropdownMenuRadioGroup value={filter}>
                                <DropdownMenuRadioItem value="" onClick={() => updateFilter("", filtersDict.title_filter, true)}>{filtersDict.no_filters}</DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="price|asc" onClick={() => updateFilter('price|asc', filtersDict.price, true)}>{filtersDict.price} <TrendingUp className='pl-1 h-6 w-6' /></DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="price|desc" onClick={() => updateFilter('price|desc', filtersDict.price, false)}>{filtersDict.price} <ArrowDown className='pl-1 h-6 w-6' /></DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="bedrooms|asc" onClick={() => updateFilter('bedrooms|asc', filtersDict.bedroom, true)}>{filtersDict.bedroom} <TrendingUp className='pl-1 h-6 w-6' /></DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="bedrooms|desc" onClick={() => updateFilter('bedrooms|desc', filtersDict.bedroom, false)}>{filtersDict.bedroom} <ArrowDown className='pl-1 h-6 w-6' /></DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="bathrooms|asc" onClick={() => updateFilter('bathrooms|asc', filtersDict.bathroom, true)}>{filtersDict.bathroom} <TrendingUp className='pl-1 h-6 w-6' /></DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="bathrooms|desc" onClick={() => updateFilter('bathrooms|desc', filtersDict.bathroom, false)}>{filtersDict.bathroom} <ArrowDown className='pl-1 h-6 w-6' /></DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="square_meters|asc" onClick={() => updateFilter('square_meters|asc', filtersDict.square, true)}>{filtersDict.square} <TrendingUp className='pl-1 h-6 w-6' /></DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="square_meters|desc" onClick={() => updateFilter('square_meters|desc', filtersDict.square, false)}>{filtersDict.square} <ArrowDown className='pl-1 h-6 w-6' /></DropdownMenuRadioItem>
                            </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>


            <aside className="fixed left-40 h-full pt-32 options hidden lg:block">
                <h3 className="mt-4 mb-2">{extraOptionsDict.title}:</h3>
                <ExtraOptionsCheckbox options={extraOptions} />
            </aside>
        </div>
    );
};
