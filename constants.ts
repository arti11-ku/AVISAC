
import type { Notification, PdfDocument } from './types';

export const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 1,
    type: 'info',
    title: 'Understanding Aadhaar Linking',
    message: 'Learn the difference between Aadhaar-linked and DBT-enabled accounts. Click here to explore our comprehensive guide.',
    category: 'Educational',
    targetAudience: 'All Students',
    timestamp: '2025-11-15T10:30:00Z',
    read: false,
    link: '/guides/aadhaar-linking',
    priority: 'medium'
  },
  {
    id: 2,
    type: 'alert',
    title: 'New DBT Scheme Announced',
    message: 'Government announces new Direct Benefit Transfer scheme for students. Ensure your bank account is DBT-enabled to receive benefits.',
    category: 'Scheme Update',
    targetAudience: 'All Students',
    timestamp: '2025-11-14T14:20:00Z',
    read: false,
    link: '/schemes/latest',
    priority: 'high'
  },
  {
    id: 3,
    type: 'alert',
    title: 'Scholarship Disbursement Alert',
    message: 'Upcoming scholarship disbursement requires DBT-enabled account. Verify your account status now to avoid delays.',
    category: 'Scholarship',
    targetAudience: 'Graduate Students',
    timestamp: '2025-11-10T11:00:00Z',
    read: false,
    link: '/verify-account',
    priority: 'high'
  }
];

export const INITIAL_PDF_DOCUMENTS: PdfDocument[] = [
  {
    id: 1,
    title: 'Complete Guide: Aadhaar Linking Process',
    description: 'Step-by-step guide to link your Aadhaar with your bank account. Includes forms, requirements, and FAQs.',
    category: 'Aadhaar Guide',
    uploadedBy: 'Ministry of Education',
    uploadDate: '2025-11-10T10:00:00Z',
    size: '2.4 MB',
    downloads: 1234,
    tags: ['Aadhaar', 'Banking', 'Guide'],
    viewed: false
  },
  {
    id: 2,
    title: 'DBT Schemes 2025-26: Complete List',
    description: 'Comprehensive list of all Direct Benefit Transfer schemes available for students. Eligibility criteria and application process included.',
    category: 'DBT Schemes',
    uploadedBy: 'Ministry of Education',
    uploadDate: '2025-11-08T14:30:00Z',
    size: '1.8 MB',
    downloads: 2456,
    tags: ['DBT', 'Schemes', 'Benefits'],
    viewed: false
  },
  {
    id: 3,
    title: 'Scholarship Application Forms 2025',
    description: 'All scholarship application forms and instructions for the academic year 2025-26.',
    category: 'Scholarship',
    uploadedBy: 'Ministry of Education',
    uploadDate: '2025-11-05T09:00:00Z',
    size: '3.1 MB',
    downloads: 3789,
    tags: ['Scholarship', 'Forms', 'Application'],
    viewed: true
  }
];

export const NOTIFICATION_CATEGORIES = ['Educational', 'Scheme Update', 'Process Update', 'Scholarship', 'Alert', 'General'];
export const TARGET_AUDIENCES = ['All Students', 'Undergraduate Students', 'Graduate Students', 'PhD Scholars', 'Final Year Students'];
export const PRIORITIES: import('./types').Priority[] = ['low', 'medium', 'high', 'urgent'];
export const NOTIFICATION_TYPES: import('./types').NotificationType[] = ['info', 'alert', 'success'];
export const PDF_CATEGORIES = ['Aadhaar Guide', 'DBT Schemes', 'Scholarship', 'Forms & Documents', 'General Information'];

export const AUTHORIZED_USERS = {
  'admin': 'admin@scholarship2025',
  'gov_official': 'govofficial@123',
  'ministry_edu': 'ministry@secure'
};
