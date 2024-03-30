import { useUser } from '@clerk/nextjs';
import { useWelcomeMessageDictionary } from '@/hooks/useWelcomeMessageDictionary';

const WelcomeMessage: React.FC = () => {
    const { isSignedIn, user } = useUser();
    const welcomeMessageDict = useWelcomeMessageDictionary();

    let welcomeMessage = welcomeMessageDict.welcomeUser.welcome_no_user;
    if (isSignedIn && user) {
        welcomeMessage = `${welcomeMessageDict.welcomeUser.welcome} ${user.firstName || ''}! ${welcomeMessageDict.welcomeUser.message}`;
    }

    return (
        <div className="welcome-message">
            <p className="italic">
                <strong>{welcomeMessage}</strong>
            </p>
            <h3>{welcomeMessageDict.overview.title}</h3>
            <p>
                {welcomeMessageDict.overview.description}
            </p>
            <h3>{welcomeMessageDict.features.title}</h3>
            <ul>
                {welcomeMessageDict.features.items.map((item, index) => (
                    <li key={index}>{item}</li>
                ))}
            </ul>
            <h3>{welcomeMessageDict.fine_tuned.title}</h3>
            <p>
                {welcomeMessageDict.fine_tuned.description}
            </p>
            <ul>
                {welcomeMessageDict.fine_tuned.items.map((item, index) => (
                    <li key={index}>{item}</li>
                ))}
            </ul>
            <h3>{welcomeMessageDict.technology.title}</h3>
            <ul>
                {welcomeMessageDict.technology.items.map((item, index) => (
                    <li key={index}>{item}</li>
                ))}
            </ul>
        </div>
    );
};

export default WelcomeMessage;
