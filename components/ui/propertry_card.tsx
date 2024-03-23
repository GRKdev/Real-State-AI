// property_card.tsx
import { CardHeader, CardContent, CardFooter } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { PropertyCardProps } from '@/types/property';
import { JSX, SVGProps } from "react";
import MyImage from "@/components/fallback_img";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/components/ui/tabs"
import { Undo2, ZoomIn, SquareParking, Fence, Heater, WashingMachine, Armchair, TreePine, ArrowUpDown, RockingChair } from "lucide-react"

const featureMappings = [
    { key: 'parking', name: 'Parking', Icon: SquareParking },
    { key: 'heating', name: 'Heating', Icon: Heater },
    { key: 'furnished', name: 'Furnished', Icon: Armchair },
    { key: 'electrodometics', name: 'Electro.', Icon: WashingMachine },
    { key: 'balcony', name: 'Balcony', Icon: Fence },
    { key: 'terrace', name: 'Terrace', Icon: RockingChair },
    { key: 'garden', name: 'Garden', Icon: TreePine },
    { key: 'elevator', name: 'Elevator', Icon: ArrowUpDown },
];

export default function PropertyCard({

    property,
    className = '',
    style = {}
}: PropertyCardProps) {
    return (
        // Apply the className and style to the top-level div
        <div className={`card-container ${className}`} style={style}>
            <div className="w-full">
                <Tabs defaultValue="general">
                    <TabsContent value="general">
                        <div className="card">
                            <CardHeader>
                                <div className="image-container">
                                    <a href={`/property/${property.reference_number}`} target="_blank" rel="noopener noreferrer">

                                        <MyImage
                                            alt={property.title_cat}
                                            className="w-full h-56 object-cover image"
                                            width={350}
                                            height={200}
                                            src={property.photo}
                                            style={{
                                                aspectRatio: "350/200",
                                                objectFit: "cover",
                                                transition: "transform 0.3s ease",
                                            }}
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
                                                {property.bedrooms} {property.bedrooms === 1 ? 'room' : 'rooms'}
                                            </span>
                                        </div>
                                    )}
                                    {property.bathrooms > 0 && (
                                        <div className="flex items-center space-x-1">
                                            <BathIcon className="text-orange-500" />
                                            <span className="text-sm">
                                                {property.bathrooms} {property.bathrooms === 1 ? 'bathroom' : 'bathrooms'}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <Separator className="mb-2" />

                                <a href={`/property/${property.reference_number}`} target="_blank" rel="noopener noreferrer">
                                    <h3 className="text-lg font-semibold title-container hover:text-orange-500">{property.title_en}</h3>
                                </a>
                                <p className="text-lg font-bold text-orange-500 text-center items-start">
                                    {new Intl.NumberFormat('de-DE', {
                                        style: 'currency',
                                        currency: 'EUR',
                                        minimumFractionDigits: 0, // This removes decimals
                                        maximumFractionDigits: 0,
                                    }).format(property.price)}
                                    {property.transaction_type === 2 ? <small className="text-sm"> / mes</small> : ''}
                                </p>

                                <div className="flex justify-between items-center mt-2">

                                    <p className="flex items-center mb-1 gap-1">
                                        <BuildingIcon className="text-gray-500" />
                                        <span className="text-sm text-gray-500">
                                            {property.real_state === 1 ? "Baron & Cabot" : property.real_state === 2 ? "Deloitte" : property.real_state === 3 ? "Blackrock" : "Particular"}
                                        </span>
                                    </p>
                                    <p className="text-sm text-gray-500 text-right  ">Ref: {property.reference_number}</p>
                                </div>
                                <p className="flex items-center gap-1">
                                    <MapIcon className="text-gray-500" />
                                    <span className="text-sm text-gray-500">
                                        {property.parish === 1 ? "Andorra la Vella" : property.parish === 2 ? "Canillo" : property.parish === 3 ? "Encamp" : property.parish === 4 ? "La Massana" : property.parish === 5 ? "Ordino" : property.parish === 6 ? "Sant Julià" : property.parish === 7 ? "Escaldes-Engordany" : ""}
                                    </span>
                                </p>
                                <div className="flex justify-center pt-2">
                                    <TabsList>
                                        <TabsTrigger value="more_info"><ZoomIn className="text-gray-500 hover:text-orange-500 w-8 h-8" /></TabsTrigger>
                                    </TabsList>
                                </div>
                            </CardContent>

                        </div>

                    </TabsContent>
                    <TabsContent value="more_info">
                        <div className="card">
                            <CardContent>
                                <h2 className="text-sm description-container items-start mt-5 text-pretty">
                                    {property.description_en}
                                </h2>
                                <div className="grid grid-cols-2 mt-5 h-28 m-10 gap-2">
                                    {featureMappings.map(({ key, name, Icon }) =>
                                        property[key as keyof typeof property] ? (
                                            <div key={key} className="flex items-center mb-2">
                                                <Icon className="text-orange-500 mr-1 w-6 h-6" /> <span>{name}</span>
                                            </div>
                                        ) : null
                                    )}
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-center pt-1">
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

