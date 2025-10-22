"use server";

import { ProfileService, ProfileData } from '@/lib/services/profile-service';
import { revalidatePath } from 'next/cache';

export async function getProfile() {
  try {
    // Import dynamically to avoid build issues
    const { getCurrentUser } = await import('@/lib/auth');
    const user = await getCurrentUser();
    
    if (!user) {
      return { 
        profile: null, 
        completion: 0, 
        error: "Please log in to view your profile" 
      };
    }
    
    console.log('Getting profile for user:', user.id);
    const profile = await ProfileService.getProfile(user.id);
    const completion = await ProfileService.getProfileCompletion(user.id);
    
    return { profile, completion, error: null };
  } catch (error) {
    console.error('Error in getProfile action:', error);
    return { 
      profile: null, 
      completion: 0, 
      error: "Failed to fetch profile. Please try again." 
    };
  }
}

export async function updateProfile(data: ProfileData) {
  try {
    const { getCurrentUser } = await import('@/lib/auth');
    const user = await getCurrentUser();
    
    if (!user) {
      return { 
        profile: null, 
        error: "Please log in to update your profile" 
      };
    }

    const profile = await ProfileService.updateProfile(user.id, data);
    revalidatePath("/dashboard/profile");
    
    return { profile, error: null };
  } catch (error) {
    console.error('Error in updateProfile action:', error);
    return { 
      profile: null, 
      error: "Failed to update profile" 
    };
  }
}