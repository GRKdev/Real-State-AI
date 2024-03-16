import { Skeleton } from "@/components/ui/skeleton"


export default function SkeletonCard() {
    return (
        <div className="card-container">
            <div className="w-full">
                <div className="card">
                    {/* Mimic CardHeader with image placeholder */}

                    <Skeleton className="h-48 m-6 rounded-t-md" />

                    {/* Mimic CardContent */}
                    <div className="p-4">
                        <div className="flex justify-between items-center mb-1 space-x-1">
                            {/* Placeholder for Square Meters */}
                            <Skeleton className="h-4 w-1/4" />
                            {/* Placeholder for Bedrooms, conditionally rendered in actual card */}
                            <Skeleton className="h-4 w-1/6" />
                            {/* Placeholder for Bathrooms, conditionally rendered in actual card */}
                            <Skeleton className="h-4 w-1/6" />
                        </div>
                        {/* Placeholder for the title */}
                        <Skeleton className="h-6 w-3/4 my-2" />
                        {/* Placeholder for the price */}
                        <Skeleton className="h-6 w-1/2 my-2 justify-center" />
                        {/* Additional placeholders mimicking the structure of your actual content */}
                        <div className="flex justify-between items-center mt-2 space-x-1">
                            <Skeleton className="h-4 w-1/4" />
                            <Skeleton className="h-4 w-1/5" />
                        </div>
                    </div>
                    {/* Mimic CardFooter */}
                    <div className="flex justify-center gap-4 p-4">
                        <Skeleton className="h-6 w-6" />
                        <Skeleton className="h-6 w-6" />
                        <Skeleton className="h-6 w-6" />
                    </div>
                </div>
            </div>
        </div>
    );
}
