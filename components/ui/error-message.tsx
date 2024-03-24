// ErrorMessageAlert.tsx
import { AlertCircle } from "lucide-react";
import {
    Alert,
    AlertDescription,
    AlertTitle,
} from "@/components/ui/alert";

interface ErrorMessageAlertProps {
    errorMessage: string;
}

const ErrorMessageAlert: React.FC<ErrorMessageAlertProps> = ({ errorMessage }) => {
    return (
        <div className="flex justify-center items-center w-full pt-10">
            <div className="alert-container">
                <Alert variant="destructive">
                    <AlertCircle className="h-10 w-10" />
                    <AlertTitle className='ml-5 text-xl'>Error</AlertTitle>
                    <AlertDescription className='ml-5 text-md'>
                        {errorMessage}
                    </AlertDescription>
                </Alert>
            </div>
        </div>
    );
};

export default ErrorMessageAlert;
