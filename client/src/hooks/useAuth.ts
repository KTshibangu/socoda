import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { getAuthToken, setAuthToken, removeAuthToken, type AuthUser, type AuthResponse } from "@/lib/auth";
import { useToast } from "./use-toast";

export interface LoginData {
  email: string;
  password: string;
}

export interface SignupData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: "artist" | "business";
}

// Hook to get current user
export function useAuth() {
  const { data: user, isLoading, error } = useQuery<AuthUser>({
    queryKey: ["/api/auth/me"],
    enabled: !!getAuthToken(),
    retry: false,
  });

  const isAuthenticated = !!getAuthToken() && !!user;

  return {
    user,
    isLoading,
    isAuthenticated,
    error,
  };
}

// Hook for login
export function useLogin() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (loginData: LoginData) => {
      const response = await apiRequest("POST", "/api/auth/login", loginData);
      return response.json() as Promise<AuthResponse>;
    },
    onSuccess: (data: AuthResponse) => {
      setAuthToken(data.token);
      queryClient.setQueryData(["/api/auth/me"], data.user);
      toast({
        title: "Welcome back!",
        description: "You have been logged in successfully.",
      });
      setLocation("/");
    },
    onError: (error: Error) => {
      console.error("Login failed:", error);
      toast({
        title: "Login failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive",
      });
    },
  });
}

// Hook for signup
export function useSignup() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (signupData: SignupData) => {
      const response = await apiRequest("POST", "/api/auth/signup", signupData);
      return response.json() as Promise<AuthResponse>;
    },
    onSuccess: (data: AuthResponse) => {
      setAuthToken(data.token);
      queryClient.setQueryData(["/api/auth/me"], data.user);
      toast({
        title: "Account created!",
        description: "Welcome to the Performing Rights Organization platform.",
      });
      setLocation("/");
    },
    onError: (error: Error) => {
      console.error("Signup failed:", error);
      toast({
        title: "Signup failed",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    },
  });
}

// Hook for logout
export function useLogout() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async () => {
      if (getAuthToken()) {
        await apiRequest("POST", "/api/auth/logout");
      }
    },
    onSuccess: () => {
      removeAuthToken();
      queryClient.clear();
      queryClient.resetQueries();
      toast({
        title: "Logged out",
        description: "You have been logged out successfully.",
      });
      setLocation("/login");
    },
    onError: () => {
      // Even if the server request fails, we still log out locally
      removeAuthToken();
      queryClient.clear();
      queryClient.resetQueries();
      setLocation("/login");
    },
  });
}