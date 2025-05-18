# Real Estate Search Engine for Andorra

## Overview

Our Real Estate Search Engine is a cutting-edge platform designed specifically for the Andorran property market. Utilizing OpenAI's GPT-4o-mini with carefully crafted system prompts, the search engine offers precise and efficient property search capabilities. This approach ensures that users receive the most relevant results quickly and efficiently.

## Features

- **Multilingual Support**: Catering to a diverse audience with support for Catalan, Spanish, English, and French.
- **Advanced Search Filters**: Users can refine their search with various filters and extra options to find their ideal property.
- **AI-Powered Queries**: Leverages GPT-4o-mini with system prompts to interpret search inputs and generate precise API queries.
- **Real-Time Updates**: Dynamically updates search results, providing immediate access to the latest properties.
- **Voice Search**: Utilizes OpenAI's Whisper API to process voice commands for search queries.
- **Live Chat Support**: Integrated Crisp chatbot for instant customer support, property inquiries, and company information. Users can interact with our automated assistant or connect with our support team directly through the chat interface.

## Why System Prompts?

Using GPT-4o-mini with system prompts presents several advantages:

- **Flexibility**: System prompts can be easily modified and updated without requiring model retraining.
- **Cost-Effective**: No need for fine-tuning, making it more economical to maintain and update.
- **Immediate Updates**: Changes to search logic can be implemented instantly through prompt modifications.
- **Consistent Performance**: System prompts provide reliable and consistent query interpretation.

Example of a system prompt:
```
You are a real estate search assistant. Convert natural language queries into API parameters.
For example:
- "Penthouses for sale in Les Bons less than 400000 €" → "location=33&transaction_type=1&property_type=15&maxprice=400000"
- "Lofts for sale in Ordino" → "location=5&transaction_type=1&property_type=18"
```

## Technologies

- **Next.js**: A React framework that enables functionality such as server-side rendering and generating static websites. Used for building the frontend interface, providing a dynamic and responsive user experience.
- **OpenAI's GPT-4o-mini**: A powerful language model used with system prompts to understand and process real estate queries efficiently.
- **OpenAI's Whisper API**: A voice recognition API that allows users to input search queries using voice commands.
- **Vercel PostgreSQL**: My choice for a highly scalable and managed database solution, ensuring robust and secure data management.
- **Deployment on Vercel Servers**: For seamless hosting and superior performance, our platform is deployed on Vercel's cutting-edge infrastructure.
- **Clerk**: A user authentication service that provides secure and customizable login functionality for our Real Estate Search Engine.
- **Crisp**: An integrated customer support platform providing automated chatbot functionality and live chat support for user assistance, property inquiries, and company information.

## Demo

Experience our Real Estate Search Engine firsthand at [rs.iand.dev](https://rs.iand.dev).
