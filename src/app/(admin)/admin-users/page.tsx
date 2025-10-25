import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Mail, Calendar, Activity } from 'lucide-react';
import { ExportUsersButton } from '@/components/admin/ExportUsersButton';

export default async function AdminUsersPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  // Check if user is admin
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true }
  });

  if (user?.role !== 'ADMIN') {
    redirect('/dashboard');
  }

  // Fetch users with their activity counts
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

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600">
            Manage and monitor all system users ({users.length} total)
          </p>
        </div>
        <ExportUsersButton users={users} />
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <Card key={user.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{user.name || 'Unnamed User'}</CardTitle>
                <Badge variant={user.role === 'ADMIN' ? 'default' : 'secondary'}>
                  {user.role}
                </Badge>
              </div>
              <CardDescription className="flex items-center">
                <Mail className="h-3 w-3 mr-1" />
                {user.email}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <Calendar className="h-3 w-3 mr-1 text-gray-500" />
                  Joined
                </div>
                <span>{new Date(user.createdAt).toLocaleDateString()}</span>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <Activity className="h-3 w-3 mr-1 text-gray-500" />
                  Interviews
                </div>
                <Badge variant="outline">{user._count.interviews}</Badge>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <Users className="h-3 w-3 mr-1 text-gray-500" />
                  Resumes
                </div>
                <Badge variant="outline">{user._count.resumes}</Badge>
              </div>

              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <Activity className="h-3 w-3 mr-1 text-gray-500" />
                  Activities
                </div>
                <Badge variant="outline">{user._count.activities}</Badge>
              </div>

              <div className="pt-3 border-t">
                <Button variant="outline" size="sm" className="w-full">
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}