import { prisma } from '@/lib/prisma';

export interface ResumeData {
  filename: string;
  content: string;
  fileUrl?: string | null; // Allow null as well
  fileSize: number;
}

export class ResumeService {
  static async getUserResumes(userId: string) {
    try {
      const resumes = await prisma.resume.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' }
      });
      return resumes;
    } catch (error) {
      console.error('Error fetching resumes:', error);
      throw new Error('Failed to fetch resumes');
    }
  }

  static async createResume(userId: string, data: ResumeData) {
    try {
      const resume = await prisma.resume.create({
        data: {
          userId,
          ...data,
        }
      });
      return resume;
    } catch (error) {
      console.error('Error creating resume:', error);
      throw new Error('Failed to create resume');
    }
  }

  static async deleteResume(resumeId: string, userId: string) {
    try {
      const resume = await prisma.resume.findFirst({
        where: { id: resumeId, userId }
      });

      if (!resume) {
        throw new Error('Resume not found');
      }

      await prisma.resume.delete({
        where: { id: resumeId }
      });

      return true;
    } catch (error) {
      console.error('Error deleting resume:', error);
      throw new Error('Failed to delete resume');
    }
  }

  static async getResume(resumeId: string, userId: string) {
    try {
      const resume = await prisma.resume.findFirst({
        where: { id: resumeId, userId }
      });

      if (!resume) {
        throw new Error('Resume not found');
      }

      return resume;
    } catch (error) {
      console.error('Error fetching resume:', error);
      throw new Error('Failed to fetch resume');
    }
  }
}