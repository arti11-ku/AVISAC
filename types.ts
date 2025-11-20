
export type UserRole = 'student' | 'government';
export type NotificationType = 'info' | 'alert' | 'success';
export type Priority = 'low' | 'medium' | 'high' | 'urgent';

export interface Notification {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  category: string;
  targetAudience: string;
  timestamp: string;
  read: boolean;
  link: string;
  priority: Priority;
}

export interface PdfDocument {
  id: number;
  title: string;
  description: string;
  category: string;
  uploadedBy: string;
  uploadDate: string;
  size: string;
  downloads: number;
  tags: string[];
  viewed: boolean;
  fileData?: File; // For newly uploaded files
  fileName?: string;
}
