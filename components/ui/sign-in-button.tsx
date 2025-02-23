'use client'
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

    return (
        <div>
            <SignedOut>
                <SignInButton>
                    <Button variant="outline">
                        {filtersDict?.sign_in ?? "Sign In"}
                    </Button>
                </SignInButton>
            </SignedOut>

            <div className="mr-4">
                <SignedIn>
                    <UserButton afterSignOutUrl={afterSignOutUrl} />
                </SignedIn>
            </div>
        </div>

    )
}