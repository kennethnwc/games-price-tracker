import create from "zustand";
import { combine } from "zustand/middleware";

export const useExpoPushToken = create(
  combine(
    {
      expoPushToken: "",
    },
    (set) => ({
      setExpoPushToken: (pushToken: string) => {
        set({ expoPushToken: pushToken });
      },
    })
  )
);
