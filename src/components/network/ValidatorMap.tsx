import React from 'react';
import { Globe } from 'lucide-react';

interface ValidatorMapProps {
  validators: {
    region: string;
    count: number;
    health: number;
  }[];
}

export const ValidatorMap: React.FC<ValidatorMapProps> = ({ validators }) => {
  return (
    <div className="bg-gradient-to-br from-blue-500/5 to-blue-600/5 dark:from-blue-500/10 dark:to-blue-600/10 rounded-xl p-6 backdrop-blur-sm border border-blue-100 dark:border-blue-900 shadow-[0_0_25px_rgba(59,130,246,0.15)] dark:shadow-[0_0_25px_rgba(37,99,235,0.15)] hover:shadow-[0_0_35px_rgba(59,130,246,0.25)] dark:hover:shadow-[0_0_35px_rgba(37,99,235,0.25)] transition-all duration-300">
      <div className="flex items-center space-x-2 mb-4">
        <Globe className="h-5 w-5 text-blue-500" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
          Validator Distribution
        </h3>
      </div>
      
      <div className="space-y-4">
        {validators.map((region) => (
          <div key={region.region} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {region.region}
              </span>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                ({region.count} validators)
              </span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-32 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full"
                  style={{ width: `${region.health}%` }}
                />
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {region.health}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};