import React from 'react';
import { Cpu } from 'lucide-react';

interface ConsensusPhaseIndicatorProps {
  phase: string;
  proposers: number;
  validations: number;
  roundTime: number;
}

export const ConsensusPhaseIndicator: React.FC<ConsensusPhaseIndicatorProps> = ({
  phase,
  proposers,
  validations,
  roundTime
}) => {
  const getPhaseColor = () => {
    switch (phase.toLowerCase()) {
      case 'open':
        return 'text-blue-500';
      case 'establish':
        return 'text-yellow-500';
      case 'accept':
        return 'text-green-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-500/5 to-blue-600/5 dark:from-blue-500/10 dark:to-blue-600/10 rounded-xl p-6 backdrop-blur-sm border border-blue-100 dark:border-blue-900 shadow-[0_0_25px_rgba(59,130,246,0.15)] dark:shadow-[0_0_25px_rgba(37,99,235,0.15)] hover:shadow-[0_0_35px_rgba(59,130,246,0.25)] dark:hover:shadow-[0_0_35px_rgba(37,99,235,0.25)] transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Cpu className="h-5 w-5 text-blue-500" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            Consensus Status
          </h3>
        </div>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${getPhaseColor()}`}>
          {phase}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Active Proposers
          </div>
          <div className="text-xl font-bold text-gray-900 dark:text-gray-100">
            {proposers}
          </div>
        </div>
        <div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Validations
          </div>
          <div className="text-xl font-bold text-gray-900 dark:text-gray-100">
            {validations}
          </div>
        </div>
        <div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Round Time
          </div>
          <div className="text-xl font-bold text-gray-900 dark:text-gray-100">
            {roundTime}s
          </div>
        </div>
      </div>

      <div className="mt-4">
        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${
              phase.toLowerCase() === 'open' ? 'bg-blue-500 w-1/3' :
              phase.toLowerCase() === 'establish' ? 'bg-yellow-500 w-2/3' :
              'bg-green-500 w-full'
            }`}
          />
        </div>
      </div>
    </div>
  );
};