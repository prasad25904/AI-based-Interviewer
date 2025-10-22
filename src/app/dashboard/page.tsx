import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, FileText, History, Upload } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface Interview {
  id: string;
  title: string;
  domain: string;
  level: string;
  status: string;
  createdAt: Date;
}

// Reusable badge component
const StatusBadge = ({ status }: { status: string }) => {
  const statusMap = {
    COMPLETED: 'bg-green-100 text-green-700 border border-green-300',
    ACTIVE: 'bg-blue-100 text-blue-700 border border-blue-300',
    PENDING: 'bg-yellow-100 text-yellow-700 border border-yellow-300',
    DEFAULT: 'bg-gray-100 text-gray-700 border border-gray-300',
  };

  const statusStyle = statusMap[status as keyof typeof statusMap] || statusMap.DEFAULT;

  return (
    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${statusStyle}`}>
      {status}
    </span>
  );
};

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  const [user, recentInterviews, resumeCount, totalInterviews] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    }),
    prisma.interview.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      take: 3,
    }),
    prisma.resume.count({
      where: { userId: session.user.id },
    }),
    prisma.interview.count({
      where: { userId: session.user.id },
    }),
  ]);

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="p-6 rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back, {session.user.name}!
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Ready for your next interview practice session?
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          {user?.role === 'ADMIN' && (
            <Link href="/admin-dashboard" className={buttonVariants({ size: 'lg', variant: 'outline' })}>
              Admin Panel
            </Link>
          )}
          <Link href="/dashboard/new-interview">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md"
            >
              <Brain className="mr-2 h-5 w-5" />
              Start New Interview
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[{
          title: "Total Interviews",
          icon: <History className="h-4 w-4 text-muted-foreground" />,
          value: totalInterviews,
          description: "Practice sessions completed"
        }, {
          title: "Resumes Uploaded",
          icon: <FileText className="h-4 w-4 text-muted-foreground" />,
          value: resumeCount,
          description: "For personalized questions"
        }, {
          title: "Skill Level",
          icon: <Brain className="h-4 w-4 text-muted-foreground" />,
          value: (
            <span className="flex items-center gap-2 text-2xl font-bold">
              {totalInterviews === 0 ? '🟢 Beginner' : totalInterviews < 5 ? '🟡 Intermediate' : '🔴 Advanced'}
            </span>
          ),
          description: "Based on your practice"
        }].map(({ title, icon, value, description }, idx) => (
          <div
            key={idx}
            className="transition-transform hover:scale-[1.01] hover:shadow-md rounded-lg"
          >
            <Card className="bg-white dark:bg-gray-900 border dark:border-gray-700">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                {icon}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                <p className="text-xs text-muted-foreground dark:text-gray-400">
                  {description}
                </p>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {/* Recent Interviews */}
      <Card className="transition-shadow hover:shadow-lg bg-white dark:bg-gray-900 border dark:border-gray-700">
        <CardHeader>
          <CardTitle>Recent Interviews</CardTitle>
          <CardDescription>Your latest practice sessions</CardDescription>
        </CardHeader>
        <CardContent>
          {recentInterviews.length === 0 ? (
            <div className="text-center py-8">
              <Image
                src="/empty-interview.svg"
                alt="No Interviews"
                width={96}
                height={96}
                className="mx-auto opacity-60 mb-4"
              />
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                No interviews yet
              </h3>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Get started by creating your first interview practice session.
              </p>
              <Link href="/dashboard/new-interview">
                <Button className="mt-4">Start Interview</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {recentInterviews.map((interview: Interview) => (
                <div
                  key={interview.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition"
                >
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {interview.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {interview.domain} • {interview.level} •{' '}
                      {new Date(interview.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <StatusBadge status={interview.status} />
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[{
          title: 'Upload Resume',
          icon: <Upload className="mr-2 h-5 w-5" />,
          description: 'Upload your resume for personalized interview questions',
          href: '/dashboard/resumes',
          buttonText: 'Upload Resume'
        }, {
          title: 'Interview History',
          icon: <History className="mr-2 h-5 w-5" />,
          description: 'View all your past interview practice sessions',
          href: '/dashboard/history',
          buttonText: 'View History'
        }].map(({ title, icon, description, href, buttonText }, idx) => (
          <div
            key={idx}
            className="transition hover:shadow-lg hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md"
          >
            <Card className="bg-white dark:bg-gray-900 border dark:border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center">{icon}{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href={href}>
                  <Button variant="outline" className="w-full">
                    {buttonText}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
