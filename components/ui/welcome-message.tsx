import { useUser } from '@clerk/nextjs';
import { useDictionary } from '@/hooks/useDictionary';

const WelcomeMessage: React.FC = () => {
    const { isSignedIn, user } = useUser();
    const welcomeMessageDict = useDictionary('welcomeMessage');

    // ✅ Asegurar que `welcomeMessageDict` y sus propiedades existen antes de usarlas
    if (!welcomeMessageDict || !welcomeMessageDict.welcomeUser) {
        return <p>Loading...</p>;
    }

    let welcomeMessage = welcomeMessageDict.welcomeUser.welcome_no_user;
    if (isSignedIn && user) {
        welcomeMessage = `${welcomeMessageDict.welcomeUser.welcome} ${user.firstName || ''}${welcomeMessageDict.welcomeUser.message}`;
    }

    return (
        <div className="welcome-message">
            <p className="italic">
                <strong>{welcomeMessage}</strong>
            </p>
            <h3>{welcomeMessageDict.overview?.title || 'Loading...'}</h3>
            <p>{welcomeMessageDict.overview?.description || 'Loading...'}</p>
            <h3>{welcomeMessageDict.examples?.title || 'Loading...'}</h3>
            <ul>
                {welcomeMessageDict.examples?.items?.map((item, index) => (
                    <li key={index} style={{ fontStyle: 'italic' }}>{item}</li>
                )) || <p>Loading...</p>}
            </ul>
            <h3>{welcomeMessageDict.features?.title || 'Loading...'}</h3>
            <ul>
                {welcomeMessageDict.features?.items?.map((item, index) => (
                    <li key={index}>{item}</li>
                )) || <p>Loading...</p>}
            </ul>
            <h3>{welcomeMessageDict.fine_tuned?.title || 'Loading...'}</h3>
            <p>{welcomeMessageDict.fine_tuned?.description || 'Loading...'}</p>
            <ul>
                {welcomeMessageDict.fine_tuned?.items?.map((item, index) => (
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
