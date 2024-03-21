import Image from 'next/image';
import { useState } from 'react';

const MyImage = ({ src, fallbackSrc, ...props }) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Track loading state

  return (
    <>
      {isLoading && (
        <div className="image-skeleton"></div> // Placeholder shown while image is loading
      )}
      <Image
        {...props}
        src={hasError ? fallbackSrc : src}
        alt="Generic Image"
        onError={() => !hasError && setHasError(true)}
        onLoadingComplete={() => setIsLoading(false)} // Hide placeholder once image has loaded
      />
    </>
  );
};

export default MyImage;