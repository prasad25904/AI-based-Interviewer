// Temporary in-memory storage for development
const profileStorage = new Map();

export interface ProfileData {
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
  location?: string | null;
  jobTitle?: string | null;
  company?: string | null;
  bio?: string | null;
  website?: string | null;
  github?: string | null;
  linkedin?: string | null;
  dateOfBirth?: Date | string | null;
  avatar?: string | null;
}

export class ProfileService {
  static async getProfile(userId: string) {
    try {
      // Try to get from database first
      const { prisma } = await import('@/lib/prisma');
      
      const profile = await prisma.profile.findUnique({
        where: { userId },
        include: {
          user: {
            select: {
              name: true,
              email: true,
              image: true,
              createdAt: true,
              emailVerified: true,
            }
          }
        }
      });

      if (!profile) {
        // Create empty profile if doesn't exist
        return await this.createProfile(userId, {});
      }

      return profile;
    } catch (error) {
      console.error('Database error, using fallback:', error);
      // Fallback to in-memory storage
      return this.getFallbackProfile(userId);
    }
  }

  static async createProfile(userId: string, data: ProfileData) {
    try {
      const { prisma } = await import('@/lib/prisma');
      
      return await prisma.profile.create({
        data: {
          userId,
          ...data,
        },
        include: {
          user: {
            select: {
              name: true,
              email: true,
              image: true,
              createdAt: true,
              emailVerified: true,
            }
          }
        }
      });
    } catch (error) {
      console.error('Database error, using fallback:', error);
      return this.createFallbackProfile(userId, data);
    }
  }

  static async updateProfile(userId: string, data: ProfileData) {
    try {
      const { prisma } = await import('@/lib/prisma');
      
      return await prisma.profile.upsert({
        where: { userId },
        update: data,
        create: {
          userId,
          ...data,
        },
        include: {
          user: {
            select: {
              name: true,
              email: true,
              image: true,
              createdAt: true,
              emailVerified: true,
            }
          }
        }
      });
    } catch (error) {
      console.error('Database error, using fallback:', error);
      return this.updateFallbackProfile(userId, data);
    }
  }

  static async getProfileCompletion(userId: string): Promise<number> {
    try {
      const profile = await this.getProfile(userId);
      const fields = [
        profile.firstName,
        profile.lastName,
        profile.phone,
        profile.location,
        profile.jobTitle,
        profile.company,
        profile.bio,
      ];
      
      const filledFields = fields.filter(field => field && field.trim() !== '').length;
      return Math.round((filledFields / fields.length) * 100);
    } catch (error) {
      console.error('Error calculating profile completion:', error);
      return 0;
    }
  }

  // Fallback methods
  private static getFallbackProfile(userId: string) {
    const profile = profileStorage.get(userId);
    if (!profile) {
      return this.createFallbackProfile(userId, {});
    }
    return profile;
  }

  private static createFallbackProfile(userId: string, data: ProfileData) {
    const fallbackProfile = {
      id: `fallback-${userId}`,
      userId,
      firstName: null,
      lastName: null,
      phone: null,
      location: null,
      jobTitle: null,
      company: null,
      bio: null,
      website: null,
      github: null,
      linkedin: null,
      dateOfBirth: null,
      avatar: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      user: {
        name: 'Demo User',
        email: 'demo@example.com',
        image: null,
        createdAt: new Date(),
        emailVerified: null,
      },
      ...data
    };
    
    profileStorage.set(userId, fallbackProfile);
    return fallbackProfile;
  }

  private static updateFallbackProfile(userId: string, data: ProfileData) {
    const existing = this.getFallbackProfile(userId);
    const updatedProfile = {
      ...existing,
      ...data,
      updatedAt: new Date(),
    };
    
    profileStorage.set(userId, updatedProfile);
    return updatedProfile;
  }
}