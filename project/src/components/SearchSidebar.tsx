import React from 'react';
import { FiX, FiChevronRight, FiLink, FiFileText, FiList } from 'react-icons/fi';
import { Module, ContentItem } from '../types';

interface SearchSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  searchTerm: string;
  modules: Module[];
  standaloneItems: ContentItem[];
  onModuleClick: (moduleId: string) => void;
  onItemClick: (moduleId: string | null, itemId: string) => void;
}

const SearchSidebar: React.FC<SearchSidebarProps> = ({
  isOpen,
  onClose,
  searchTerm,
  modules,
  standaloneItems,
  onModuleClick,
  onItemClick,
}) => {
  if (!isOpen) return null;

  const filteredModules = modules.filter(module =>
    module.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    module.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredStandaloneItems = standaloneItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const highlightText = (text: string, searchTerm: string) => {
    if (!searchTerm) return text;
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <span key={index} className="bg-yellow-200 text-yellow-800 px-1 rounded">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const showOutline = modules.length > 1;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div 
        className="flex-1 bg-black bg-opacity-25" 
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className="w-80 bg-white shadow-xl border-l border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            {searchTerm ? 'Search Results' : (showOutline ? 'Outline' : 'Course')}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Search term display */}
        {searchTerm && (
          <div className="px-4 py-2 bg-gray-50 border-b border-gray-200">
            <span className="text-sm text-gray-600">
              Searching for: <span className="font-medium">"{searchTerm}"</span>
            </span>
          </div>
        )}

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {searchTerm ? (
            <>
              {/* Search Results */}
              {/* Standalone Items */}
              {filteredStandaloneItems.length > 0 && (
                <div className="p-4 border-b border-gray-100">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    Standalone Items
                  </h3>
                  <div className="space-y-2">
                    {filteredStandaloneItems.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => onItemClick(null, item.id)}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer group"
                      >
                        {item.type === 'link' ? (
                          <FiLink className="w-4 h-4 text-blue-500 flex-shrink-0" />
                        ) : (
                          <FiFileText className="w-4 h-4 text-red-500 flex-shrink-0" />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate">
                            {highlightText(item.name, searchTerm)}
                          </div>
                          <div className="text-xs text-gray-500">
                            {item.type === 'link' ? 'Link' : 'File'}
                          </div>
                        </div>
                        <FiChevronRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Modules */}
              {filteredModules.map((module) => {
                const matchingItems = module.items.filter(item =>
                  item.name.toLowerCase().includes(searchTerm.toLowerCase())
                );
                const moduleMatches = module.name.toLowerCase().includes(searchTerm.toLowerCase());

                return (
                  <div key={module.id} className="border-b border-gray-100">
                    {/* Module Header */}
                    <div
                      onClick={() => onModuleClick(module.id)}
                      className="p-4 hover:bg-gray-50 cursor-pointer group"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate">
                            {highlightText(module.name, searchTerm)}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {module.items.length} item{module.items.length !== 1 ? 's' : ''}
                            {matchingItems.length > 0 && matchingItems.length < module.items.length && (
                              <span> • {matchingItems.length} matching</span>
                            )}
                          </div>
                        </div>
                        <FiChevronRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>

                    {/* Module Items */}
                    {matchingItems.length > 0 && (
                      <div className="pb-2">
                        {matchingItems.map((item) => (
                          <div
                            key={item.id}
                            onClick={() => onItemClick(module.id, item.id)}
                            className="flex items-center gap-3 px-8 py-2 hover:bg-gray-50 cursor-pointer group"
                          >
                            {item.type === 'link' ? (
                              <FiLink className="w-3 h-3 text-blue-500 flex-shrink-0" />
                            ) : (
                              <FiFileText className="w-3 h-3 text-red-500 flex-shrink-0" />
                            )}
                            <div className="flex-1 min-w-0">
                              <div className="text-xs font-medium text-gray-800 truncate">
                                {highlightText(item.name, searchTerm)}
                              </div>
                              <div className="text-xs text-gray-500">
                                {item.type === 'link' ? 'Link' : 'File'}
                              </div>
                            </div>
                            <FiChevronRight className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* No Results */}
              {filteredModules.length === 0 && filteredStandaloneItems.length === 0 && (
                <div className="p-8 text-center">
                  <div className="text-gray-400 mb-2">
                    <FiX className="w-8 h-8 mx-auto" />
                  </div>
                  <div className="text-sm text-gray-600">
                    No results found for "{searchTerm}"
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              {/* Outline View (when no search and multiple modules) */}
              {showOutline ? (
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <FiList className="w-4 h-4 text-gray-600" />
                    <h3 className="text-sm font-medium text-gray-700">
                      Course Outline
                    </h3>
                  </div>
                  <div className="space-y-3">
                    {modules.map((module, index) => (
                      <div key={module.id} className="space-y-1">
                        <div
                          onClick={() => onModuleClick(module.id)}
                          className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer group"
                        >
                          <div className="text-xs font-medium text-gray-500 mt-1 min-w-[20px]">
                            {index + 1}.
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-900 leading-tight">
                              {module.name}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              {module.items.length} item{module.items.length !== 1 ? 's' : ''}
                            </div>
                          </div>
                          <FiChevronRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity mt-0.5" />
                        </div>
                        
                        {/* Module Items in Outline */}
                        {module.items.length > 0 && (
                          <div className="ml-8 space-y-1">
                            {module.items.map((item, itemIndex) => (
                              <div
                                key={item.id}
                                onClick={() => onItemClick(module.id, item.id)}
                                className="flex items-center gap-2 p-1 rounded hover:bg-gray-50 cursor-pointer group"
                              >
                                <div className="text-xs text-gray-400 min-w-[16px]">
                                  {index + 1}.{itemIndex + 1}
                                </div>
                                {item.type === 'link' ? (
                                  <FiLink className="w-3 h-3 text-blue-500 flex-shrink-0" />
                                ) : (
                                  <FiFileText className="w-3 h-3 text-red-500 flex-shrink-0" />
                                )}
                                <div className="text-xs text-gray-700 truncate flex-1">
                                  {item.name}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                /* Single Module View */
                <div className="p-4">
                  <h3 className="text-sm font-medium text-gray-700 mb-3">
                    Course Content
                  </h3>
                  <div className="space-y-1">
                    {modules.map((module) => (
                      <div
                        key={module.id}
                        onClick={() => onModuleClick(module.id)}
                        className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 cursor-pointer group"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate">
                            {module.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {module.items.length} item{module.items.length !== 1 ? 's' : ''}
                          </div>
                        </div>
                        <FiChevronRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchSidebar;