"use client";

import { useState, useEffect } from 'react';
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
  Globe,
  AlertCircle
} from 'lucide-react';
import { getProfile, updateProfile } from '@/app/actions/profile-actions';

interface ProfileUser {
  name: string | null;
  email: string;
  image: string | null;
  createdAt: Date;
  emailVerified: Date | null;
}

interface ProfileData {
  id: string;
  userId: string;
  firstName: string | null;
  lastName: string | null;
  phone: string | null;
  location: string | null;
  jobTitle: string | null;
  company: string | null;
  bio: string | null;
  website: string | null;
  github: string | null;
  linkedin: string | null;
  dateOfBirth: Date | null;
  avatar: string | null;
  createdAt: Date;
  updatedAt: Date;
  user: ProfileUser;
}

interface UneditableFieldProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}

interface EditableFieldProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  field: keyof Omit<ProfileData, 'id' | 'userId' | 'createdAt' | 'updatedAt' | 'user' | 'avatar'>;
  type?: 'text' | 'date' | 'url';
  required?: boolean;
}

// Utility function for User ID masking
const maskUserId = (userId: string): string => {
  if (!userId) return 'Not available';
  if (userId.length <= 5) return `${userId}***`;
  return `${userId.substring(0, 5)}***`;
};

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [completion, setCompletion] = useState(0);
  const [tempProfile, setTempProfile] = useState<Partial<ProfileData>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setIsLoading(true);
      const result = await getProfile();
      
      if (result.error) {
        setError(result.error);
      } else {
        setProfile(result.profile);
        setCompletion(result.completion || 0);
      }
    } catch (err) {
      setError("Failed to load profile");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    if (profile) {
      setTempProfile({
        firstName: profile.firstName,
        lastName: profile.lastName,
        phone: profile.phone,
        location: profile.location,
        jobTitle: profile.jobTitle,
        company: profile.company,
        bio: profile.bio,
        website: profile.website,
        github: profile.github,
        linkedin: profile.linkedin,
        dateOfBirth: profile.dateOfBirth,
      });
      setIsEditing(true);
      setError(null);
    }
  };

  const handleSave = async () => {
    if (!tempProfile) return;

    try {
      setIsSaving(true);
      setError(null);

      const result = await updateProfile({
        firstName: tempProfile.firstName ?? null,
        lastName: tempProfile.lastName ?? null,
        phone: tempProfile.phone ?? null,
        location: tempProfile.location ?? null,
        jobTitle: tempProfile.jobTitle ?? null,
        company: tempProfile.company ?? null,
        bio: tempProfile.bio ?? null,
        website: tempProfile.website ?? null,
        github: tempProfile.github ?? null,
        linkedin: tempProfile.linkedin ?? null,
        dateOfBirth: tempProfile.dateOfBirth ? new Date(tempProfile.dateOfBirth) : null,
      });

      if (result.error) {
        setError(result.error);
      } else {
        setProfile(result.profile);
        setIsEditing(false);
        // Reload to get updated completion
        const newResult = await getProfile();
        setCompletion(newResult.completion || 0);
      }
    } catch (err) {
      setError("Failed to save profile");
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setTempProfile({});
    setIsEditing(false);
    setError(null);
  };

  const handleChange = (field: keyof ProfileData, value: string) => {
    setTempProfile(prev => ({
      ...prev,
      [field]: value || null
    }));
  };

  const formatDate = (date: Date | null) => {
    if (!date) return 'Not provided';
    return new Date(date).toLocaleDateString();
  };

  const formatDateTime = (date: Date | null) => {
    if (!date) return 'Not provided';
    return new Date(date).toLocaleString();
  };

  // Function to format date for input field
  const formatDateForInput = (date: Date | null) => {
    if (!date) return '';
    return new Date(date).toISOString().split('T')[0];
  };

  // Updated UneditableField component with User ID masking
  const UneditableField: React.FC<UneditableFieldProps> = ({ icon: Icon, label, value }) => {
    // Mask User ID to show first 5 characters followed by asterisks
    const displayValue = label === "User ID" ? maskUserId(value) : value;

    return (
      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
        <Icon className="w-5 h-5 text-gray-400" />
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-500">{label}</label>
          <p className="text-gray-900">{displayValue}</p>
        </div>
        <Lock className="w-4 h-4 text-gray-400" />
      </div>
    );
  };

  const EditableField: React.FC<EditableFieldProps> = ({ 
    icon: Icon, 
    label, 
    field, 
    type = 'text',
    required = false 
  }) => {
    let currentValue: string;

    if (isEditing) {
      // For editing mode
      if (field === 'dateOfBirth') {
        currentValue = formatDateForInput(tempProfile[field] as Date | null);
      } else {
        currentValue = (tempProfile[field] as string) || '';
      }
    } else {
      // For view mode
      if (field === 'dateOfBirth') {
        currentValue = formatDate(profile?.[field] as Date | null);
      } else {
        currentValue = (profile?.[field] as string) || '';
      }
    }

    const isEmpty = !currentValue && !isEditing;

    return (
      <div className="flex items-center space-x-3">
        <Icon className="w-5 h-5 text-gray-400 mt-6" />
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
          {isEditing ? (
            <input
              type={type}
              value={currentValue}
              onChange={(e) => handleChange(field, e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              placeholder={`Enter your ${label.toLowerCase()}...`}
            />
          ) : (
            <div>
              <p className={`py-2 ${isEmpty ? 'text-gray-400 italic' : 'text-gray-900'}`}>
                {isEmpty ? 'Not provided - Click edit to add' : currentValue}
              </p>
              {isEmpty && (
                <p className="text-sm text-amber-600 flex items-center mt-1">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  This field is empty
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4"></div>
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-200 rounded"></div>
                    <div className="h-4 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {error ? 'Error Loading Profile' : 'Profile Not Found'}
            </h2>
            <p className="text-gray-600 mb-4">
              {error || 'Unable to load your profile. Please try again.'}
            </p>
            <button 
              onClick={loadProfile}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
              <p className="text-gray-600 mt-2">Manage your personal information and account settings</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-purple-600">{completion}%</div>
              <div className="text-gray-600 text-sm">Profile Complete</div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-purple-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${completion}%` }}
            ></div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2 text-red-700">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Picture & Basic Info */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm border p-6 sticky top-8">
              {/* Profile Picture */}
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-4xl font-bold mb-4 mx-auto">
                    {profile.firstName?.[0] || profile.user.name?.[0] || 'U'}
                    {profile.lastName?.[0] || ''}
                  </div>
                  {isEditing && (
                    <button 
                      className="absolute bottom-2 right-2 bg-white p-2 rounded-full shadow-lg border hover:bg-gray-50 transition-colors"
                      type="button"
                    >
                      <Camera className="w-4 h-4 text-gray-600" />
                    </button>
                  )}
                </div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {profile.firstName && profile.lastName 
                    ? `${profile.firstName} ${profile.lastName}`
                    : profile.user.name || 'Unknown User'
                  }
                </h2>
                <p className="text-gray-600">{profile.jobTitle || 'No job title'}</p>
              </div>

              {/* Uneditable Information */}
              <div className="space-y-3 mb-6">
                <UneditableField icon={Mail} label="Email" value={profile.user.email} />
                <UneditableField icon={User} label="User ID" value={profile.userId} />
                <UneditableField icon={Calendar} label="Member since" value={formatDate(profile.user.createdAt)} />
                <UneditableField 
                  icon={Calendar} 
                  label="Email verified" 
                  value={profile.user.emailVerified ? formatDateTime(profile.user.emailVerified) : 'Not verified'} 
                />
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                      type="button"
                    >
                      <Save className="w-4 h-4" />
                      <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
                    </button>
                    <button
                      onClick={handleCancel}
                      disabled={isSaving}
                      className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      type="button"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleEdit}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                    type="button"
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
                  <EditableField icon={User} label="First Name" field="firstName" required />
                  <EditableField icon={User} label="Last Name" field="lastName" required />
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
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Bio
                      </label>
                      {isEditing ? (
                        <textarea
                          value={tempProfile.bio || ''}
                          onChange={(e) => handleChange('bio', e.target.value)}
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          placeholder="Tell us about yourself..."
                        />
                      ) : (
                        <div>
                          <p className={`py-2 ${!profile.bio ? 'text-gray-400 italic' : 'text-gray-900 whitespace-pre-wrap'}`}>
                            {profile.bio || 'Not provided - Click edit to add'}
                          </p>
                          {!profile.bio && (
                            <p className="text-sm text-amber-600 flex items-center mt-1">
                              <AlertCircle className="w-4 h-4 mr-1" />
                              This field is empty
                            </p>
                          )}
                        </div>
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
                  <EditableField icon={Globe} label="GitHub" field="github" />
                  <EditableField icon={Globe} label="LinkedIn" field="linkedin" />
                </div>
              </div>
            </div>

            {/* Stats Card */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-white p-4 rounded-lg border shadow-sm text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {profile.user.emailVerified ? 'Verified' : 'Pending'}
                </div>
                <div className="text-gray-600 text-sm">Email Status</div>
              </div>
              <div className="bg-white p-4 rounded-lg border shadow-sm text-center">
                <div className="text-2xl font-bold text-green-600">{completion}%</div>
                <div className="text-gray-600 text-sm">Profile Complete</div>
              </div>
              <div className="bg-white p-4 rounded-lg border shadow-sm text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {Math.floor((new Date().getTime() - new Date(profile.user.createdAt).getTime()) / (1000 * 60 * 60 * 24))}d
                </div>
                <div className="text-gray-600 text-sm">Account Age</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}