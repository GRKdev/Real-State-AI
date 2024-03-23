import { Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function HomeRedirect() {
    return (
        <div className="flex items-center space-x-2">
            <Button asChild variant="outline" size="icon" className=" hover:text-orange-500">
                <Link href="/">
                    <Home />
                </Link>
            </Button>
        </div>
    )
}
