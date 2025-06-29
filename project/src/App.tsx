import React, { useState, useRef } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Header from './components/Header';
import ModuleList from './components/ModuleList';
import AddLinkModal from './components/AddLinkModal';
import AddModuleModal from './components/AddModuleModal';
import EmptyState from './components/EmptyState';
import StandaloneItems from './components/StandaloneItems';
import SearchSidebar from './components/SearchSidebar';
import { Module, ContentItem } from './types';

function App() {
  const [modules, setModules] = useState<Module[]>([]);
  const [standaloneItems, setStandaloneItems] = useState<ContentItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearchSidebarOpen, setIsSearchSidebarOpen] = useState(false);
  const [isAddLinkModalOpen, setIsAddLinkModalOpen] = useState(false);
  const [isAddModuleModalOpen, setIsAddModuleModalOpen] = useState(false);
  const [selectedModuleId, setSelectedModuleId] = useState<string | null>(null);

  const handleAddModule = (name: string) => {
    const newModule: Module = {
      id: Date.now().toString(),
      name,
      items: [],
      isCollapsed: false,
    };
    setModules([...modules, newModule]);
  };

  const handleAddLink = (moduleId: string | null, url: string, displayName: string) => {
    const newItem: ContentItem = {
      id: Date.now().toString(),
      type: 'link',
      name: displayName,
      url,
    };

    if (moduleId) {
      // Add to specific module
      setModules(modules.map(module => 
        module.id === moduleId 
          ? { ...module, items: [...module.items, newItem] }
          : module
      ));
    } else {
      // Add as standalone item
      setStandaloneItems([...standaloneItems, newItem]);
    }
  };

  const handleFileUpload = (moduleId: string | null, file: File) => {
    const newItem: ContentItem = {
      id: Date.now().toString(),
      type: 'file',
      name: file.name,
      file,
    };

    if (moduleId) {
      // Add to specific module
      setModules(modules.map(module => 
        module.id === moduleId 
          ? { ...module, items: [...module.items, newItem] }
          : module
      ));
    } else {
      // Add as standalone item
      setStandaloneItems([...standaloneItems, newItem]);
    }
  };

  const handleRenameModule = (moduleId: string, newName: string) => {
    setModules(modules.map(module => 
      module.id === moduleId 
        ? { ...module, name: newName }
        : module
    ));
  };

  const handleRenameItem = (moduleId: string | null, itemId: string, newName: string) => {
    if (moduleId) {
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
    } else {
      setStandaloneItems(standaloneItems.map(item =>
        item.id === itemId ? { ...item, name: newName } : item
      ));
    }
  };

  const handleDeleteModule = (moduleId: string) => {
    setModules(modules.filter(module => module.id !== moduleId));
  };

  const handleDeleteItem = (moduleId: string | null, itemId: string) => {
    if (moduleId) {
      setModules(modules.map(module => 
        module.id === moduleId 
          ? { ...module, items: module.items.filter(item => item.id !== itemId) }
          : module
      ));
    } else {
      setStandaloneItems(standaloneItems.filter(item => item.id !== itemId));
    }
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

  const moveItem = (dragModuleId: string | null, dragIndex: number, hoverModuleId: string | null, hoverIndex: number) => {
    if (dragModuleId === null && hoverModuleId === null) {
      // Moving within standalone items
      const draggedItem = standaloneItems[dragIndex];
      const newItems = [...standaloneItems];
      newItems.splice(dragIndex, 1);
      newItems.splice(hoverIndex, 0, draggedItem);
      setStandaloneItems(newItems);
    } else if (dragModuleId === null && hoverModuleId !== null) {
      // Moving from standalone to module
      const draggedItem = standaloneItems[dragIndex];
      setStandaloneItems(standaloneItems.filter((_, index) => index !== dragIndex));
      setModules(modules.map(module => {
        if (module.id === hoverModuleId) {
          const newItems = [...module.items];
          newItems.splice(hoverIndex, 0, draggedItem);
          return { ...module, items: newItems };
        }
        return module;
      }));
    } else if (dragModuleId !== null && hoverModuleId === null) {
      // Moving from module to standalone
      const sourceModule = modules.find(m => m.id === dragModuleId);
      if (!sourceModule) return;
      
      const draggedItem = sourceModule.items[dragIndex];
      setModules(modules.map(module => {
        if (module.id === dragModuleId) {
          return {
            ...module,
            items: module.items.filter((_, index) => index !== dragIndex)
          };
        }
        return module;
      }));
      
      const newStandaloneItems = [...standaloneItems];
      newStandaloneItems.splice(hoverIndex, 0, draggedItem);
      setStandaloneItems(newStandaloneItems);
    } else if (dragModuleId !== null && hoverModuleId !== null) {
      // Moving between modules
      const sourceModule = modules.find(m => m.id === dragModuleId);
      const targetModule = modules.find(m => m.id === hoverModuleId);
      
      if (!sourceModule || !targetModule) return;

      const draggedItem = sourceModule.items[dragIndex];
      
      setModules(modules.map(module => {
        if (module.id === dragModuleId) {
          return {
            ...module,
            items: module.items.filter((_, index) => index !== dragIndex)
          };
        } else if (module.id === hoverModuleId) {
          const newItems = [...module.items];
          newItems.splice(hoverIndex, 0, draggedItem);
          return {
            ...module,
            items: newItems
          };
        }
        return module;
      }));
    }
  };

  const openAddLinkModal = (moduleId?: string) => {
    if (moduleId) {
      setSelectedModuleId(moduleId);
    } else {
      setSelectedModuleId(null);
    }
    setIsAddLinkModalOpen(true);
  };

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    if (term && !isSearchSidebarOpen) {
      setIsSearchSidebarOpen(true);
    }
  };

  const handleSearchFocus = () => {
    if (searchTerm || modules.length > 0 || standaloneItems.length > 0) {
      setIsSearchSidebarOpen(true);
    }
  };

  const handleModuleClick = (moduleId: string) => {
    // Scroll to module and expand it if collapsed
    const moduleElement = document.getElementById(`module-${moduleId}`);
    if (moduleElement) {
      moduleElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      
      // Expand module if collapsed
      const module = modules.find(m => m.id === moduleId);
      if (module?.isCollapsed) {
        handleToggleModule(moduleId);
      }
    }
    setIsSearchSidebarOpen(false);
  };

  const handleItemClick = (moduleId: string | null, itemId: string) => {
    let targetElement: HTMLElement | null = null;
    
    if (moduleId) {
      targetElement = document.getElementById(`item-${moduleId}-${itemId}`);
      // Also expand the module if collapsed
      const module = modules.find(m => m.id === moduleId);
      if (module?.isCollapsed) {
        handleToggleModule(moduleId);
        // Wait for expansion animation
        setTimeout(() => {
          const element = document.getElementById(`item-${moduleId}-${itemId}`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 200);
      }
    } else {
      targetElement = document.getElementById(`standalone-item-${itemId}`);
    }
    
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    setIsSearchSidebarOpen(false);
  };

  const filteredModules = modules.filter(module =>
    module.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    module.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredStandaloneItems = standaloneItems.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gray-50">
        <Header 
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          modules={modules}
          onAddModule={() => setIsAddModuleModalOpen(true)}
          onAddLink={() => openAddLinkModal()}
          onFileUpload={(file) => handleFileUpload(null, file)}
          onSearchFocus={handleSearchFocus}
        />

        <div className="max-w-4xl mx-auto p-6">
          {modules.length === 0 && standaloneItems.length === 0 ? (
            <EmptyState onAddModule={() => setIsAddModuleModalOpen(true)} />
          ) : (
            <div className="space-y-6">
              {filteredStandaloneItems.length > 0 && (
                <StandaloneItems
                  items={filteredStandaloneItems}
                  onRenameItem={(itemId, newName) => handleRenameItem(null, itemId, newName)}
                  onDeleteItem={(itemId) => handleDeleteItem(null, itemId)}
                  onMoveItem={moveItem}
                />
              )}
              
              {filteredModules.length > 0 && (
                <ModuleList
                  modules={filteredModules}
                  onAddLink={openAddLinkModal}
                  onFileUpload={(moduleId, file) => handleFileUpload(moduleId, file)}
                  onRenameModule={handleRenameModule}
                  onRenameItem={(moduleId, itemId, newName) => handleRenameItem(moduleId, itemId, newName)}
                  onDeleteModule={handleDeleteModule}
                  onDeleteItem={(moduleId, itemId) => handleDeleteItem(moduleId, itemId)}
                  onToggleModule={handleToggleModule}
                  onMoveModule={moveModule}
                  onMoveItem={moveItem}
                />
              )}
            </div>
          )}
        </div>

        <SearchSidebar
          isOpen={isSearchSidebarOpen}
          onClose={() => setIsSearchSidebarOpen(false)}
          searchTerm={searchTerm}
          modules={modules}
          standaloneItems={standaloneItems}
          onModuleClick={handleModuleClick}
          onItemClick={handleItemClick}
        />

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
            handleAddLink(selectedModuleId, url, displayName);
            setIsAddLinkModalOpen(false);
            setSelectedModuleId(null);
          }}
          modules={modules}
          selectedModuleId={selectedModuleId}
          onModuleSelect={setSelectedModuleId}
          allowStandalone={true}
        />
      </div>
    </DndProvider>
  );
}

export default App;