import { create } from "zustand";
import { persist } from "zustand/middleware";
import notificationStore from "./notificationStore";

const useReactionStore = create(
  persist(
    (set, get) => ({
      reactions: [],

      toggleReaction: ({ user, targetId, targetType, type, targetOwner }) => {
        const { reactions } = get();

        const existing = reactions.find(
          (r) =>
            r.user === user &&
            r.targetId === targetId &&
            r.targetType === targetType
        );

        let updated = [...reactions];

        if (existing) {
          if (existing.type === type) {
            updated = reactions.filter((r) => r !== existing);
          } else {
            existing.type = type;
          }
        } else {
          updated.push({ user, targetId, targetType, type });
        }

        set({ reactions: [...updated] });

        if (user !== targetOwner) {
          notificationStore.getState().addNotification({
            id: Date.now(),
            user: targetOwner,
            type: "reaction",
            message: `❤️ ${user.split("@")[0]} تفاعل مع ${
              targetType === "article" ? "مقالك" : "تعليقك"
            }`,
            read: false,
            createdAt: new Date().toISOString(),
          });
        }
      },

      getUserReaction: (user, targetId, targetType) =>
        get().reactions.find(
          (r) =>
            r.user === user &&
            r.targetId === targetId &&
            r.targetType === targetType
        )?.type || null,

      countReactions: (targetId, targetType, type) =>
        get().reactions.filter(
          (r) =>
            r.targetId === targetId &&
            r.targetType === targetType &&
            r.type === type
        ).length,

      // ✅ لحساب إعجابات المستخدم
      getLikesCountByUser: (user) =>
        get().reactions.filter(
          (r) => r.user === user && r.type === "like" && r.targetType === "article"
        ).length,

      // ✅ لحساب تعليقات المستخدم (بناءً على نوع التفاعل = "comment" + targetType = "comment")
      countCommentsByUser: (user) =>
        get().reactions.filter(
          (r) => r.user === user && r.targetType === "comment" && r.type === "comment"
        ).length,
    }),
    {
      name: "reaction-store",
    }
  )
);

export default useReactionStore;
