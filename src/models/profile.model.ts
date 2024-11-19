// src/models/profile.model.ts

export interface UserProfile {
  name: string;
  email: string;
  phoneNumber: string;
  photo?: string;
}

export interface UpdateProfileRequest {
  name: string;
  phoneNumber: string;
}