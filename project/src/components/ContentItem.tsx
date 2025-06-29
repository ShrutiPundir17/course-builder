import React, { useState, useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { FiLink, FiFileText, FiMoreVertical, FiEdit2, FiTrash2, FiExternalLink, FiMove } from 'react-icons/fi';
import { ContentItem as ContentItemType } from '../types';

interface ContentItemProps {
  item: ContentItemType;
  moduleId: string | null;
  index: number;
  onRename: (moduleId: string | null, itemId: string, newName: string) => void;
  onDelete: (moduleId: string | null, itemId: string) => void;
  onMoveItem?: (dragModuleId: string | null, dragIndex: number, hoverModuleId: string | null, hoverIndex: number) => void;
}

interface DragItem {
  type: string;
  id: string;
  index: number;
  moduleId: string | null;
}

const ContentItem: React.FC<ContentItemProps> = ({
  item,
  moduleId,
  index,
  onRename,
  onDelete,
  onMoveItem,
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(item.name);
  const ref = useRef<HTMLDivElement>(null);

  const [{ handlerId, isOver, canDrop }, drop] = useDrop({
    accept: 'content-item',
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      };
    },
    hover(dragItem: DragItem, monitor) {
      if (!ref.current) {
        return;
      }

      const dragIndex = dragItem.index;
      const hoverIndex = index;
      const dragModuleId = dragItem.moduleId;
      const hoverModuleId = moduleId;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex && dragModuleId === hoverModuleId) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientY = clientOffset!.y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY && dragModuleId === hoverModuleId) {
        return;
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY && dragModuleId === hoverModuleId) {
        return;
      }

      // Time to actually perform the action
      if (onMoveItem) {
        onMoveItem(dragModuleId, dragIndex, hoverModuleId, hoverIndex);
      }

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      dragItem.index = hoverIndex;
      dragItem.moduleId = hoverModuleId;
    },
  });

  const [{ isDragging }, drag, preview] = useDrag({
    type: 'content-item',
    item: () => {
      return { id: item.id, index, moduleId, type: 'content-item' };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0.4 : 1;
  const isActive = isOver && canDrop;

  // Connect drag and drop refs
  drag(drop(ref));

  const handleRename = () => {
    if (newName.trim() && newName !== item.name) {
      onRename(moduleId, item.id, newName.trim());
    }
    setIsRenaming(false);
    setIsMenuOpen(false);
  };

  const getIcon = () => {
    return item.type === 'link' ? (
      <FiLink className="w-4 h-4 text-blue-500" />
    ) : (
      <FiFileText className="w-4 h-4 text-red-500" />
    );
  };

  const getTypeLabel = () => {
    return item.type === 'link' ? 'Link' : 'PDF';
  };

  const handleItemClick = () => {
    if (item.type === 'link' && item.url) {
      window.open(item.url, '_blank');
    } else if (item.type === 'file' && item.file) {
      const url = URL.createObjectURL(item.file);
      window.open(url, '_blank');
    }
  };

  return (
    <div
      ref={ref}
      style={{ opacity }}
      data-handler-id={handlerId}
      className={`flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group relative ${
        isActive ? 'ring-2 ring-blue-500 bg-blue-50' : ''
      }`}
    >
      {isActive && (
        <div className="absolute inset-0 bg-blue-100 border-2 border-dashed border-blue-400 rounded-lg pointer-events-none" />
      )}
      
      <div className="flex items-center gap-3 flex-1">
        <div 
          className="text-gray-400 hover:text-gray-600 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
          style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
        >
          <FiMove className="w-4 h-4" />
        </div>

        <div 
          className="flex items-center gap-3 flex-1 cursor-pointer"
          onClick={handleItemClick}
        >
          {getIcon()}
          <div className="flex-1">
            {isRenaming ? (
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onBlur={handleRename}
                onKeyPress={(e) => e.key === 'Enter' && handleRename()}
                className="w-full bg-transparent border-b border-blue-500 outline-none"
                autoFocus
              />
            ) : (
              <div className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                {item.name}
              </div>
            )}
            <div className="text-sm text-gray-500">{getTypeLabel()}</div>
          </div>
          {item.type === 'link' && (
            <FiExternalLink className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          )}
        </div>
      </div>

      <div className="relative">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsMenuOpen(!isMenuOpen);
          }}
          className="text-gray-400 hover:text-gray-600 p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <FiMoreVertical className="w-4 h-4" />
        </button>

        {isMenuOpen && (
          <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsRenaming(true);
                setIsMenuOpen(false);
              }}
              className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-3"
            >
              <FiEdit2 className="w-4 h-4 text-gray-500" />
              Rename
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(moduleId, item.id);
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
  );
};

export default ContentItem;