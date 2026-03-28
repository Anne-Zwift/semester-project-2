import type { RegisterPayload } from "../types/Auth";
import type { LoginPayLoad } from "../types/Auth";


export function validateRegister(data: RegisterPayload): string | null {
  const usernameRegex = /^[a-zA-Z0-9_]+$/;
  const emailRegex = /^[^\s@]+@stud\.noroff\.no$/;

  if (!usernameRegex.test(data.name)) {
    return 'Username can only contain letters, numbers, and underscores';
  }

  if (!emailRegex.test(data.email)) {
    return 'Email must be a valid stud.noroff.no address';
  }

  if (data.password.length < 8) {
    return 'Password must be at least 8 characters';
  }

  return null;
}


export function validateLogin(data: LoginPayLoad): string | null {
  if (!data.email) return 'Email is required';
  if (!data.password) return 'Password is required';

  return null;
}