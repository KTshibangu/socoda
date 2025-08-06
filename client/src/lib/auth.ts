// Basic auth utilities - to be extended when implementing full auth system

export interface AuthUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: "composer" | "author" | "vocalist" | "business" | "admin";
  profileImageUrl?: string;
}

export function getMockUser(): AuthUser {
  return {
    id: "mock-user-id",
    email: "john@example.com",
    firstName: "John",
    lastName: "Composer",
    role: "admin",
    profileImageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=32&h=32",
  };
}

export function hasPermission(userRole: string, requiredRole: string): boolean {
  const roleHierarchy = {
    admin: 4,
    business: 3,
    composer: 2,
    author: 2,
    vocalist: 2,
  };

  return (roleHierarchy[userRole as keyof typeof roleHierarchy] || 0) >= 
         (roleHierarchy[requiredRole as keyof typeof roleHierarchy] || 0);
}
