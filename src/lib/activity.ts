import { prisma } from '@/lib/db';
import { ActivityType } from '@prisma/client';

// Define proper types instead of using 'any'
interface ActivityMetadata {
  [key: string]: string | number | boolean | null;
}

export interface CreateActivityParams {
  userId: string;
  activityType: ActivityType;
  description: string;
  metadata?: ActivityMetadata;
}

export class ActivityService {
  static async createActivity(params: CreateActivityParams) {
    try {
      const activity = await prisma.userActivity.create({
        data: {
          userId: params.userId,
          activityType: params.activityType,
          description: params.description,
          metadata: params.metadata || {},
        },
      });
      return activity;
    } catch (error) {
      console.error('Error creating activity:', error);
      throw new Error('Failed to create activity');
    }
  }

  static async getUserActivities(userId: string) {
    try {
      const activities = await prisma.userActivity.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 50, // Limit to last 50 activities
      });
      return activities;
    } catch (error) {
      console.error('Error fetching user activities:', error);
      throw new Error('Failed to fetch user activities');
    }
  }

  static async logLogin(userId: string) {
    return this.createActivity({
      userId,
      activityType: 'LOGIN',
      description: 'User logged in',
    });
  }

  static async logLogout(userId: string) {
    return this.createActivity({
      userId,
      activityType: 'LOGOUT',
      description: 'User logged out',
    });
  }

  static async logResumeUpload(userId: string, filename: string) {
    return this.createActivity({
      userId,
      activityType: 'RESUME_UPLOADED',
      description: `User uploaded resume: ${filename}`,
      metadata: { filename },
    });
  }

  static async logProfileUpdate(userId: string) {
    return this.createActivity({
      userId,
      activityType: 'PROFILE_UPDATED',
      description: 'User updated profile',
    });
  }

  static async logInterviewStarted(userId: string, interviewId: string) {
    return this.createActivity({
      userId,
      activityType: 'INTERVIEW_STARTED',
      description: 'User started an interview',
      metadata: { interviewId },
    });
  }

  static async logInterviewCompleted(userId: string, interviewId: string, score?: number) {
    return this.createActivity({
      userId,
      activityType: 'INTERVIEW_COMPLETED',
      description: 'User completed an interview',
      metadata: { interviewId, score: score ?? null },
    });
  }
}