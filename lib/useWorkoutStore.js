import { create } from "zustand"
import { persist } from "zustand/middleware"

export const useWorkoutStore = create(
  persist(
    (set) => ({
      activeWorkout: null, // { id: user_workout_id, workout_id, exercises: [...] }
      setActiveWorkout: (workoutId) => set({ activeWorkout: workoutId }),
      clearWorkout: () => set({ activeWorkout: null }),
    }),
    { name: "workout-storage" } // clave en localStorage
  )
)
