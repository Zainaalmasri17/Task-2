import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import usePostStore from "../../Store/Poststore";
import useAuthRedirect from "./useAuthRedirect";
import PageWrapper from "./Pagewrapper";
import { useMutation } from "@tanstack/react-query";
import useUserGuard from "../../Store/useUserGuard";
import useUserStore from "../../Store/userStore"; // ✅ جديد

export default function CreatePost() {
  useAuthRedirect();
  const navigate = useNavigate();
  const { addPost } = usePostStore();
  const { checkAccess } = useUserGuard();
  const { users } = useUserStore();

  const userEmail = localStorage.getItem("userEmail");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [category, setCategory] = useState("tech");

  // ✅ منع دخول المستخدم المحظور إلى الصفحة نهائيًا
  useEffect(() => {
    const currentUser = users.find((u) => u.email === userEmail);
    if (!currentUser || currentUser.role === "banned") {
      alert("🚫 تم حظرك من إنشاء المقالات.");
      navigate("/");
    }
  }, [userEmail, users, navigate]);

  const { mutate, isPending } = useMutation({
    mutationFn: async (newPost) => {
      addPost(newPost);
    },
    onSuccess: () => {
      alert("✅ تم نشر المقال بنجاح!");
      navigate("/articles");
    },
    onError: () => {
      alert("❌ فشل في إنشاء المقال، حاول مجددًا.");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!title || !body) {
      alert("📌 يرجى إدخال العنوان والمحتوى");
      return;
    }

    if (!checkAccess(userEmail, "نشر المقال")) return;

    mutate({
      id: Date.now(),
      title,
      body,
      category,
      author: userEmail,
      createdAt: new Date().toISOString(),
    });
  };

  return (
    <PageWrapper>
      <div className="min-h-screen flex justify-center items-start p-6">
        <div className="max-w-xl w-full bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <h1 className="text-3xl font-bold mb-6 text-center text-gray-900 dark:text-white">
            ✍️ إنشاء مقال جديد
          </h1>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="عنوان المقال"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-3 border rounded bg-white dark:bg-gray-700 dark:text-white"
              disabled={isPending}
            />

            <textarea
              placeholder="نص المقال"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={6}
              className="w-full p-3 border rounded bg-white dark:bg-gray-700 dark:text-white resize-none"
              disabled={isPending}
            />

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-3 border rounded bg-white dark:bg-gray-700 dark:text-white"
              disabled={isPending}
            >
              <option value="tech">تقنية</option>
              <option value="news">أخبار</option>
              <option value="culture">ثقافة</option>
              <option value="sports">رياضة</option>
            </select>

            <button
              type="submit"
              className={`w-full py-3 rounded text-white transition ${
                isPending
                  ? "bg-green-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
              disabled={isPending}
            >
              {isPending ? "⏳ جارٍ النشر..." : "➕ نشر المقال"}
            </button>
          </form>
        </div>
      </div>
    </PageWrapper>
  );
}
