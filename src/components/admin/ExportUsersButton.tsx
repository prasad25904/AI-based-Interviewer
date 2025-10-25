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

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      // Use client-side export for simplicity
      const XLSX = await import('xlsx');
      
      // Prepare data for Excel
      const excelData = users.map(user => ({
        'User ID': user.id,
        'Name': user.name || 'N/A',
        'Email': user.email,
        'Role': user.role,
        'Email Verified': user.emailVerified ? 'Yes' : 'No',
        'Join Date': new Date(user.createdAt).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric'
        }),
        'Total Interviews': user._count.interviews,
        'Resumes Uploaded': user._count.resumes,
        'Active Sessions': user._count.sessions,
        'Total Activities': user._count.activities,
        'Days Since Join': Math.floor((new Date().getTime() - new Date(user.createdAt).getTime()) / (1000 * 60 * 60 * 24))
      }));

      // Create workbook and worksheet
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(excelData);

      // Set column widths for better readability
      const colWidths = [
        { wch: 36 }, // User ID
        { wch: 20 }, // Name
        { wch: 25 }, // Email
        { wch: 10 }, // Role
        { wch: 12 }, // Email Verified
        { wch: 15 }, // Join Date
        { wch: 15 }, // Total Interviews
        { wch: 15 }, // Resumes Uploaded
        { wch: 15 }, // Active Sessions
        { wch: 15 }, // Total Activities
        { wch: 15 }, // Days Since Join
      ];
      worksheet['!cols'] = colWidths;

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');

      // Generate filename with timestamp
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `users_export_${timestamp}.xlsx`;

      // Export to Excel
      XLSX.writeFile(workbook, filename);

    } catch (error) {
      console.error('Error exporting users:', error);
      alert('Failed to export users. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <Button 
      onClick={handleExport} 
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