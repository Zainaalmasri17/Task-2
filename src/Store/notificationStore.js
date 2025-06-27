import { create } from "zustand";
import { persist } from "zustand/middleware";

const useNotificationStore = create(
  persist(
    (set, get) => ({
      notifications: [],

      addNotification: (notif) =>
        set((state) => ({
          notifications: [...state.notifications, notif],
        })),

      markAsRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        })),

      markAllAsRead: () =>
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        })),

      getForUser: (user) =>
        get().notifications.filter((n) => n.user === user),
    }),
    {
      name: "notification-store",
    }
  )
);

export default useNotificationStore;
