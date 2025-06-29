export interface ContentItem {
  id: string;
  type: 'link' | 'file';
  name: string;
  url?: string;
  file?: File;
  createdAt: string;
}

export interface Module {
  id: string;
  name: string;
  items: ContentItem[];
  isCollapsed: boolean;
  createdAt: string;
}

export interface CourseData {
  modules: Module[];
  metadata: {
    title: string;
    description?: string;
    createdAt: string;
    lastModified: string;
  };
}