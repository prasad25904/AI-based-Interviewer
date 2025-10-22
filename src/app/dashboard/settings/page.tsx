import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Trash2, ShieldOff } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-3xl mx-auto px-4">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400">Configure your application preferences</p>
      </div>

      {/* Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
          <CardDescription>Customize how the application behaves</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Theme Selection */}
          <div className="space-y-1">
            <Label>Theme</Label>
            <Select defaultValue="system">
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Default Interview Level */}
          <div className="space-y-1">
            <Label>Default Interview Level</Label>
            <Select defaultValue="beginner">
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Notification Settings */}
          <div className="flex items-center justify-between">
            <Label>Enable Notifications</Label>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card>
        <CardHeader>
          <CardTitle>Security</CardTitle>
          <CardDescription>Manage authentication and sessions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* 2FA */}
          <div className="flex items-center justify-between">
            <Label>Two-Factor Authentication (2FA)</Label>
            <Switch />
          </div>

          {/* Session Management */}
          <div className="space-y-1">
            <Label>Sessions</Label>
            <p className="text-sm text-muted-foreground">Manage active devices and sessions</p>
            <Button variant="outline" size="sm">Manage Sessions</Button>
          </div>
        </CardContent>
      </Card>

      {/* Resume Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Resume Settings</CardTitle>
          <CardDescription>Control your resume preferences</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Default Resume */}
          <div className="space-y-1">
            <Label>Default Resume</Label>
            <Select defaultValue="resume1">
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select resume" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="resume1">Resume 1</SelectItem>
                <SelectItem value="resume2">Resume 2</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Resume Visibility */}
          <div className="flex items-center justify-between">
            <Label>Resume Visibility</Label>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-red-500">
        <CardHeader>
          <CardTitle className="text-red-600">Danger Zone</CardTitle>
          <CardDescription className="text-red-500">
            Be careful – these actions are irreversible
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Delete Account */}
          <div className="flex items-center justify-between">
            <div>
              <Label>Delete Account</Label>
              <p className="text-sm text-muted-foreground">Permanently remove your account and data</p>
            </div>
            <Button variant="destructive" size="sm">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </div>

          {/* Reset Data */}
          <div className="flex items-center justify-between">
            <div>
              <Label>Reset All Data</Label>
              <p className="text-sm text-muted-foreground">Clear all interviews and resumes</p>
            </div>
            <Button variant="destructive" size="sm">
              <ShieldOff className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
