import create from "zustand";
import { User } from "../types/type";
import { persist } from "zustand/middleware";

interface UserStore {
  user: User | null | undefined;
  province_id: string;
  city_id: string;
  setCityId: (e: string) => void;
  setProvinceId: (e: string) => void;
  setUser: (e: User | null | undefined) => void;
}

export const useUserStore = create<UserStore>(
  persist(
    (set, get) => ({
      province_id: "",
      city_id: "",
      user: null,
      setUser: (user) => set({ user }),
      setCityId: (city_id) => set({ city_id }),
      setProvinceId: (province_id) => set({ province_id }),
    }),
    {
      name: "user-storage", // unique name
    }
  )
);
