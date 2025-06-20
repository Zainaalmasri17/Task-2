import { create } from "zustand";
import { persist } from "zustand/middleware";


const usePostStore = create(
  persist(
    (set) => ({
      posts: [],

      addPost: (newPost) =>
        set((state) => ({
          posts: [newPost, ...state.posts],
        })),

      deletePost: (id) =>
        set((state) => ({
          posts: state.posts.filter((post) => post.id !== id),
        })),

      editPost: (updatedPost) =>
        set((state) => ({
          posts: state.posts.map((post) =>
            post.id === updatedPost.id ? updatedPost : post
          ),
        })),
    }),
    {
      name: "post-storage",
    }
  )
);
export default usePostStore;
