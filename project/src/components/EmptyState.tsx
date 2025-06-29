import React from 'react';
import { FiPlus } from 'react-icons/fi';

interface EmptyStateProps {
  onAddModule: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onAddModule }) => {
  return (
    <div className="text-center py-16">
      <div className="mb-8">
        <div className="mx-auto w-32 h-24 relative">
          {/* Box illustration */}
          <div className="absolute inset-0">
            <svg viewBox="0 0 128 96" className="w-full h-full">
              {/* Box base */}
              <path
                d="M16 48 L64 24 L112 48 L112 80 L64 96 L16 80 Z"
                fill="#FCD34D"
                stroke="#F59E0B"
                strokeWidth="2"
              />
              {/* Box top */}
              <path
                d="M16 48 L64 24 L112 48 L64 72 L16 48 Z"
                fill="#FEF3C7"
                stroke="#F59E0B"
                strokeWidth="2"
              />
              {/* Box side */}
              <path
                d="M64 72 L112 48 L112 80 L64 96 Z"
                fill="#FBBF24"
                stroke="#F59E0B"
                strokeWidth="2"
              />
              {/* Documents */}
              <rect x="32" y="16" width="24" height="32" rx="2" fill="#60A5FA" />
              <rect x="36" y="12" width="24" height="32" rx="2" fill="#3B82F6" />
              <rect x="40" y="8" width="24" height="32" rx="2" fill="#1D4ED8" />
              {/* Side documents */}
              <rect x="72" y="20" width="20" height="28" rx="2" fill="#C084FC" />
              <rect x="76" y="16" width="20" height="28" rx="2" fill="#A855F7" />
            </svg>
          </div>
        </div>
      </div>

      <div className="max-w-sm mx-auto">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Nothing added here yet
        </h3>
        <p className="text-gray-500 mb-6">
          Click on the [+] Add button to add items to this course
        </p>
        
        <button
          onClick={onAddModule}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 mx-auto transition-colors"
        >
          <FiPlus className="w-4 h-4" />
          Create your first module
        </button>
      </div>
    </div>
  );
};

export default EmptyState;