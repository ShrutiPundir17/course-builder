import React, { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import { Module } from '../types';

interface AddLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (url: string, displayName: string) => void;
  modules: Module[];
  selectedModuleId: string | null;
  onModuleSelect: (moduleId: string | null) => void;
  allowStandalone?: boolean;
}

const AddLinkModal: React.FC<AddLinkModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  modules,
  selectedModuleId,
  onModuleSelect,
  allowStandalone = false,
}) => {
  const [url, setUrl] = useState('');
  const [displayName, setDisplayName] = useState('');

  useEffect(() => {
    if (isOpen) {
      setUrl('');
      setDisplayName('');
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim() && displayName.trim()) {
      onAdd(url.trim(), displayName.trim());
      setUrl('');
      setDisplayName('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Add new link</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {(modules.length > 0 || allowStandalone) && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Add to
              </label>
              <select
                value={selectedModuleId || ''}
                onChange={(e) => onModuleSelect(e.target.value || null)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              >
                {allowStandalone && (
                  <option value="">Create as standalone item</option>
                )}
                {modules.map((module) => (
                  <option key={module.id} value={module.id}>
                    {module.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://www.trigonometryfordummies.com"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Display name
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Understanding trigonometry"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg transition-colors"
              disabled={!url.trim() || !displayName.trim()}
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddLinkModal;