'use client';

import { useEffect, useState } from 'react';

interface ServiceFrameProps {
  url: string;
  serviceName: string;
}

export const ServiceFrame: React.FC<ServiceFrameProps> = ({ url, serviceName }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [frameUrl, setFrameUrl] = useState<string>('');

  useEffect(() => {
    // All services use cookie-based authentication
    // The user's session cookies will be automatically sent with the iframe requests
    console.log('[ServiceFrame] Using cookie-based authentication for', serviceName, 'at', url);
    setFrameUrl(url);
  }, [url, serviceName]);

  const handleLoad = () => {
    setIsLoading(false);
  };

  // Don't render iframe until we have the URL with token
  if (!frameUrl) {
    return (
      <div className="relative w-full h-full">
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Preparing {serviceName}...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full flex-1 min-h-0">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-90 z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading {serviceName}...</p>
          </div>
        </div>
      )}
      <iframe
        src={frameUrl}
        className="w-full h-full"
        style={{ 
          border: 'none',
          outline: 'none',
          display: 'block'
        }}
        title={serviceName}
        onLoad={handleLoad}
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals"
      />
    </div>
  );
};
