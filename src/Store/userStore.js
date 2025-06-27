import { create } from "zustand";
import { persist } from "zustand/middleware";

const useUserStore = create(
  persist(
    (set, get) => ({
      users: [
        { email: "admin@gmail.com", name: "أدمن", role: "admin" },
        { email: "zaina@gmail.com", name: "زينة", role: "user" },
        { email: "ahmad@gmail.com", name: "أحمد", role: "banned" },
      ],

      updateRole: (email, newRole) => {
        set({
          users: get().users.map((u) =>
            u.email === email ? { ...u, role: newRole } : u
          ),
        });
      },

      getRoleByEmail: (email) => {
        const user = get().users.find((u) => u.email === email);
        return user?.role || "user";
      },
    }),
    {
      name: "user-store",
    }
  )
);

export default useUserStore;
