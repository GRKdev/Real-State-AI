import Image from 'next/image';
import { useState } from 'react';

const MyImage = ({ src, fallbackSrc, ...props }) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  return (
    <>
      {isLoading && <div className="loading-spinner"></div>}
      <Image
        src={hasError ? fallbackSrc : src}
        alt="Generic Image"
        onError={() => !hasError && setHasError(true)}
        onLoadingComplete={() => setIsLoading(false)}
        objectFit="cover"
        {...props}
      />
    </>
  );
};

export default MyImage;