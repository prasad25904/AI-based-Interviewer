import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import AdminSettingsClient from './AdminSettingsClient';

export default async function AdminSettingsPage() {
  const session = await getServerSession(authOptions);

  if (!session) redirect('/login');

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true }
  });

  if (user?.role !== 'ADMIN') redirect('/dashboard');

  // ✅ Render client component
  return <AdminSettingsClient />;
}


// // src/app/(admin)/admin-settings/page.tsx
// import { getServerSession } from 'next-auth';
// import { authOptions } from '@/lib/auth';
// import { prisma } from '@/lib/db';
// import { redirect } from 'next/navigation';
// import AdminSettingsClient from './AdminSettingsClient';

// // Type definition matching your Prisma adminSetting model
// export type AdminSettingsType = {
//   id: string;
//   createdAt: Date;
//   updatedAt: Date;
//   siteName: string;
//   description: string | null;
//   siteUrl: string;
//   timezone: string;
//   language: string;
//   smtpHost: string | null;
//   smtpPort: number | null;
//   smtpUser: string | null;
//   smtpPass: string | null;
//   welcomeEmails: boolean;
//   notificationEmails: boolean;
//   twoFactor: boolean;
//   passwordPolicy: boolean;
//   sessionTimeout: boolean;
//   emailNotifications: boolean;
//   userSignups: boolean;
//   systemAlerts: boolean;
//   autoBackup: boolean;
//   backupFrequency: string;
// };

// export default async function AdminSettingsPage() {
//   const session = await getServerSession(authOptions);

//   if (!session) redirect('/login');

//   const user = await prisma.user.findUnique({
//     where: { id: session.user.id },
//     select: { role: true },
//   });

//   if (user?.role !== 'ADMIN') redirect('/dashboard');

//   // Fetch existing settings from DB
//   let settings = await prisma.adminSetting.findFirst();

//   // If no settings exist, create default
//   if (!settings) {
//     settings = await prisma.adminSetting.create({
//       data: {
//         siteName: 'InterviewMaster',
//         description: 'AI-powered interview preparation platform',
//         siteUrl: 'https://interviewmaster.com',
//         timezone: 'utc',
//         language: 'en',
//         smtpHost: 'smtp.gmail.com',
//         smtpPort: 587,
//         smtpUser: 'noreply@interviewmaster.com',
//         smtpPass: '',
//         welcomeEmails: true,
//         notificationEmails: true,
//         twoFactor: false,
//         passwordPolicy: true,
//         sessionTimeout: true,
//         emailNotifications: true,
//         userSignups: true,
//         systemAlerts: true,
//         autoBackup: true,
//         backupFrequency: 'daily',
//       },
//     });
//   }

//   // ✅ Type assertion so TS knows this matches AdminSettingsType
//   return <AdminSettingsClient settings={settings as AdminSettingsType} />;
// }
