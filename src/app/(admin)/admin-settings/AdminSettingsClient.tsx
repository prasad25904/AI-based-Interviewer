"use client";

import { motion } from "framer-motion";
import { Save, Bell, Shield, Database, Mail, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AdminSettingsClient() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* Header Section */}
      <motion.div variants={itemVariants} className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
          <p className="text-gray-600">
            Manage application configuration and preferences
          </p>
        </div>
        <Button>
          <Save className="mr-2 h-4 w-4" />
          Save Changes
        </Button>
      </motion.div>

      {/* Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side (Main Settings) */}
        <div className="lg:col-span-2 space-y-8">
          {/* General Settings */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  General Settings
                </CardTitle>
                <CardDescription>Basic application configuration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="siteName">Site Name</Label>
                    <Input id="siteName" defaultValue="InterviewMaster" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="siteUrl">Site URL</Label>
                    <Input id="siteUrl" defaultValue="https://interviewmaster.com" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Site Description</Label>
                  <Textarea
                    id="description"
                    defaultValue="AI-powered interview preparation platform"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select defaultValue="utc">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="utc">UTC</SelectItem>
                        <SelectItem value="est">EST</SelectItem>
                        <SelectItem value="pst">PST</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="language">Default Language</Label>
                    <Select defaultValue="en">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Spanish</SelectItem>
                        <SelectItem value="fr">French</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Email Settings */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Mail className="h-5 w-5" />
                  Email Settings
                </CardTitle>
                <CardDescription>
                  Configure email notifications and SMTP
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="smtpHost">SMTP Host</Label>
                    <Input id="smtpHost" defaultValue="smtp.gmail.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtpPort">SMTP Port</Label>
                    <Input id="smtpPort" defaultValue="587" type="number" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="smtpUser">SMTP Username</Label>
                    <Input id="smtpUser" defaultValue="noreply@interviewmaster.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtpPass">SMTP Password</Label>
                    <Input id="smtpPass" type="password" placeholder="Enter password" />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="welcomeEmails">Welcome Emails</Label>
                      <p className="text-sm text-gray-500">
                        Send welcome email to new users
                      </p>
                    </div>
                    <Switch id="welcomeEmails" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="notificationEmails">Notification Emails</Label>
                      <p className="text-sm text-gray-500">
                        Send activity notifications
                      </p>
                    </div>
                    <Switch id="notificationEmails" defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Right Side (Sidebar Settings) */}
        <div className="space-y-8">
          {/* Security Settings */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="twoFactor">Two-Factor Authentication</Label>
                    <p className="text-sm text-gray-500">
                      Require 2FA for all users
                    </p>
                  </div>
                  <Switch id="twoFactor" />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="passwordPolicy">Strong Password Policy</Label>
                    <p className="text-sm text-gray-500">Enforce complex passwords</p>
                  </div>
                  <Switch id="passwordPolicy" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="sessionTimeout">Session Timeout</Label>
                    <p className="text-sm text-gray-500">
                      Auto-logout after inactivity
                    </p>
                  </div>
                  <Switch id="sessionTimeout" defaultChecked />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Notification Settings */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="emailNotifications">Email Notifications</Label>
                    <p className="text-sm text-gray-500">Receive email alerts</p>
                  </div>
                  <Switch id="emailNotifications" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="userSignups">New User Signups</Label>
                    <p className="text-sm text-gray-500">
                      Alert on new registrations
                    </p>
                  </div>
                  <Switch id="userSignups" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="systemAlerts">System Alerts</Label>
                    <p className="text-sm text-gray-500">
                      Critical system notifications
                    </p>
                  </div>
                  <Switch id="systemAlerts" defaultChecked />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Database Settings */}
          <motion.div variants={itemVariants}>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Database
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="autoBackup">Auto Backup</Label>
                    <p className="text-sm text-gray-500">
                      Daily automatic backups
                    </p>
                  </div>
                  <Switch id="autoBackup" defaultChecked />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="backupFrequency">Backup Frequency</Label>
                  <Select defaultValue="daily">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Hourly</SelectItem>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}



// 'use client';

// import { useState } from 'react';
// import { motion } from 'framer-motion';
// import { Save, Bell, Shield, Database, Mail, Globe } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Switch } from '@/components/ui/switch';
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from '@/components/ui/select';
// import { Textarea } from '@/components/ui/textarea';
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from '@/components/ui/card';

// interface Settings {
//   id: string;
//   siteName: string;
//   description: string | null;
//   siteUrl: string;
//   smtpHost?: string | null;
//   smtpPort?: number | null;
//   smtpUser?: string | null;
//   smtpPass?: string | null;
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
// }

// interface AdminSettingsClientProps {
//   settings: Settings;
// }

