export interface ContentItem {
  id: string;
  type: 'link' | 'file';
  name: string;
  url?: string;
  file?: File;
}

export interface Module {
  id: string;
  name: string;
  items: ContentItem[];
  isCollapsed: boolean;
}