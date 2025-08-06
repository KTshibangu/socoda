export interface AuthUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: string;
  profileImageUrl?: string;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

// Get token from localStorage
export function getAuthToken(): string | null {
  return localStorage.getItem('auth_token');
}

// Set token in localStorage
export function setAuthToken(token: string): void {
  localStorage.setItem('auth_token', token);
}

// Remove token from localStorage
export function removeAuthToken(): void {
  localStorage.removeItem('auth_token');
}

// Check if user has specific roles
export function hasRole(userRole: string, allowedRoles: string[]): boolean {
  return allowedRoles.includes(userRole);
}

// Check if user can access artist features (works, royalties)
export function canAccessArtistFeatures(userRole: string): boolean {
  return hasRole(userRole, ['artist', 'admin']);
}

// Check if user can access business features (licenses, usage reports)
export function canAccessBusinessFeatures(userRole: string): boolean {
  return hasRole(userRole, ['business', 'admin']);
}

// Check if user is admin
export function isAdmin(userRole: string): boolean {
  return userRole === 'admin';
}

// Get user's display name
export function getUserDisplayName(user: AuthUser): string {
  if (user.firstName && user.lastName) {
    return `${user.firstName} ${user.lastName}`;
  }
  if (user.firstName) {
    return user.firstName;
  }
  return user.email;
}

// Get user initials
export function getUserInitials(user: AuthUser): string {
  if (user.firstName && user.lastName) {
    return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
  }
  if (user.firstName) {
    return user.firstName[0].toUpperCase();
  }
  return user.email[0].toUpperCase();
}