// export default function AdminSettingsClient({ settings }: AdminSettingsClientProps) {
//   const [formData, setFormData] = useState<Settings>(settings);
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSwitch = (name: keyof Settings, value: boolean) => {
//     setFormData({ ...formData, [name]: value });
//   };

//   const handleSubmit = async () => {
//     setLoading(true);
//     try {
//       const res = await fetch('/api/admin/settings', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(formData),
//       });
//       if (res.ok) {
//         alert('Settings updated successfully!');
//       } else {
//         alert('Failed to update settings.');
//       }
//     } catch (err) {
//       console.error(err);
//       alert('Error updating settings.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
//   };
//   const itemVariants = {
//     hidden: { opacity: 0, x: -20 },
//     visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
//   };

//   return (
//     <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
//       {/* Header */}
//       <motion.div variants={itemVariants} className="flex justify-between items-center">
//         <div>
//           <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
//           <p className="text-gray-600">Manage application configuration and preferences</p>
//         </div>
//         <Button onClick={handleSubmit} disabled={loading}>
//           <Save className="mr-2 h-4 w-4" />
//           {loading ? 'Saving...' : 'Save Changes'}
//         </Button>
//       </motion.div>

//       {/* Settings Grid */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//         {/* Left Column */}
//         <div className="lg:col-span-2 space-y-8">
//           {/* General Settings */}
//           <motion.div variants={itemVariants}>
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2"><Globe className="h-5 w-5" /> General Settings</CardTitle>
//                 <CardDescription>Basic application configuration</CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <Label htmlFor="siteName">Site Name</Label>
//                     <Input name="siteName" value={formData.siteName} onChange={handleChange} />
//                   </div>
//                   <div>
//                     <Label htmlFor="siteUrl">Site URL</Label>
//                     <Input name="siteUrl" value={formData.siteUrl} onChange={handleChange} />
//                   </div>
//                 </div>

//                 <div>
//                   <Label htmlFor="description">Description</Label>
//                   <Textarea name="description" value={formData.description ?? ""} onChange={handleChange} rows={3} />
//                 </div>
//               </CardContent>
//             </Card>
//           </motion.div>

//           {/* Email Settings */}
//           <motion.div variants={itemVariants}>
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2"><Mail className="h-5 w-5" /> Email Settings</CardTitle>
//                 <CardDescription>SMTP and email notifications</CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <Label htmlFor="smtpHost">SMTP Host</Label>
//                     <Input name="smtpHost" value={formData.smtpHost || ''} onChange={handleChange} />
//                   </div>
//                   <div>
//                     <Label htmlFor="smtpPort">SMTP Port</Label>
//                     <Input type="number" name="smtpPort" value={formData.smtpPort || 0} onChange={handleChange} />
//                   </div>
//                 </div>

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div>
//                     <Label htmlFor="smtpUser">SMTP Username</Label>
//                     <Input name="smtpUser" value={formData.smtpUser || ''} onChange={handleChange} />
//                   </div>
//                   <div>
//                     <Label htmlFor="smtpPass">SMTP Password</Label>
//                     <Input type="password" name="smtpPass" value={formData.smtpPass || ''} onChange={handleChange} />
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <div className="flex items-center justify-between">
//                     <Label htmlFor="welcomeEmails">Welcome Emails</Label>
//                     <Switch checked={formData.welcomeEmails} onCheckedChange={(val) => handleSwitch('welcomeEmails', val)} />
//                   </div>
//                   <div className="flex items-center justify-between">
//                     <Label htmlFor="notificationEmails">Notification Emails</Label>
//                     <Switch checked={formData.notificationEmails} onCheckedChange={(val) => handleSwitch('notificationEmails', val)} />
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </motion.div>
//         </div>

//         {/* Right Column */}
//         <div className="space-y-8">
//           {/* Security Settings */}
//           <motion.div variants={itemVariants}>
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5" /> Security</CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-2">
//                 <div className="flex items-center justify-between">
//                   <Label>Two-Factor Authentication</Label>
//                   <Switch checked={formData.twoFactor} onCheckedChange={(val) => handleSwitch('twoFactor', val)} />
//                 </div>
//                 <div className="flex items-center justify-between">
//                   <Label>Strong Password Policy</Label>
//                   <Switch checked={formData.passwordPolicy} onCheckedChange={(val) => handleSwitch('passwordPolicy', val)} />
//                 </div>
//                 <div className="flex items-center justify-between">
//                   <Label>Session Timeout</Label>
//                   <Switch checked={formData.sessionTimeout} onCheckedChange={(val) => handleSwitch('sessionTimeout', val)} />
//                 </div>
//               </CardContent>
//             </Card>
//           </motion.div>

//           {/* Notification Settings */}
//           <motion.div variants={itemVariants}>
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2"><Bell className="h-5 w-5" /> Notifications</CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-2">
//                 <div className="flex items-center justify-between">
//                   <Label>Email Notifications</Label>
//                   <Switch checked={formData.emailNotifications} onCheckedChange={(val) => handleSwitch('emailNotifications', val)} />
//                 </div>
//                 <div className="flex items-center justify-between">
//                   <Label>New User Signups</Label>
//                   <Switch checked={formData.userSignups} onCheckedChange={(val) => handleSwitch('userSignups', val)} />
//                 </div>
//                 <div className="flex items-center justify-between">
//                   <Label>System Alerts</Label>
//                   <Switch checked={formData.systemAlerts} onCheckedChange={(val) => handleSwitch('systemAlerts', val)} />
//                 </div>
//               </CardContent>
//             </Card>
//           </motion.div>

//           {/* Database Settings */}
//           <motion.div variants={itemVariants}>
//             <Card>
//               <CardHeader>
//                 <CardTitle className="flex items-center gap-2"><Database className="h-5 w-5" /> Database</CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-2">
//                 <div className="flex items-center justify-between">
//                   <Label>Auto Backup</Label>
//                   <Switch checked={formData.autoBackup} onCheckedChange={(val) => handleSwitch('autoBackup', val)} />
//                 </div>
//                 <div>
//                   <Label>Backup Frequency</Label>
//                   <Select value={formData.backupFrequency} onValueChange={(val) => setFormData({ ...formData, backupFrequency: val })}>
//                     <SelectTrigger><SelectValue /></SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="hourly">Hourly</SelectItem>
//                       <SelectItem value="daily">Daily</SelectItem>
//                       <SelectItem value="weekly">Weekly</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </CardContent>
//             </Card>
//           </motion.div>
//         </div>
//       </div>
//     </motion.div>
//   );
// }
