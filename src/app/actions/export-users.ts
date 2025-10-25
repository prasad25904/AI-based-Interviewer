'use server';

import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function exportUsersToExcel() {
  const session = await getServerSession(authOptions);

  if (!session) {
    throw new Error('Unauthorized');
  }

  // Check if user is admin
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true }
  });

  if (user?.role !== 'ADMIN') {
    throw new Error('Forbidden');
  }

  try {
    const XLSX = await import('xlsx');
    
    // Fetch users data
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        emailVerified: true,
        _count: {
          select: {
            interviews: true,
            resumes: true,
            sessions: true,
            activities: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

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

    // Set column widths
    const colWidths = [
      { wch: 36 }, { wch: 20 }, { wch: 25 }, { wch: 10 },
      { wch: 12 }, { wch: 15 }, { wch: 15 }, { wch: 15 },
      { wch: 15 }, { wch: 15 }, { wch: 15 }
    ];
    worksheet['!cols'] = colWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');

    // Generate Excel buffer
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    
    // Generate filename
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `users_export_${timestamp}.xlsx`;

    return {
      success: true,
      data: excelBuffer.toString('base64'),
      filename
    };

  } catch (error) {
    console.error('Error exporting users:', error);
    return {
      success: false,
      error: 'Failed to export users'
    };
  }
}