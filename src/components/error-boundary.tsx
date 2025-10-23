// src/components/error-boundary.tsx
'use client';

import { useEffect } from 'react';

export function ErrorBoundary({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const handleChunkError = (event: ErrorEvent) => {
      const errorMessage = event.error?.message || '';
      if (errorMessage.includes('Loading chunk')) {
        console.warn('Chunk load error detected, reloading page...');
        window.location.reload();
      }
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const errorMessage = event.reason?.message || '';
      if (errorMessage.includes('Loading chunk')) {
        console.warn('Chunk load promise rejection detected, reloading page...');
        window.location.reload();
      }
    };

    window.addEventListener('error', handleChunkError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleChunkError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return <>{children}</>;
}