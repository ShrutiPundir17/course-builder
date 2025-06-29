import React from 'react';
import ModuleItem from './ModuleItem';
import { Module } from '../types';

interface ModuleListProps {
  modules: Module[];
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

const ModuleList: React.FC<ModuleListProps> = ({
  modules,
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
  return (
    <div className="space-y-4">
      {modules.map((module, index) => (
        <ModuleItem
          key={module.id}
          module={module}
          index={index}
          onAddLink={onAddLink}
          onFileUpload={onFileUpload}
          onRenameModule={onRenameModule}
          onRenameItem={onRenameItem}
          onDeleteModule={onDeleteModule}
          onDeleteItem={onDeleteItem}
          onToggleModule={onToggleModule}
          onMoveModule={onMoveModule}
          onMoveItem={onMoveItem}
        />
      ))}
    </div>
  );
};

export default ModuleList;