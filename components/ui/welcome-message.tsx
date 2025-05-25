import { useUser } from '@clerk/nextjs';
import { useDictionary } from '@/hooks/useDictionary';
import { Copy } from 'lucide-react';
import { useState } from 'react';

const WelcomeMessage: React.FC = () => {
    const { isSignedIn, user } = useUser();
    const welcomeMessageDict = useDictionary('welcomeMessage');
    const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

    // ✅ Asegurar que `welcomeMessageDict` y sus propiedades existen antes de usarlas
    if (!welcomeMessageDict || !welcomeMessageDict.welcomeUser) {
        return <p>Loading...</p>;
    }

    let welcomeMessage = welcomeMessageDict.welcomeUser.welcome_no_user;
    if (isSignedIn && user) {
        welcomeMessage = `${welcomeMessageDict.welcomeUser.welcome} ${user.firstName || ''}${welcomeMessageDict.welcomeUser.message}`;
    }

    const handleCopy = (text: string, index: number) => {
        navigator.clipboard.writeText(text);
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    return (
        <div className="welcome-message">
            <p className="italic">
                <strong>{welcomeMessage}</strong>
            </p>
            <h3>{welcomeMessageDict.overview?.title || 'Loading...'}</h3>
            <p>{welcomeMessageDict.overview?.description || 'Loading...'}</p>
            <h3>{welcomeMessageDict.examples?.title || 'Loading...'}</h3>
            <ul className="space-y-2">
                {welcomeMessageDict.examples?.items?.map((item, index) => {
                    const [query] = item.split(' --> ');
                    return (
                        <li key={index} className="flex items-center gap-2 group">
                            <span
                                className="cursor-pointer hover:text-orange-500 transition-colors"
                                onClick={() => handleCopy(query, index)}
                            >
                                {item}
                            </span>
                            <button
                                onClick={() => handleCopy(query, index)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded"
                                title="Copy to clipboard"
                            >
                                <Copy className="w-4 h-4" />
                            </button>
                            {copiedIndex === index && (
                                <span className="text-sm text-green-500">Copied!</span>
                            )}
                        </li>
                    );
                }) || <p>Loading...</p>}
            </ul>
            <h3>{welcomeMessageDict.features?.title || 'Loading...'}</h3>
            <ul>
                {welcomeMessageDict.features?.items?.map((item, index) => (
                    <li key={index}>{item}</li>
                )) || <p>Loading...</p>}
            </ul>
            <h3>{welcomeMessageDict.system_prompts?.title || 'Loading...'}</h3>
            <p>{welcomeMessageDict.system_prompts?.description || 'Loading...'}</p>
            <ul>
                {welcomeMessageDict.system_prompts?.items?.map((item, index) => (
                    <li key={index}>{item}</li>
                )) || <p>Loading...</p>}
            </ul>
            <h3>{welcomeMessageDict.technology?.title || 'Loading...'}</h3>
            <ul>
                {welcomeMessageDict.technology?.items?.map((item, index) => (
                    <li key={index}>{item}</li>
                )) || <p>Loading...</p>}
            </ul>
        </div>
    );
};

export default WelcomeMessage;
