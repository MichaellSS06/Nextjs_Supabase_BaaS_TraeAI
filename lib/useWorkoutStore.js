import { create } from "zustand"
import { persist } from "zustand/middleware"

export const useWorkoutStore = create(
  persist(
    (set) => ({
      activeWorkout: null, // { id: user_workout_id, workout_id, exercises: [...] }
      setActiveWorkout: (workoutId) => set({ activeWorkout: workoutId }),
      clearWorkout: () => set({ activeWorkout: null }),

       // flag de hidratación
      hasHydrated: false,
      setHasHydrated: (state) => set({ hasHydrated: state }),
    }),
    { name: "workout-storage",
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
     } // clave en localStorage
  )
)
