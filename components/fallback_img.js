import Image from 'next/image';
import { useState } from 'react';

const MyImage = ({ src, fallbackSrc, ...props }) => {
  const [hasError, setHasError] = useState(false);

  return (
    <Image
      {...props}
      src={hasError ? fallbackSrc : src}
      alt="Generic Image"
      onError={() => !hasError && setHasError(true)}
    />
  );
};

export default MyImage;