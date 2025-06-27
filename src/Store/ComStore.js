import { create } from "zustand";
import { persist } from "zustand/middleware";

const useCommentStore = create(
  persist(
    (set, get) => ({
      comments: [],

      addComment: (comment) =>
        set((state) => ({
          comments: [...state.comments, comment],
        })),

      editComment: (id, newBody) =>
        set((state) => ({
          comments: state.comments.map((c) =>
            c.id === id ? { ...c, body: newBody } : c
          ),
        })),

      deleteComment: (id) =>
        set((state) => ({
          comments: state.comments.filter(
            (c) => c.id !== id && c.parentId !== id
          ),
        })),

      getCommentsByArticle: (articleId) =>
        get().comments.filter((c) => c.articleId === articleId),

      // ✅ دالة جديدة لحساب عدد تعليقات مستخدم معيّن
      countCommentsByUser: (email) =>
        get().comments.filter((c) => c.email === email).length,
    }),
    {
      name: "comments-store",
    }
  )
);

export default useCommentStore;
