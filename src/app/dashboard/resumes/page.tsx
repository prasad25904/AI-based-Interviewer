//src/app/dashboard/resumes/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { 
  Upload, 
  Download, 
  Trash2, 
  FileText, 
  AlertCircle,
  Calendar,
  File,
  Sparkles,
  Shield,
  FolderOpen,
  Zap,
  CloudUpload
} from 'lucide-react';
import { getUserResumes, uploadResume, deleteResume } from '@/app/actions/resume-actions';

// Update the interface to match the database structure
interface Resume {
  id: string;
  userId: string;
  filename: string;
  content: string;
  fileUrl?: string | null;
  fileSize: number;
  createdAt: Date;
}

export default function ResumesPage() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    loadResumes();
  }, []);

  const loadResumes = async () => {
    try {
      setIsLoading(true);
      const result = await getUserResumes();
      
      if (result.error) {
        setError(result.error);
      } else {
        setResumes(result.resumes);
      }
    } catch (err) {
      setError("Failed to load resumes");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    setUploadError(null);
  };

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!selectedFile) {
      setUploadError("Please select a file");
      return;
    }

    const formData = new FormData(e.currentTarget);
    
    try {
      setIsUploading(true);
      setUploadError(null);

      const result = await uploadResume(formData);

      if (result.error) {
        setUploadError(result.error);
      } else {
        // Reset form and reload resumes
        setSelectedFile(null);
        setShowUploadForm(false);
        (e.target as HTMLFormElement).reset();
        await loadResumes();
      }
    } catch (err) {
      setUploadError("Failed to upload resume");
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (resumeId: string) => {
    if (!confirm('Are you sure you want to delete this resume?')) {
      return;
    }

    try {
      const result = await deleteResume(resumeId);

      if (result.error) {
        setError(result.error);
      } else {
        await loadResumes();
      }
    } catch (err) {
      setError("Failed to delete resume");
      console.error(err);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-8 p-4">
        {/* Header Skeleton */}
        <div className="flex justify-between items-start">
          <div className="space-y-3">
            <div className="h-8 bg-gradient-to-r from-amber-500/20 to-blue-500/20 rounded-lg w-48 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-64 animate-pulse"></div>
          </div>
          <div className="h-12 bg-gray-200 rounded-xl w-40 animate-pulse"></div>
        </div>
        
        {/* Content Skeleton */}
        <div className="bg-gradient-to-br from-slate-50 to-blue-50 border-2 border-gray-200 rounded-2xl p-8">
          <div className="animate-pulse space-y-6">
            <div className="grid grid-cols-3 gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-32 bg-gray-200 rounded-xl"></div>
              ))}
            </div>
            <div className="h-64 bg-gray-200 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 p-4">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 rounded-xl bg-gradient-to-r from-amber-500 to-blue-600 shadow-lg">
              <FolderOpen className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-amber-600 to-blue-600 bg-clip-text text-transparent">
              My Resumes
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl">
            Upload and manage your resumes for personalized interview questions and better practice sessions.
          </p>
        </div>
        <button
          onClick={() => setShowUploadForm(true)}
          className="bg-gradient-to-r from-amber-500 to-blue-600 hover:from-amber-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all duration-300 transform hover:scale-105 flex items-center space-x-3 group font-semibold"
        >
          <CloudUpload className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
          <span>Upload Resume</span>
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-xl p-4 flex items-center space-x-3 text-red-700 shadow-lg">
          <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
          <span className="font-medium">{error}</span>
        </div>
      )}

      {/* Upload Form */}
      {showUploadForm && (
        <div className="bg-gradient-to-br from-white to-blue-50 border-2 border-amber-200 rounded-2xl p-8 shadow-2xl backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 shadow-lg">
              <Upload className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
              Upload New Resume
            </h2>
          </div>
          
          <form onSubmit={handleUpload} className="space-y-6">
            <div>
              <label htmlFor="filename" className="block text-sm font-semibold text-gray-700 mb-3">
                Resume Name *
              </label>
              <input
                type="text"
                id="filename"
                name="filename"
                required
                placeholder="e.g., Software Engineer Resume 2024"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-300 bg-white/80 backdrop-blur-sm"
              />
            </div>

            <div>
              <label htmlFor="resume" className="block text-sm font-semibold text-gray-700 mb-3">
                Resume File (PDF/DOC) *
              </label>
              <div className="border-2 border-dashed border-amber-300 rounded-xl p-6 bg-amber-50/50 transition-all duration-300 hover:border-amber-400 hover:bg-amber-50">
                <input
                  type="file"
                  id="resume"
                  name="resume"
                  accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={handleFileSelect}
                  required
                  className="w-full file:mr-4 file:py-3 file:px-6 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-amber-500 file:to-orange-500 file:text-white hover:file:from-amber-600 hover:file:to-orange-600 transition-all duration-300"
                />
              </div>
              <p className="text-sm text-gray-600 mt-3 flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-500" />
                Supported formats: PDF, DOC, DOCX (Max: 5MB)
              </p>
            </div>

            {selectedFile && (
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-semibold text-green-800">Selected file: {selectedFile.name}</p>
                    <p className="text-sm text-green-600">Size: {formatFileSize(selectedFile.size)}</p>
                  </div>
                </div>
              </div>
            )}

            {uploadError && (
              <div className="bg-gradient-to-r from-red-50 to-pink-50 border-2 border-red-200 rounded-xl p-4 flex items-center gap-3 text-red-700">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <span className="font-medium">{uploadError}</span>
              </div>
            )}

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={isUploading}
                className="bg-gradient-to-r from-amber-500 to-blue-600 hover:from-amber-600 hover:to-blue-700 text-white px-8 py-3 rounded-xl shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-300 transform hover:scale-105 flex items-center space-x-3 font-semibold group"
              >
                <CloudUpload className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
                <span>{isUploading ? 'Uploading...' : 'Upload Resume'}</span>
                {isUploading && <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowUploadForm(false);
                  setSelectedFile(null);
                  setUploadError(null);
                }}
                className="border-2 border-gray-300 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Resumes List */}
      <div className="bg-gradient-to-br from-white to-blue-50 border-2 border-gray-200 rounded-2xl shadow-xl overflow-hidden transition-all duration-500 hover:shadow-2xl">
        <div className="p-8 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Your Resumes</h2>
              <p className="text-amber-600 font-semibold flex items-center gap-2 mt-1">
                <Sparkles className="w-4 h-4" />
                {resumes.length} resume{resumes.length !== 1 ? 's' : ''} stored securely
              </p>
            </div>
          </div>
        </div>

        {resumes.length === 0 ? (
          <div className="p-16 text-center">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r from-amber-100 to-orange-100 border-2 border-amber-200 flex items-center justify-center">
              <File className="h-12 w-12 text-amber-500" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No resumes uploaded yet</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg">
              Upload your first resume to get personalized interview questions and enhance your practice sessions.
            </p>
            <button
              onClick={() => setShowUploadForm(true)}
              className="bg-gradient-to-r from-amber-500 to-blue-600 hover:from-amber-600 hover:to-blue-700 text-white px-8 py-4 rounded-xl shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all duration-300 transform hover:scale-105 flex items-center space-x-3 mx-auto font-semibold group"
            >
              <CloudUpload className="w-5 h-5 group-hover:scale-110 transition-transform duration-300" />
              <span>Upload Your First Resume</span>
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {resumes.map((resume) => (
              <div 
                key={resume.id} 
                className="p-8 hover:bg-gradient-to-r hover:from-amber-50/50 hover:to-blue-50/50 transition-all duration-300 group"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6">
                    <div className="p-4 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg group-hover:scale-110 transition-transform duration-300">
                      <FileText className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h3 className="font-bold text-xl text-gray-900 group-hover:text-amber-700 transition-colors duration-300">
                        {resume.filename}
                      </h3>
                      <div className="flex items-center space-x-6 text-sm text-gray-600 mt-2">
                        <span className="flex items-center space-x-2 bg-blue-50 px-3 py-1 rounded-full">
                          <Calendar className="w-4 h-4 text-blue-600" />
                          <span>Uploaded {formatDate(resume.createdAt)}</span>
                        </span>
                        <span className="flex items-center space-x-2 bg-amber-50 px-3 py-1 rounded-full">
                          <Zap className="w-4 h-4 text-amber-600" />
                          <span>{formatFileSize(resume.fileSize)}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => {
                        // Use the API route for download
                        const downloadUrl = `/api/resumes/${resume.id}/download`;
                        window.open(downloadUrl, '_blank');
                      }}
                      className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white p-3 rounded-xl shadow-lg shadow-green-500/25 hover:shadow-green-500/40 transition-all duration-300 transform hover:scale-110 group/btn"
                      title="Download resume"
                    >
                      <Download className="w-5 h-5 group-hover/btn:scale-110 transition-transform duration-300" />
                    </button>
                    <button
                      onClick={() => handleDelete(resume.id)}
                      className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white p-3 rounded-xl shadow-lg shadow-red-500/25 hover:shadow-red-500/40 transition-all duration-300 transform hover:scale-110 group/btn"
                      title="Delete resume"
                    >
                      <Trash2 className="w-5 h-5 group-hover/btn:scale-110 transition-transform duration-300" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Features Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[{
          icon: <CloudUpload className="w-6 h-6 text-white" />,
          title: "Easy Upload",
          description: "Upload your resumes in PDF or document format with a custom name for easy identification.",
          gradient: "from-blue-500 to-cyan-500",
          bgGradient: "from-blue-50 to-cyan-50",
          borderColor: "border-blue-200"
        }, {
          icon: <Shield className="w-6 h-6 text-white" />,
          title: "Organized Storage",
          description: "All your resumes are stored securely and organized with upload dates and file sizes.",
          gradient: "from-amber-500 to-orange-500",
          bgGradient: "from-amber-50 to-orange-50",
          borderColor: "border-amber-200"
        }, {
          icon: <Zap className="w-6 h-6 text-white" />,
          title: "Quick Access",
          description: "Download or delete your resumes anytime. Your most recent uploads appear first.",
          gradient: "from-purple-500 to-pink-500",
          bgGradient: "from-purple-50 to-pink-50",
          borderColor: "border-purple-200"
        }].map(({ icon, title, description, gradient, bgGradient, borderColor }, idx) => (
          <div
            key={idx}
            className="group transition-all duration-500 hover:scale-105 hover:shadow-2xl rounded-2xl"
          >
            <div className={`bg-gradient-to-br ${bgGradient} ${borderColor} border-2 backdrop-blur-sm shadow-xl h-full rounded-2xl p-6 transition-all duration-300`}>
              <div className={`p-4 rounded-xl bg-gradient-to-r ${gradient} shadow-lg w-fit mb-4 group-hover:scale-110 transition-transform duration-300`}>
                {icon}
              </div>
              <h3 className="font-bold text-xl text-gray-900 mb-3">{title}</h3>
              <p className="text-gray-600 leading-relaxed">
                {description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}