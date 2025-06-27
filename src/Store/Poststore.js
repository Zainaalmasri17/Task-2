import { create } from "zustand";
import { persist } from "zustand/middleware";

const usePostStore = create(
  persist(
    (set, get) => ({
      posts: [],

      // ➕ إضافة مقال جديد
      addPost: (newPost) =>
        set((state) => ({
          posts: [newPost, ...state.posts],
        })),

      // 🗑️ حذف مقال حسب المعرف
      deletePost: (id) =>
        set((state) => ({
          posts: state.posts.filter((post) => post.id !== id),
        })),
      
      // 🛠️ تعديل مقال موجود
      editPost: (updatedPost) =>
        set((state) => ({
          posts: state.posts.map((post) =>
            post.id === updatedPost.id ? updatedPost : post
          ),
        })),

      // 🔍 جلب مقالات كاتب معيّن
      getPostsByAuthor: (email) =>
        get().posts.filter((post) => post.author === email),

      // 🌐 جلب جميع المقالات العامة
      getPublicPosts: () =>
        get().posts.filter((post) => post.isPublic === true),

      // 👤 جلب المقالات العامة للمستخدم الحالي
      getMyPublicPosts: (email) =>
        get().posts.filter(
          (post) => post.author === email && post.isPublic === true
        ),

      // 🛑 لا تستخدمها إلا بحذر (مسح كل المقالات)
      clearAllPosts: () => {
        console.warn("⚠️ تم استدعاء clearAllPosts — تأكد من أنك تريد الحذف");
        set({ posts: [] });
      },
    }),
    {
      name: "post-storage", // ✅ يتم حفظه في localStorage
      skipHydration: false,
      // ⚠️ تأكد ألا تستدعي دوال الحذف من أماكن أخرى
    }
  )
);

export default usePostStore;
