'use client'
import { useFiltersDictionary } from "@/hooks/useFiltersDictionary";
import { Button } from "@/components/ui/button";
import {
    SignInButton,
    UserButton,
    SignedIn,
    SignedOut,
} from "@clerk/nextjs";
import { useLocale } from '@/contexts/localeContext';


export const Button_Signin = () => {
    const filtersDict = useFiltersDictionary();
    const { locale: currentLocale } = useLocale();
    const afterSignOutUrl = `/${currentLocale}`;

    return (
        <div>
            <SignedOut>
                <SignInButton>
                    <Button variant="outline">
                        {filtersDict.sign_in}
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