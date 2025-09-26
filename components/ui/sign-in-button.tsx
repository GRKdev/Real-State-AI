'use client'
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    SignInButton,
    UserButton,
    SignedIn,
    SignedOut,
} from "@clerk/nextjs";
import { useLocale } from '@/contexts/localeContext';
import { useDictionary } from "@/hooks/useDictionary";

export const Button_Signin = () => {
    const filtersDict = useDictionary('filters');
    const { locale: currentLocale } = useLocale();
    const afterSignOutUrl = `/${currentLocale}`;
    const manageLabel = filtersDict?.manage_properties ?? 'Manage properties';

    return (
        <div className="flex items-center gap-3">
            <SignedOut>
                <SignInButton>
                    <Button variant="outline">
                        {filtersDict?.sign_in ?? "Sign In"}
                    </Button>
                </SignInButton>
            </SignedOut>

            <SignedIn>
                <div className="flex items-center gap-3 mr-4">
                    <Link href={`/${currentLocale}/manage-properties`}>
                        <Button variant="default" className="whitespace-nowrap">
                            {manageLabel}
                        </Button>
                    </Link>
                    <UserButton afterSignOutUrl={afterSignOutUrl} />
                </div>
            </SignedIn>
        </div>

    )
}
