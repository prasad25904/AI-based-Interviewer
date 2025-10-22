'use client';

import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/simple-avatar';
import { LogOut, User, Settings, Crown, Sparkles, ChevronDown } from 'lucide-react';

interface DashboardNavProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export default function DashboardNav({ user }: DashboardNavProps) {
  const getInitials = (name: string | null | undefined) => {
    return name
      ? name.split(' ').map(n => n[0]).join('').toUpperCase()
      : 'U';
  };

  return (
    <nav className="border-b border-white/10 bg-gradient-to-r from-slate-900 via-blue-900 to-amber-900 shadow-2xl backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo Section */}
          <Link href="/dashboard" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="p-2 rounded-xl bg-gradient-to-r from-amber-500 to-blue-600 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <Crown className="h-6 w-6 text-white" />
              </div>
              <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-amber-300" />
            </div>
            <div>
              <span className="text-2xl font-bold bg-gradient-to-r from-amber-400 to-blue-400 bg-clip-text text-transparent">
                AIInterviewer
              </span>
              <div className="text-xs text-amber-200 opacity-80 -mt-1">Dashboard</div>
            </div>
          </Link>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="relative h-10 px-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-amber-400/30 transition-all duration-300 group"
                >
                  <Avatar className="h-7 w-7 border-2 border-amber-400/50">
                    <AvatarFallback className="text-xs font-bold bg-gradient-to-r from-amber-500 to-blue-600 text-white">
                      {getInitials(user.name)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="ml-2 text-amber-100 font-medium max-w-32 truncate">
                    {user.name}
                  </span>
                  <ChevronDown className="ml-1 h-4 w-4 text-amber-300 group-hover:rotate-180 transition-transform duration-300" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                className="w-64 bg-gradient-to-br from-slate-800 to-blue-900 border border-white/20 backdrop-blur-xl shadow-2xl" 
                align="end" 
                forceMount
              >
                <DropdownMenuLabel className="font-normal p-4">
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10 border-2 border-amber-400/50">
                        <AvatarFallback className="text-sm font-bold bg-gradient-to-r from-amber-500 to-blue-600 text-white">
                          {getInitials(user.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate">
                          {user.name}
                        </p>
                        <p className="text-xs text-amber-200 opacity-80 truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </div>
                </DropdownMenuLabel>
                
                <DropdownMenuSeparator className="bg-white/10" />
                
                <DropdownMenuItem asChild className="p-0">
                  <Link 
                    href="/dashboard/profile" 
                    className="flex items-center px-3 py-3 text-amber-100 hover:text-amber-50 hover:bg-white/10 transition-all duration-200 group/item"
                  >
                    <div className="p-2 rounded-lg bg-gradient-to-r from-amber-500/20 to-orange-500/20 mr-3 group-hover/item:scale-110 transition-transform duration-300">
                      <User className="h-4 w-4 text-amber-400" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">Profile</div>
                      <div className="text-xs text-amber-200 opacity-70">Manage your account</div>
                    </div>
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuItem asChild className="p-0">
                  <Link 
                    href="/dashboard/settings" 
                    className="flex items-center px-3 py-3 text-amber-100 hover:text-amber-50 hover:bg-white/10 transition-all duration-200 group/item"
                  >
                    <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500/20 to-cyan-500/20 mr-3 group-hover/item:scale-110 transition-transform duration-300">
                      <Settings className="h-4 w-4 text-blue-400" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">Settings</div>
                      <div className="text-xs text-amber-200 opacity-70">Customize preferences</div>
                    </div>
                  </Link>
                </DropdownMenuItem>
                
                <DropdownMenuSeparator className="bg-white/10" />
                
                <DropdownMenuItem 
                  onClick={() => signOut()}
                  className="flex items-center px-3 py-3 text-red-100 hover:text-red-50 hover:bg-red-500/20 transition-all duration-200 group/item cursor-pointer"
                >
                  <div className="p-2 rounded-lg bg-gradient-to-r from-red-500/20 to-pink-500/20 mr-3 group-hover/item:scale-110 transition-transform duration-300">
                    <LogOut className="h-4 w-4 text-red-400" />
                  </div>
                  <div>
                    <div className="text-sm font-medium">Log out</div>
                    <div className="text-xs text-red-200 opacity-70">Sign out of your account</div>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}