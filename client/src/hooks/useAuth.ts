import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

export interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: string;
  department: string | null;
  lastLoginAt: Date | null;
}

export interface Developer {
  id: string;
  name: string;
  team: string | null;
  permissions: any;
  lastActiveAt: Date | null;
}

export interface AuthData {
  user: User;
  developer: Developer | null;
}

export function useAuth() {
  const { data: authData, isLoading, error } = useQuery<AuthData | null>({
    queryKey: ['/api/auth/me'],
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchInterval: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  return {
    user: authData?.user || null,
    developer: authData?.developer || null,
    isAuthenticated: !!authData?.user,
    isLoading,
    error
  };
}

export function useLogin() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const response = await apiRequest('POST', '/api/auth/login', credentials);
      return response.json();
    },
    onSuccess: (data) => {
      // Update the auth query cache
      queryClient.setQueryData(['/api/auth/me'], data);
      
      toast({
        title: "Welcome back!",
        description: `Successfully signed in as ${data.user.firstName || data.user.email}`,
      });
    },
    onError: (error: Error) => {
      let message = 'An error occurred during login';
      
      if (error.message.includes('401:')) {
        message = 'Invalid email or password';
      } else if (error.message.includes('429:')) {
        message = 'Too many login attempts. Please try again later.';
      } else if (error.message.includes('400:')) {
        message = 'Please check your email and password format';
      }

      toast({
        title: "Login failed",
        description: message,
        variant: "destructive"
      });
    }
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/auth/logout');
      return response.json();
    },
    onSuccess: () => {
      // Clear all auth-related queries
      queryClient.setQueryData(['/api/auth/me'], null);
      queryClient.removeQueries({ predicate: () => true });
      
      toast({
        title: "Signed out",
        description: "You have been successfully signed out"
      });
    },
    onError: () => {
      // Even if logout fails on server, clear local state
      queryClient.setQueryData(['/api/auth/me'], null);
      queryClient.removeQueries({ predicate: () => true });
    }
  });
}