import React, { useState, useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { FiChevronRight, FiChevronDown, FiMoreVertical, FiPlus, FiLink, FiUpload, FiEdit2, FiTrash2, FiMove } from 'react-icons/fi';
import ContentItem from './ContentItem';
import { Module } from '../types';

interface ModuleItemProps {
  module: Module;
  index: number;
  onAddLink: (moduleId: string) => void;
  onFileUpload: (moduleId: string, file: File) => void;
  onRenameModule: (moduleId: string, newName: string) => void;
  onRenameItem: (moduleId: string, itemId: string, newName: string) => void;
  onDeleteModule: (moduleId: string) => void;
  onDeleteItem: (moduleId: string, itemId: string) => void;
  onToggleModule: (moduleId: string) => void;
  onMoveModule: (dragIndex: number, hoverIndex: number) => void;
  onMoveItem?: (dragModuleId: string | null, dragIndex: number, hoverModuleId: string | null, hoverIndex: number) => void;
}

interface DragItem {
  type: string;
  id: string;
  index: number;
  moduleId?: string | null;
}

const ModuleItem: React.FC<ModuleItemProps> = ({
  module,
  index,
  onAddLink,
  onFileUpload,
  onRenameModule,
  onRenameItem,
  onDeleteModule,
  onDeleteItem,
  onToggleModule,
  onMoveModule,
  onMoveItem,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(module.name);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const ref = useRef<HTMLDivElement>(null);
  const dragRef = useRef<HTMLDivElement>(null);

  // Drop functionality for content items
  const [{ handlerId: contentHandlerId, isOver: isContentOver, canDrop: canContentDrop }, contentDrop] = useDrop({
    accept: 'content-item',
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      };
    },
    drop(item: DragItem, monitor) {
      if (!ref.current) {
        return;
      }

      const dragModuleId = item.moduleId;
      const dragIndex = item.index;
      const hoverModuleId = module.id;

      // If dropping on a different module, add to the end
      if (dragModuleId !== hoverModuleId && onMoveItem) {
        onMoveItem(dragModuleId!, dragIndex, hoverModuleId, module.items.length);
      }
    },
  });

  // Drop functionality for module reordering
  const [{ handlerId: moduleHandlerId }, moduleDrop] = useDrop({
    accept: 'module',
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      if (dragIndex === hoverIndex) {
        return;
      }

      const hoverBoundingRect = ref.current?.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset!.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      onMoveModule(dragIndex, hoverIndex);
      item.index = hoverIndex;
    },
  });

  // Drag functionality for modules
  const [{ isDragging }, moduleDrag] = useDrag({
    type: 'module',
    item: () => {
      return { id: module.id, index, type: 'module' };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0.4 : 1;
  const isContentActive = isContentOver && canContentDrop;

  // Connect drop refs
  contentDrop(ref);
  moduleDrop(ref);
  moduleDrag(dragRef);

  const handleRename = () => {
    if (newName.trim() && newName !== module.name) {
      onRenameModule(module.id, newName.trim());
    }
    setIsRenaming(false);
    setIsMenuOpen(false);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onFileUpload(module.id, file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div
      id={`module-${module.id}`}
      ref={ref}
      style={{ opacity }}
      data-handler-id={`${contentHandlerId}-${moduleHandlerId}`}
      className={`bg-white rounded-lg border border-gray-200 shadow-sm ${
        isContentActive ? 'ring-2 ring-blue-500 bg-blue-50' : ''
      }`}
    >
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div 
              ref={dragRef}
              className="text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing"
              style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
            >
              <FiMove className="w-4 h-4" />
            </div>
            
            <button
              onClick={() => onToggleModule(module.id)}
              className="text-gray-500 hover:text-gray-700"
            >
              {module.isCollapsed ? (
                <FiChevronRight className="w-4 h-4" />
              ) : (
                <FiChevronDown className="w-4 h-4" />
              )}
            </button>

            {isRenaming ? (
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onBlur={handleRename}
                onKeyPress={(e) => e.key === 'Enter' && handleRename()}
                className="font-medium text-gray-900 bg-transparent border-b border-blue-500 outline-none"
                autoFocus
              />
            ) : (
              <h3 className="font-medium text-gray-900">{module.name}</h3>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onAddLink(module.id)}
              className="text-blue-500 hover:text-blue-600 p-1 rounded"
              title="Add link"
            >
              <FiPlus className="w-4 h-4" />
            </button>

            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded"
              >
                <FiMoreVertical className="w-4 h-4" />
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
                  <button
                    onClick={() => {
                      onAddLink(module.id);
                      setIsMenuOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3"
                  >
                    <FiLink className="w-4 h-4 text-gray-500" />
                    Add a link
                  </button>
                  <button
                    onClick={() => {
                      fileInputRef.current?.click();
                      setIsMenuOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3"
                  >
                    <FiUpload className="w-4 h-4 text-gray-500" />
                    Upload
                  </button>
                  <hr className="my-2" />
                  <button
                    onClick={() => {
                      setIsRenaming(true);
                      setIsMenuOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3"
                  >
                    <FiEdit2 className="w-4 h-4 text-gray-500" />
                    Rename
                  </button>
                  <button
                    onClick={() => {
                      onDeleteModule(module.id);
                      setIsMenuOpen(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3 text-red-600"
                  >
                    <FiTrash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {module.items.length > 0 && !module.isCollapsed && (
          <div className="text-sm text-gray-500 mt-1">
            {module.items.length} item{module.items.length !== 1 ? 's' : ''}
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileSelect}
        className="hidden"
        accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png,.mp4,.mov"
      />

      {!module.isCollapsed && (
        <div className="p-4">
          {module.items.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="mb-2">Add items to this module</div>
              <div className="text-sm">Click the + button to add links or upload files</div>
            </div>
          ) : (
            <div className="space-y-2">
              {module.items.map((item, itemIndex) => (
                <div key={item.id} id={`item-${module.id}-${item.id}`}>
                  <ContentItem
                    item={item}
                    moduleId={module.id}
                    index={itemIndex}
                    onRename={(moduleId, itemId, newName) => onRenameItem(moduleId!, itemId, newName)}
                    onDelete={(moduleId, itemId) => onDeleteItem(moduleId!, itemId)}
                    onMoveItem={onMoveItem}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {isContentActive && module.items.length === 0 && !module.isCollapsed && (
        <div className="absolute inset-x-4 bottom-4 h-2 bg-blue-400 rounded-full opacity-50" />
      )}
    </div>
  );
};

export default ModuleItem;