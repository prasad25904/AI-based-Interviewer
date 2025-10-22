"use server";

import { ResumeService, ResumeData } from '@/lib/services/resume-service';
import { getCurrentUser } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function getUserResumes() {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return { resumes: [], error: "Please log in to view resumes" };
    }
    
    const resumes = await ResumeService.getUserResumes(user.id);
    return { resumes, error: null };
  } catch (error) {
    console.error('Error in getUserResumes action:', error);
    return { 
      resumes: [], 
      error: "Failed to fetch resumes" 
    };
  }
}

export async function uploadResume(formData: FormData) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return { resume: null, error: "Please log in to upload resumes" };
    }

    const file = formData.get('resume') as File;
    const filename = formData.get('filename') as string;

    if (!file) {
      return { resume: null, error: "No file provided" };
    }

    if (!filename || filename.trim() === '') {
      return { resume: null, error: "Resume name is required" };
    }

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (!allowedTypes.includes(file.type) && !file.name.toLowerCase().endsWith('.pdf') && !file.name.toLowerCase().endsWith('.doc') && !file.name.toLowerCase().endsWith('.docx')) {
      return { resume: null, error: "Only PDF and Word documents are allowed" };
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      return { resume: null, error: "File size must be less than 5MB" };
    }

    // Read file content (in a real app, you'd upload to cloud storage)
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const content = buffer.toString('base64');

    const resumeData: ResumeData = {
      filename: filename.trim(),
      content,
      fileSize: file.size,
      fileUrl: undefined // Use undefined instead of null
    };

    const resume = await ResumeService.createResume(user.id, resumeData);
    revalidatePath("/dashboard/resumes");
    
    return { resume, error: null };
  } catch (error) {
    console.error('Error in uploadResume action:', error);
    return { 
      resume: null, 
      error: "Failed to upload resume" 
    };
  }
}

export async function deleteResume(resumeId: string) {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return { error: "Please log in to delete resumes" };
    }

    await ResumeService.deleteResume(resumeId, user.id);
    revalidatePath("/dashboard/resumes");
    
    return { error: null };
  } catch (error) {
    console.error('Error in deleteResume action:', error);
    return { 
      error: "Failed to delete resume" 
    };
  }
}