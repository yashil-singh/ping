import { getUser, logout } from "@/hooks/useAuth";
import { User } from "../types/User";
import { create } from "zustand";
import { toast } from "@/hooks/use-toast";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  fetchUser: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  fetchUser: async () => {
    const { success, data } = await getUser();

    if (success) {
      setTimeout(() => {
        // Simulate initial loading
        set({ user: data.data, isLoading: false });
      }, 2000);
    } else {
      set({ user: null, isLoading: false });
    }
  },
  logout: async () => {
    const { success } = await logout();

    if (success) {
      set({ user: null });
      toast({ description: "Logged out successfully." });
    } else {
      toast({
        description: "Logout failed. Please try again.",
        variant: "destructive",
      });
    }
  },
}));
