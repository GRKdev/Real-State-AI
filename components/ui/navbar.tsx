import Logo from "@/components/ui/logo";
import { Button_Signin } from "@/components/ui/sign-in-button";
import LocaleSwitcher from "@/components/locale-switcher";
import { ModeToggle } from "@/components/ui/toggle-theme";
import { Locale } from "@/i18n-config";

interface NavbarProps {
    lang: Locale;
}

export default function Navbar({ lang }: NavbarProps) {
    return (
        <>
            <div className="fixed z-50 pl-40 pt-5 hidden lg:block">
                <Logo lang={lang} />
            </div>
            <div className="fixed flex top-0 right-0 p-4 z-50 items-center">
                <Button_Signin />
                <div className="hidden lg:block">
                    <LocaleSwitcher />
                    <ModeToggle />
                </div>
            </div>
        </>
    );
}
