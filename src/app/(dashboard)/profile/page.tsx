'use client';

import { getProfile, updateProfile } from "@/app/actions/profile-actions";
import { useEffect, useState } from "react";
import { 
  Camera, 
  Save, 
  Edit2, 
  Lock, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  User, 
  Briefcase,
  Globe
} from 'lucide-react';

// Type definitions
interface Profile {
  userId: string;
  email: string;
  joinDate: string;
  lastLogin: string;
  firstName: string;
  lastName: string;
  phone: string;
  location: string;
  jobTitle: string;
  company: string;
  bio: string;
  website: string;
  github: string;
  linkedin: string;
  dateOfBirth: string;
}

interface UneditableFieldProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}

interface EditableFieldProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  field: keyof Profile;
  type?: 'text' | 'date' | 'url';
}

interface IconProps {
  className?: string;
}

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [tempProfile, setTempProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const { profile, error } = await getProfile();
      if (error) {
        setError(error);
      } else {
        setProfile(profile);
        setTempProfile(profile);
      }
      setLoading(false);
    };
    fetchProfile();
  }, []);

  const handleEdit = (): void => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (tempProfile) {
      const { profile, error } = await updateProfile(tempProfile);
      if (error) {
        // Handle error (e.g., show a toast message)
      } else {
        setProfile(profile);
        setIsEditing(false);
      }
    }
  };

  const handleCancel = (): void => {
    setTempProfile(profile);
    setIsEditing(false);
  };

  const handleChange = (field: keyof Profile, value: string): void => {
    setTempProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const UneditableField: React.FC<UneditableFieldProps> = ({ icon: Icon, label, value }) => (
    <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
      <Icon className="w-5 h-5 text-gray-400" />
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-500">{label}</label>
        <p className="text-gray-900">{value}</p>
      </div>
      <Lock className="w-4 h-4 text-gray-400" />
    </div>
  );

  const EditableField: React.FC<EditableFieldProps> = ({ icon: Icon, label, field, type = 'text' }) => (
    <div className="flex items-center space-x-3">
      <Icon className="w-5 h-5 text-gray-400 mt-6" />
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
        {isEditing ? (
          <input
            type={type}
            value={tempProfile[field]}
            onChange={(e) => handleChange(field, e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        ) : (
          <p className="text-gray-900 py-2">{profile[field] || 'Not provided'}</p>
        )}
      </div>
    </div>
  );

  // Custom SVG icons with proper typing
  const GitHub: React.FC<IconProps> = ({ className }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
    </svg>
  );

  const Linkedin: React.FC<IconProps> = ({ className }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!profile) {
    return <div>Profile Not Found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-600 mt-2">Manage your personal information and account settings</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Picture & Basic Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border p-6 sticky top-8">
              {/* Profile Picture */}
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold mb-4 mx-auto">
                    {profile.firstName && profile.lastName ? `${profile.firstName[0]}${profile.lastName[0]}` : ''}
                  </div>
                  {isEditing && (
                    <button className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-lg border hover:bg-gray-50 transition-colors">
                      <Camera className="w-4 h-4 text-gray-600" />
                    </button>
                  )}
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {profile.firstName} {profile.lastName}
                </h2>
                <p className="text-gray-600">{profile.jobTitle}</p>
              </div>

              {/* Uneditable Information */}
              <div className="space-y-3 mb-6">
                <UneditableField icon={Mail} label="Email" value={profile.email} />
                <UneditableField icon={User} label="User ID" value={profile.userId} />
                <UneditableField icon={Calendar} label="Member since" value={new Date(profile.joinDate).toLocaleDateString()} />
                <UneditableField icon={Calendar} label="Last login" value={new Date(profile.lastLogin).toLocaleString()} />
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSave}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>Save Changes</span>
                    </button>
                    <button
                      onClick={handleCancel}
                      className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleEdit}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Edit2 className="w-4 h-4" />
                    <span>Edit Profile</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Editable Information */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm border">
              {/* Personal Information */}
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <EditableField icon={User} label="First Name" field="firstName" />
                  <EditableField icon={User} label="Last Name" field="lastName" />
                  <EditableField icon={Phone} label="Phone" field="phone" />
                  <EditableField icon={Calendar} label="Date of Birth" field="dateOfBirth" type="date" />
                  <EditableField icon={MapPin} label="Location" field="location" />
                </div>
              </div>

              {/* Professional Information */}
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Professional Information</h3>
                <div className="space-y-4">
                  <EditableField icon={Briefcase} label="Job Title" field="jobTitle" />
                  <EditableField icon={Briefcase} label="Company" field="company" />
                  
                  <div className="flex items-start space-x-3">
                    <User className="w-5 h-5 text-gray-400 mt-2" />
                    <div class="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Bio
                      </label>
                      {isEditing ? (
                        <textarea
                          value={tempProfile.bio}
                          onChange={(e) => handleChange('bio', e.target.value)}
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          placeholder="Tell us about yourself..."
                        />
                      ) : (
                        <p className="text-gray-900 py-2 whitespace-pre-wrap">
                          {profile.bio || 'No bio provided'}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Social Links</h3>
                <div className="space-y-4">
                  <EditableField icon={Globe} label="Website" field="website" type="url" />
                  <EditableField icon={GitHub} label="GitHub" field="github" />
                  <EditableField icon={Linkedin} label="LinkedIn" field="linkedin" />
                </div>
              </div>
            </div>

            {/* Stats Card */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-white p-4 rounded-lg border shadow-sm text-center">
                <div className="text-2xl font-bold text-blue-600">42</div>
                <div className="text-gray-600 text-sm">Projects</div>
              </div>
              <div className="bg-white p-4 rounded-lg border shadow-sm text-center">
                <div className="text-2xl font-bold text-green-600">128</div>
                <div className="text-gray-600 text-sm">Connections</div>
              </div>
              <div className="bg-white p-4 rounded-lg border shadow-sm text-center">
                <div className="text-2xl font-bold text-purple-600">96%</div>
                <div className="text-gray-600 text-sm">Profile Complete</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
