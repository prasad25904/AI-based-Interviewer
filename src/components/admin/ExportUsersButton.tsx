'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';

interface User {
  id: string;
  name: string | null;
  email: string;
  role: string;
  createdAt: Date;
  emailVerified: Date | null;
  _count: {
    interviews: number;
    resumes: number;
    sessions: number;
    activities: number;
  };
}

interface ExportUsersButtonProps {
  users: User[];
}

export function ExportUsersButton({ users }: ExportUsersButtonProps) {
  const [isExporting, setIsExporting] = useState(false);

  const exportToCSV = () => {
    setIsExporting(true);
    
    try {
      // Prepare CSV headers
      const headers = [
        'User ID',
        'Name',
        'Email', 
        'Role',
        'Email Verified',
        'Join Date',
        'Total Interviews',
        'Resumes Uploaded',
        'Active Sessions',
        'Total Activities',
        'Days Since Join'
      ];

      // Prepare data rows
      const csvData = users.map(user => [
        user.id,
        user.name || 'N/A',
        user.email,
        user.role,
        user.emailVerified ? 'Yes' : 'No',
        new Date(user.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }),
        user._count.interviews.toString(),
        user._count.resumes.toString(),
        user._count.sessions.toString(),
        user._count.activities.toString(),
        Math.floor((new Date().getTime() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24)).toString()
      ]);

      // Combine headers and data
      const csvContent = [headers, ...csvData]
        .map(row => row.map(field => `"${field}"`).join(','))
        .join('\n');

      // Create and download CSV file
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `users_export_${timestamp}.csv`;
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', filename);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Error exporting users:', error);
      alert('Failed to export users. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button 
      onClick={exportToCSV} 
      disabled={isExporting || users.length === 0}
      className="flex items-center gap-2"
    >
      {isExporting ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Download className="h-4 w-4" />
      )}
      {isExporting ? 'Exporting...' : 'Export Users'}
    </Button>
  );
}