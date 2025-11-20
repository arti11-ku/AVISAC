import React, { useState, useEffect, useCallback } from 'react';
import type { UserRole, Notification, PdfDocument } from './types';
import { INITIAL_NOTIFICATIONS, INITIAL_PDF_DOCUMENTS, AUTHORIZED_USERS } from './constants';
import Header from './components/Header';
import LoginModal from './components/LoginModal';
import NotificationPanel from './components/NotificationPanel';
import StudentDashboard from './components/student/StudentDashboard';
import GovernmentDashboard from './components/government/GovernmentDashboard';
import { generateSamplePDF, downloadAllNotifications, downloadSingleNotification } from './services/pdfGenerator';

// Fix: Add a type guard to safely check if a user string is a valid key of AUTHORIZED_USERS.
function isAuthorizedUser(user: string): user is keyof typeof AUTHORIZED_USERS {
  return user in AUTHORIZED_USERS;
}

export default function App() {
  const [userRole, setUserRole] = useState<UserRole>('student');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [showLoginModal, setShowLoginModal] = useState<boolean>(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState<boolean>(false);
  
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [pdfDocuments, setPdfDocuments] = useState<PdfDocument[]>(INITIAL_PDF_DOCUMENTS);

  const [unreadCount, setUnreadCount] = useState<number>(0);

  useEffect(() => {
    const unreadNotifs = notifications.filter(n => !n.read).length;
    const recentPdfs = pdfDocuments.filter(pdf => {
      const uploadDate = new Date(pdf.uploadDate);
      const daysDiff = (new Date().getTime() - uploadDate.getTime()) / (1000 * 60 * 60 * 24);
      return daysDiff <= 7 && !pdf.viewed;
    }).length;
    setUnreadCount(unreadNotifs + recentPdfs);
  }, [notifications, pdfDocuments]);

  const handleLogin = useCallback((credentials: { username: string; password: string }): boolean => {
    const { username, password } = credentials;

    // Fix: Use the type guard to safely validate credentials. This resolves the error
    // where a 'string' could not be used to index the strongly-typed AUTHORIZED_USERS object.
    if (isAuthorizedUser(username) && AUTHORIZED_USERS[username] === password) {
      setIsAuthenticated(true);
      setUserRole('government');
      setShowLoginModal(false);
      return true;
    }
    return false;
  }, []);

  const handleLogout = useCallback(() => {
    setIsAuthenticated(false);
    setUserRole('student');
  }, []);

  const attemptGovernmentAccess = useCallback(() => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
    } else {
      setUserRole('government');
    }
  }, [isAuthenticated]);

  const handleSendNotification = useCallback((formData: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      id: Date.now(),
      ...formData,
      timestamp: new Date().toISOString(),
      read: false
    };
    setNotifications(prev => [newNotification, ...prev]);
  }, []);

  const handleUploadPdf = useCallback((pdfData: Omit<PdfDocument, 'id' | 'uploadDate' | 'size' | 'downloads' | 'uploadedBy' | 'viewed'>) => {
    if (!pdfData.fileData) return;
    const newPdf: PdfDocument = {
      id: Date.now(),
      title: pdfData.title,
      description: pdfData.description,
      category: pdfData.category,
      tags: pdfData.tags,
      uploadedBy: 'Ministry of Education',
      uploadDate: new Date().toISOString(),
      size: `${(pdfData.fileData.size / (1024 * 1024)).toFixed(1)} MB`,
      downloads: 0,
      viewed: false,
      fileData: pdfData.fileData,
      fileName: pdfData.fileName,
    };
    setPdfDocuments(prev => [newPdf, ...prev]);
  }, []);
  
  const deleteNotification = useCallback((id: number) => {
    if (window.confirm('Are you sure you want to delete this notification?')) {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }
  }, []);

  const deletePdfDocument = useCallback((id: number) => {
    if (window.confirm('Are you sure you want to delete this PDF document?')) {
      setPdfDocuments(prev => prev.filter(pdf => pdf.id !== id));
    }
  }, []);

  const markNotificationAsRead = useCallback((id: number) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  }, []);

  const markAllNotificationsAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setPdfDocuments(prev => prev.map(p => ({ ...p, viewed: true })));
  }, []);

  const handleNotificationClick = useCallback((notification: Notification) => {
    markNotificationAsRead(notification.id);
    alert(`📍 Navigating to: ${notification.link}\n\n(This is a placeholder for routing)`);
  }, [markNotificationAsRead]);

  const handlePdfNotificationClick = useCallback((pdf: PdfDocument) => {
    setPdfDocuments(prev => prev.map(p => p.id === pdf.id ? { ...p, viewed: true } : p));
    setIsNotificationOpen(false);
    setTimeout(() => {
      document.getElementById('pdf-documents-section')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }, []);

  const downloadPdf = useCallback((pdf: PdfDocument) => {
    setPdfDocuments(prev => prev.map(p => p.id === pdf.id ? { ...p, viewed: true, downloads: p.downloads + 1 } : p));
    if (pdf.fileData) {
      const url = URL.createObjectURL(pdf.fileData);
      const link = document.createElement('a');
      link.href = url;
      link.download = pdf.fileName || `${pdf.title}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else {
      generateSamplePDF(pdf);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 font-sans">
      <Header
        userRole={userRole}
        isAuthenticated={isAuthenticated}
        unreadCount={unreadCount}
        onUserRoleChange={setUserRole}
        onAttemptGovernmentAccess={attemptGovernmentAccess}
        onLogout={handleLogout}
        onToggleNotifications={() => setIsNotificationOpen(prev => !prev)}
      />

      <main>
        {userRole === 'student' ? (
          <StudentDashboard
            notifications={notifications}
            pdfDocuments={pdfDocuments}
            onNotificationClick={handleNotificationClick}
            onDownloadPdf={downloadPdf}
          />
        ) : isAuthenticated ? (
          <GovernmentDashboard
            notifications={notifications}
            pdfDocuments={pdfDocuments}
            onSendNotification={handleSendNotification}
            onUploadPdf={handleUploadPdf}
            onDeleteNotification={deleteNotification}
            onDeletePdf={deletePdfDocument}
          />
        ) : (
           <div className="text-center p-20">
             <h2 className="text-2xl font-bold text-gray-700">Please log in to access the government dashboard.</h2>
           </div>
        )}
      </main>

      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} onLogin={handleLogin} />}

      {userRole === 'student' && (
        <NotificationPanel
          isOpen={isNotificationOpen}
          onClose={() => setIsNotificationOpen(false)}
          notifications={notifications}
          pdfDocuments={pdfDocuments}
          unreadCount={unreadCount}
          onMarkAllAsRead={markAllNotificationsAsRead}
          onNotificationClick={handleNotificationClick}
          onPdfNotificationClick={handlePdfNotificationClick}
          onDownloadAll={() => downloadAllNotifications(notifications)}
          onDownloadSingle={downloadSingleNotification}
          onDownloadPdf={downloadPdf}
        />
      )}
    </div>
  );
}