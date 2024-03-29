import { useUser } from '@clerk/nextjs';

const WelcomeMessage: React.FC = () => {
    const { isSignedIn, user } = useUser();

    let welcomeMessage = "Welcome to this demo, don\'t forget to sign up to use it.";
    if (isSignedIn && user) {
        welcomeMessage = `Welcome ${user.firstName}! Enjoy this demo.`;
    }
    return (
        <div className="welcome-message ">
            <p className="italic">
                <strong>{welcomeMessage}</strong>
            </p>
            <h3>Overview Demo</h3>
            <p>
                Our Real Estate Search Engine is a cutting-edge platform designed specifically for the Andorran property market. Utilizing a fine-tuned model from OpenAI (babbage-002), the search engine offers unprecedented precision and speed. This innovative approach ensures that users receive the most relevant results quickly and efficiently, more than using traditional SQL agents and cheaper than directly generating SQL from a large language model (LLM).
            </p>
            <h3>Features</h3>
            <ul>
                <li>Multilingual Support: Catering to a diverse audience with support for Catalan, Spanish, English, and French.</li>
                <li>Advanced Search Filters: Users can refine their search with various filters and extra options to find their ideal property.</li>
                <li>AI-Powered Queries: Leverages a fine-tuned OpenAI model to interpret search inputs and generate precise API queries.</li>
                <li>Voice Search: Utilizes OpenAI's Whisper API to process voice commands for search queries.</li>
                <li>Real-Time Updates: Dynamically updates search results, providing immediate access to the latest properties.</li>
            </ul>
            <h3>Why a Fine-Tuned Model?</h3>
            <p>
                Choosing a fine-tuned model over traditional SQL agents or directly generating SQL from a large language model (LLM) presents several advantages:
            </p>
            <ul>
                <li><strong>Precision</strong>: We can train with an specific dataset and we will have less Errors and Hallucinations.</li>
                <li><strong>Speed</strong>: Although fine-tuning requires significant initial effort, the resulting model provides faster responses by directly generating API queries.</li>
                <li><strong>Data Importance</strong>: The quality of the parameters API heavily depends on the underlying data. Fine-tuning allows the model to leverage specific datasets for improved performance.</li>
            </ul>
            <h3>Technologies</h3>
            <ul>
                <li><a href="https://nextjs.org/" target="_blank">Next.js</a>: A React framework that enables functionality such as server-side rendering and generating static websites. Used for building the frontend interface, providing a dynamic and responsive user experience.</li>
                <li><a href="https://platform.openai.com/docs/overview" target="_blank">OpenAI's GPT (babbage-002)</a>: A language model fine-tuned for this application to understand and process real estate queries efficiently.</li>
                <li><a href="https://openai.com/research/whisper" target="_blank">OpenAI's Whisper</a>: A Speech-to-Text API that allows users to input search queries via voice commands.</li>
                <li><a href="https://vercel.com/docs/storage/vercel-postgres" target="_blank">Vercel PostgreSQL</a>: My choice for a highly scalable and managed database solution, ensuring robust and secure data management.</li>
                <li><a href="https://vercel.com/" target="_blank">Deployment on Vercel Servers</a>: For seamless hosting and superior performance, our platform is deployed on Vercel's cutting-edge infrastructure.</li>
                <li><a href="https://clerk.com/" target="_blank">Clerk</a>: A user authentication service that provides secure and customizable login functionality for our Real Estate Search Engine.</li>
            </ul>
        </div>
    );
};

export default WelcomeMessage;