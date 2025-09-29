import { create } from "zustand"
import { persist } from "zustand/middleware"

export const useUserStore = create(persist(
  (set) => ({
  user: null,
  profile: null,
  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
  clearUser: () => set({ user: null }),
}),
  {
    name: "user-storage",
  }
)
)
