import { CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { PropertyCardProps, Property } from '@/types/property';
import { JSX, SVGProps } from "react";
import MyImage from "@/components/fallback_img";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { Undo2, ZoomIn, SquareParking, Fence, Heater, WashingMachine, Armchair, TreePine, ArrowUpDown, RockingChair, Hash } from "lucide-react"
import { useLocale } from '@/contexts/localeContext';
import { useExtraOptionsDictionary } from "@/hooks/useExtraOptionsDictionary";
import { usePropertyCardDictionary } from "@/hooks/usePropertyCardDictionary";

export default function PropertyCard({
    property,
    className = '',
    style = {}
}: PropertyCardProps) {
    const { locale } = useLocale();
    const extraOptionsDict = useExtraOptionsDictionary();
    const propertyCardDict = usePropertyCardDictionary();


    const featureMappings = [
        { key: 'parking', name: extraOptionsDict.parking, Icon: SquareParking },
        { key: 'heating', name: extraOptionsDict.heating, Icon: Heater },
        { key: 'furnished', name: extraOptionsDict.furnished, Icon: Armchair },
        { key: 'electrodometics', name: extraOptionsDict.electrod, Icon: WashingMachine },
        { key: 'balcony', name: extraOptionsDict.balcony, Icon: Fence },
        { key: 'terrace', name: extraOptionsDict.terrace, Icon: RockingChair },
        { key: 'garden', name: extraOptionsDict.garden, Icon: TreePine },
        { key: 'elevator', name: extraOptionsDict.elevator, Icon: ArrowUpDown },
    ];
    const titleLocaleMap: { [key: string]: keyof Property } = {
        en: 'title_en',
        ca: 'title_cat',
        es: 'title_esp',
        fr: 'title_fr'
    };
    const descriptionLocaleMap: { [key: string]: keyof Property } = {
        en: 'description_en',
        ca: 'description_cat',
        es: 'description_esp',
        fr: 'description_fr'
    };
    const titleKey = titleLocaleMap[locale];
    const displayTitle = property[titleKey] ? property[titleKey] : property.title_en;
    const descriptionKey = descriptionLocaleMap[locale];
    const displayDescription = property[descriptionKey] ? property[descriptionKey] : property.description_en;

    return (
        <div className={`card-container ${className}`} style={style}>
            <div className="w-full">
                <Tabs defaultValue="general">
                    <TabsContent value="general">
                        <div className="card">
                            <CardHeader>
                                <div className="image-container">
                                    <a href={`${locale}/property/${property.reference_number}`} target="_blank" rel="noopener noreferrer">

                                        <MyImage
                                            alt={property.title_cat}
                                            className="image image-style"
                                            width={350}
                                            height={200}
                                            src={property.photo}
                                            loading="lazy"
                                            fallbackSrc="/logo2.webp"
                                        />
                                    </a>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="flex justify-between items-center mb-1">
                                    <div className="flex items-center space-x-1">
                                        <SquareIcon className="text-orange-500" />
                                        <span className="text-sm">{Math.trunc(property.square_meters)} m²</span>
                                    </div>
                                    {property.bedrooms > 0 && (
                                        <div className="flex items-center space-x-1">
                                            <BedIcon className="text-orange-500" />
                                            <span className="text-sm">
                                                {property.bedrooms} {property.bedrooms === 1 ? propertyCardDict.room : propertyCardDict.rooms}
                                            </span>
                                        </div>
                                    )}
                                    {property.bathrooms > 0 && (
                                        <div className="flex items-center space-x-1">
                                            <BathIcon className="text-orange-500" />
                                            <span className="text-sm">
                                                {property.bathrooms} {property.bathrooms === 1 ? propertyCardDict.bathroom : propertyCardDict.bathrooms}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <Separator className="mb-2" />

                                <a href={`${locale}/property/${property.reference_number}`} target="_blank" rel="noopener noreferrer">
                                    <h3 className="text-lg font-semibold title-container hover:text-orange-500">
                                        {displayTitle}
                                    </h3>
                                </a>
                                <p className="text-lg font-bold text-orange-500 text-center items-start">
                                    {new Intl.NumberFormat('de-DE', {
                                        style: 'currency',
                                        currency: 'EUR',
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 0,
                                    }).format(property.price)}
                                    {property.transaction_type === 2 ? <small className="text-sm"> / {propertyCardDict.month}</small> : ''}
                                </p>
                                <p className="flex items-center gap-1 mt-2 mb-1">
                                    <MapIcon className="text-gray-500 h-4 w-4" />
                                    <span className="text-sm text-gray-500">
                                        {property.parish === 1 ? "Andorra la Vella" : property.parish === 2 ? "Canillo" : property.parish === 3 ? "Encamp" : property.parish === 4 ? "La Massana" : property.parish === 5 ? "Ordino" : property.parish === 6 ? "Sant Julià" : property.parish === 7 ? "Escaldes-Engordany" : ""}
                                    </span>
                                </p>

                                <div className="flex justify-between items-center">

                                    <p className="flex items-center mb-1 gap-1">
                                        <BuildingIcon className="text-gray-500 h-4 w-4" />
                                        <span className="text-sm text-gray-500">
                                            {property.real_state === 1 ? "Baron & Cabot" : property.real_state === 2 ? "Deloitte" : property.real_state === 3 ? "Blackrock" : "Particular"}
                                        </span>
                                    </p>
                                    <p className="flex justify-between items-center text-sm text-gray-500 text-right gap-1 ">
                                        <Hash className="text-gray-500 h-4 w-4" />
                                        Ref: {property.reference_number}</p>
                                </div>
                                <div className="flex justify-center pt-2">
                                    <TabsList>
                                        <TabsTrigger value="more_info">
                                            <ZoomIn className="text-gray-500 hover:text-orange-500 w-8 h-8" />
                                        </TabsTrigger>
                                    </TabsList>
                                </div>
                            </CardContent>

                        </div>

                    </TabsContent>
                    <TabsContent value="more_info">
                        <div className="card">
                            <CardContent>
                                <h2 className="text-sm description-container items-start mt-5 text-pretty">
                                    {displayDescription}
                                </h2>
                                <div className="grid grid-cols-2 mt-5 h-32 m-6 gap-2">
                                    {featureMappings.map(({ key, name, Icon }) =>
                                        property[key as keyof typeof property] ? (
                                            <div key={key} className="flex items-center mb-2">
                                                <Icon className="text-orange-500 mr-1 w-5 h-5" /> <span>{name}</span>
                                            </div>
                                        ) : null
                                    )}
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-center pt-2">
                                <TabsList className="grid w-[200px]">
                                    <TabsTrigger value="general"><Undo2 className="text-gray-500 hover:text-orange-500 w-8 h-8" /></TabsTrigger>
                                </TabsList>
                            </CardFooter>
                        </div>
                    </TabsContent>
                </Tabs>

            </div>
        </div>
    );
}

function BathIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M9 6 6.5 3.5a1.5 1.5 0 0 0-1-.5C4.683 3 4 3.683 4 4.5V17a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5" />
            <line x1="10" x2="8" y1="5" y2="7" />
            <line x1="2" x2="22" y1="12" y2="12" />
            <line x1="7" x2="7" y1="19" y2="21" />
            <line x1="17" x2="17" y1="19" y2="21" />
        </svg>
    )
}


function BedIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M2 4v16" />
            <path d="M2 8h18a2 2 0 0 1 2 2v10" />
            <path d="M2 17h20" />
            <path d="M6 8v9" />
        </svg>
    )
}


function BuildingIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
            <path d="M9 22v-4h6v4" />
            <path d="M8 6h.01" />
            <path d="M16 6h.01" />
            <path d="M12 6h.01" />
            <path d="M12 10h.01" />
            <path d="M12 14h.01" />
            <path d="M16 10h.01" />
            <path d="M16 14h.01" />
            <path d="M8 10h.01" />
            <path d="M8 14h.01" />
        </svg>
    )
}


function DownloadIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" x2="12" y1="15" y2="3" />
        </svg>
    )
}


function HeartIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        </svg>
    )
}


function ShareIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
            <polyline points="16 6 12 2 8 6" />
            <line x1="12" x2="12" y1="2" y2="15" />
        </svg>
    )
}


function SquareIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect width="18" height="18" x="3" y="3" rx="2" />
        </svg>
    )
}

function MapIcon(props: JSX.IntrinsicAttributes & SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
            <circle cx="12" cy="10" r="3" />
        </svg>
    )
}

