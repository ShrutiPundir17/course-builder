import React, { useState } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Header from './Header';
import ModuleList from './ModuleList';
import AddLinkModal from './AddLinkModal';
import AddModuleModal from './AddModuleModal';
import EmptyState from './EmptyState';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { Module, ContentItem } from '../../types/course-builder';

const CourseBuilder: React.FC = () => {
  const [modules, setModules] = useLocalStorage<Module[]>('course-modules', []);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddLinkModalOpen, setIsAddLinkModalOpen] = useState(false);
  const [isAddModuleModalOpen, setIsAddModuleModalOpen] = useState(false);
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);

  const handleAddModule = (name: string) => {
    const newModule: Module = {
      id: Date.now().toString(),
      name,
      items: [],
      isCollapsed: false,
      createdAt: new Date().toISOString(),
    };
    setModules([...modules, newModule]);
  };

  const handleAddLink = (moduleId: string, url: string, displayName: string) => {
    const newItem: ContentItem = {
      id: Date.now().toString(),
      type: 'link',
      name: displayName,
      url,
      createdAt: new Date().toISOString(),
    };

    setModules(modules.map(module => 
      module.id === moduleId 
        ? { ...module, items: [...module.items, newItem] }
        : module
    ));
  };

  const handleFileUpload = (moduleId: string, file: File) => {
    const newItem: ContentItem = {
      id: Date.now().toString(),
      type: 'file',
      name: file.name,
      file,
      createdAt: new Date().toISOString(),
    };

    setModules(modules.map(module => 
      module.id === moduleId 
        ? { ...module, items: [...module.items, newItem] }
        : module
    ));
  };

  const handleRenameModule = (moduleId: string, newName: string) => {
    setModules(modules.map(module => 
      module.id === moduleId 
        ? { ...module, name: newName }
        : module
    ));
  };

  const handleRenameItem = (moduleId: string, itemId: string, newName: string) => {
    setModules(modules.map(module => 
      module.id === moduleId 
        ? {
            ...module,
            items: module.items.map(item =>
              item.id === itemId ? { ...item, name: newName } : item
            )
          }
        : module
    ));
  };

  const handleDeleteModule = (moduleId: string) => {
    setModules(modules.filter(module => module.id !== moduleId));
  };

  const handleDeleteItem = (moduleId: string, itemId: string) => {
    setModules(modules.map(module => 
      module.id === moduleId 
        ? { ...module, items: module.items.filter(item => item.id !== itemId) }
        : module
    ));
  };

  const handleToggleModule = (moduleId: string) => {
    setModules(modules.map(module => 
      module.id === moduleId 
        ? { ...module, isCollapsed: !module.isCollapsed }
        : module
    ));
  };

  const moveModule = (dragIndex: number, hoverIndex: number) => {
    const draggedModule = modules[dragIndex];
    const newModules = [...modules];
    newModules.splice(dragIndex, 1);
    newModules.splice(hoverIndex, 0, draggedModule);
    setModules(newModules);
  };

  const openAddLinkModal = (moduleId?: string) => {
    if (moduleId) {
      setSelectedModuleId(moduleId);
      setIsAddLinkModalOpen(true);
    } else if (modules.length === 1) {
      setSelectedModuleId(modules[0].id);
      setIsAddLinkModalOpen(true);
    } else {
      setIsAddLinkModalOpen(true);
    }
  };

  const filteredModules = modules.filter(module =>
    module.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    module.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleExportData = () => {
    const dataStr = JSON.stringify(modules, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `course-data-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleImportData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target?.result as string);
          setModules(importedData);
        } catch (error) {
          alert('Invalid file format');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gray-50">
        <Header 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          modules={modules}
          onAddModule={() => setIsAddModuleModalOpen(true)}
          onAddLink={() => openAddLinkModal()}
          onFileUpload={handleFileUpload}
          onExportData={handleExportData}
          onImportData={handleImportData}
        />

        <div className="max-w-4xl mx-auto p-6">
          {modules.length === 0 ? (
            <EmptyState onAddModule={() => setIsAddModuleModalOpen(true)} />
          ) : (
            <ModuleList
              modules={filteredModules}
              onAddLink={openAddLinkModal}
              onFileUpload={handleFileUpload}
              onRenameModule={handleRenameModule}
              onRenameItem={handleRenameItem}
              onDeleteModule={handleDeleteModule}
              onDeleteItem={handleDeleteItem}
              onToggleModule={handleToggleModule}
              onMoveModule={moveModule}
            />
          )}
        </div>

        <AddModuleModal
          isOpen={isAddModuleModalOpen}
          onClose={() => setIsAddModuleModalOpen(false)}
          onAdd={handleAddModule}
        />

        <AddLinkModal
          isOpen={isAddLinkModalOpen}
          onClose={() => {
            setIsAddLinkModalOpen(false);
            setSelectedModuleId(null);
          }}
          onAdd={(url, displayName) => {
            const moduleId = selectedModuleId || modules[0]?.id;
            if (moduleId) {
              handleAddLink(moduleId, url, displayName);
            }
            setIsAddLinkModalOpen(false);
            setSelectedModuleId(null);
          }}
          modules={modules}
          selectedModuleId={selectedModuleId}
          onModuleSelect={setSelectedModuleId}
        />
      </div>
    </DndProvider>
  );
};

export default CourseBuilder;