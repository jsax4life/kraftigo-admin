"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authService, type LoginInput } from "@/services/auth.service";
import type { AdminUser } from "@/types/auth";

export function useAuth() {
  const queryClient = useQueryClient();

  const {
    data: user,
    isLoading: isUserLoading
  } = useQuery<AdminUser | null, Error>({
    queryKey: ["currentUser"],
    queryFn: () => authService.getCurrentUser(),
    staleTime: 60_000,
    retry: 1
  });

  const {
    mutateAsync: loginMutate,
    isPending: isLoggingIn,
    error: loginError
  } = useMutation<AdminUser, Error, LoginInput>({
    mutationFn: (payload) => authService.login(payload),
    onSuccess: async (data) => {
      // Store the logged-in user in React Query cache
      queryClient.setQueryData<AdminUser>(["currentUser"], data);
    }
  });

  const {
    mutateAsync: logoutMutate,
    isPending: isLoggingOut
  } = useMutation<void, Error, void>({
    mutationFn: () => authService.logout(),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    }
  });

  async function login(input: LoginInput): Promise<boolean> {
    try {
      console.log("useAuth.login: calling loginMutate");
      const result = await loginMutate(input);
      console.log("useAuth.login: loginMutate succeeded", result);
      return true;
    } catch (err) {
      console.error("useAuth.login: loginMutate failed", err);
      // Error is already captured in loginError mutation state
      return false;
    }
  }

  async function logout(): Promise<void> {
    await logoutMutate();
  }

  return {
    user,
    isAuthenticated: !!user,
    isLoading: isUserLoading || isLoggingIn || isLoggingOut,
    login,
    logout,
    error: loginError?.message ?? null
  };
}

