import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthState = {
  isAuthed: boolean;
  login: (email: string, password: string, expectedEmail: string, expectedPassword: string) => boolean;
  logout: () => void;
};

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      isAuthed: false,
      login: (email, password, expectedEmail, expectedPassword) => {
        const ok =
          email.trim().toLowerCase() === expectedEmail.toLowerCase() &&
          password === expectedPassword;
        if (ok) set({ isAuthed: true });
        return ok;
      },
      logout: () => set({ isAuthed: false }),
    }),
    { name: "taratech-auth-v1" }
  )
);
