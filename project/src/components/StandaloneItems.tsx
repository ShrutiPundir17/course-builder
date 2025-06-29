import React from 'react';
import { useDrop } from 'react-dnd';
import ContentItem from './ContentItem';
import { ContentItem as ContentItemType } from '../types';

interface StandaloneItemsProps {
  items: ContentItemType[];
  onRenameItem: (itemId: string, newName: string) => void;
  onDeleteItem: (itemId: string) => void;
  onMoveItem: (dragModuleId: string | null, dragIndex: number, hoverModuleId: string | null, hoverIndex: number) => void;
}

interface DragItem {
  type: string;
  id: string;
  index: number;
  moduleId: string | null;
}

const StandaloneItems: React.FC<StandaloneItemsProps> = ({
  items,
  onRenameItem,
  onDeleteItem,
  onMoveItem,
}) => {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: 'content-item',
    collect(monitor) {
      return {
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
      };
    },
    drop(item: DragItem, monitor) {
      const dragModuleId = item.moduleId;
      const dragIndex = item.index;

      // If dropping from a module to standalone area, add to the end
      if (dragModuleId !== null) {
        onMoveItem(dragModuleId, dragIndex, null, items.length);
      }
    },
  });

  const isActive = isOver && canDrop;

  return (
    <div
      ref={drop}
      className={`bg-white rounded-lg border border-gray-200 shadow-sm p-4 ${
        isActive ? 'ring-2 ring-blue-500 bg-blue-50' : ''
      }`}
    >
      <div className="space-y-2">
        {items.map((item, index) => (
          <div key={item.id} id={`standalone-item-${item.id}`}>
            <ContentItem
              item={item}
              moduleId={null}
              index={index}
              onRename={(_, itemId, newName) => onRenameItem(itemId, newName)}
              onDelete={(_, itemId) => onDeleteItem(itemId)}
              onMoveItem={onMoveItem}
            />
          </div>
        ))}
      </div>

      {isActive && items.length === 0 && (
        <div className="h-16 border-2 border-dashed border-blue-400 rounded-lg bg-blue-50 flex items-center justify-center">
          <span className="text-blue-600 text-sm">Drop item here</span>
        </div>
      )}
    </div>
  );
};

export default StandaloneItems;