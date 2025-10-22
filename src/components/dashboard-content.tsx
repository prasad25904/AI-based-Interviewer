'use client';

import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, History, Upload, Crown, Sparkles, TrendingUp, Zap, Target, Award, Play, BarChart3, Rocket } from 'lucide-react';
import Link from 'next/link';
import { DashboardProps } from '@/lib/types';

// Reusable badge component
const StatusBadge = ({ status }: { status: string }) => {
  const statusMap = {
    COMPLETED: 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/25',
    ACTIVE: 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-lg shadow-amber-500/25',
    PENDING: 'bg-gradient-to-r from-yellow-500 to-amber-500 text-white shadow-lg shadow-yellow-500/25',
    DEFAULT: 'bg-gradient-to-r from-gray-500 to-slate-500 text-white shadow-lg shadow-gray-500/25',
  };

  const statusStyle = statusMap[status as keyof typeof statusMap] || statusMap.DEFAULT;

  return (
    <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${statusStyle} backdrop-blur-sm`}>
      {status}
    </span>
  );
};

// Skill level indicator component
const SkillLevel = ({ level }: { level: string }) => {
  const levelMap = {
    beginner: { 
      color: 'from-green-500 to-emerald-500', 
      text: 'Beginner',
      icon: '🌱'
    },
    intermediate: { 
      color: 'from-amber-500 to-orange-500', 
      text: 'Intermediate',
      icon: '🚀'
    },
    advanced: { 
      color: 'from-red-500 to-pink-500', 
      text: 'Advanced',
      icon: '🏆'
    },
  };

  const levelInfo = levelMap[level as keyof typeof levelMap] || levelMap.beginner;

  return (
    <div className="flex items-center gap-3">
      <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${levelInfo.color} shadow-lg flex items-center justify-center text-white text-sm font-bold`}>
        {levelInfo.icon}
      </div>
      <div>
        <div className="text-lg font-bold text-gray-900">{levelInfo.text}</div>
        <div className="text-xs text-gray-600">Keep practicing!</div>
      </div>
    </div>
  );
};

