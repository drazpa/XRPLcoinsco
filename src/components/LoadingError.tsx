import React from 'react';
import { AlertCircle } from 'lucide-react';

interface LoadingErrorProps {
  message: string;
  subMessage?: string;
}

export const LoadingError: React.FC<LoadingErrorProps> = ({ message, subMessage }) => {
  return (
    <div className="flex items-center p-4 rounded-lg bg-red-50 dark:bg-red-900/20">
      <AlertCircle className="h-5 w-5 text-red-400 mr-3 flex-shrink-0" />
      <div>
        <p className="text-sm font-medium text-red-800 dark:text-red-200">
          {message}
        </p>
        {subMessage && (
          <p className="mt-1 text-sm text-red-700 dark:text-red-300">
            {subMessage}
          </p>
        )}
      </div>
    </div>
  );
}