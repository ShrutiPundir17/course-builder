import { Module, ContentItem } from '../types/course-builder';

export const validateUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const getFileExtension = (filename: string): string => {
  return filename.slice((filename.lastIndexOf('.') - 1 >>> 0) + 2);
};

export const isValidFileType = (file: File): boolean => {
  const allowedTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    'image/jpeg',
    'image/png',
    'image/gif',
    'video/mp4',
    'video/quicktime'
  ];
  return allowedTypes.includes(file.type);
};

export const exportCourseData = (modules: Module[], title: string = 'Course'): void => {
  const courseData = {
    modules,
    metadata: {
      title,
      createdAt: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      version: '1.0'
    }
  };

  const dataStr = JSON.stringify(courseData, null, 2);
  const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
  
  const exportFileDefaultName = `${title.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.json`;
  
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
};

export const calculateCourseStats = (modules: Module[]) => {
  const totalModules = modules.length;
  const totalItems = modules.reduce((sum, module) => sum + module.items.length, 0);
  const totalLinks = modules.reduce((sum, module) => 
    sum + module.items.filter(item => item.type === 'link').length, 0
  );
  const totalFiles = modules.reduce((sum, module) => 
    sum + module.items.filter(item => item.type === 'file').length, 0
  );

  return {
    totalModules,
    totalItems,
    totalLinks,
    totalFiles
  };
};