export default function DashboardContent({ 
  session, 
  user, 
  recentInterviews, 
  resumeCount, 
  totalInterviews 
}: DashboardProps) {
  const getSkillLevel = () => {
    if (totalInterviews === 0) return 'beginner';
    if (totalInterviews < 5) return 'intermediate';
    return 'advanced';
  };

  return (
    <div className="space-y-8 p-4">
      {/* Welcome Header - Keep as is */}
      <div className="relative p-8 rounded-2xl bg-gradient-to-r from-slate-900 via-blue-900 to-amber-900 shadow-2xl overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-amber-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-1000"></div>
        </div>
        
        <div className="relative flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-xl bg-gradient-to-r from-amber-500 to-blue-600 shadow-lg">
                <Crown className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white via-amber-200 to-blue-200 bg-clip-text text-transparent">
                Welcome back, {session.user.name}!
              </h1>
            </div>
            <p className="text-xl text-amber-100 opacity-90">
              Ready to ace your next interview practice session?
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            {user?.role === 'ADMIN' && (
              <Link href="/admin-dashboard" className={buttonVariants({ 
                size: 'lg', 
                variant: 'outline',
                className: "border-2 border-amber-400/50 text-amber-300 hover:bg-amber-400/10 hover:border-amber-400 backdrop-blur-sm transition-all duration-300"
              })}>
                <Sparkles className="mr-2 h-5 w-5" />
                Admin Panel
              </Link>
            )}
            <Link href="/dashboard/new-interview">
              <Button
                size="lg"
                className="bg-gradient-to-r from-amber-500 to-blue-600 hover:from-amber-600 hover:to-blue-700 text-white shadow-2xl shadow-amber-500/25 hover:shadow-amber-500/40 transition-all duration-300 transform hover:scale-105 group font-bold"
              >
                <Zap className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                Start New Interview
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Enhanced Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[{
          title: "Total Interviews",
          icon: <History className="h-6 w-6 text-white" />,
          value: totalInterviews,
          description: "Practice sessions completed",
          gradient: "from-blue-500 to-cyan-500",
          bgGradient: "from-blue-50 to-cyan-50",
          borderColor: "border-blue-200",
          textColor: "text-blue-600",
          hoverEffect: "hover:shadow-blue-500/20"
        }, {
          title: "Resumes Uploaded",
          icon: <FileText className="h-6 w-6 text-white" />,
          value: resumeCount,
          description: "For personalized questions",
          gradient: "from-amber-500 to-orange-500",
          bgGradient: "from-amber-50 to-orange-50",
          borderColor: "border-amber-200",
          textColor: "text-amber-600",
          hoverEffect: "hover:shadow-amber-500/20"
        }, {
          title: "Skill Level",
          icon: <Target className="h-6 w-6 text-white" />,
          value: <SkillLevel level={getSkillLevel()} />,
          description: "Based on your practice",
          gradient: "from-purple-500 to-pink-500",
          bgGradient: "from-purple-50 to-pink-50",
          borderColor: "border-purple-200",
          textColor: "text-purple-600",
          hoverEffect: "hover:shadow-purple-500/20"
        }].map(({ title, icon, value, description, gradient, bgGradient, borderColor, textColor, hoverEffect }, idx) => (
          <div
            key={idx}
            className="group transition-all duration-500 hover:scale-105 hover:shadow-2xl rounded-2xl"
          >
            <Card className={`bg-gradient-to-br ${bgGradient} ${borderColor} border-2 backdrop-blur-sm shadow-lg ${hoverEffect} transition-all duration-300`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <CardTitle className={`text-lg font-bold ${textColor}`}>{title}</CardTitle>
                <div className={`p-3 rounded-xl bg-gradient-to-r ${gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {icon}
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-gray-900 mb-2">{value}</div>
                <p className="text-sm text-gray-600">
                  {description}
                </p>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {/* Enhanced Recent Interviews Card */}
      <Card className="bg-white border-2 border-gray-200 shadow-xl transition-all duration-500 hover:shadow-2xl hover:border-amber-200">
        <CardHeader className="border-b border-gray-100 pb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 shadow-lg">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Recent Interviews
              </CardTitle>
              <CardDescription className="text-gray-600 text-base">
                Your latest practice sessions and progress
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {recentInterviews.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 border-2 border-amber-200 flex items-center justify-center">
                <Play className="h-12 w-12 text-amber-500" />
              </div>
              <h3 className="mt-4 text-2xl font-bold text-gray-900">
                No interviews yet
              </h3>
              <p className="mt-3 text-gray-600 max-w-md mx-auto">
                Start your journey to interview mastery with your first practice session.
              </p>
              <Link href="/dashboard/new-interview">
                <Button className="mt-6 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-lg shadow-amber-500/25 transform hover:scale-105 transition-all duration-300 group">
                  <Rocket className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                  Start Your First Interview
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {recentInterviews.map((interview) => (
                <div
                  key={interview.id}
                  className="group flex items-center justify-between p-6 rounded-xl bg-gradient-to-r from-gray-50 to-white border-2 border-gray-100 hover:border-amber-300 hover:from-amber-50 hover:to-orange-50 transition-all duration-300"
                >
                  <div className="flex-1">
                    <h4 className="font-bold text-lg text-gray-900 group-hover:text-amber-700 transition-colors duration-300">
                      {interview.title}
                    </h4>
                    <p className="text-sm text-gray-600 group-hover:text-amber-600 mt-1">
                      {interview.domain} • {interview.level} •{' '}
                      {new Date(interview.createdAt).toLocaleDateString('en-US', {
                        weekday: 'short',
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <StatusBadge status={interview.status} />
                </div>
              ))}
              <div className="pt-4 border-t border-gray-100">
                <Link href="/dashboard/history">
                  <Button 
                    variant="outline" 
                    className="w-full border-2 border-amber-200 text-amber-700 hover:bg-amber-50 hover:border-amber-300 transition-all duration-300 group"
                  >
                    <BarChart3 className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
                    View All Interview History
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Enhanced Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[{
          title: 'Upload Resume',
          icon: <Upload className="h-6 w-6 text-white" />,
          description: 'Upload your resume for personalized interview questions tailored to your experience',
          href: '/dashboard/resumes',
          buttonText: 'Upload Resume',
          gradient: "from-blue-500 to-cyan-500",
          bgGradient: "from-blue-50 to-cyan-50",
          borderColor: "border-blue-200",
          buttonColor: "bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600"
        }, {
          title: 'Interview History',
          icon: <Award className="h-6 w-6 text-white" />,
          description: 'View all your past interview practice sessions and track your progress over time',
          href: '/dashboard/history',
          buttonText: 'View History',
          gradient: "from-purple-500 to-pink-500",
          bgGradient: "from-purple-50 to-pink-50",
          borderColor: "border-purple-200",
          buttonColor: "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
        }].map(({ title, icon, description, href, buttonText, gradient, bgGradient, borderColor, buttonColor }, idx) => (
          <div
            key={idx}
            className="group transition-all duration-500 hover:scale-105 hover:shadow-2xl rounded-2xl"
          >
            <Card className={`bg-gradient-to-br ${bgGradient} ${borderColor} border-2 backdrop-blur-sm shadow-xl h-full transition-all duration-300 hover:shadow-2xl`}>
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`p-3 rounded-xl bg-gradient-to-r ${gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {icon}
                  </div>
                  <CardTitle className="text-xl font-bold text-gray-900">{title}</CardTitle>
                </div>
                <CardDescription className="text-gray-600 text-base">
                  {description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href={href}>
                  <Button 
                    className={`w-full ${buttonColor} text-white shadow-lg transform hover:scale-105 transition-all duration-300 group/btn font-bold`}
                  >
                    <span className="group-hover/btn:translate-x-1 transition-transform duration-300">
                      {buttonText}
                    </span>
                    <Sparkles className="ml-2 h-4 w-4 group-hover/btn:rotate-180 transition-transform duration-500" />
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