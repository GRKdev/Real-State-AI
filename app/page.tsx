'use client'
import { NavbarSearch } from '@/components/ui/SearchBar';
import { useState } from 'react';

export default function Home() {
  const [response, setResponse] = useState('');

  const handleSearch = async (message: string, filter: string) => {
    try {
      const res = await fetch('/api/AI', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, filter }),
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data = await res.json();

      if (data.text) {
        const finalResponse = data.text + (filter ? filter : '');
        setResponse(finalResponse);
      } else {
        setResponse('No valid response from API');
      }
    } catch (error) {
      console.error('Error processing the response:', error);
      setResponse('Error parsing response');
    }
  };

  return (
    <div>
      <nav className="fixed top-0 left-0 right-0 flex justify-center items-center p-4 pt-10 bg-transparent">

        <NavbarSearch onSearch={handleSearch} />
      </nav>
      <div className="flex flex-col items-center justify-center min-h-screen">
        {response && <div className="mt-16 p-4 rounded">{response}</div>}
      </div>
    </div>
  );
}
